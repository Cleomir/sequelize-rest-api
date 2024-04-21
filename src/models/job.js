const { Op } = require("sequelize");

/**
 * Find all active jobs that are not paid for the user
 * @param {Object} Contract - Sequelize model
 * @param {Object} Job - Sequelize model
 * @param {number} id - user id
 * @returns {Promise<Array>} - array of objects
 */
async function findUnpaidJobs(Contract, Job, id) {
  const jobs = await Contract.findAll({
    where: {
      [Op.or]: [
        {
          clientId: id,
        },
        { contractorId: id },
      ],
      [Op.and]: [
        {
          status: "in_progress",
        },
      ],
    },
    include: {
      model: Job,
      where: {
        paymentDate: null,
      },
    },
  });

  return jobs;
}

/**
 * Find an unpaid job by client ID and job ID
 * @param {Object} Contract - Sequelize model
 * @param {Object} Job - Sequelize model
 * @param {number} clientId - client ID
 * @param {number} jobId - job ID
 * @returns {Promise<Object|null>} - job object or null if not found
 */
async function findUnpaidContractByClientIdAndJobId(
  Contract,
  Job,
  clientId,
  jobId
) {
  const contract = await Contract.findOne({
    where: {
      clientId,
      [Op.and]: [
        {
          status: "in_progress",
        },
      ],
    },
    include: {
      model: Job,
      where: {
        id: Number(jobId),
        paymentDate: null,
      },
    },
  });

  return contract || null;
}

module.exports = { findUnpaidJobs, findUnpaidContractByClientIdAndJobId };
