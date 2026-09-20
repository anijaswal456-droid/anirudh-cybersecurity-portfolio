const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const messagesFile = path.join(__dirname, 'messages.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/health', (req, res) => res.json({ ok: true, service: 'portfolio-api' }));

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) return res.status(400).json({ ok: false, error: 'All fields are required.' });
  const entry = { name: String(name).slice(0, 100), email: String(email).slice(0, 200), message: String(message).slice(0, 2000), createdAt: new Date().toISOString() };
  let messages = [];
  try { messages = JSON.parse(fs.readFileSync(messagesFile, 'utf8')); } catch (_) {}
  messages.push(entry);
  fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2));
  res.json({ ok: true, message: 'Thanks! Your message has been received.' });
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.listen(PORT, () => console.log(`Portfolio running on http://localhost:${PORT}`));
