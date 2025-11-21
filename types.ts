export enum ItemType {
  PROMPT = 'prompt',
  ASSISTANT = 'assistant'
}

export interface PromptItem {
  id: string;
  title: string;
  description: string; // "Для чего этот промт"
  instructions: string; // "Инструкция по использованию"
  content: string; // The actual prompt text or Custom Instructions
  type: ItemType;
  // For Assistants only
  subPrompts?: { title: string; content: string }[];
}

export interface Section {
  id: string;
  title: string;
  description?: string;
  instructions?: string; // "Описание как работать с этим разделом"
  items: PromptItem[];
}

export interface Category {
  id: string;
  title: string;
  description: string;
  imageUrl?: string; // Deprecated
  theme?: 'orange' | 'rose' | 'blue' | 'violet' | 'emerald' | 'amber';
  sections: Section[];
}