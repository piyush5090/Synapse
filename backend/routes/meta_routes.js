import express from "express";
import {
  connectMetaAccounts,
  getMetaAccounts,
  deleteMetaAccounts,
} from "../controllers/metaController.js";

const router = express.Router();

// Connect Route
router.post("/connect", connectMetaAccounts);

// Get Meta Accounts Route 
router.get("/:businessId", getMetaAccounts);

// Delete Meta Accounts Route
router.delete("/:businessId", deleteMetaAccounts);

export default router;
