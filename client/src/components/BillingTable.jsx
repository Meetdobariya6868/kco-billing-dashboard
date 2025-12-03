// client/src/components/BillingTable.jsx
function fmtDate(d) {
  if (!d) return "";
  const dt = d instanceof Date ? d : new Date(d);
  if (isNaN(dt.getTime())) return String(d);
  return dt.toISOString().slice(0, 10); // YYYY-MM-DD
}

function safeNumber(value) {
  if (value == null) return "";
  if (typeof value === "number") return value;
  const s = String(value).replace(/[^0-9.-]+/g, "");
  const n = parseFloat(s);
  return isNaN(n) ? value : n;
}

export default function BillingTable({ data }) {
  if (!data || data.length === 0) {
    return <p>No billing data available.</p>;
  }

  return (
    <table style={{ width: "100%", marginTop: "20px", borderCollapse: "collapse" }}>
      <thead>
        <tr style={{ backgroundColor: "#f0f0f0" }}>
          <th style={th}>Provider</th>
          <th style={th}>Service</th>
          <th style={th}>Cost</th>
          <th style={th}>Date</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, idx) => {
          // robust mapping: prefer normalized fields, fallback to common raw CSV keys
          const raw = item.raw || {};
          const provider = item.provider || raw.provider || raw.Provider || raw.cloud || "Unknown";
          const service =
            item.service ||
            raw.service ||
            raw.ProductName ||
            raw.Product ||
            raw["lineItem/ProductCode"] ||
            raw["SKU"] ||
            raw["ServiceDescription"] ||
            "unknown";
          const cost =
            item.cost ??
            safeNumber(raw.cost) ??
            safeNumber(raw.UnblendedCost) ??
            safeNumber(raw.unblendedCost) ??
            safeNumber(raw.BlendedCost) ??
            "";
          // try several date fields
          const usageDate =
            item.usageDate ||
            raw.usageDate ||
            raw["lineItem/UsageStartDate"] ||
            raw.usageStart ||
            raw.date ||
            raw.Date ||
            "";

          return (
            <tr key={idx} style={tr}>
              <td style={td}>{provider}</td>
              <td style={td}>{service}</td>
              <td style={td}>{cost !== "" ? `$${Number(cost).toFixed(2)}` : ""}</td>
              <td style={td}>{fmtDate(usageDate)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

const th = { padding: "10px", border: "1px solid #ddd", textAlign: "left" };
const td = { padding: "10px", border: "1px solid #ddd" };
const tr = { backgroundColor: "white" };
