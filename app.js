require('dotenv').config();
const express = require('express');
const {
  validateUser,
  emailAlreadyExists,
  userIdExists,
} = require('./utils/usersValidations');
const bodyParser = require('body-parser');

const fileSystem = require('fs');
const path = require('path');
const usersFilePath = path.join(__dirname, './utils/users.json');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send(`
    <style>
      .card {
        width: 400px;
        border: 1px solid #ccc;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        font-family: Arial, sans-serif;
        margin: 20px;
      }

      .card-body {
        padding: 20px;
      }

      .card-title {
        font-size: 1.5em;
        margin-bottom: 10px;
      }

      .card-text {
        font-size: 1em;
        margin-bottom: 20px;
        color: #555;
      }
    </style>
    </head>

    <body>
      <div class="card">
        <div class="card-body">
          <h2 class="card-title">Corriendo en el puerto ${PORT}</h2>
          <p class="card-text">HTML template desde un request a una api creada con <b>node.js</b> y <b>express.js</b>
          </p>
        </div>
      </div>
    </body>
    `);
});

app.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  const message = `User ID is: ${userId}`;
  res.status(200).send(message);
});

app.get('/search', (req, res) => {
  const { query } = req;

  const category = query.category || 'general';
  const page = query.page || 1;
  const limit = query.limit || 10;
  const message = `Search results for category: ${category}, page: ${page}, limit: ${limit}`;
  res.status(200).send(message);
});

app.post('/form', (req, res) => {
  const name = req.body?.name || 'Guest';
  const email = req.body?.email || 'unknown';

  res.status(200).json({
    message: 'Form submitted successfully! Name',
    data: {
      name,
      email,
    },
  });
});

app.post('/api/data', (req, res) => {
  const data = req.body;

  if (!data || !Object.keys(data).length) {
    return res.status(400).json({ error: 'No data provided' });
  }

  res.status(200).json({
    message: 'Data received successfully',
    data,
  });
});

app.get('/users', (req, res) => {
  fileSystem.readFile(usersFilePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Error reading users file' });

    const users = JSON.parse(data);
    res.status(200).json(users);
  });
});

app.post('/users', (req, res) => {
  const newUser = req.body;

  fileSystem.readFile(usersFilePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Error reading users file' });

    const users = JSON.parse(data);

    const validation = validateUser(newUser);

    if (!validation.isValid) return res.status(400).json({ error: validation.errors });

    if (emailAlreadyExists(newUser.email, users)) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    newUser.id = users.length ? users.length + 1 : 1;
    users.push(newUser);
    fileSystem.writeFile(usersFilePath, JSON.stringify(users, null, 2), 'utf8', (err) => {
      if (err) return res.status(500).json({ error: 'Error writing to users file' });

      res.status(201).json({
        message: 'User created successfully',
        user: newUser,
      });
    });
  });
});

app.put('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const userToUpdate = req.body;

  fileSystem.readFile(usersFilePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Error reading users file' });

    const users = JSON.parse(data);

    const validation = validateUser(userToUpdate);

    if (!validation.isValid) return res.status(400).json({ error: validation.errors });

    if (!userIdExists(userId, users))
      return res.status(404).json({ error: 'User not found' });

    userToUpdate.id = userId;

    const updatedUsers = users.map((user) => {
      if (user.id === userId) {
        return {
          ...user,
          ...userToUpdate,
        };
      }
      return user;
    });

    fileSystem.writeFile(
      usersFilePath,
      JSON.stringify(updatedUsers, null, 2),
      'utf8',
      (err) => {
        if (err) return res.status(500).json({ error: 'Error writing to users file' });

        res.status(200).json({
          message: 'User updated successfully',
          user: userToUpdate,
        });
      }
    );
  });
});

app.delete('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id, 10);

  fileSystem.readFile(usersFilePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Error reading users file' });

    let users = JSON.parse(data);

    if (!userIdExists(userId, users))
      return res.status(404).json({ error: 'User not found' });

    users = users.filter((user) => user.id !== userId);

    fileSystem.writeFile(usersFilePath, JSON.stringify(users, null, 2), 'utf8', (err) => {
      if (err) return res.status(500).json({ error: 'Error writing to users file' });

      res.status(200).json({
        message: 'User deleted successfully',
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on: http://localhost:${PORT}`);
});
