import express from "express";
import {downloadAudio, downloadVideo} from "./controller.js";

const router = express.Router();

// TODO: Add thumbnail download
router.get("/video/", downloadVideo);
router.get("/audio/", downloadAudio);

export default router;