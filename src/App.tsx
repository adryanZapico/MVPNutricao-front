import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/AuthProvider';
import { PrivateRoute } from './components/PrivateRoute';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Login } from './pages/Login/Login';  
import { Register } from './pages/Register/Register';  
import { Dashboard } from './pages/Dashboard/Dashboard';  
import { Patients } from './pages/Patients/Patients';  
import { Consultations } from './pages/Consultations/Consultations'; 
import { MealPlans } from './pages/MealPlans/MealPlans';  
import { Evolution } from './pages/Evolution/Evolution';  
import { Anamnese } from './pages/Anamnese/Anamnese';  

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rota pública principal: Register */}
          <Route path="/" element={<Navigate to="/register" replace />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Rotas privadas com layout */}
          <Route
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/consultations" element={<Consultations />} />
            <Route path="/meal-plans" element={<MealPlans />} />
            <Route path="/evolution" element={<Evolution />} />
            <Route path="/anamnese" element={<Anamnese />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
