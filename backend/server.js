import express, { json } from 'express';
import env from "dotenv"
import connection from './connection.js';
import router from './router.js';
import path from "path"
import { fileURLToPath } from 'url';
import fs from 'fs';
import cors from "cors"
env.config()

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);


const app = express();
app.use(cors())
app.use(express.static(path.join(__dirname, '../frontend/dist')))
// app.get("*",(req,res)=>{
//     res.status(200).sendFile(path.join(__dirname,"../frontend/dist/index.html"))
// })
app.use(express.json())
app.use("/api",router)

connection().then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`server started on port http://localhost:${process.env.PORT}`)
    })
})