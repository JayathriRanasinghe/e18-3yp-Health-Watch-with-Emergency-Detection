const express = require("express");
const mongoose =  require("mongoose");

const port = process.env.port || 5000;
const app = express();

mongoose.connect('mongodb+srv://jayathrimr:test@clusterauthentication.zuqekpl.mongodb.net/Healthwatch_patients?retryWrites=true&w=majority');

const connection = mongoose.connection;

connection.once("open", ()=>{
    console.log("MongoDb connected");
});

app.use(express.json());
const userRoute = require("./routes/user");
app.use("/user",userRoute);

app.route("/").get((request, response)=>response.json("First Rest API: updated"));

app.listen(port, ()=>console.log(`port:${port} -> Server is running...`));