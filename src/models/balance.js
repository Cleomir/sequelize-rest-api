/**
 * Make deposit to user balance
 * @param {object} Profile - Profile model
 * @param {number} depositAmount - amount to deposit
 * @param {number} id - user id
 * @returns {Promise<void>}
 */
async function makeDeposit(Profile, depositAmount, id) {
  await Profile.increment("balance", {
    by: depositAmount,
    where: { id },
  });
}

/**
 * Get total price to pay for a client
 * @param {object} sequelize - Sequelize instance
 * @param {number} id - client id
 * @returns {Promise<number>} - Total price to pay
 */
async function getTotalPriceToPay(sequelize, id) {
  const result = await sequelize.query(
    `SELECT SUM(j.price) as total_price_to_pay 
    FROM contracts AS c 
    JOIN jobs AS j ON c.id = j.contractId 
    WHERE c.clientId = ${id} 
    AND c.status = 'in_progress' 
    AND j.paymentDate IS NULL 
    GROUP BY c.clientId;`,
    { type: sequelize.QueryTypes.SELECT }
  );

  return result;
}

module.exports = { makeDeposit, getTotalPriceToPay };
