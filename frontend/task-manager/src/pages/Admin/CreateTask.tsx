import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { PRIORITY_DATA } from '../../utils/data';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import moment from "moment";
import { LuTrash2 } from 'react-icons/lu';

interface User {
  _id: string;
  name: string;
  email: string;
  profileImageUrl?: string;
}

const CreateTask = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [priority, setPriority] = useState<string>('Média');
  const [dueDate, setDueDate] = useState<string>(moment().add(1, 'days').format('YYYY-MM-DD'));
  const [assignedTo, setAssignedTo] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [todoChecklist, setTodoChecklist] = useState<string[]>(['']);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get<User[]>(API_PATHS.USERS.GET_ALL_USERS);
      setUsers(response.data);
    } catch (error) {
      console.error("Erro ao buscar usuários", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!title) {
      toast.error("O título da tarefa é obrigatório!");
      return;
    }
  
    if (todoChecklist.length === 0 || todoChecklist.every(item => item.trim() === '')) {
      toast.error("Adicione pelo menos um item no checklist!");
      return;
    }
  
    if (assignedTo.length === 0) {
      toast.error("Atribua a tarefa a pelo menos um membro!");
      return;
    }
  
    setLoading(true);
  
    try {
      const taskData = {
        title,
        description,
        priority,
        dueDate,
        assignedTo,
        todoChecklist: todoChecklist
          .filter(item => item.trim() !== '')
          .map(item => ({ text: item, completed: false })),
      };
  
      const response = await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, taskData);
  
      if (response.data) {
        toast.success("Tarefa criada com sucesso!");
        setTimeout(() => {
          navigate('/admin/tarefas');
        }, 1500);
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar tarefa!");
    } finally {
      setLoading(false);
    }
  }; 

  const handleAddChecklistItem = () => {
    setTodoChecklist([...todoChecklist, '']);
  };

  const handleRemoveChecklistItem = (index: number) => {
    const updatedChecklist = [...todoChecklist];
    updatedChecklist.splice(index, 1);
    setTodoChecklist(updatedChecklist);
  };

  const handleChecklistChange = (index: number, value: string) => {
    const updatedChecklist = [...todoChecklist];
    updatedChecklist[index] = value;
    setTodoChecklist(updatedChecklist);
  };

  const handleSelectAssignedTo = (userId: string) => {
    if (assignedTo.includes(userId)) {
      setAssignedTo(assignedTo.filter(id => id !== userId));
    } else {
      setAssignedTo([...assignedTo, userId]);
    }
  };

  return (
    <DashboardLayout activeMenu="Criar Tarefas">
      <form onSubmit={handleCreateTask} className="bg-white p-6 rounded-xl shadow-md flex flex-col gap-4">

        <div>
          <label className="text-sm font-medium text-gray-700">Título</label>
          <input
            type="text"
            className="w-full mt-1 p-2 border rounded-md text-sm"
            placeholder="Título da tarefa"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Descrição</label>
          <textarea
            className="w-full mt-1 p-2 border rounded-md text-sm"
            placeholder="Descrição da tarefa"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Prioridade</label>
            <select
              className="w-full mt-1 p-2 border rounded-md text-sm"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              {PRIORITY_DATA.map((item, index) => (
                <option key={index} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Data de Entrega</label>
            <input
              type="date"
              className="w-full mt-1 p-2 border rounded-md text-sm"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Atribuir a:</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {users.map(user => (
              <button
                key={user._id}
                type="button"
                onClick={() => handleSelectAssignedTo(user._id)}
                className={`flex items-center gap-2 border px-3 py-1 rounded-full text-sm ${
                  assignedTo.includes(user._id)
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-gray-600 border-gray-300"
                }`}
              >
                {user.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Checklist (opcional)</label>
          {todoChecklist.map((item, index) => (
            <div key={index} className="flex items-center gap-2 mt-2">
              <input
                type="text"
                className="flex-1 p-2 border rounded-md text-sm"
                placeholder={`Item ${index + 1}`}
                value={item}
                onChange={(e) => handleChecklistChange(index, e.target.value)}
              />
              {index > 0 && (
                <button
                  type="button"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleRemoveChecklistItem(index)}
                >
                  <LuTrash2 />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddChecklistItem}
            className="mt-3 text-sm text-orange-500 hover:underline"
          >
            + Adicionar Item
          </button>
        </div>

        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-md transition"
          disabled={loading}
        >
          {loading ? "Criando..." : "Criar Tarefa"}
        </button>

      </form>
    </DashboardLayout>
  );
};

export default CreateTask;
