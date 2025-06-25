const {
  createTimeBlockService,
  listReservationsService,
} = require('../services/admin.services');

const createTimeBlock = async (req, res) => {
  try {
    const { role } = req.user;
    if (role !== 'ADMIN') return res.status(403).json({ error: 'Access denied' });

    const { startTime, endTime } = req.body;

    const newTimeBlock = await createTimeBlockService(startTime, endTime);

    res.status(201).json(newTimeBlock);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const listReservations = async (req, res) => {
  try {
    const { role } = req.user;
    if (role !== 'ADMIN') return res.status(403).json({ error: 'Access denied' });

    const reservations = await listReservationsService();

    res.status(200).json(reservations);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { createTimeBlock, listReservations };
