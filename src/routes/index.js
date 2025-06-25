const { Router } = require('express');
const authRouter = require('./auth.router');
const adminRouter = require('./admin.router');

const router = Router();

router.use('/auth', authRouter);
router.use('/admin', adminRouter);

module.exports = router;
