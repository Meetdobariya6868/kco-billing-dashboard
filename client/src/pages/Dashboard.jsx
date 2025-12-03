// client/src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { fetchCombined } from "../services/api";
import BillingTable from "../components/BillingTable";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
  setLoading(true);
  // request a reasonable limit so we get data
  fetchCombined({ page: 1, limit: 100 })
    .then((res) => {
      console.log("DEBUG: /api/billing response:", res.data);
      // server returns { success, total, page, limit, data }
      const finalArray = res?.data?.data ?? [];
      setData(finalArray);
    })
    .catch((err) => {
      console.error("Error fetching data:", err);
      setError(err.message || "Error fetching data");
    })
    .finally(() => setLoading(false));
}, []);


  return (
    <div style={{ padding: "30px" }}>
      <h1>Billing Dashboard</h1>
      <p>Static data loaded from backend</p>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <BillingTable data={data} />
    </div>
  );
}
