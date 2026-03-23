const express = require('express');
const router = express.Router();

const DEFAULT_CATEGORIES = [
  {
    id: 'needs',
    name: 'Needs',
    percentage: 50,
    color: '#3B82F6',
    icon: '🏠',
    description: 'Essential expenses you cannot avoid',
    subcategories: [
      { id: 'rent', name: 'Rent / Mortgage', percentage: 25 },
      { id: 'groceries', name: 'Groceries', percentage: 10 },
      { id: 'transport', name: 'Transportation', percentage: 7 },
      { id: 'utilities', name: 'Utilities', percentage: 5 },
      { id: 'healthcare', name: 'Healthcare', percentage: 3 },
    ],
  },
  {
    id: 'wants',
    name: 'Wants',
    percentage: 30,
    color: '#F59E0B',
    icon: '🎉',
    description: 'Non-essential lifestyle expenses',
    subcategories: [
      { id: 'entertainment', name: 'Entertainment', percentage: 8 },
      { id: 'dining', name: 'Dining Out', percentage: 8 },
      { id: 'shopping', name: 'Shopping', percentage: 7 },
      { id: 'subscriptions', name: 'Subscriptions', percentage: 4 },
      { id: 'travel', name: 'Travel', percentage: 3 },
    ],
  },
  {
    id: 'savings',
    name: 'Savings',
    percentage: 20,
    color: '#10B981',
    icon: '💰',
    description: 'Building your financial future',
    subcategories: [
      { id: 'emergency', name: 'Emergency Fund', percentage: 8 },
      { id: 'investments', name: 'Investments', percentage: 7 },
      { id: 'retirement', name: 'Retirement / Goals', percentage: 5 },
    ],
  },
];

router.post('/calculate', (req, res) => {
  const { salary } = req.body;
  if (!salary || isNaN(salary) || salary <= 0) {
    return res.status(400).json({ error: 'Please provide a valid positive salary.' });
  }

  const categories = DEFAULT_CATEGORIES.map((cat) => ({
    ...cat,
    amount: parseFloat(((salary * cat.percentage) / 100).toFixed(2)),
    subcategories: cat.subcategories.map((sub) => ({
      ...sub,
      amount: parseFloat(((salary * sub.percentage) / 100).toFixed(2)),
    })),
  }));

  res.json({ salary: parseFloat(salary), categories });
});

module.exports = router;
