// server/src/controllers/billing.controller.js
import BillingItem from "../models/BillingItem.model.js";
import mongoose from "mongoose";

/**
 * GET /api/billing
 * Query params:
 *  - provider (AWS|GCP)
 *  - service
 *  - accountId
 *  - from (YYYY-MM-DD)
 *  - to (YYYY-MM-DD)
 *  - sort (usageDate,-cost,...)
 *  - page (1-based)
 *  - limit
 */
export const listBilling = async (req, res) => {
  try {
    const {
      provider,
      service,
      accountId,
      from,
      to,
      sort = "-usageDate",
      page = 1,
      limit = 50,
      minCost,
      maxCost,
    } = req.query;

    const filter = {};

    if (provider) filter.provider = provider;
    if (service) filter.service = { $regex: service, $options: "i" };
    if (accountId) filter.accountId = accountId;
    if (minCost) filter.cost = { ...(filter.cost || {}), $gte: parseFloat(minCost) };
    if (maxCost) filter.cost = { ...(filter.cost || {}), $lte: parseFloat(maxCost) };

    if (from || to) {
      filter.usageDate = {};
      if (from) filter.usageDate.$gte = new Date(from);
      if (to) filter.usageDate.$lte = new Date(to);
    }

    const skip = (Math.max(parseInt(page, 10), 1) - 1) * parseInt(limit, 10);
    const query = BillingItem.find(filter).sort(parseSortString(sort)).skip(skip).limit(parseInt(limit, 10));

    const [items, total] = await Promise.all([query.exec(), BillingItem.countDocuments(filter)]);
    res.json({ success: true, total, page: parseInt(page, 10), limit: parseInt(limit, 10), data: items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

function parseSortString(sort) {
  // accepts "-usageDate,cost" or "usageDate,-cost"
  if (!sort) return { usageDate: -1 };
  const fields = sort.split(",").map((s) => s.trim());
  const out = {};
  fields.forEach((f) => {
    if (!f) return;
    if (f.startsWith("-")) out[f.slice(1)] = -1;
    else out[f] = 1;
  });
  return out;
}

export const getBillingById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ success: false, message: "Invalid id" });
    const item = await BillingItem.findById(id);
    if (!item) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createBilling = async (req, res) => {
  try {
    const payload = req.body;
    const item = await BillingItem.create(payload);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const importCsvEndpoint = async (req, res) => {
  // Optional endpoint if you want to trigger import via HTTP.
  // For safety, keep this disabled or protected in production.
  res.status(501).json({ success: false, message: "Use server script to import CSVs" });
};

/**
 * Aggregation: monthly totals grouped by provider and month
 * GET /api/billing/summary/monthly?provider=AWS&year=2024
 */
export const monthlySummary = async (req, res) => {
  try {
    const { provider, year } = req.query;
    const match = {};
    if (provider) match.provider = provider;
    if (year) {
      const y = parseInt(year);
      match.usageDate = {
        $gte: new Date(y, 0, 1),
        $lte: new Date(y, 11, 31, 23, 59, 59, 999),
      };
    }

    const pipeline = [
      { $match: match },
      {
        $group: {
          _id: { provider: "$provider", year: { $year: "$usageDate" }, month: { $month: "$usageDate" } },
          totalCost: { $sum: "$cost" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          provider: "$_id.provider",
          year: "$_id.year",
          month: "$_id.month",
          totalCost: 1,
          count: 1,
          _id: 0,
        },
      },
      { $sort: { year: 1, month: 1 } },
    ];

    const result = await BillingItem.aggregate(pipeline).allowDiskUse(true);
    res.json({ success: true, data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
