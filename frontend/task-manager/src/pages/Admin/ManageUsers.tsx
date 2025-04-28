import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { LuTrash2 } from 'react-icons/lu';
import toast from 'react-hot-toast';
import { useUserAuth } from '../../hooks/useUserAuth';

interface User {
  _id: string;
  name: string;
  email: string;
  profileImageUrl?: string;
}

const ManageUsers = () => {
  useUserAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get<User[]>(API_PATHS.USERS.GET_ALL_USERS);
      setUsers(response.data);
    } catch (error) {
      console.error('Erro ao carregar usuários', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Tem certeza que deseja deletar este usuário?')) return;

    try {
      await axiosInstance.delete(API_PATHS.USERS.DELETE_USER(userId));
      toast.success('Usuário deletado com sucesso!');
      fetchUsers(); // Recarrega a lista
    } catch (error) {
      console.error('Erro ao deletar usuário', error);
      toast.error('Erro ao deletar usuário');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <DashboardLayout activeMenu="Membros da Equipe">
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Lista de Membros</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="py-3 px-4 text-gray-700 text-sm">Foto</th>
                <th className="py-3 px-4 text-gray-700 text-sm">Nome</th>
                <th className="py-3 px-4 text-gray-700 text-sm">Email</th>
                <th className="py-3 px-4 text-gray-700 text-sm">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <img
                      src={user.profileImageUrl || '/default-avatar.png'}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="py-4 px-4 text-gray-700 text-sm">{user.name}</td>
                  <td className="py-4 px-4 text-gray-700 text-sm">{user.email}</td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="text-red-500 hover:text-red-700 transition"
                      title="Deletar usuário"
                    >
                      <LuTrash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <p className="text-center text-sm text-gray-500 mt-6">Nenhum usuário encontrado.</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageUsers;
