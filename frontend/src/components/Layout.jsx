import { BarChart3, CirclePlus, Leaf, LogOut, Utensils } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <NavLink to="/" className="brand"><span className="brand-mark"><Leaf size={20} /></span><span>daily<span className="brand-light">diet</span></span></NavLink>
        <div className="side-label">MENU</div>
        <nav className="side-nav">
          <NavLink to="/" end><BarChart3 size={18} /> Visão geral</NavLink>
          <NavLink to="/meals"><Utensils size={18} /> Refeições</NavLink>
        </nav>
        <div className="sidebar-bottom">
          <div className="profile"><div className="avatar">{user?.name?.slice(0, 1).toUpperCase()}</div><div className="profile-copy"><strong>{user?.name}</strong><span>Minha conta</span></div></div>
          <button className="logout-button" onClick={handleLogout} aria-label="Sair"><LogOut size={18} /></button>
        </div>
      </aside>
      <main className="main-content"><Outlet /></main>
      <nav className="mobile-nav">
        <NavLink to="/" end><BarChart3 size={19} /><span>Início</span></NavLink>
        <NavLink to="/meals"><Utensils size={19} /><span>Refeições</span></NavLink>
        <NavLink to="/meals/new"><CirclePlus size={19} /><span>Adicionar</span></NavLink>
        <button onClick={handleLogout}><LogOut size={19} /><span>Sair</span></button>
      </nav>
    </div>
  );
}

export function PageHeader({ eyebrow, title, description, action }) {
  return <header className="page-header"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1>{description && <p>{description}</p>}</div>{action}</header>;
}

export function Loading({ label = 'Carregando...' }) {
  return <div className="loading-state"><span className="spinner" />{label}</div>;
}

export function ErrorMessage({ children }) {
  return children ? <div className="alert alert-error" role="alert">{children}</div> : null;
}
