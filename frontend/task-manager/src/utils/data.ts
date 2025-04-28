import {
    LuLayoutDashboard,
    LuClipboardCheck,
    LuUsers,
    LuSquarePlus,
    LuLogOut,
  } from "react-icons/lu";  

  export interface MenuItem {
    id: string;
    label: string;
    icon: React.ElementType;
    path: string;
  }
  
  export const SIDE_MENU_DATA: MenuItem[] = [
    {
      id: "01",
      label: "Dashboard",
      icon: LuLayoutDashboard,
      path: "/admin/dashboard",
    },
    {
      id: "02",
      label: "Gerenciar Tarefas",
      icon: LuClipboardCheck,
      path: "/admin/tarefas",
    },
    {
      id: "03",
      label: "Criar Tarefas",
      icon: LuSquarePlus,
      path: "/admin/criar-tarefa",
    },
    {
      id: "04",
      label: "Equipe",
      icon: LuUsers,
      path: "/admin/usuarios",
    },
    {
      id: "05",
      label: "Sair",
      icon: LuLogOut,
      path: "logout",
    },
  ];
  
  export const SIDE_MENU_USER_DATA: MenuItem[] = [
    {
      id: "01",
      label: "Dashboard",
      icon: LuLayoutDashboard,
      path: "/user/dashboard",
    },
    {
      id: "02",
      label: "Minhas Tarefas",
      icon: LuClipboardCheck,
      path: "/user/tarefas",
    },
    {
      id: "05",
      label: "Sair",
      icon: LuLogOut,
      path: "logout",
    },
  ];
  
  export const PRIORITY_DATA = [
    { label: "Baixa", value: "Baixa" },
    { label: "Média", value: "Média" },
    { label: "Alta", value: "Alta" },
  ];
  
  export const STATUS_DATA = [
    { label: "Pendente", value: "Pendente" },
    { label: "Em Progresso", value: "Em progresso" },
    { label: "Completada", value: "Completada" },
  ];