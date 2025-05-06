import Task from "../models/Task";
import { Request, Response } from "express";

interface AuthenticatedRequest extends Request {
    user?: {
      _id: string;
      role: "admin" | "member";
    };
  }

// @desc    Retorna todas as tasks (Admin: todas, User: apenas as dele)
// @route   GET /api/tarefas
// @access  Privado
export const getTasks = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { status } = req.query as { status?: string };
      const user = req.user;
  
      if (!user) {
        return res.status(401).json({ message: "Não autorizado" });
      }
  
      let filter: Record<string, any> = {};
      if (status) {
        filter.status = status;
      }
  
      const userFilter = user.role !== "admin" ? { assignedTo: user._id } : {};
  
      const tasksRaw = await Task.find({ ...filter, ...userFilter }).populate(
        "assignedTo",
        "name email profileImageUrl"
      );
  
      const tasks = await Promise.all(
        tasksRaw.map(async (task) => {
          const completedCount = task.todoChecklist.filter(
            (item) => item.completed
          ).length;
  
          return {
            ...task.toObject(),
            completedTodoCount: completedCount,
          };
        })
      );
  
      const allTasks = await Task.countDocuments(userFilter);
  
      const pendingTasks = await Task.countDocuments({
        ...filter,
        status: "Pendente",
        ...userFilter,
      });
  
      const inProgressTasks = await Task.countDocuments({
        ...filter,
        status: "Em progresso",
        ...userFilter,
      });
  
      const completedTasks = await Task.countDocuments({
        ...filter,
        status: "Completada",
        ...userFilter,
      });
  
      res.json({
        tasks,
        statusSummary: {
          all: allTasks,
          pendingTasks,
          inProgressTasks,
          completedTasks,
        },
      });
    } catch (error: unknown) {
      const err = error as Error;
      res.status(500).json({ message: "Erro no servidor", error: err.message });
    }
  };

// @desc    Retorna tarefa por Id
// @route   GET /api/tarefas/:id
// @access  Privado
export const getTaskById = async (req: Request, res: Response) => {  
    try {
      const task = await Task.findById(req.params.id).populate(
        "assignedTo",
        "name email profileImageUrl"
      );
  
      if (!task) {
        return res.status(404).json({ message: "Tarefa não encontrada" });
      }
  
      res.json(task);
    } catch (error: unknown) {
      const err = error as Error;
      res.status(500).json({ message: "Erro no servidor", error: err.message });
    }
};

// @desc    Cria uma tarefa (Admin)
// @route   POST /api/tarefas
// @access  Privado
export const createTask = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const {
        title,
        description,
        priority,
        dueDate,
        assignedTo,
        attachments,
        todoChecklist,
      } = req.body;
  
      if (!title || !dueDate || !Array.isArray(assignedTo)) {
        return res.status(400).json({
          message: "Campos obrigatórios ausentes ou inválidos",
        });
      }
  
      const task = await Task.create({
        title,
        description,
        priority,
        dueDate,
        assignedTo,
        createdBy: req.user?._id,
        todoChecklist,
        attachments,
      });
  
      res.status(201).json({ message: "Tarefa criada com sucesso", task });
    } catch (error: unknown) {
      const err = error as Error;
      res.status(500).json({ message: "Erro no servidor", error: err.message });
    }
};
  


// @desc    Atualiza uma tarefa 
// @route   PUT /api/tarefas/:id
// @access  Privado
export const updateTask = async (req: Request, res: Response) => {
    try {
      const task = await Task.findById(req.params.id);
  
      if (!task) {
        return res.status(404).json({ message: "Tarefa não encontrada" });
      }
  
      task.title = req.body.title ?? task.title;
      task.description = req.body.description ?? task.description;
      task.priority = req.body.priority ?? task.priority;
      task.dueDate = req.body.dueDate ?? task.dueDate;
      task.todoChecklist = req.body.todoChecklist ?? task.todoChecklist;
      task.attachments = req.body.attachments ?? task.attachments;
  
      if (req.body.assignedTo) {
        if (!Array.isArray(req.body.assignedTo)) {
          return res.status(400).json({
            message: "assignedTo precisa ser um array de IDs de usuários",
          });
        }
        task.assignedTo = req.body.assignedTo;
      }
  
      const updatedTask = await task.save();
  
      res.json({ message: "Tarefa atualizada com sucesso", updatedTask });
    } catch (error: unknown) {
      const err = error as Error;
      res.status(500).json({ message: "Erro no servidor", error: err.message });
    }
};

// @desc    Deleta uma tarefa 
// @route   DELETE /api/tarefas/:id
// @access  Privado
export const deleteTask = async (req: Request, res: Response) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: "Tarefa não encontrada" });
        }

        await task.deleteOne();
        res.json({ message: "Tarefa deletada com sucesso! "});
    } catch (error: unknown) {
        const err = error as Error;
        res.status(500).json({ message: "Erro no servidor", error: err.message });
      }
    };

// @desc    Atualiza status de uma tarefa 
// @route   PUT /api/tarefas/:id/status
// @access  Privado
export const updateTaskStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Tarefa não encontrada" });
    }

    const isAssigned = task.assignedTo.some(
      (userId) => userId.toString() === req.user?._id.toString()
    );

    if (!isAssigned && req.user?.role !== "admin") {
      return res.status(403).json({ message: "Não autorizado" });
    }

    task.status = req.body.status ?? task.status;

    if (task.status === "Completada") {
      task.todoChecklist.forEach((item) => (item.completed = true));
      task.progress = 100;
    }

    const updatedTask = await task.save();

    res.json({ message: "Tarefa atualizada com sucesso!", task: updatedTask });
  } catch (error: unknown) {
    const err = error as Error;
    res.status(500).json({ message: "Erro no servidor", error: err.message });
  }
};

// Tipagem para req.user
interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    role: "admin" | "member";
  };
}

export const updateTaskChecklist = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Tarefa não encontrada" });
    }

    const isAssigned = task.assignedTo.some(
      (userId) => userId.toString() === req.user?._id.toString()
    );

    if (!isAssigned && req.user?.role !== "admin") {
      return res.status(403).json({ message: "Não autorizado" });
    }

    const { todoChecklist } = req.body;

    if (!Array.isArray(todoChecklist)) {
      return res.status(400).json({ message: "Checklist inválido" });
    }

    task.todoChecklist = todoChecklist;

    const completedCount = task.todoChecklist.filter((item) => item.completed).length;
    const totalItems = task.todoChecklist.length;

    task.progress = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

    if (task.progress === 100) {
      task.status = "Completada";
    } else if (task.progress > 0) {
      task.status = "Em progresso";
    } else {
      task.status = "Pendente";
    }

    await task.save();

    const updatedTask = await Task.findById(req.params.id).populate(
      "assignedTo",
      "name email profileImageUrl"
    );

    res.json({ message: "Checklist atualizado!", task: updatedTask });
  } catch (error: unknown) {
    const err = error as Error;
    res.status(500).json({ message: "Erro no servidor", error: err.message });
  }
};


// @desc    Dados Dashboard 
// @route   GET /api/tarefas/dashboard-data
// @access  Privado
export const getDashboardData = async (req: Request, res: Response) => {
  try {
    const totalTasks = await Task.countDocuments();
    const pendingTasks = await Task.countDocuments({ status: "Pendente" });
    const completedTasks = await Task.countDocuments({ status: "Completada" });
    const overdueTasks = await Task.countDocuments({
      status: { $ne: "Completada" },
      dueDate: { $lt: new Date() },
    });

    const taskStatuses = ["Pendente", "Em progresso", "Completada"];
    const taskDistributionRaw = await Task.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const taskDistribution = taskStatuses.reduce((acc, status) => {
      const formattedKey = status.replace(/\s+/g, "");
      acc[formattedKey] =
        taskDistributionRaw.find((item) => item._id === status)?.count || 0;
      return acc;
    }, {} as Record<string, number>);

    taskDistribution["Todas"] = totalTasks;

    const taskPriorities = ["Baixa", "Média", "Alta"];
    const taskPriorityLevelsRaw = await Task.aggregate([
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ]);

    const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
      acc[priority] =
        taskPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0;
      return acc;
    }, {} as Record<string, number>);

    const recentTasks = await Task.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title status priority dueDate createdAt");


    res.status(200).json({
      statistics: {
        totalTasks,
        pendingTasks,
        completedTasks,
        overdueTasks,
      },
      charts: {
        taskDistribution,
        taskPriorityLevels,
      },
      recentTasks,
    });
  } catch (error: unknown) {
    const err = error as Error;
    res.status(500).json({ message: "Erro no servidor", error: err.message });
  }
};

// @desc    Dados Dashboard Individual 
// @route   GET /api/tarefas/user-dashboard-data
// @access  Privado
export const getUserDashboardData = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?._id;

        const totalTasks = await Task.countDocuments({ assignedTo: userId});
        const pendingTasks = await Task.countDocuments({ assignedTo: userId, status: "Pendente" });
        const completedTasks = await Task.countDocuments({ assignedTo: userId, status: "Completada" });
        const overdueTasks = await Task.countDocuments({
          assignedTo: userId,
          status: { $ne: "Completada" },
          dueDate: { $lt: new Date() },
        });

        const taskStatuses = ["Pendente", "Em progresso", "Completada"];
        const taskDistributionRaw = await Task.aggregate([
          { $match: { assignedTo: userId }},
          {
            $group: {
              _id: "$status",
              count: { $sum: 1 },
            },
          },
        ]);

        const taskDistribution = taskStatuses.reduce((acc, status) => {
          const formattedKey = status.replace(/\s+/g, "");
          acc[formattedKey] =
            taskDistributionRaw.find((item) => item._id === status)?.count || 0;
          return acc;
        }, {} as Record<string, number>);
    
        taskDistribution["Todas"] = totalTasks;

        const taskPriorities = ["Baixa", "Média", "Alta"];
        const taskPriorityLevelsRaw = await Task.aggregate([
          {$match: {assignedTo: userId}},
          {
            $group: {
              _id: "$priority",
              count: { $sum: 1 },
            },
          },
        ]);

        const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
          acc[priority] =
            taskPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0;
          return acc;
        }, {} as Record<string, number>);

        const recentTasks = await Task.find()
          .sort({ createdAt: -1 })
          .limit(10)
          .select("title status priority dueDate createdAt");


        res.status(200).json({
          statistics: {
            totalTasks,
            pendingTasks,
            completedTasks,
            overdueTasks,
          },
          charts: {
            taskDistribution,
            taskPriorityLevels,
          },
          recentTasks,
        });
    } catch (error) {
        res.status(500).json({ message: "Erro no servidor", error: error.message});      
    }
};