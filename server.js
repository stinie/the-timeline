const express = require("express");
const app = express();


app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Keep for learning purposes
// app.get("/", (req, res) => {
//   res.render("index", {
//     text: "World"
//   });
// });

app.set("view engine", "ejs");

const userRouter = require("./routes/users");


app.use("/users", userRouter);


app.listen(300); // http://localhost:300