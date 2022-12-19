const express = require("express");
const app = express();
const db = require("./config/database");
ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const bodyParser = require("body-parser");
const logger = require("morgan");
const cors = require("cors");

// ************** express settings **************
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());
app.use(logger("dev"));
app.use(cors());

// ************** DB Commands *******************

const connectDB = db.connectDB;

// Connect To Database
connectDB();

// ************** Routes ************************

const apiRoutes = require("./routes/api");
const pageRoutes = require("./routes/page");

app.use("/", pageRoutes);
app.use("/api", apiRoutes);

const server = app.listen(process.env.PORT || 3000, () => {
	console.log(`Your server is listening on port ${process.env.PORT || 3000}`);
});

// const setIntervalKey = setInterval(
// 	() =>
// 		server.getConnections((err, connections) =>
// 			console.log(`${connections} connections currently open`)
// 		),
// 	1000
// );

process.on("SIGTERM", () => shutDown());
process.on("SIGINT", () => shutDown());

let connections = [];

server.on("connection", (connection) => {
	connections.push(connection);
	connection.on(
		"close",
		() => (connections = connections.filter((curr) => curr !== connection))
	);
});

const shutDown = function shutDown() {
	console.log("Received kill signal, shutting down gracefully");
	server.close(() => {
		process.exit(0);
	});

	setTimeout(() => {
		console.error(
			"Could not close connections in time, forcefully shutting down"
		);
		process.exit(1);
	}, 20000);

	connections.forEach((curr) => curr.end());
	setTimeout(() => connections.forEach((curr) => curr.destroy()), 5000);
};

exports.shutDown = shutDown;
exports.server = server;
// exports.setIntervalKey = setIntervalKey;
