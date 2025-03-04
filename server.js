const express = require("express");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));



app.get("/", (req,res) => {
    res.render("index");
})

app.get("/article", (req,res) => {
    res.render("article");
})

app.get("/create-entry", (req,res) => {
    res.render("create-entry");
})

app.get("/checkout", (req,res) => {
    res.render("checkout");
})

app.listen(PORT, () => {
    console.log(`App running on http://localhost:${PORT}`);
})