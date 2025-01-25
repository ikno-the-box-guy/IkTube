import express from 'express';
import router from "./router.js";
import {execSync} from "child_process";

execSync("yt-dlp -U", {stdio: "inherit"});

const app = express()
app.use(express.json())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use('/api/v1/', router)
app.listen(3000, () => {
    console.log('\nServer is running on port 3000')
});