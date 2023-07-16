//============== Require Packages ==============
import express from "express";
const app = express();
require("dotenv").config();
const port = process.env.PORT ? process.env.PORT : 3000;
import con from "./src/config/db";
const bodyParser = require("body-parser");
const route = require("./src/modules/users/user_route");
const path = require("path");
var cors = require('cors');
const usersModel = require("./src/modules/users/user_model");
const postcard = require("./src/modules/postcard/postcard_route");
const fs = require("fs");

//============ Mongodb connected ================
con.on('open', () => {
    console.log('I am Darkseid!');
    const usersData = fs.readFileSync(`${__dirname}/src/config/users.json`, { encoding: 'utf8', flag: 'r' })

    // import data from users json file
    const importData = async() =>{
        try{
            await usersModel.insertMany(JSON.parse(usersData)).then(()=>{
                console.log("data sucessfully imported")
            })
        }catch(err){
            console.log(err)
        }
    }
    // importData();
});


//============ Global Middleware ================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


//============ Connect Route ====================
app.use("/api", route);
app.use("/api", postcard);


//============== Server listening ===============
app.listen(port, () => {
    console.log("server started on port " + port)
})