const express = require('express');
const cors = require('cors');
const path = require('path');
const budgetRoutes = require('./routes/budget');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/api/budget', budgetRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Serve built React frontend
const distPath = path.join(__dirname, '../client/dist');
app.use(express.static(distPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => console.log(`App running on http://0.0.0.0:${PORT}`));
