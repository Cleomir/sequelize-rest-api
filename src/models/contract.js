const { Op } = require("sequelize");

/**
 * Find all contracts that are not terminated
 * @param {Object} Contract - Sequelize model
 * @param {number} id - user id
 * @returns {Promise<Array>} - array of objects
 */
async function findNonTerminatedContracts(Contract, id) {
  const result = await Contract.findAll({
    where: {
      [Op.or]: [
        {
          clientId: id,
        },
        { contractorId: id },
      ],
      [Op.and]: [
        {
          status: {
            [Op.not]: "terminated",
          },
        },
      ],
    },
  });

  return result;
}

/**
 * Find contract by id
 * @param {Object} Contract - Sequelize model
 * @param {number} id - contract id
 * @returns {Promise<Object>} - object
 */
async function findContractById(Contract, id) {
  const contract = await Contract.findOne({ where: { id } });

  return contract;
}

module.exports = { findNonTerminatedContracts, findContractById };
