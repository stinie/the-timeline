const express = require("express");
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

// Keep for learning purposes
// app.get("/", (req, res) => {
//   res.render("index", {
//     text: "World"
//   });
// });

const userRouter = require("./routes/users");
const { escapeXML } = require("ejs");

app.use("/users", userRouter);


app.listen(300); // http://localhost:300