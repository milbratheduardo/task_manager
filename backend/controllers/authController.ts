import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";


// Gerar JWT Token
const generateToken = (userId: string): string => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
};

// @desc    Registra um novo usuário
// @route   POST /api/auth/registro
// @access  Público
export const registerUser = async (req: Request, res: Response) => {
  try {
    const {name, email, password, profileImageUrl, adminInviteToken} = req.body;

    const userExists = await User.findOne({ email });
    if(userExists) {
        return res.status(400).json({ message: "Usuário já existe"});
    }

    let role = "member";
    if (
        adminInviteToken && adminInviteToken == process.env.ADMIN_INVITE_TOKEN
    ) {
        role = "admin";
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        profileImageUrl,
        role,
    });

    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImageUrl: user.profileImageUrl,
        token: generateToken(user._id)
    });

  } catch (error: any) {
    res.status(500).json({ message: "Erro no servidor", error: error.message});
  }
};

// @desc    Login
// @route   POST /api/auth/login
// @access  Público
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Email ou senha inválidos" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Email ou senha inválidos" });
    }

    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImageUrl: user.profileImageUrl,
      token,
    });
  } catch (error: any) {
    res.status(500).json({ message: "Erro no servidor", error: error.message });
  }
};


// @desc    Get perfil do usuário
// @route   GET /api/auth/perfil
// @access  Privado
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Não autorizado" });
    }

    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: "Erro no servidor", error: error.message });
  }
};

// @desc    Atualiza perfil do usuário
// @route   PUT /api/auth/perfil
// @access  Privado
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Não autorizado" });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();

    const token = generateToken(updatedUser._id);

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      profileImageUrl: updatedUser.profileImageUrl,
      token,
    });
  } catch (error: any) {
    res.status(500).json({ message: "Erro no servidor", error: error.message });
  }
};
