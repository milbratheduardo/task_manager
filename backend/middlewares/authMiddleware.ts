import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/User";
import { Request, Response, NextFunction } from "express";

//Middleware para proteger rotas
export const protect = async (req: Request, res: Response, next: NextFunction) => {
    let token = req.headers.authorization;
  
    if (token && token.startsWith("Bearer")) {
      try {
        token = token.split(" ")[1];  
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        req.user = await User.findById(decoded.id).select("-password");
        next();
      } catch (error: any) {
        res.status(401).json({ message: "Falha no token", error: error.message });
      }
    } else {
      res.status(401).json({ message: "Não autorizado, token ausente" });
    }
  };
  
  // Middleware para permitir apenas administradores
  export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      res.status(403).json({ message: "Acesso negado, apenas administradores" });
    }
  };