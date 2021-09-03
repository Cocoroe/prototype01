const express = require("express");
const app = express();
const path = require("path")
const port = process.env.PORT || 80
app.use(express.static(path.join(__dirname,"../client/build")))

app.get("/",function(req,res){
    res.sendFile(path.join(__dirname,"./client/build","index.html"))
})

app.listen(port);
console.log(`✔ NodeJS Server is starting... (PORT=${port})`)
