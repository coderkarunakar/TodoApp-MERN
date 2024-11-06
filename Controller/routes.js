const express = require("express");

//method on express called router
const router = express.Router();
const {getConnectedClient} = require("./database");
//we need object id for put and delete request which will be getting from mongodb
const { ObjectId} = require("mongodb");


// returning a collection
const getCollection = () => {
    //it gets the client and store it inside a variable called client
    const client = getConnectedClient();
    //create a collection
    const collection = client.db("todosdb").collection("todos");
    return collection;
    
};


//Get todo
router.get("/todos",async(req,res)=>{
    try{
    //getting our collection 
    const collection = getCollection();

    //here find select document  in a collection and returns the selected document
    //converting all our collection todos will be converted to array
    const todos = await collection.find({}).toArray();
//now all the data of our collection will be stored inside todos and i.e passed to our json response (todos)
    res.status(200).json(todos);
    }catch(error)
    {
        console.error("Error fetching todo:", error);
        res.status(500).json({msg:"Error fetching todo" });
    }

})


//status code 201 represents "created", indicates req was successful and resulted in creation  of new resource
//post todo
router.post("/todos", async(req,res)=>{
    console.log("karunakar req check", req.body);
    const collection = getCollection();
    let {todo} =  req.body;
    //validation checks:if there is no todo then simply we need to return 400 status
    if(!todo){
        return res.status(400).json({msg:"error no todo found"});
    }
    //converting todo object data into string
    todo = (typeof todo === "string") ? todo : JSON.stringify(todo);

    const newTodo = await collection.insertOne({ todo, status: false });

    res.status(201).json({ todo, status: false, _id: newTodo.insertedId });

    
})

//delete todo/:id
router.delete("/todos/:id", async(req,res)=>{
    try{
    const collection = getCollection();
    //similar to req.body we can pull our id using req.params.id
    const _id =  new ObjectId(req.params.id);
    //here deleteOne deletes the single document that matches the filter
    const deletedTodo = await collection.deleteOne({_id});
  

    res.status(200).json({ acknowledge: deletedTodo.deletedCount > 0 });
}catch(error){
    console.error("Error deleting todo",error);
    res.status(500).json({msg:"Error deleting todo"});
}


    
})
//put todo/:id

//put means simply update
router.put("/todos/:id", async(req,res)=>{
    try{
    const collection = getCollection();
    //similar to req.body we can pull our id using req.params.id
    const _id =  new ObjectId(req.params.id);
    const {status}  = req.body;
//validtation check
    if(typeof status !== "boolean"){
        return res.status(400).json({msg:"invalid status"});
    }


    //here updateOne updates the sindle document that matches the filter
    //inorder to update our status
    const  updatedTodo = await collection.updateOne({_id},{$set:{status: !status}})
    if(updatedTodo.matchedCount === 0){
        return res.status(400).json({msg:"todo not found"});
    }
    res.status(200).json({ acknowledge: updatedTodo.modifiedCount > 0 });;
}catch(error){
    console.error("Error updating todo:", error);
    res.status(500).json({msg:"Error updating todo"});
}
    
});


//exporting router
module.exports = router;