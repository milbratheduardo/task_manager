import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useUserAuth } from '../../hooks/useUserAuth';
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { IoDocumentAttachOutline } from 'react-icons/io5';
import moment from 'moment';
import 'moment/locale/pt-br';
import { useNavigate } from 'react-router-dom';

moment.locale('pt-br');

interface Task {
  _id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  dueDate: string;
  createdAt: string;
  assignedTo: {
    _id: string;
    name: string;
    email: string;
    profileImageUrl?: string;
  }[];
  attachments: string[];
  todoChecklist: { text: string; completed: boolean }[];
}

const ManageTasks = () => {
  useUserAuth();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const fetchTasks = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS);
      if (response.data) {
        setTasks(response.data.tasks || []);
      }
    } catch (error) {
      console.error("Erro ao carregar tarefas", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <DashboardLayout activeMenu="Gerenciar Tarefas">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">Tarefas</h2>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between my-4 gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {['All', 'Pendente', 'Em progresso', 'Completada'].map((status) => (
              <button
                key={status}
                onClick={() => handleStatusFilter(status)}
                className={`px-3 py-1 rounded-full text-sm border ${
                  statusFilter === status
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-600 border-gray-300'
                }`}
              >
                {status}
                {status !== 'All' && (
                  <span className="ml-1 text-[12px] text-gray-400">
                    ({tasks.filter((task) => task.status === status).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="flex">
            <input
              type="text"
              placeholder="Pesquisar tarefa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
          {filteredTasks.map((task) => (
            <div
              key={task._id}
              className="bg-white p-5 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all cursor-pointer"
              onClick={() => navigate(`/user/detalhes-tarefas/${task._id}`)}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(task.status)}`}>
                  {task.status}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${getPriorityBadge(task.priority)}`}>
                  {task.priority}
                </span>
              </div>

              <h4 className="text-md font-bold text-gray-800 mb-1">{task.title}</h4>
              <p className="text-xs text-gray-500 mb-2 line-clamp-2">{task.description}</p>

              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden mt-3 mb-4">
                <div
                  className="h-full bg-purple-500 transition-all"
                  style={{ width: `${getProgress(task)}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                <div>
                  <p>Início: {moment(task.createdAt).format('DD/MM/YYYY')}</p>
                  <p>Entrega: {moment(task.dueDate).format('DD/MM/YYYY')}</p>
                </div>

                <div className="flex items-center gap-2">
                  {task.assignedTo.map((member) => (
                    <img
                      key={member._id}
                      src={member.profileImageUrl || '/default-avatar.png'}
                      alt={member.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ))}
                  {task.attachments.length > 0 && (
                    <div className="flex items-center ml-2">
                      <IoDocumentAttachOutline className="text-gray-500" />
                      <span className="text-xs ml-0.5">{task.attachments.length}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Pendente':
      return 'bg-purple-100 text-purple-600';
    case 'Em progresso':
      return 'bg-cyan-100 text-cyan-600';
    case 'Completada':
      return 'bg-green-100 text-green-600';
    default:
      return 'bg-gray-100 text-gray-500';
  }
};

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case 'Alta':
      return 'bg-red-100 text-red-600';
    case 'Média':
      return 'bg-orange-100 text-orange-600';
    case 'Baixa':
      return 'bg-green-100 text-green-600';
    default:
      return 'bg-gray-100 text-gray-500';
  }
};

const getProgress = (task: Task) => {
  if (task.todoChecklist.length === 0) return 0;
  const completed = task.todoChecklist.filter((item) => item.completed).length;
  return Math.round((completed / task.todoChecklist.length) * 100);
};

export default ManageTasks;
