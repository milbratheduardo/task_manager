import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom'; 
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import Dashboard from './pages/Admin/Dashboard';
import ManageTasks from './pages/Admin/ManageTasks';
import CreateTask from './pages/Admin/CreateTask';
import ManageUsers from './pages/Admin/ManageUsers';
import UserDashboard from './pages/User/UserDashboard';
import MyTasks from './pages/User/MyTasks';
import ViewTaskDetails from './pages/User/ViewTaskDetails';
import PrivateRoute from './routes/PrivateRoute';
import UserProvider, { UserContext } from './context/userContext';
import { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Toaster position="top-right" reverseOrder={false} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />

          {/* Rotas Administrador */}
          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/tarefas" element={<ManageTasks />} />
            <Route path="/admin/criar-tarefa" element={<CreateTask />} />
            <Route path="/admin/usuarios" element={<ManageUsers />} />
          </Route>

          {/* Rotas Usuários */}
          <Route element={<PrivateRoute allowedRoles={["member"]} />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/tarefas" element={<MyTasks />} />
            <Route path="/user/detalhes-tarefas/:id" element={<ViewTaskDetails />} />
          </Route>

          {/* Redirecionamento inteligente */}
          <Route path="/" element={<Root />} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;

const Root = () => {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen text-gray-700">Carregando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return user.role === "admin" ? (
    <Navigate to="/admin/dashboard" />
  ) : (
    <Navigate to="/user/dashboard" />
  );
};
