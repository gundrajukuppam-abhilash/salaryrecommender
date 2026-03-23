import { useState } from 'react';
import styles from './SalaryInput.module.css';

export default function SalaryInput({ onCalculate, savedProfile, onLoadProfile }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = parseFloat(value);
    if (!value || isNaN(num) || num <= 0) {
      setError('Please enter a valid salary amount.');
      return;
    }
    setError('');
    onCalculate(num);
  };

  const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logo}>💸</div>
          <h1 className={styles.title}>Salary Budget Recommender</h1>
          <p className={styles.subtitle}>
            Enter your monthly in-hand salary to get a personalised budget plan
            based on the <strong>50 / 30 / 20 rule</strong>.
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label} htmlFor="salary">
            Monthly In-Hand Salary (₹)
          </label>
          <div className={styles.inputRow}>
            <span className={styles.prefix}>₹</span>
            <input
              id="salary"
              className={styles.input}
              type="number"
              min="1"
              placeholder="e.g. 80000"
              value={value}
              onChange={(e) => { setValue(e.target.value); setError(''); }}
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.btn}>
            Calculate My Budget
          </button>
        </form>

        {savedProfile && (
          <div className={styles.profileBanner}>
            <span>📁 Saved profile found — <strong>{fmt(savedProfile.salary)}</strong>/month</span>
            <button className={styles.loadBtn} onClick={onLoadProfile}>
              Load Profile
            </button>
          </div>
        )}

        <div className={styles.ruleCards}>
          {[
            { pct: '50%', label: 'Needs', desc: 'Rent, groceries, transport…', color: '#3B82F6', bg: '#eff6ff' },
            { pct: '30%', label: 'Wants', desc: 'Dining, entertainment, travel…', color: '#F59E0B', bg: '#fffbeb' },
            { pct: '20%', label: 'Savings', desc: 'Emergency fund, investments…', color: '#10B981', bg: '#ecfdf5' },
          ].map((r) => (
            <div key={r.label} className={styles.ruleCard} style={{ background: r.bg, borderColor: r.color }}>
              <span className={styles.rulePct} style={{ color: r.color }}>{r.pct}</span>
              <span className={styles.ruleLabel}>{r.label}</span>
              <span className={styles.ruleDesc}>{r.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
