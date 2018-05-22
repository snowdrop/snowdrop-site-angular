const express = require("express");
const morgan = require('morgan')
const app = express();
const path = require("path");

app.use(morgan(':remote-addr [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms'));

app.get("/settings.json", (req, res) => {
	return res.json({
		"backend_url": process.env.LAUNCHER_BACKEND_URL || "https://forge.api.openshift.io/api",
		"mission_control_url": process.env.LAUNCHER_MISSIONCONTROL_URL || "wss://forge.api.openshift.io/"
	});
});

app.use("/", express.static('dist'));
app.use(express.static(path.join(__dirname, 'dist')));

app.get("*", function(req, res) {
	res.sendfile(path.resolve(__dirname, "..", "dist", "index.html"));
});

app.listen(8080, () => { console.log("Server listening on port 8080"); });