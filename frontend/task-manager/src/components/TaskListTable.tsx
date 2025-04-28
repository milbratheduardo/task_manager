import React from 'react';
import moment from 'moment';
import 'moment/locale/pt-br'; 
moment.locale('pt-br');

interface TaskItem {
  _id: string;
  title: string;
  status: 'Pendente' | 'Em progresso' | 'Completada';
  priority: 'Alta' | 'Média' | 'Baixa';
  createdAt: string;
}

interface TaskListTableProps {
  tableData: TaskItem[];
}

const TaskListTable = ({ tableData }: TaskListTableProps) => {

  const getStatusBadgeColor = (status: TaskItem['status']) => {
    switch (status) {
      case 'Completada':
        return 'bg-green-100 text-green-500 border border-green-200';
      case 'Pendente':
        return 'bg-purple-100 text-purple-500 border border-purple-200';
      case 'Em progresso':
        return 'bg-cyan-100 text-cyan-500 border border-cyan-200';
      default:
        return 'bg-gray-100 text-gray-500 border border-gray-200';
    }
  };

  const getPriorityBadgeColor = (priority: TaskItem['priority']) => {
    switch (priority) {
      case 'Alta':
        return 'bg-red-100 text-red-500 border border-red-200';
      case 'Média':
        return 'bg-orange-100 text-orange-500 border border-orange-200';
      case 'Baixa':
        return 'bg-green-100 text-green-500 border border-green-200';
      default:
        return 'bg-gray-100 text-gray-500 border border-gray-200';
    }
  };

  return (
    <div className="overflow-x-auto p-0 rounded-lg mt-3">
      <table className="min-w-full">
        <thead>
          <tr className="text-left">
            <th scope="col" className="py-3 px-4 text-gray-800 font-medium text-[13px]">Nome</th>
            <th scope="col" className="py-3 px-4 text-gray-800 font-medium text-[13px]">Status</th>
            <th scope="col" className="py-3 px-4 text-gray-800 font-medium text-[13px]">Prioridade</th>
            <th scope="col" className="py-3 px-4 text-gray-800 font-medium text-[13px] hidden md:table-cell">Data Criação</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((task) => (
            <tr key={task._id} className="border-t border-gray-200">
              <td className="py-4 px-4 text-gray-700 text-[13px] truncate max-w-[200px]">{task.title}</td>
              <td className="py-4 px-4">
                <span className={`px-2 py-1 text-xs rounded inline-block ${getStatusBadgeColor(task.status)}`}>
                  {task.status}
                </span>
              </td>
              <td className="py-4 px-4">
                <span className={`px-2 py-1 text-xs rounded inline-block ${getPriorityBadgeColor(task.priority)}`}>
                  {task.priority}
                </span>
              </td>
              <td className="py-4 px-4 text-gray-700 text-[13px] whitespace-nowrap hidden md:table-cell">
                {task.createdAt ? moment(task.createdAt).format('D [de] MMMM [de] YYYY') : 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskListTable;
