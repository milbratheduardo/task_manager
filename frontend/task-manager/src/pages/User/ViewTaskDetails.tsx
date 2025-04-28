import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useUserAuth } from '../../hooks/useUserAuth';
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { LuArrowLeft, LuCheck, LuClock, LuTrash2 } from 'react-icons/lu';
import moment from 'moment';
import 'moment/locale/pt-br';
import toast from 'react-hot-toast';

moment.locale('pt-br');

interface ChecklistItem {
  text: string;
  completed: boolean;
  _id?: string;
}

interface AssignedUser {
  _id: string;
  name: string;
  email: string;
  profileImageUrl?: string;
}

interface Task {
  _id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  dueDate: string;
  createdAt: string;
  assignedTo: AssignedUser[];
  attachments: string[];
  todoChecklist: ChecklistItem[];
}

const ViewTaskDetails = () => {
  useUserAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [task, setTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState<Task | null>(null);
  const [users, setUsers] = useState<AssignedUser[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const isAdmin = user?.role === "admin";
  const isAssignedMember = task?.assignedTo?.some(u => u._id === user?._id);

  const [newChecklistItem, setNewChecklistItem] = useState<string>('');

  const handleAddChecklistItem = () => {
    if (!formData || !newChecklistItem.trim()) return;

    const updatedChecklist = [
      ...formData.todoChecklist,
      { text: newChecklistItem.trim(), completed: false }
    ];

    setFormData({ ...formData, todoChecklist: updatedChecklist });
    setNewChecklistItem('');
  };

  const fetchTaskDetails = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(id!));
      setTask(response.data);
      setFormData(response.data);
    } catch (error) {
      console.error('Erro ao carregar detalhes da tarefa', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      setUsers(response.data);
    } catch (error) {
      console.error("Erro ao buscar usuários", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchTaskDetails();
      fetchUsers();
    }
  }, [id]);

  const handleChecklistToggle = async (index: number) => {
    if (!formData) return;
    const updatedChecklist = [...formData.todoChecklist];
    updatedChecklist[index].completed = !updatedChecklist[index].completed;
    setFormData({ ...formData, todoChecklist: updatedChecklist });

    try {
      await axiosInstance.put(API_PATHS.TASKS.UPDATE_TODO_CHECKLIST(formData._id), {
        todoChecklist: updatedChecklist,
      });
      toast.success("Checklist atualizado!");
      fetchTaskDetails();
    } catch (error) {
      toast.error("Erro ao atualizar checklist");
    }
  };

  const handleSelectAssignedTo = (userId: string) => {
    if (!formData) return;

    const alreadyAssigned = formData.assignedTo.some(user => user._id === userId);

    if (alreadyAssigned) {
      setFormData({
        ...formData,
        assignedTo: formData.assignedTo.filter(user => user._id !== userId),
      });
    } else {
      const userToAdd = users.find(u => u._id === userId);
      if (userToAdd) {
        setFormData({
          ...formData,
          assignedTo: [...formData.assignedTo, userToAdd],
        });
      }
    }
  };  

  const handleRemoveChecklistItem = (index: number) => {
    if (!formData) return;
  
    const updatedChecklist = [...formData.todoChecklist];
    updatedChecklist.splice(index, 1);
  
    setFormData({
      ...formData,
      todoChecklist: updatedChecklist,
    });
  };

  
  const handleSave = async () => {
    if (!formData) return;
  
    try {
      await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK(formData._id), {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        dueDate: formData.dueDate,
        assignedTo: formData.assignedTo.map((u) => u._id),
      });
  
      await axiosInstance.put(API_PATHS.TASKS.UPDATE_TODO_CHECKLIST(formData._id), {
        todoChecklist: formData.todoChecklist,
      });
  
      toast.success("Tarefa atualizada com sucesso!");
      setIsEditing(false);
      fetchTaskDetails(); 
    } catch (error) {
      console.error('Erro ao salvar alterações', error);
      toast.error("Erro ao salvar alterações");
    }
  };
  

  const handleDelete = async () => {
    if (!task) return;

    if (confirm('Tem certeza que deseja excluir essa tarefa?')) {
      try {
        await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(task._id));
        toast.success("Tarefa excluída!");
        navigate("/admin/tarefas");
      } catch (error) {
        toast.error("Erro ao excluir tarefa");
      }
    }
  };

  if (!task || !formData) {
    return (
      <DashboardLayout activeMenu="">
        <div className="p-6">Carregando detalhes da tarefa...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="">
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-sm gap-1 text-gray-700 hover:text-primary"
        >
          <LuArrowLeft />
          Voltar
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md flex flex-col gap-6">

        <div className="flex flex-col md:flex-row justify-between">
          <div>
            {isEditing ? (
              <input
                className="text-xl font-semibold text-gray-800"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            ) : (
              <h2 className="text-2xl font-bold text-gray-800">{task.title}</h2>
            )}

            {isEditing ? (
              <textarea
                className="text-sm text-gray-600 mt-2 w-full"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            ) : (
              <p className="text-sm text-gray-600 mt-2">{task.description}</p>
            )}
          </div>

          <div className="flex flex-col gap-2 text-sm text-gray-600 mt-4 md:mt-0">
            {isEditing ? (
              <>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="border p-1 rounded-md"
                >
                  <option value="Pendente">Pendente</option>
                  <option value="Em progresso">Em progresso</option>
                  <option value="Completada">Completada</option>
                </select>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="border p-1 rounded-md"
                >
                  <option value="Baixa">Baixa</option>
                  <option value="Média">Média</option>
                  <option value="Alta">Alta</option>
                </select>
                <input
                  type="date"
                  value={moment(formData.dueDate).format('YYYY-MM-DD')}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="border p-1 rounded-md"
                />
              </>
            ) : (
              <>
                <span>Status: <strong>{task.status}</strong></span>
                <span>Prioridade: <strong>{task.priority}</strong></span>
                <span>Data de entrega: <strong>{moment(task.dueDate).format('DD/MM/YYYY')}</strong></span>
              </>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-3">Checklist ({task.todoChecklist.length})</h4>
          <div className="flex flex-col gap-2">
          {formData.todoChecklist.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => handleChecklistToggle(index)}
                    className="accent-green-500"
                  />
                  <input
                    type="text"
                    value={item.text}
                    onChange={(e) => {
                      const updatedChecklist = [...formData.todoChecklist];
                      updatedChecklist[index].text = e.target.value;
                      setFormData({ ...formData, todoChecklist: updatedChecklist });
                    }}
                    className="flex-1 p-2 border rounded-md text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveChecklistItem(index)}
                    className="text-red-500 hover:text-red-700"
                    title="Remover item"
                  >
                    <LuTrash2 size={18} />
                  </button>
                </>
              ) : (
                <>
                  {item.completed ? (
                    <LuCheck className="text-green-500" />
                  ) : (
                    <LuClock className="text-gray-400" />
                  )}
                  <span className={`${item.completed ? 'line-through text-gray-400' : ''}`}>
                    {item.text}
                  </span>
                </>
              )}
            </div>
          ))}

            {isAssignedMember && !isAdmin && (
              <p className="text-xs text-red-500 mt-2">Você precisa de permissão de administrador para alterar a tarefa.</p>
            )}
          </div>
        </div>

        {isEditing && isAdmin && (
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Atribuir membros</h4>
            <div className="flex flex-wrap gap-2">
              {users.map((user) => (
                <button
                  key={user._id}
                  type="button"
                  onClick={() => handleSelectAssignedTo(user._id)}
                  className={`flex items-center gap-2 border px-3 py-1 rounded-full text-sm ${
                    formData.assignedTo.some(u => u._id === user._id)
                      ? "bg-orange-500 text-white border-orange-500"
                      : "bg-white text-gray-600 border-gray-300"
                  }`}
                >
                  {user.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {isEditing && (
          <div className="flex items-center gap-2 mt-4">
            <input
              type="text"
              className="flex-1 p-2 border rounded-md text-sm"
              placeholder="Novo item de checklist"
              value={newChecklistItem}
              onChange={(e) => setNewChecklistItem(e.target.value)}
            />
            <button
              type="button"
              onClick={handleAddChecklistItem}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-md transition"
            >
              Adicionar
            </button>
          </div>
        )}

         {isAdmin && (
          <div className="flex flex-col gap-2 mt-4">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-md transition"
              >
                Editar
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-md transition"
                disabled={loading}
              >
                {loading ? "Salvando..." : "Salvar"}
              </button>
            )}

            <button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-md transition"
            >
              Excluir
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ViewTaskDetails;
