const express = require("express");
const connectDB = require("./config/database");
const signupRouter = require("./routes/account/signup");
const loginRouter = require("./routes/account/login");
const profileRoute = require("./routes/profile/profile");
const logoutRouter = require("./routes/account/logout");
const profileEditRouter = require("./routes/profile/profile_edit");
const requestSendRouter = require("./routes/relations/request_send");
const requestReceivedReview = require("./routes/relations/request_received_review");
const connectionReview = require("./routes/relations/connection_review");
const myConnectionsListRouter = require("./routes/profile/myConnections");
const feedPeopleRouter = require("./routes/feed/feed_people");
const postUploadRouter = require("./routes/post/post_upload");
const postDeleteRouter = require("./routes/post/post_delete");
const cookieParser = require("cookie-parser");
const app = express();

//Connected to the DB already.  then listen
connectDB()
  .then(() => {
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database", err);
    process.exit(1);
  });

app.use(express.json()); //Middleware to parse incoming JSON request bodies into JavaScript objects
app.use(cookieParser()); //Middleware (cookie-parser) converts cookie into a JS object that can be access through req.cookies.

app.use("/", signupRouter);
app.use("/", loginRouter);
app.use("/", profileRoute);
app.use("/", logoutRouter);
app.use("/", profileEditRouter);
app.use("/", requestSendRouter);
app.use("/", requestReceivedReview);
app.use("/", connectionReview);
app.use("/", myConnectionsListRouter);
app.use("/", feedPeopleRouter);
app.use("/", postUploadRouter);
app.use("/", postDeleteRouter);

app.use("/", (req, res) => {
  res.send("404 Route not found!");
});
