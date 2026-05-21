import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(cors({
  origin:['http://localhost:4200', 'http://render.cccccc.com']  
}))


app.use(express.json())


export default app;