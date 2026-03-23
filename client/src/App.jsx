import { useState, useEffect } from 'react';
import SalaryInput from './components/SalaryInput';
import BudgetDashboard from './components/BudgetDashboard';

const PROFILE_KEY = 'salary_budget_profile';

export default function App() {
  const [view, setView] = useState('input');
  const [salary, setSalary] = useState('');
  const [categories, setCategories] = useState([]);
  const [savedProfile, setSavedProfile] = useState(null);
  const [saveMsg, setSaveMsg] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem(PROFILE_KEY);
    if (stored) {
      const profile = JSON.parse(stored);
      setSavedProfile(profile);
    }
  }, []);

  const handleCalculate = async (inputSalary) => {
    try {
      const res = await fetch('/api/budget/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ salary: parseFloat(inputSalary) }),
      });
      if (!res.ok) throw new Error('Server error');
      const data = await res.json();
      setSalary(data.salary);
      setCategories(data.categories);
      setView('dashboard');
    } catch {
      alert('Could not connect to server. Please ensure the backend is running.');
    }
  };

  const loadProfile = () => {
    if (savedProfile) {
      setSalary(savedProfile.salary);
      setCategories(savedProfile.categories);
      setView('dashboard');
    }
  };

  const saveProfile = () => {
    const profile = { salary, categories };
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    setSavedProfile(profile);
    setSaveMsg('Profile saved!');
    setTimeout(() => setSaveMsg(''), 2500);
  };

  const handleBack = () => setView('input');

  return (
    <div>
      {view === 'input' ? (
        <SalaryInput
          onCalculate={handleCalculate}
          savedProfile={savedProfile}
          onLoadProfile={loadProfile}
        />
      ) : (
        <BudgetDashboard
          salary={salary}
          categories={categories}
          setCategories={setCategories}
          onSave={saveProfile}
          saveMsg={saveMsg}
          onBack={handleBack}
        />
      )}
    </div>
  );
}
