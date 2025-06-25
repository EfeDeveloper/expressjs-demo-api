const { Router } = require('express');
const { register, login } = require('../controllers/auth.controller');
const authenticateToken = require('../middlewares/auth.middleware');

const router = Router();

router.post('/register', register);
router.post('/login', login);

router.get('/protected-route', authenticateToken, (req, res) => {
  res.send({ message: 'This route is protected', user: req.user });
});

module.exports = router;
