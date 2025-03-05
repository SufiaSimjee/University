import express from 'express';
import {protect , roleAccess} from "../middleware/authMiddleware.js";

const router = express.Router();


export default router;