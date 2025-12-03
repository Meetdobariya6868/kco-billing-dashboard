// server/src/routes/billing.routes.js
import express from "express";
import {
  listBilling,
  getBillingById,
  createBilling,
  importCsvEndpoint,
  monthlySummary,
} from "../controllers/billing.controller.js";

const router = express.Router();

router.get("/", listBilling);
router.get("/summary/monthly", monthlySummary);
router.get("/:id", getBillingById);
router.post("/", createBilling);
router.post("/import", importCsvEndpoint); // stub - prefer script

export default router;
