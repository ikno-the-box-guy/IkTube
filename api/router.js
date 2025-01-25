import express from "express";
import {downloadAudio, downloadVideo} from "./controller.js";

const router = express.Router();

// TODO: Add thumbnail download
router.post("/video/", downloadVideo);
router.post("/audio/", downloadAudio);

export default router;