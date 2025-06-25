const { registerUserService, loginUserService } = require('../services/auth.services');

const register = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    await registerUserService(email, password, name, role);
    return res.status(201).json({ message: 'User registered Successfully' });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await loginUserService(email, password);
    return res.json({ token });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = { register, login };
