import express from 'express';
import router from "./router.js";
import {execSync} from "child_process";

execSync("yt-dlp -U", {stdio: "inherit"});

const app = express()
app.use(express.json())

app.use('/api/v1/', router)
app.listen(3000, () => {
    console.log('\nServer is running on port 3000')
});