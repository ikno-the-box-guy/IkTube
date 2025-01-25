import express from "express";
import {downloadAudio, downloadVideo} from "./controller.js";

const router = express.Router();

// TODO: Add thumbnail download
router.get("/video/:id", downloadVideo);
router.get("/audio/:id", downloadAudio);

export default router;