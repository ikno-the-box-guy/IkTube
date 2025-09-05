import express from "express";
import {downloadAudio, downloadVideo, downloadThumbnail, fetchInfo} from "./controller.js";

const router = express.Router();

router.get("/video/:id", downloadVideo);
router.get("/audio/:id", downloadAudio);
router.get("/thumbnail/:id", downloadThumbnail);
router.get("/info/:id", fetchInfo);

export default router;