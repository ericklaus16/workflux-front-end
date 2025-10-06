import { Node } from "@xyflow/react";
import { NodeData } from "../interfaces/Node";

export type User = {
  id: string;
  name: string;
  avatarUrl?: string;
};

export type Task = {
  id: string;
  title: string;
  date: string; // ISO date
  owner: User;
  description?: string;
  completed?: boolean;
};

export type CustomNode = Node<NodeData>;
