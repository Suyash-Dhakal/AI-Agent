import 'dotenv/config';
import express from "express";
import getResponse from './services/openai.service.js';

const app=express();
const PORT=8000;


app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use((error,req,res,next)=>{
    res.status(500).json({
        message: JSON.stringify(error),
      });
});

app.listen(PORT,()=>{
    console.log(`Server is running on PORT: ${PORT}`);
})
