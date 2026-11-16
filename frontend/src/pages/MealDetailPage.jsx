import { ArrowLeft, CalendarDays, Clock3, Leaf, Pencil, Trash2, Utensils } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { api, formatDate } from '../api.js';
import { ErrorMessage, Loading } from '../components/Layout.jsx';

export function MealDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [meal, setMeal] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState(location.state?.notice ?? '');

  useEffect(() => {
    api(`/meals/${id}`).then(({ meal: data }) => setMeal(data)).catch((loadError) => setError(loadError.message));
  }, [id]);

  async function handleDelete() {
    if (!window.confirm('Tem certeza que deseja excluir esta refeição? Esta ação não pode ser desfeita.')) return;
    try {
      await api(`/meals/${id}`, { method: 'DELETE' });
      navigate('/meals', { replace: true, state: { notice: 'Refeição excluída com sucesso.' } });
    } catch (deleteError) {
      setError(deleteError.message);
    }
  }

  if (!meal && !error) return <Loading />;
  return <div className="page-wrap narrow-page">
    <Link className="back-link" to="/meals"><ArrowLeft size={16} /> Voltar para refeições</Link>
    {notice && <div className="alert alert-success">{notice}</div>}
    <ErrorMessage>{error}</ErrorMessage>
    {meal && <article className="detail-card">
      <div className="detail-cover"><div className="detail-food-icon"><Utensils size={27} /></div><span className={`diet-badge ${meal.isOnDiet ? 'on' : 'off'}`}><span />{meal.isOnDiet ? 'Dentro da dieta' : 'Fora da dieta'}</span></div>
      <div className="detail-content"><div className="eyebrow">DETALHES DO REGISTRO</div><h1>{meal.name}</h1><p className="detail-description">{meal.description || 'Nenhuma descrição foi adicionada para esta refeição.'}</p>
        <div className="detail-facts"><div><span className="fact-icon"><CalendarDays size={17} /></span><span><small>DATA</small><strong>{new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full' }).format(new Date(meal.date))}</strong></span></div><div><span className="fact-icon"><Clock3 size={17} /></span><span><small>HORÁRIO</small><strong>{new Intl.DateTimeFormat('pt-BR', { timeStyle: 'short' }).format(new Date(meal.date))}</strong></span></div><div><span className="fact-icon"><Leaf size={17} /></span><span><small>STATUS</small><strong>{meal.isOnDiet ? 'Dentro da dieta' : 'Fora da dieta'}</strong></span></div></div>
        <div className="detail-actions"><Link className="button button-primary" to={`/meals/${id}/edit`}><Pencil size={16} /> Editar refeição</Link><button className="button button-danger" onClick={handleDelete}><Trash2 size={16} /> Excluir</button></div>
        <div className="detail-created">Registro criado em {formatDate(meal.createdAt)}</div>
      </div>
    </article>}
  </div>;
}
