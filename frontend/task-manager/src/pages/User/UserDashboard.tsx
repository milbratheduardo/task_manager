import React, { useContext, useEffect, useState } from 'react';
import { useUserAuth } from '../../hooks/useUserAuth';
import { UserContext } from '../../context/userContext';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { IoMdCard } from 'react-icons/io';
import InfoCard from '../../components/Cards/InfoCard';
import { addThousandsSeparator } from '../../utils/helper';
import { LuArrowRight } from 'react-icons/lu';
import TaskListTable from '../../components/TaskListTable';
import CustomPieChart from '../../components/Charts/CustomPieChart';
import CustomBarChart from '../../components/Charts/CustomBarChart';

const COLORS = ["#8D51FF", "#008808", "#7BCE00"];

interface Task {
  _id: string;
  title: string;
  status: string;
  priority: string;
  dueDate: string;
  createdAt: string;
  assignedTo: {
    _id: string;
  }[];
  todoChecklist: { text: string; completed: boolean }[];
}

const UserDashboard = () => {
  useUserAuth();
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [pieChartData, setPieChartData] = useState<{ status: string; count: number }[]>([]);
  const [barChartData, setBarChartData] = useState<{ status: string; count: number }[]>([]);
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);

  const prepareChartData = (userTasks: Task[]) => {
    const distribution = {
      "Pendente": 0,
      "Em progresso": 0,
      "Completada": 0,
    };
    const priorityLevels = {
      "Baixa": 0,
      "Média": 0,
      "Alta": 0,
    };

    userTasks.forEach(task => {
      distribution[task.status] = (distribution[task.status] || 0) + 1;
      priorityLevels[task.priority] = (priorityLevels[task.priority] || 0) + 1;
    });

    setPieChartData([
      { status: "Pendente", count: distribution["Pendente"] },
      { status: "Em progresso", count: distribution["Em progresso"] },
      { status: "Completada", count: distribution["Completada"] },
    ]);

    setBarChartData([
      { priority: "Baixa", count: priorityLevels["Baixa"] },
      { priority: "Média", count: priorityLevels["Média"] },
      { priority: "Alta", count: priorityLevels["Alta"] },
    ]);
  };

  const fetchTasks = async () => {
    try {
      const response = await axiosInstance.get<{ tasks: Task[] }>(API_PATHS.TASKS.GET_ALL_TASKS);
      if (response.data?.tasks && user) {
        const userTasks = response.data.tasks.filter(task =>
          task.assignedTo.some(u => u._id === user._id)
        );

        setTasks(userTasks);
        prepareChartData(userTasks);

        const sorted = [...userTasks].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setRecentTasks(sorted.slice(0, 5));
      }
    } catch (error) {
      console.error("Erro ao carregar tarefas", error);
    }
  };

  const onSeeMore = () => {
    navigate('/user/tarefas');
  };

  useEffect(() => {
    if (!loading && user) {
      fetchTasks();
    }
  }, [loading, user]);

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50 my-5">
        <div className="col-span-3">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
            Bem-vindo! {user?.name || ""}
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5">
          <InfoCard 
            icon={<IoMdCard />}
            label="Total"
            value={addThousandsSeparator(tasks.length)}
            color="bg-primary"
          />
          <InfoCard 
            icon={<IoMdCard />}
            label="Em Progresso"
            value={addThousandsSeparator(pieChartData.find(p => p.status === "Em progresso")?.count || 0)}
            color="bg-cyan-500"
          />
          <InfoCard 
            icon={<IoMdCard />}
            label="Pendentes"
            value={addThousandsSeparator(pieChartData.find(p => p.status === "Pendente")?.count || 0)}
            color="bg-violet-500"
          />
          <InfoCard 
            icon={<IoMdCard />}
            label="Completadas"
            value={addThousandsSeparator(pieChartData.find(p => p.status === "Completada")?.count || 0)}
            color="bg-lime-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">
        <div>
          <div className="bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50">
            <h5 className="font-medium mb-4">Distribuição das Tarefas</h5>
            <CustomPieChart data={pieChartData} colors={COLORS} />
          </div>
        </div>

        <div>
          <div className="bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50">
            <h5 className="font-medium mb-4">Níveis de Prioridade</h5>
            <CustomBarChart data={barChartData} />
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50">
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-lg font-semibold text-gray-800">Tarefas Recentes</h5>

              <button
                onClick={onSeeMore}
                className="flex items-center gap-2 bg-gray-300/50 hover:bg-gray-400/70 text-gray-700 px-3 py-1.5 rounded-md text-sm transition-all"
              >
                Ver Todas
                <LuArrowRight className="text-base" />
              </button>
            </div>

            <TaskListTable tableData={recentTasks || []} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
