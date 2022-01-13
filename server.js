const express = require("express");

const PORT = process.env.PORT || 3001;
const app = express();

const htmlRoutes = require("./routes/htmlRoutes");

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.use("/", htmlRoutes);

app.listen(PORT, () => console.log(`listening on ${PORT}`));
