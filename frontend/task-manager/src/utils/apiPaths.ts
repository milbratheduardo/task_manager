export const BASE_URL = "http://localhost:8000";

export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/registro",
    LOGIN: "/api/auth/login",
    GET_PROFILE: "/api/auth/perfil",
  },

  USERS: {
    GET_ALL_USERS: "/api/usuarios",
    GET_USER_BY_ID: (userId: string) => `/api/usuarios/${userId}`,
    CREATE_USER: "/api/usuarios",
    UPDATE_USER: (userId: string) => `/api/usuarios/${userId}`,
    DELETE_USER: (userId: string) => `/api/usuarios/${userId}`,
  },

  TASKS: {
    GET_DASHBOARD_DATA: "/api/tarefas/dashboard-data",
    GET_USER_DASHBOARD_DATA: "/api/tarefas/user-dashboard-data",
    GET_ALL_TASKS: "/api/tarefas",
    GET_TASK_BY_ID: (taskId: string) => `/api/tarefas/${taskId}`,
    CREATE_TASK: "/api/tarefas",
    UPDATE_TASK: (taskId: string) => `/api/tarefas/${taskId}`,
    DELETE_TASK: (taskId: string) => `/api/tarefas/${taskId}`,
    UPDATE_TASK_STATUS: (taskId: string) => `/api/tarefas/${taskId}/status`,
    UPDATE_TODO_CHECKLIST: (taskId: string) => `/api/tarefas/${taskId}/fazer`,
  },
  IMAGE: {
    UPLOAD_IMAGE: "api/auth/upload-image"
  }
};
