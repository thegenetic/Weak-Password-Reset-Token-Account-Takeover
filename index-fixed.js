const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Secret key for JWT signing and encryption
const JWT_SECRET = 'secret';

// In-memory user store
const users = [];
let nextId = 1;

// --------------Password Reset Token Store----------------
const resetTokens = new Map(); // Map to store reset tokens with expiration

// Function to generate a secure random token
function generateResetToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Seed some users
users.push({ id: nextId++, email: 'user1@example.com', password: 'password1' });
users.push({ id: nextId++, email: 'user2@example.com', password: 'password2' });
users.push({ id: nextId++, email: 'attacker@example.com', password: 'password3' });

// Helper to find user by email
function findUserByEmail(email) {
  return users.find(user => user.email === email);
}

// Helper to find user by ID
function findUserById(id) {
  return users.find(user => user.id === id);
}

// Login page
app.get('/login', (req, res) => {
  res.send(`
    <h1>Login</h1>
    <form method="POST" action="/login">
      <input type="email" name="email" placeholder="Email" required />
      <input type="password" name="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  `);
});

// Handle login
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = findUserByEmail(email);

  if (!user || user.password !== password) {
    return res.status(401).send('Invalid email or password');
  }
  // Create JWT token
  const token = jwt.sign({ id: user.id }, JWT_SECRET);
  res.redirect(`/dashboard?token=${token}`);
});

// Dashboard page
app.get('/dashboard', (req, res) => {
  const token = req.query.token;
  if (!token) {
    return res.status(401).send('No token provided');
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = findUserById(decoded.id);
    if (!user) {
      return res.status(401).send('Invalid token');
    }
    res.send(`
      <h1>Dashboard</h1>
      <p>Welcome, ${user.email}!</p>
    `);
  } catch (error) {
    return res.status(401).send('Invalid token');
  }
});

// -------------Forget Password Page-------------
app.get('/forget-password', (req, res) => {
  res.send(`
    <h1>Forget Password</h1>
    <form method="POST" action="/forget-password">
      <input type="email" name="email" placeholder="Email" required />
      <button type="submit">Reset Password</button>
    </form>
  `);
});

app.post('/forget-password', (req, res) => {
  const { email } = req.body;
  const user = findUserByEmail(email);

  if (!user) {
    return res.status(404).send('User not found');
  }
  
  const resetToken = generateResetToken();
  const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
  const expires = Date.now() + 15 *60 * 1000; // Token valid for 15 minutes
  resetTokens.set(tokenHash, { userId: user.id, expires });
  console.log(resetTokens);
  
  
  console.log(`Password reset link: http://localhost:${PORT}/password-reset?token=${resetToken}`);

  res.send('Password reset link has been sent to your email (check console for the link)');
});

//Password reset page
app.get('/password-reset', (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).send('No token provided');
  }
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const record = resetTokens.get(tokenHash);

  if (!record || record.expires < Date.now()) {
    return res.status(400).send('Invalid or expired token');
  }

  const user = findUserById(record.userId);
  if (!user) {
    return res.status(400).send('Invalid token');
  }

  res.send(`
    <h1>Password Reset</h1>
    <form method="POST" action="/password-reset">
      <input type="hidden" name="token" value="${token}" />
      <input type="password" name="newPassword" placeholder="New Password" required />
      <button type="submit">Reset Password</button>
    </form>
  `);
  
});

app.post('/password-reset', (req, res) => {
  const { token, newPassword } = req.body;
  if (!token||!newPassword) {
    return res.status(400).send('No token or new password provided');
  }
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const record = resetTokens.get(tokenHash);
  
  if (!record || record.expires < Date.now()) {
    return res.status(400).send('Invalid or expired token');
  }
  const user = findUserById(record.userId);
  if (!user) {
    return res.status(400).send('Invalid token');
  }
  user.password = newPassword;
  resetTokens.delete(tokenHash); // Invalidate the token after use
  console.log(users);
  res.send('Password has been reset successfully');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/login`);
  console.log(users);
});

