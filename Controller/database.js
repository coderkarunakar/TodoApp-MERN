//this file maintains all our secret details like database username,password,connection string etc
require("dotenv").config();
const {MongoClient, serverApiVersion, ServerApiVersion } = require("mongodb");
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/";

const options = {
    serverApi :{
        version: ServerApiVersion.v1,
        strict: true,
        deprecationsError:true,

    }
};

let client;
const connectToMongoDB = async ()=>{

    //by below lines we dont need to create a client every single time,so here we have created a client and returning it
    if(!client){
        try{
            //if there is no client we will say client to await a new mongo client
            client = await MongoClient.connect(uri, options);
            console.log("Connected to mongodb");
        }catch(error){
                console.log(error);
        }
    }
    return client;
}

const getConnectedClient = () => client;

module.exports = {connectToMongoDB, getConnectedClient};

