import mongoose, { Document, Schema, Types } from "mongoose";

interface IToDo {
  text: string;
  completed: boolean;
}

export interface ITask extends Document {
  title: string;
  description?: string;
  priority: "Baixa" | "Média" | "Alta";
  status: "Pendente" | "Em progresso" | "Completada";
  dueDate: Date;
  assignedTo: Types.ObjectId[];
  createdBy: Types.ObjectId;
  attachments: string[];
  todoChecklist: IToDo[];
  progress: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const toDoSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    priority: {
      type: String,
      enum: ["Baixa", "Média", "Alta"],
      default: "Média",
    },
    status: {
      type: String,
      enum: ["Pendente", "Em progresso", "Completada"],
      default: "Pendente",
    },
    dueDate: { type: Date, required: true },
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    attachments: [{ type: String }],
    todoChecklist: [toDoSchema],
    progress: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Task = mongoose.model<ITask>("Task", taskSchema);
export default Task;
