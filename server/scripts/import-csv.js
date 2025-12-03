// server/scripts/import-csv.js
import fs from "fs";
import path from "path";
import csv from "csvtojson";
import connectDB from "../src/config/db.js";
import BillingItem from "../src/models/BillingItem.model.js";
import dotenv from "dotenv";
dotenv.config();

const BATCH_SIZE = 1000;

/**
 * transformRow(row) -> normalized object matching BillingItem schema.
 * You MUST adapt these fields depending on CSV column names.
 */
function transformRow(row, providerName = "AWS") {
  // Example mapping - adjust to your CSV column names.
  // Common AWS CSV columns: "lineItem/UsageStartDate", "ProductName", "usageAmount", "UnblendedCost", "lineItem/UsageEndDate"
  const usageDateStr = row["usageStart"] || row["lineItem/UsageStartDate"] || row["usageStartDate"] || row["date"] || row["UsageStartDate"];
  const usageDate = usageDateStr ? new Date(usageDateStr) : null;

  const costStr = row["cost"] || row["unblendedCost"] || row["UnblendedCost"] || row["BlendedCost"] || row["LineItem/UnblendedCost"] || row["costUSD"];
  const cost = costStr ? parseFloat(costStr) || 0 : 0;

  const service = row["service"] || row["ProductName"] || row["Product"] || row["lineItem/ProductCode"] || "unknown";

  const accountId = row["accountId"] || row["payerAccountId"] || row["LinkedAccountId"] || row["AccountId"];

  return {
    provider: providerName,
    accountId,
    service,
    region: row["region"] || row["AvailabilityZone"] || null,
    usageStart: usageDate || null,
    usageEnd: null,
    usageDate: usageDate || new Date(),
    cost,
    currency: "USD",
    description: row["description"] || null,
    raw: row,
  };
}

async function importCsvFile(csvFilePath, providerName = "AWS") {
  console.log("Starting import:", csvFilePath);
  const jsonStream = csv().fromFile(csvFilePath);

  let batch = [];
  let total = 0;

  for await (const row of jsonStream) {
    const doc = transformRow(row, providerName);
    batch.push(doc);

    if (batch.length >= BATCH_SIZE) {
      await BillingItem.insertMany(batch, { ordered: false });
      total += batch.length;
      console.log(`Inserted ${total} rows...`);
      batch = [];
    }
  }

  if (batch.length > 0) {
    await BillingItem.insertMany(batch, { ordered: false });
    total += batch.length;
    console.log(`Inserted ${total} rows - done`);
  }

  console.log("Import finished for", csvFilePath);
}

async function main() {
  try {
    await connectDB();
    const base = path.resolve(); // run script from repo root or adjust paths
    // Adjust relative paths to your CSV locations
    const awsCsv = path.join(base, "/aws_line_items_12mo.csv");
    const gcpCsv = path.join(base, "/gcp_billing_12mo.csv");

    if (fs.existsSync(awsCsv)) {
      await importCsvFile(awsCsv, "AWS");
    } else {
      console.warn("AWS CSV not found at", awsCsv);
    }

    if (fs.existsSync(gcpCsv)) {
      await importCsvFile(gcpCsv, "GCP");
    } else {
      console.warn("GCP CSV not found at", gcpCsv);
    }

    console.log("All imports completed");
    process.exit(0);
  } catch (err) {
    console.error("Import error:", err);
    process.exit(1);
  }
}

main();
