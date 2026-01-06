import express from "express";
import { connectMetaAccounts } from "../controllers/metaController.js";

const router = express.Router();

router.post("/connect", connectMetaAccounts);

export default router;
