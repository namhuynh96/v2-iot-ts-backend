import app from "./hamkIotApp";
const port = 10002;

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
