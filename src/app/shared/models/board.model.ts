export type Title = {
  title: string;
};

export interface TaskData extends Title {
  id: string;
  description: string;
  priority: 'high' | 'medium' | 'low' | null;
  tags: string[];
  order: number;
}

export interface ListData extends Title {
  id: string;
  order: number;
  tasks: TaskData[];
}

export type Result = { ok: true } | { ok: false; error: string };
