import { ArrowUpRight, Clock3, Utensils } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate } from '../api.js';

export function MealCard({ meal }) {
  return (
    <Link className="meal-card" to={`/meals/${meal.id}`}>
      <div className="meal-icon"><Utensils size={19} /></div>
      <div className="meal-info"><div className="meal-title-row"><h3>{meal.name}</h3><span className={`diet-badge ${meal.isOnDiet ? 'on' : 'off'}`}><span />{meal.isOnDiet ? 'Dentro da dieta' : 'Fora da dieta'}</span></div>
        <p>{meal.description || 'Sem descrição'}</p><div className="meal-time"><Clock3 size={14} />{formatDate(meal.date)}</div></div>
      <ArrowUpRight className="meal-arrow" size={18} />
    </Link>
  );
}
