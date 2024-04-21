const { makeDeposit, getTotalPriceToPay } = require("../models/balance");

const router = require("express").Router();

/**
 * @param {number} userId - user id
 * @body {number} depositAmount - amount to deposit
 */
router.post("/deposit/:userId", async (req, res) => {
  const { Profile } = req.app.get("models");
  const sequelize = req.app.get("sequelize");
  const { id } = req.profile;
  const { userId } = req.params;
  const { depositAmount } = req.body;

  // check if the user is the same as the profile
  if (id !== parseInt(userId)) {
    return res.status(400).json({ message: "Bad request" });
  }
  // check if the user is a client
  const client = await Profile.findOne({ where: { id }, type: "client" });
  if (!client) return res.status(403).json({ message: "Forbidden" });
  // check if the amount is a number
  if (isNaN(depositAmount)) {
    return res.status(400).json({ message: "Amount should be a number" });
  }
  // check if the amount is positive
  if (depositAmount <= 0) {
    return res.status(400).json({ message: "Amount should be positive" });
  }

  try {
    // get the total price to pay for the client
    const result = await getTotalPriceToPay(sequelize, id);
    if (result.length === 0) {
      return res.status(400).json({ message: "No jobs to pay" });
    }
    // check if the deposit amount is higher than 25% of the total price to pay
    if (depositAmount > result[0].total_price_to_pay * 0.25) {
      return res.status(400).json({
        message: "Deposit amount can't be higher than 25% of jobs to pay",
      });
    }

    await makeDeposit(Profile, depositAmount, id);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }

  res.status(200).json({ message: "Deposit successful" });
});

module.exports = router;
