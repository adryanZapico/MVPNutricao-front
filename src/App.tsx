
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/AuthProvider';
import { PrivateRoute } from './components/PrivateRoute';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Patients } from './pages/Patients';
import { Consultations } from './pages/Consultations';
import { MealPlans } from './pages/MealPlans';
import { Evolution } from './pages/Evolution';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rota pública */}
          <Route path="/login" element={<Login />} />

          {/* Rotas privadas com layout */}
          <Route
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/consultations" element={<Consultations />} />
            <Route path="/meal-plans" element={<MealPlans />} />
            <Route path="/evolution" element={<Evolution />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
