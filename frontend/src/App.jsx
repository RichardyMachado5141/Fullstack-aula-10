import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { AuthPage } from './pages/AuthPage.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { MealDetailPage } from './pages/MealDetailPage.jsx';
import { MealFormPage } from './pages/MealFormPage.jsx';
import { MealsPage } from './pages/MealsPage.jsx';

export default function App() {
  return <Routes>
    <Route path="/login" element={<AuthPage mode="login" />} />
    <Route path="/register" element={<AuthPage mode="register" />} />
    <Route element={<ProtectedRoute />}><Route element={<Layout />}>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/meals" element={<MealsPage />} />
      <Route path="/meals/new" element={<MealFormPage />} />
      <Route path="/meals/:id" element={<MealDetailPage />} />
      <Route path="/meals/:id/edit" element={<MealFormPage />} />
    </Route></Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>;
}
