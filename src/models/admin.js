/**
 * Find the profession with the highest paid sum between the start and end date
 * @param {sequelize} sequelize - sequelize instance
 * @param {string} startDate - start date
 * @param {string} endDate - end date
 * @returns {Promise<Array>} - array of objects
 */
async function findHighestPaidProfession(sequelize, startDate, endDate) {
  const result = await sequelize.query(
    `SELECT p.profession, SUM(j.price) AS sum_of_jobs_paid 
    FROM contracts AS c 
    JOIN jobs AS j ON c.id = j.contractId 
    JOIN profiles AS p ON c.contractorId = p.id 
    WHERE j.paymentDate BETWEEN '${startDate}' AND '${endDate}' 
    GROUP BY c.contractorId 
    ORDER BY SUM(j.price) DESC 
    LIMIT 1;`,
    { type: sequelize.QueryTypes.SELECT }
  );

  return result;
}

/**
 * Find the clients with the highest paid sum between the start and end date and limit the result
 * @param {sequelize} sequelize - sequelize instance
 * @param {string} startDate - start date
 * @param {string} endDate - end date
 * @param {number} limit - limit the result
 * @returns {Promise<Array>} - array of objects
 */
async function findBestClients(sequelize, startDate, endDate, limit) {
  const result = await sequelize.query(
    `SELECT p.id, p.firstName, p.lastName, SUM(j.price) AS sum_of_jobs_paid 
    FROM contracts AS c 
    JOIN jobs AS j ON c.id = j.contractId 
    JOIN profiles AS p ON c.clientId = p.id 
    WHERE j.paymentDate BETWEEN '${startDate}' AND '${endDate}' 
    GROUP BY c.clientId 
    ORDER BY SUM(j.price) DESC 
    LIMIT ${limit};`,
    { type: sequelize.QueryTypes.SELECT }
  );

  return result;
}

module.exports = {
  findHighestPaidProfession,
  findBestClients,
};
