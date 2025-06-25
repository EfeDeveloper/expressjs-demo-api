const { Router } = require('express');
const { createTimeBlock, listReservations } = require('../controllers/admin.controller');
const authenticateToken = require('../middlewares/auth.middleware');

const router = Router();

router.post('/time-block', authenticateToken, createTimeBlock);
router.get('/reservations', authenticateToken, listReservations);

module.exports = router;
