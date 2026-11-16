import { ArrowLeft, ArrowRight, CalendarDays, Plus, Search, SlidersHorizontal, Utensils } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { api } from '../api.js';
import { ErrorMessage, Loading, PageHeader } from '../components/Layout.jsx';
import { MealCard } from '../components/MealCard.jsx';

export function MealsPage() {
  const [meals, setMeals] = useState(null);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const currentPage = Math.max(1, Number(searchParams.get('page')) || 1);
  const pageSize = 8;

  useEffect(() => {
    api('/meals').then(({ meals: data }) => setMeals(data)).catch((loadError) => setError(loadError.message));
  }, []);

  const filtered = useMemo(() => (meals ?? []).filter((meal) => {
    const matchesText = `${meal.name} ${meal.description}`.toLocaleLowerCase('pt-BR').includes(query.toLocaleLowerCase('pt-BR'));
    return matchesText && (filter === 'all' || meal.isOnDiet === (filter === 'on'));
  }), [meals, query, filter]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visibleMeals = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return <div className="page-wrap">
    <PageHeader eyebrow="SEU HISTÓRICO" title="Refeições" description="Um registro de cada escolha que você fez." action={<Link className="button button-primary" to="/meals/new"><Plus size={17} /> Nova refeição</Link>} />
    {location.state?.notice && <div className="alert alert-success">{location.state.notice}</div>}
    <ErrorMessage>{error}</ErrorMessage>
    <div className="filter-toolbar"><label className="search-field"><Search size={17} /><input value={query} onChange={(event) => { setQuery(event.target.value); setSearchParams({ page: '1' }); }} placeholder="Buscar refeição..." /></label>
      <label className="select-field"><SlidersHorizontal size={16} /><select value={filter} onChange={(event) => { setFilter(event.target.value); setSearchParams({ page: '1' }); }} aria-label="Filtrar por status"><option value="all">Todas as refeições</option><option value="on">Dentro da dieta</option><option value="off">Fora da dieta</option></select></label>
      <span className="result-count">{filtered.length} {filtered.length === 1 ? 'refeição' : 'refeições'}</span>
    </div>
    {meals === null ? <Loading /> : visibleMeals.length ? <div className="meal-list">{visibleMeals.map((meal) => <MealCard key={meal.id} meal={meal} />)}</div> : <div className="empty-state compact"><div className="empty-icon">{meals.length ? <Search size={22} /> : <CalendarDays size={22} />}</div><h3>{meals.length ? 'Nenhuma refeição encontrada' : 'Ainda não há registros'}</h3><p>{meals.length ? 'Tente outra busca ou ajuste os filtros.' : 'Adicione sua primeira refeição e comece a acompanhar sua rotina.'}</p>{!meals.length && <Link className="button button-primary" to="/meals/new"><Plus size={17} /> Registrar refeição</Link>}</div>}
    {visibleMeals.length > 0 && totalPages > 1 && <div className="pagination"><span>Página {currentPage} de {totalPages}</span><div><Link className={`page-button ${currentPage <= 1 ? 'disabled' : ''}`} aria-disabled={currentPage <= 1} to={`/meals?page=${Math.max(1, currentPage - 1)}`}><ArrowLeft size={16} /> Anterior</Link><Link className={`page-button ${currentPage >= totalPages ? 'disabled' : ''}`} aria-disabled={currentPage >= totalPages} to={`/meals?page=${Math.min(totalPages, currentPage + 1)}`}>Próxima <ArrowRight size={16} /></Link></div></div>}
  </div>;
}
