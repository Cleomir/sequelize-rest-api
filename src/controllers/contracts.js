const router = require("express").Router();

const {
  findNonTerminatedContracts,
  findContractById,
} = require("../models/contract");

/**
 *
 * @returns all contracts that are not terminated
 */
router.get("/", async (req, res) => {
  const { Contract } = req.app.get("models");
  const { id } = req.profile;

  try {
    const contracts = await findNonTerminatedContracts(Contract, id);

    return res.json(contracts);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

/**
 *
 * @returns contract by id
 */
router.get("/:id", async (req, res) => {
  const { Contract } = req.app.get("models");
  const { id: requestId } = req.params;
  const { id: profileId } = req.profile;

  // check if the profile is the owner of the contract
  if (profileId !== parseInt(requestId)) {
    return res.status(403).json({ message: "Forbidden" });
  }

  try {
    const contract = await findContractById(Contract, requestId);
    if (!contract) {
      return res.status(404).json({ message: "Contract not found" });
    }

    return res.status(200).json(contract);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
