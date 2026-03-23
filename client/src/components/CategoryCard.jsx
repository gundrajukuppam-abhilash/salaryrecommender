import { useState } from 'react';
import styles from './CategoryCard.module.css';

const fmt = (n) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n);

function SubCategoryRow({ sub, salary, catColor, onUpdate, onRemove }) {
  const [editingName, setEditingName] = useState(false);
  const [editingAmt, setEditingAmt] = useState(false);
  const [nameVal, setNameVal] = useState(sub.name);
  const [amtVal, setAmtVal] = useState(sub.amount);

  const commitName = () => {
    const trimmed = nameVal.trim();
    if (trimmed) onUpdate(sub.id, 'name', trimmed);
    else setNameVal(sub.name);
    setEditingName(false);
  };

  const commitAmt = () => {
    const n = parseFloat(amtVal);
    if (!isNaN(n) && n >= 0) {
      onUpdate(sub.id, 'amount', n);
      const pct = salary > 0 ? parseFloat(((n / salary) * 100).toFixed(1)) : 0;
      onUpdate(sub.id, 'percentage', pct);
    } else {
      setAmtVal(sub.amount);
    }
    setEditingAmt(false);
  };

  const pct = salary > 0 ? ((sub.amount / salary) * 100).toFixed(1) : 0;
  const barWidth = Math.min(100, parseFloat(pct) * 2);

  return (
    <div className={styles.subRow}>
      <div className={styles.subLeft}>
        {editingName ? (
          <input
            className={styles.nameInput}
            value={nameVal}
            autoFocus
            onChange={(e) => setNameVal(e.target.value)}
            onBlur={commitName}
            onKeyDown={(e) => { if (e.key === 'Enter') commitName(); if (e.key === 'Escape') { setNameVal(sub.name); setEditingName(false); } }}
          />
        ) : (
          <span className={styles.subName} onClick={() => setEditingName(true)} title="Click to edit name">
            {sub.name}
            <span className={styles.editHint}>✎</span>
          </span>
        )}
        <div className={styles.barTrack}>
          <div className={styles.barFill} style={{ width: `${barWidth}%`, background: catColor }} />
        </div>
      </div>
      <div className={styles.subRight}>
        <span className={styles.subPct} style={{ color: catColor }}>{pct}%</span>
        {editingAmt ? (
          <input
            className={styles.amtInput}
            type="number"
            value={amtVal}
            autoFocus
            min="0"
            onChange={(e) => setAmtVal(e.target.value)}
            onBlur={commitAmt}
            onKeyDown={(e) => { if (e.key === 'Enter') commitAmt(); if (e.key === 'Escape') { setAmtVal(sub.amount); setEditingAmt(false); } }}
          />
        ) : (
          <span className={styles.subAmt} onClick={() => { setAmtVal(sub.amount); setEditingAmt(true); }} title="Click to edit amount">
            {fmt(sub.amount)}
          </span>
        )}
        <button className={styles.removeBtn} onClick={() => onRemove(sub.id)} title="Remove">×</button>
      </div>
    </div>
  );
}

export default function CategoryCard({ category, salary, onUpdateSub, onAddSub, onRemoveSub }) {
  const catTotal = category.subcategories.reduce((s, sub) => s + sub.amount, 0);
  const catPct = salary > 0 ? ((catTotal / salary) * 100).toFixed(1) : 0;
  const recommended = (salary * category.percentage) / 100;
  const diff = catTotal - recommended;
  const diffAbs = Math.abs(diff);
  const isOver = diff > 1;
  const isUnder = diff < -1;

  return (
    <div className={styles.card} style={{ '--cat-color': category.color }}>
      <div className={styles.cardHeader} style={{ borderBottomColor: category.color + '33' }}>
        <div className={styles.headerLeft}>
          <span className={styles.catIcon}>{category.icon}</span>
          <div>
            <h2 className={styles.catName}>{category.name}</h2>
            <p className={styles.catDesc}>{category.description}</p>
          </div>
        </div>
        <div className={styles.headerRight}>
          <span className={styles.catAmt} style={{ color: category.color }}>{fmt(catTotal)}</span>
          <span className={styles.catPct} style={{ background: category.color + '22', color: category.color }}>
            {catPct}%
          </span>
        </div>
      </div>

      <div className={styles.statusRow}>
        <span className={styles.recommended}>Recommended: {fmt(recommended)} ({category.percentage}%)</span>
        {diffAbs > 1 && (
          <span className={styles.diffTag} style={{ background: isOver ? '#fef2f2' : '#f0fdf4', color: isOver ? '#ef4444' : '#16a34a' }}>
            {isOver ? `▲ ${fmt(diffAbs)} over` : `▼ ${fmt(diffAbs)} under`}
          </span>
        )}
        {diffAbs <= 1 && (
          <span className={styles.diffTag} style={{ background: '#f0fdf4', color: '#16a34a' }}>✓ On target</span>
        )}
      </div>

      <div className={styles.subList}>
        {category.subcategories.map((sub) => (
          <SubCategoryRow
            key={sub.id}
            sub={sub}
            salary={salary}
            catColor={category.color}
            onUpdate={(subId, field, val) => onUpdateSub(category.id, subId, field, val)}
            onRemove={(subId) => onRemoveSub(category.id, subId)}
          />
        ))}
      </div>

      <button className={styles.addBtn} onClick={() => onAddSub(category.id)} style={{ color: category.color, borderColor: category.color + '55' }}>
        + Add Item
      </button>
    </div>
  );
}
