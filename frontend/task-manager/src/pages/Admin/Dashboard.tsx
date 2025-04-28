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

interface DashboardData {
  statistics: {
    totalTasks: number;
    pendingTasks: number;
    completedTasks: number;
    overdueTasks: number;
  };
  charts: {
    taskDistribution: Record<string, number>;
    taskPriorityLevels: Record<string, number>;
  };
  recentTasks: {
    _id: string;
    title: string;
    status: string;
    priority: string;
    dueDate: string;
    createdAt: string;
  }[];
}

const Dashboard = () => {
  useUserAuth();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [pieChartData, setPieChartData] = useState<{ status: string; count: number }[]>([]);
  const [barChartData, setBarChartData] = useState<{ status: string; count: number }[]>([]);

  const prepareChartData = (charts: DashboardData["charts"] | null) => {
    if (!charts) return;
  
    const taskDistributionData = [
      { status: "Pendente", count: charts.taskDistribution?.["Pendente"] || 0 },
      { status: "Em progresso", count: charts.taskDistribution?.Emprogresso || 0 },
      { status: "Completada", count: charts.taskDistribution?.["Completada"] || 0 },
    ];
    setPieChartData(taskDistributionData);
  
    const priorityLevelData = [
      { priority: "Baixa", count: charts.taskPriorityLevels?.["Baixa"] || 0 },
      { priority: "Média", count: charts.taskPriorityLevels?.["Média"] || 0 },
      { priority: "Alta", count: charts.taskPriorityLevels?.["Alta"] || 0 },
    ];
    setBarChartData(priorityLevelData);
  };
  

  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get<DashboardData>(API_PATHS.TASKS.GET_DASHBOARD_DATA);
      if (response.data) {
        setDashboardData(response.data);
        prepareChartData(response.data.charts);
      }
    } catch (error) {
      console.error("Erro ao carregar dashboard", error);
    }
  };

  const onSeeMore = () => {
    navigate('/admin/tarefas');
  };

  useEffect(() => {
    getDashboardData();
  }, []);

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
            value={addThousandsSeparator(dashboardData?.statistics.totalTasks || 0)}
            color="bg-primary"
          />
          <InfoCard 
            icon={<IoMdCard />}
            label="Em Progresso"
            value={addThousandsSeparator(dashboardData?.charts.taskDistribution?.Emprogresso || 0)}
            color="bg-cyan-500"
          />
          <InfoCard 
            icon={<IoMdCard />}
            label="Pendentes"
            value={addThousandsSeparator(dashboardData?.charts.taskDistribution?.["Pendente"] || 0)}
            color="bg-violet-500"
          />
          <InfoCard 
            icon={<IoMdCard />}
            label="Completadas"
            value={addThousandsSeparator(dashboardData?.charts.taskDistribution?.["Completada"] || 0)}
            color="bg-lime-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">
        <div>
          <div className="bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50">
            <h5 className="font-medium mb-4">Distribuição das Tarefas</h5>
            <CustomPieChart 
              data={pieChartData}
              colors={COLORS}
            />
          </div>
        </div>

        <div>
          <div className="bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50">
            <h5 className="font-medium mb-4">Níveis de Prioridade</h5>
            <CustomBarChart 
              data={barChartData}
            />
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

            <TaskListTable tableData={dashboardData?.recentTasks || []} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
