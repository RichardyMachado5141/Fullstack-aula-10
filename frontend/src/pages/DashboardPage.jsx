import { ArrowRight, ArrowUpRight, CalendarDays, Check, Flame, Plus, TrendingUp, Utensils, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, formatDate } from '../api.js';
import { ErrorMessage, Loading, PageHeader } from '../components/Layout.jsx';
import { MealCard } from '../components/MealCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';

function StatCard({ icon: Icon, label, value, note, variant }) {
  return <article className={`stat-card ${variant}`}><div className="stat-top"><span className="stat-icon"><Icon size={18} /></span><span className="stat-label">{label}</span></div><div className="stat-value">{value}<span className="stat-note">{note}</span></div></article>;
}

export function DashboardPage() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [meals, setMeals] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api('/metrics'), api('/meals')])
      .then(([metricData, mealData]) => {
        setMetrics(metricData.metrics);
        setMeals(mealData.meals.slice(0, 4));
      })
      .catch((loadError) => setError(loadError.message));
  }, []);

  return <div className="page-wrap">
    <PageHeader eyebrow="VISÃO GERAL" title={`Olá, ${user?.name?.split(' ')[0]} 👋`} description="Cada refeição é uma nova oportunidade de cuidar de você." action={<Link className="button button-primary" to="/meals/new"><Plus size={17} /> Nova refeição</Link>} />
    <ErrorMessage>{error}</ErrorMessage>
    {!metrics ? <Loading label="Preparando seu resumo..." /> : <>
      <section className="stats-grid">
        <StatCard icon={Utensils} label="Total de refeições" value={metrics.totalMeals} note="registradas" variant="stat-green" />
        <StatCard icon={Check} label="Dentro da dieta" value={metrics.mealsOnDiet} note="refeições" variant="stat-mint" />
        <StatCard icon={X} label="Fora da dieta" value={metrics.mealsOffDiet} note="refeições" variant="stat-orange" />
        <StatCard icon={Flame} label="Maior sequência" value={metrics.bestDietStreak} note="em sequência" variant="stat-yellow" />
      </section>
      <section className="welcome-strip"><div className="strip-icon"><TrendingUp size={21} /></div><div><strong>Seu progresso é feito de escolhas.</strong><p>O que importa é continuar, uma refeição de cada vez.</p></div><span className="strip-decoration">✳</span></section>
      <section className="section-block"><div className="section-heading"><div><div className="eyebrow">ACOMPANHAMENTO</div><h2>Refeições recentes</h2></div><Link className="text-link" to="/meals">Ver todas <ArrowRight size={16} /></Link></div>
        {meals.length ? <div className="meal-list">{meals.map((meal) => <MealCard key={meal.id} meal={meal} />)}</div> : <div className="empty-state"><div className="empty-icon"><CalendarDays size={23} /></div><h3>Sua jornada começa aqui</h3><p>Registre sua primeira refeição para começar a acompanhar seu progresso.</p><Link className="button button-primary" to="/meals/new"><Plus size={17} /> Registrar refeição</Link></div>}
      </section>
      {meals.length > 0 && <div className="bottom-note"><span>✳</span> Seu último registro foi em {formatDate(meals[0].date)}. <Link to={`/meals/${meals[0].id}`}>Ver detalhes <ArrowUpRight size={13} /></Link></div>}
    </>}
  </div>;
}
