const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const adminRouter = require("../routes/admin");
const userRouter = require("../routes/user");

app.use(bodyParser.json());
app.use("/user", userRouter);
app.use("/admin", adminRouter);

const PORT = 3001;
app.listen(PORT);
