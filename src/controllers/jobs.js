const router = require("express").Router();

const {
  findUnpaidJobs,
  findUnpaidContractByClientIdAndJobId,
} = require("../models/job");

/**
 *
 * @returns all active jobs that are not paid for the user
 */
router.get("/unpaid", async (req, res) => {
  const { Contract, Job } = req.app.get("models");
  const { id } = req.profile;

  try {
    const jobs = await findUnpaidJobs(Contract, Job, id);

    return res.status(200).json(jobs);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * @param {number} job_id - job id
 * pays for a job active and unpaid job, and transfers money to the contractor
 */
router.post("/:job_id/pay", async (req, res) => {
  const { Profile, Contract, Job } = req.app.get("models");
  const sequelize = req.app.get("sequelize");
  const { id } = req.profile;
  const { job_id } = req.params;

  // check if the profile is a client and the user is the same as the profile
  const client = await Profile.findOne({ where: { id }, type: "client" });
  if (!client) {
    return res.status(403).json({ message: "Forbidden" });
  }

  try {
    // // check if the job exists, is active and is not paid
    const contract = await findUnpaidContractByClientIdAndJobId(
      Contract,
      Job,
      id,
      job_id
    );
    if (!contract) {
      return res.status(404).json({ message: "Job not found" });
    }
    // check if client has balance to pay for the job
    const job = contract.Jobs[0];
    if (client.balance < job.price) {
      return res.status(400).json({ message: "Insufficient funds" });
    }
    // check if the contractor exists
    const contractor = await Profile.findOne({
      where: { id: contract.ContractorId },
    });
    if (!contractor) {
      return res.status(404).json({ message: "Contractor not found" });
    }

    // pay for the job and transfer money to the contractor
    await sequelize.transaction(async (transaction) => {
      client.balance -= job.price;
      contractor.balance += job.price;
      job.paid = true;
      job.paymentDate = new Date();

      await Promise.all([
        client.save({ transaction }),
        contractor.save({ transaction }),
        job.save({ transaction }),
      ]);
    });

    return res.status(200).json({ message: "Job paid" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
