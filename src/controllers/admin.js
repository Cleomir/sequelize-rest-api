const {
  findHighestPaidProfession,
  findBestClients,
} = require("../models/admin");
const areValidDates = require("../utils/areValidDates");

const router = require("express").Router();

/**
 * @queryParam {string} start - start date
 * @queryParam {string} end - end date
 * @returns the profession with the highest paid sum between the start and end date
 */
router.get("/best-profession", async (req, res) => {
  const sequelize = req.app.get("sequelize");
  const { start, end } = req.query;

  // validate the query parameters
  const { valid, errorMessage } = areValidDates(start, end);
  if (!valid) {
    return res.status(400).json({ message: errorMessage });
  }

  try {
    const result = await findHighestPaidProfession(sequelize, start, end);
    if (result.length === 0) {
      return res.status(404).json({ message: "No profession found" });
    }

    return res.status(200).json(result[0]);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * @queryParam {string} start - start date
 * @queryParam {string} end - end date
 * @queryParam {number} limit - number of clients to return
 * @returns the clients with the highest paid sum between the start and end date and limit the result
 */
router.get("/best-clients", async (req, res) => {
  const sequelize = req.app.get("sequelize");
  const { start, end, limit = 2 } = req.query;

  // validate the query parameters
  const { valid, errorMessage } = areValidDates(start, end);
  if (!valid) {
    return res.status(400).json({ message: errorMessage });
  }
  if (isNaN(Number(limit))) {
    return res.status(400).json({ message: "Invalid limit" });
  }

  try {
    const result = await findBestClients(sequelize, start, end, limit);
    if (result.length === 0) {
      return res.status(404).json({ message: "No clients found" });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
