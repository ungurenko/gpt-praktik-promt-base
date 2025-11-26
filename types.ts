
export enum ItemType {
  PROMPT = 'prompt',
  ASSISTANT = 'assistant',
  SEQUENCE = 'sequence'
}

export interface PromptItem {
  id: string;
  title: string;
  description: string; // "Для чего этот промт"
  instructions: string; // "Инструкция по использованию"
  content: string; // The actual prompt text or Custom Instructions
  type: ItemType;
  // For Assistants and Sequences
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

// --- New Types for Instructions CMS ---

export type BlockType = 'header' | 'text' | 'code' | 'image' | 'video' | 'tip' | 'step';

export interface ArticleBlock {
  id: string;
  type: BlockType;
  content: string; // The main text, url, or code
  meta?: string; // Used for: Code language, Image caption, Step title, Tip type
}

export interface Article {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  blocks: ArticleBlock[];
  published: boolean;
  date: string;
}
