const express = require("express");
const morgan = require('morgan')
const app = express();
const path = require("path");

app.use(morgan(':remote-addr [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms'));

app.use("/", express.static('dist'));
app.use(express.static(path.join(__dirname, 'dist')));

app.listen(8080, () => { console.log("Server listening on port 8080"); });