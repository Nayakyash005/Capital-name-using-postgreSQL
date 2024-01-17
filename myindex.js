import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";

let currentQuestion = 0;
let currentscore = 0;

const port = 3000;
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  user: "postgres",
  host:"localhost",
  database:"world",
  password:"Mydp#nayak09",
  port:5432,
});
let arr = [];
db.connect();

db.query("SELECT* FROM capitals",(err,res)=>{
if(err){
    console.log(err.stack);
}else{
    console.log("response from database is" );
    arr = (res.rows);
}
db.end();
});

 currentQuestion = Math.floor(Math.random()*arr.length+1);
app.get("/", (error,res)=>{
try{
    currentQuestion = Math.floor(Math.random()*arr.length+1);
    console.log("country is " +currentQuestion+"index"+ JSON.stringify(arr[currentQuestion]));
res.render("index.ejs",{
      question: arr[currentQuestion], 
})
}catch(error){
    console.log(error.message);
    res.sendStatus(404).json("there is porblem loading website");
}
});

app.post("/submit",(req,res)=>{
    try{
      const val =req.body.answer;

      if(val == arr[currentQuestion].capital){
        currentscore+=1;
        currentQuestion = Math.floor(Math.random()*arr.length+1);
        res.render("index.ejs",{
            question: arr[currentQuestion],
            totalScore: currentscore,
            wasCorrect: true,
        }); 
      }else{
        currentscore;
        res.render("index.ejs",{
            question: arr[currentQuestion],
            totalScore: currentscore,
            wasCorrect: false,
        });
      }
      
     
    }catch(error){
        console.log(error.message);
        res.sendStatus(500);
    }
})

app.listen(port,()=>{
    console.log(`your site is running at http://localhost:${port}`);
});

