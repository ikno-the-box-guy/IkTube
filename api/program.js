import express from 'express';
import router from "./router.js";
import {execSync} from "child_process";
import * as fs from "node:fs";
import 'dotenv/config';

if(process.platform === 'win32')
  execSync("yt-dlp -U", {stdio: "inherit"});
else 
  console.log("Don't forget to check your yt-dlp version!");

// Clear cache
fs.rmSync('./downloads', { recursive: true, force: true });

// TODO: Periodically clear cache

const app = express()
app.use(express.json())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use('/api/v1/', router)

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`\nServer is running on port ${port}`)
});