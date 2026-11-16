import { ArrowLeft, Check, Clock3, Leaf, Save, Utensils } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, toLocalInput } from '../api.js';
import { ErrorMessage, Loading, PageHeader } from '../components/Layout.jsx';

export function MealFormPage() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(editing);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!editing) return;
    api(`/meals/${id}`).then(({ meal: data }) => setMeal(data)).catch((loadError) => setError(loadError.message)).finally(() => setLoading(false));
  }, [editing, id]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    const form = new FormData(event.currentTarget);
    const values = {
      name: form.get('name'),
      description: form.get('description'),
      date: new Date(form.get('date')).toISOString(),
      isOnDiet: form.get('isOnDiet') === 'true',
    };
    try {
      const { meal: saved } = await api(editing ? `/meals/${id}` : '/meals', {
        method: editing ? 'PUT' : 'POST',
        body: JSON.stringify(values),
      });
      navigate(`/meals/${saved.id}`, { replace: true, state: { notice: editing ? 'Refeição atualizada com sucesso.' : 'Refeição registrada com sucesso.' } });
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <Loading />;
  if (editing && !meal && !error) return <Loading />;
  if (editing && !meal && error) return <div className="page-wrap narrow-page"><Link className="back-link" to="/meals"><ArrowLeft size={16} /> Voltar para refeições</Link><ErrorMessage>{error}</ErrorMessage></div>;

  return <div className="page-wrap narrow-page">
    <Link className="back-link" to={editing ? `/meals/${id}` : '/meals'}><ArrowLeft size={16} /> {editing ? 'Voltar para refeição' : 'Voltar para refeições'}</Link>
    <PageHeader eyebrow={editing ? 'ATUALIZE SEU REGISTRO' : 'NOVO REGISTRO'} title={editing ? 'Editar refeição' : 'Adicionar refeição'} description={editing ? 'Ajuste os dados do seu registro.' : 'Cada detalhe ajuda a acompanhar sua rotina.'} />
    <ErrorMessage>{error}</ErrorMessage>
    <form className="meal-form" onSubmit={handleSubmit}>
      <div className="form-section-title"><span><Utensils size={17} /></span><div><strong>Sobre a refeição</strong><small>O que você comeu?</small></div></div>
      <label>Nome da refeição <span className="required">*</span><input name="name" defaultValue={meal?.name ?? ''} placeholder="Ex.: Almoço, Lanche da tarde..." maxLength="120" required /></label>
      <label>Descrição <span className="optional">OPCIONAL</span><textarea name="description" defaultValue={meal?.description ?? ''} placeholder="Conte um pouco mais sobre essa refeição..." rows="4" maxLength="1000" /></label>
      <label>Data e horário <span className="required">*</span><div className="input-wrap form-input-wrap"><Clock3 size={17} /><input name="date" type="datetime-local" defaultValue={meal ? toLocalInput(meal.date) : toLocalInput(new Date())} required /></div></label>
      <div className="diet-question"><div><strong>Esta refeição está dentro da sua dieta?</strong></div><div className="diet-options">
        <label className={`diet-option ${meal?.isOnDiet !== false ? 'selected selected-green' : ''}`}><input type="radio" name="isOnDiet" value="true" defaultChecked={meal?.isOnDiet !== false} required /><Check size={17} /> Sim, dentro</label>
        <label className={`diet-option ${meal?.isOnDiet === false ? 'selected selected-orange' : ''}`}><input type="radio" name="isOnDiet" value="false" defaultChecked={meal?.isOnDiet === false} /><Leaf size={17} /> Não, fora</label>
      </div></div>
      <div className="form-footer"><span><span className="required">*</span> Campos obrigatórios</span><button className="button button-primary" disabled={busy}>{busy ? 'Salvando...' : editing ? 'Salvar alterações' : 'Salvar refeição'} <Save size={16} /></button></div>
    </form>
  </div>;
}
