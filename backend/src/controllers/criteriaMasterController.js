import db from "../models/index.js";

const CriteriaMaster = db.criteria_master;
// Get all criteria
const getAllCriteria = async (req, res) => {
  try {
    const criteria = await CriteriaMaster.findAll();
    res.json(criteria);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single criteria by ID
const getCriteriaById = async (req, res) => {
  try {
    const criteria = await criteria_master.findByPk(req.params.id);
    if (!criteria) {
      return res.status(404).json({ error: 'Criteria not found' });
    }
    res.json(criteria);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new criteria
const createCriteria = async (req, res) => {
  try {
    const criteria = await CriteriaMaster.create(req.body);
    res.status(201).json(criteria);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update criteria
const updateCriteria = async (req, res) => {
  try {
    const [updated] = await CriteriaMaster.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedCriteria = await CriteriaMaster.findByPk(req.params.id);
      return res.json(updatedCriteria);
    }
    throw new Error('Criteria not found');
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete criteria
const deleteCriteria = async (req, res) => {
  try {
    const deleted = await CriteriaMaster.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      return res.json({ message: 'Criteria deleted' });
    }
    throw new Error('Criteria not found');
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export {
  getAllCriteria,
  getCriteriaById,
  createCriteria,
  updateCriteria,
  deleteCriteria
};
