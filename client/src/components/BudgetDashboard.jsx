import CategoryCard from './CategoryCard';
import styles from './BudgetDashboard.module.css';

const fmt = (n) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n);

export default function BudgetDashboard({ salary, categories, setCategories, onSave, saveMsg, onBack }) {
  const totalAllocated = categories.reduce(
    (sum, cat) => sum + cat.subcategories.reduce((s, sub) => s + sub.amount, 0),
    0
  );
  const unallocated = salary - totalAllocated;

  const updateSubcategory = (catId, subId, field, value) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== catId) return cat;
        return {
          ...cat,
          subcategories: cat.subcategories.map((sub) =>
            sub.id === subId ? { ...sub, [field]: value } : sub
          ),
        };
      })
    );
  };

  const addSubcategory = (catId) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== catId) return cat;
        const newSub = {
          id: `custom_${Date.now()}`,
          name: 'New Item',
          percentage: 0,
          amount: 0,
        };
        return { ...cat, subcategories: [...cat.subcategories, newSub] };
      })
    );
  };

  const removeSubcategory = (catId, subId) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== catId) return cat;
        return { ...cat, subcategories: cat.subcategories.filter((s) => s.id !== subId) };
      })
    );
  };

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={onBack}>
          ← Back
        </button>
        <div className={styles.salaryBadge}>
          Monthly Salary: <strong>{fmt(salary)}</strong>
        </div>
        <div className={styles.saveArea}>
          {saveMsg && <span className={styles.saveMsg}>{saveMsg}</span>}
          <button className={styles.saveBtn} onClick={onSave}>
            💾 Save Profile
          </button>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.summaryRow}>
          {categories.map((cat) => {
            const catTotal = cat.subcategories.reduce((s, sub) => s + sub.amount, 0);
            const pct = salary > 0 ? Math.round((catTotal / salary) * 100) : 0;
            return (
              <div key={cat.id} className={styles.summaryCard} style={{ borderTopColor: cat.color }}>
                <span className={styles.summaryIcon}>{cat.icon}</span>
                <span className={styles.summaryName}>{cat.name}</span>
                <span className={styles.summaryAmt} style={{ color: cat.color }}>{fmt(catTotal)}</span>
                <span className={styles.summaryPct}>{pct}% of salary</span>
              </div>
            );
          })}
          <div
            className={styles.summaryCard}
            style={{ borderTopColor: Math.abs(unallocated) < 1 ? '#10B981' : '#ef4444' }}
          >
            <span className={styles.summaryIcon}>📊</span>
            <span className={styles.summaryName}>Unallocated</span>
            <span
              className={styles.summaryAmt}
              style={{ color: Math.abs(unallocated) < 1 ? '#10B981' : '#ef4444' }}
            >
              {fmt(Math.abs(unallocated))}
            </span>
            <span className={styles.summaryPct}>
              {Math.abs(unallocated) < 1 ? '✓ Fully allocated' : unallocated > 0 ? 'Remaining' : 'Over budget'}
            </span>
          </div>
        </div>

        <div className={styles.cards}>
          {categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              salary={salary}
              onUpdateSub={updateSubcategory}
              onAddSub={addSubcategory}
              onRemoveSub={removeSubcategory}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
