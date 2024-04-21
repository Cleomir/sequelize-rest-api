const express = require("express");
const bodyParser = require("body-parser");

const { sequelize } = require("./model");
const { getProfile } = require("./middleware/getProfile");
const contracts = require("./controllers/contracts");
const jobs = require("./controllers/jobs");
const balances = require("./controllers/balances");
const admin = require("./controllers/admin");

const app = express();

// middleware
app.use(bodyParser.json());
app.set("sequelize", sequelize);
app.set("models", sequelize.models);

app.use("/contracts", getProfile, contracts);
app.use("/jobs", getProfile, jobs);
app.use("/balances", getProfile, balances);
app.use("/admin", admin);

module.exports = app;
