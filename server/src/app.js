import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Routes
import billingRoutes from "./routes/billing.routes.js";
app.use("/api/billing", billingRoutes);

export default app;
