import { ArrowRight, Leaf, LockKeyhole, Mail, UserRound } from 'lucide-react';
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { ErrorMessage } from '../components/Layout.jsx';

export function AuthPage({ mode }) {
  const isRegister = mode === 'register';
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/" replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    const form = new FormData(event.currentTarget);
    const values = Object.fromEntries(form.entries());
    try {
      if (isRegister && values.password !== values.confirmPassword) {
        throw new Error('As senhas não coincidem.');
      }
      delete values.confirmPassword;
      await (isRegister ? register(values) : login(values));
      navigate('/', { replace: true });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-visual"><Link to="/login" className="brand auth-brand"><span className="brand-mark"><Leaf size={20} /></span><span>daily<span className="brand-light">diet</span></span></Link>
        <div className="auth-quote"><div className="quote-leaf"><Leaf size={25} /></div><h2>Pequenas escolhas.<br /><em>Grandes mudanças.</em></h2><p>Uma rotina mais leve começa com atenção ao que você coloca no prato.</p>
          <div className="quote-points"><span>01</span><div><strong>Registre sem complicação</strong><small>Suas refeições em poucos segundos.</small></div></div>
          <div className="quote-points"><span>02</span><div><strong>Acompanhe sua evolução</strong><small>Consistência é melhor que perfeição.</small></div></div>
        </div><div className="visual-footer">BEM-ESTAR, UM DIA DE CADA VEZ <span>✳</span></div>
      </div>
      <div className="auth-form-side"><div className="auth-mobile-brand"><Leaf size={20} /> daily diet</div><div className="auth-form-wrap">
        <div className="eyebrow">{isRegister ? 'COMECE SUA JORNADA' : 'BEM-VINDO DE VOLTA'}</div><h1>{isRegister ? 'Crie sua conta' : 'Acesse sua conta'}</h1><p className="auth-subtitle">{isRegister ? 'Vamos construir hábitos melhores, juntos.' : 'Entre para continuar acompanhando sua rotina.'}</p>
        <ErrorMessage>{error}</ErrorMessage>
        <form className="form-stack" onSubmit={handleSubmit}>
          {isRegister && <label>Seu nome<div className="input-wrap"><UserRound size={17} /><input name="name" placeholder="Como podemos te chamar?" minLength="2" maxLength="80" required autoComplete="name" /></div></label>}
          <label>E-mail<div className="input-wrap"><Mail size={17} /><input name="email" type="email" placeholder="voce@email.com" maxLength="254" required autoComplete="email" /></div></label>
          <label>Senha<div className="input-wrap"><LockKeyhole size={17} /><input name="password" type="password" placeholder="Mínimo de 8 caracteres" minLength="8" maxLength="72" required autoComplete={isRegister ? 'new-password' : 'current-password'} /></div></label>
          {isRegister && <label>Confirme sua senha<div className="input-wrap"><LockKeyhole size={17} /><input name="confirmPassword" type="password" placeholder="Digite novamente" minLength="8" maxLength="72" required autoComplete="new-password" /></div></label>}
          <button className="button button-primary auth-submit" disabled={busy}>{busy ? 'Aguarde...' : isRegister ? 'Criar minha conta' : 'Entrar'} <ArrowRight size={17} /></button>
        </form>
        <div className="auth-switch">{isRegister ? 'Já tem uma conta?' : 'Ainda não tem uma conta?'} <Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'Fazer login' : 'Cadastre-se'}</Link></div>
        <div className="privacy-note"><LockKeyhole size={13} /> Seus dados são privados e protegidos.</div>
      </div></div>
    </div>
  );
}
