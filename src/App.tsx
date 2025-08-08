import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Alunos from './pages/Alunos';
import ProfessorLogin from './pages/ProfessorLogin';
import Professores from './pages/Professores';
import AdminLogin from './pages/AdminLogin';
import Admin from './pages/Admin';
import AdminAlunos from './pages/AdminAlunos';
import AdminProfessores from './pages/AdminProfessores';
import AdminAdmins from './pages/AdminAdmins';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/alunos" element={<Alunos />} />
        <Route path="/professor/login" element={<ProfessorLogin />} />
        <Route path="/professores" element={<Professores />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/alunos" element={<AdminAlunos />} />
        <Route path="/admin/professores" element={<AdminProfessores />} />
        <Route path="/admin/admins" element={<AdminAdmins />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
