import { Request, Response } from "express";
import User from "../models/User";
import Task from "../models/Task";

// @desc    Get todos os usuários com contagem de tarefas
// @route   GET /api/usuarios
// @access  Privado
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({ role: "member" }).select("-password");
    const usersWithTaskCounts = await Promise.all(
      users.map(async (user) => {
        const pendingTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "Pendente",
        });
        const inProgressTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "Em progresso",
        });
        const completedTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "Completada",
        });

        return {
          ...user.toObject(),
          pendingTasks,
          inProgressTasks,
          completedTasks,
        };
      })
    );

    res.json(usersWithTaskCounts);
  } catch (error: any) {
    res.status(500).json({
      message: "Erro no servidor",
      error: error.message,
    });
  }
};

  
  // @desc    Get usuário por ID
  // @route   GET /api/usuarios/:id
  // @access  Privado
  export const getUserById = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if(!user) return res.status(404).json({ message: "Usuário não encontrado"});
        res.json(user);
    } catch (error: any) {
      res.status(500).json({ message: "Erro no servidor", error: error.message});
    }
  };
  
  
  // @desc    Deletar usuário
  // @route   DELETE /api/usuarios/:id
  // @access  Privado
  export const deleteUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

        await user.deleteOne();

        res.json({ message: "Usuário deletado com sucesso" });
  
    } catch (error: any) {
      res.status(500).json({ message: "Erro no servidor", error: error.message});
    }
  };