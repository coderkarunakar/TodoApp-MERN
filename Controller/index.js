require("dotenv").config();
//import express
const express = require("express");
//this path will keep track of our directories
const path = require("path");





//creating an instance of express
const app = express();

//inorder to read json objects we are using a middle ware 
app.use(express.json());
//with the below code we can serve the build folder
app.use(express.static(path.join(__dirname,"build")));
app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname, "build/index.html"));
    
})
const {connectToMongoDB} = require("../Controller/database");


//importing our router i.e made inside an router file
const router  = require("./routes");
//here we are trying to use app and route,here api is the name we are just giving as like a navigation locaton and after giving this api name we need to give its router name i.e todos
app.use("/api",router);


//making server to run on database steps

//the below line mean if the port in .env is set to "8888" then it will run on 8888 if no port i s se t then by default it takes port no set on env, or even if you specify some thing here like 500 also it takes from .env port only
const port =  5000;

async function startServer(){
    //first it will wait for mongodb to connect which we set on our data base file ,only then connect to our express server
    await connectToMongoDB();
    app.listen(port,() =>{
        console.log(`Server is listening on http://localhost:${port}`);
        
    })

}
startServer();


