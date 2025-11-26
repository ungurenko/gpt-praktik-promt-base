
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Category, Section, PromptItem, ItemType, Article } from '../types';
import { CATEGORIES as INITIAL_DATA } from '../data';

// --- Initial Articles Data (Examples) ---
const INITIAL_ARTICLES: Article[] = [
  {
    id: 'guide-1',
    title: 'Как загрузить GPT-Ассистента',
    description: 'Полное руководство по настройке Custom Instructions и созданию своего GPTs под конкретные задачи.',
    published: true,
    date: new Date().toISOString(),
    blocks: [
      { id: 'b1', type: 'text', content: 'GPT-Ассистенты позволяют задать постоянный контекст для всех ваших диалогов. Это экономит время, так как вам не нужно каждый раз объяснять боту, кто вы и что вам нужно. Существует два способа: Custom Instructions (для всех чатов) и GPTs (отдельные боты).' },
      { id: 'b2', type: 'header', content: 'Способ 1: Custom Instructions' },
      { id: 'b3', type: 'step', content: 'Нажмите на свое имя в левом нижнем углу интерфейса ChatGPT (или в настройках мобильного приложения).', meta: 'Шаг 1: Меню' },
      { id: 'b4', type: 'step', content: 'Выберите пункт "Customize ChatGPT" или "Custom Instructions".', meta: 'Шаг 2: Настройка' },
      { id: 'b5', type: 'text', content: 'Вы увидите два поля. Первое: "Что бы вы хотели, чтобы ChatGPT знал о вас?". Второе: "Как бы вы хотели, чтобы ChatGPT отвечал?".' },
      { id: 'b6', type: 'header', content: 'Пример системного промта (для второго поля)' },
      { id: 'b7', type: 'code', content: 'Role: Professional Marketer & Copywriter\nTone: Strict, concise, data-driven.\nStyle: Avoid fluff, use bullet points, always critique my ideas before suggesting improvements.\nConstraints: Never apologize ("I apologize for the confusion"). Just correct the mistake.', meta: 'System Prompt: Маркетолог' },
      { id: 'b8', type: 'tip', content: 'Убедитесь, что переключатель "Enable for new chats" активен, чтобы инструкция применялась автоматически.', meta: 'Важно' }
    ]
  },
  {
    id: 'guide-2',
    title: 'Как обучить ChatGPT под себя',
    description: 'Методика "Few-Shot Learning": как заставить нейросеть писать в вашем стиле, используя примеры.',
    published: true,
    date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    blocks: [
      { id: 'b1', type: 'text', content: 'Многие жалуются, что ChatGPT пишет "как робот". Секрет в том, что он не знает вашего стиля. Чтобы "обучить" его (в рамках диалога), нужно использовать технику Few-Shot Learning — обучение на примерах.' },
      { id: 'b2', type: 'header', content: 'Алгоритм действий' },
      { id: 'b3', type: 'step', content: 'Соберите 3-5 своих лучших текстов (постов, писем), стиль которых вам нравится.', meta: 'Шаг 1: Сбор данных' },
      { id: 'b4', type: 'step', content: 'Используйте специальный промт для анализа стиля (см. ниже).', meta: 'Шаг 2: Анализ' },
      { id: 'b5', type: 'code', content: 'Я предоставлю тебе несколько примеров моих текстов. Твоя задача:\n1. Проанализировать тон (Tone of Voice).\n2. Выделить структуру предложений и длину абзацев.\n3. Запомнить использование сленга или терминов.\n\nПосле этого я попрошу тебя написать новый текст, и ты должен будешь имитировать этот стиль.\n\nВот примеры:\n[ВСТАВЬТЕ ТЕКСТ 1]\n[ВСТАВЬТЕ ТЕКСТ 2]', meta: 'Промт для анализа стиля' },
      { id: 'b6', type: 'step', content: 'После того как ChatGPT подтвердит, что понял стиль, дайте ему задачу на написание нового контента.', meta: 'Шаг 3: Генерация' },
      { id: 'b7', type: 'tip', content: 'Вы можете сохранить результат анализа (описание стиля, которое выдаст бот) и добавить его в Custom Instructions. Тогда бот всегда будет писать как вы.', meta: 'Pro Tip' }
    ]
  },
  {
    id: 'guide-3',
    title: 'Работа с промптами: База',
    description: 'Основные элементы идеального запроса, которые улучшают качество ответов на 80%.',
    published: true,
    date: new Date(Date.now() - 172800000).toISOString(),
    blocks: [
      { id: 'b1', type: 'header', content: 'Формула идеального промпта' },
      { id: 'b2', type: 'text', content: 'Хороший промт состоит из 4 частей:\n1. Роль (Кто ты?)\n2. Задача (Что сделать?)\n3. Контекст (Детали, ограничения)\n4. Формат (В виде таблицы, списка, кода)' },
      { id: 'b3', type: 'image', content: 'https://images.unsplash.com/photo-1664575602554-2087b04935a5?q=80&w=1000&auto=format&fit=crop', meta: 'Схема промптинга' },
      { id: 'b4', type: 'tip', content: 'Никогда не пишите "напиши статью". Пишите "напиши статью для блога про маркетинг, целевая аудитория - новички, тон - дружелюбный, используй аналогии".', meta: 'Совет' }
    ]
  }
];

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface DataContextType {
  categories: Category[];
  articles: Article[];
  // Read
  getCategory: (id: string) => Category | undefined;
  getSection: (catId: string, secId: string) => Section | undefined;
  getItem: (catId: string, secId: string, itemId: string) => PromptItem | undefined;
  getArticle: (id: string) => Article | undefined;
  // Write - Category
  addCategory: (category: Category) => void;
  updateCategory: (id: string, data: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  moveCategory: (fromIndex: number, toIndex: number) => void;
  // Write - Section
  addSection: (catId: string, section: Section) => void;
  updateSection: (catId: string, secId: string, data: Partial<Section>) => void;
  deleteSection: (catId: string, secId: string) => void;
  // Write - Item
  addItem: (catId: string, secId: string, item: PromptItem) => void;
  updateItem: (catId: string, secId: string, itemId: string, data: Partial<PromptItem>) => void;
  deleteItem: (catId: string, secId: string, itemId: string) => void;
  // Write - Article
  addArticle: (article: Article) => void;
  updateArticle: (id: string, data: Partial<Article>) => void;
  deleteArticle: (id: string) => void;
  // Favorites
  favorites: string[]; 
  toggleFavorite: (itemId: string) => void;
  isFavorite: (itemId: string) => boolean;
  getFavoriteItems: () => { item: PromptItem, category: Category, section: Section }[];
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: { item: PromptItem, category: Category, section: Section }[];
  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // --- Categories State ---
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem('gpt-practicum-data');
      return saved ? JSON.parse(saved) : INITIAL_DATA;
    } catch (e) {
      console.error("Failed to parse data from local storage", e);
      return INITIAL_DATA;
    }
  });

  // --- Articles State ---
  const [articles, setArticles] = useState<Article[]>(() => {
    try {
      const saved = localStorage.getItem('gpt-practicum-articles');
      if (!saved) return INITIAL_ARTICLES;
      
      const parsed = JSON.parse(saved);
      return parsed.length > 0 ? parsed : INITIAL_ARTICLES;
    } catch {
      return INITIAL_ARTICLES;
    }
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('gpt-practicum-favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [searchQuery, setSearchQuery] = useState('');

  // --- Toast State ---
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);


  // Helper to safely save to localStorage
  const safeSetItem = (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error: any) {
      if (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
        console.error("LocalStorage Limit Reached:", error);
        showToast("Ошибка: Память браузера переполнена! Изменения не сохранены.", "error");
      } else {
        console.error(`Error saving ${key} to localStorage:`, error);
        showToast("Ошибка сохранения данных", "error");
      }
    }
  };

  useEffect(() => {
    safeSetItem('gpt-practicum-data', categories);
  }, [categories]);
  
  useEffect(() => {
    safeSetItem('gpt-practicum-articles', articles);
  }, [articles]);

  useEffect(() => {
    safeSetItem('gpt-practicum-favorites', favorites);
  }, [favorites]);

  // Favorites Logic
  const toggleFavorite = (itemId: string) => {
    setFavorites(prev => 
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  const isFavorite = (itemId: string) => favorites.includes(itemId);

  // --- PERFORMANCE: Cache flattened items list ---
  // This prevents recalculating the huge array on every render or search keystroke
  const allItemsCache = useMemo(() => {
    const results: { item: PromptItem, category: Category, section: Section }[] = [];
    categories.forEach(cat => {
      cat.sections.forEach(sec => {
        sec.items.forEach(item => {
          results.push({ item, category: cat, section: sec });
        });
      });
    });
    return results;
  }, [categories]);

  const getFavoriteItems = () => {
    return allItemsCache.filter(x => favorites.includes(x.item.id));
  };

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const lowerQ = searchQuery.toLowerCase();
    return allItemsCache.filter(x => 
      x.item.title.toLowerCase().includes(lowerQ) || 
      x.item.description.toLowerCase().includes(lowerQ)
    );
  }, [allItemsCache, searchQuery]);


  // Read Helpers
  const getCategory = (id: string) => categories.find(c => c.id === id);
  
  const getSection = (catId: string, secId: string) => {
    const cat = getCategory(catId);
    return cat?.sections.find(s => s.id === secId);
  };

  const getItem = (catId: string, secId: string, itemId: string) => {
    const sec = getSection(catId, secId);
    return sec?.items.find(i => i.id === itemId);
  };

  const getArticle = (id: string) => articles.find(a => a.id === id);

  // Write - Category
  const addCategory = (category: Category) => {
    setCategories([...categories, category]);
  };

  const updateCategory = (id: string, data: Partial<Category>) => {
    setCategories(categories.map(c => c.id === id ? { ...c, ...data } : c));
  };

  const deleteCategory = (id: string) => {
    setCategories(categories.filter(c => c.id !== id));
  };

  const moveCategory = (fromIndex: number, toIndex: number) => {
    if (fromIndex < 0 || fromIndex >= categories.length || toIndex < 0 || toIndex >= categories.length) return;
    const newCategories = [...categories];
    const [movedItem] = newCategories.splice(fromIndex, 1);
    newCategories.splice(toIndex, 0, movedItem);
    setCategories(newCategories);
  };

  // Write - Section
  const addSection = (catId: string, section: Section) => {
    setCategories(categories.map(c => {
      if (c.id !== catId) return c;
      return { ...c, sections: [...c.sections, section] };
    }));
  };

  const updateSection = (catId: string, secId: string, data: Partial<Section>) => {
    setCategories(categories.map(c => {
      if (c.id !== catId) return c;
      return {
        ...c,
        sections: c.sections.map(s => s.id === secId ? { ...s, ...data } : s)
      };
    }));
  };

  const deleteSection = (catId: string, secId: string) => {
    setCategories(categories.map(c => {
      if (c.id !== catId) return c;
      return {
        ...c,
        sections: c.sections.filter(s => s.id !== secId)
      };
    }));
  };

  // Write - Item
  const addItem = (catId: string, secId: string, item: PromptItem) => {
    setCategories(categories.map(c => {
      if (c.id !== catId) return c;
      return {
        ...c,
        sections: c.sections.map(s => {
          if (s.id !== secId) return s;
          return { ...s, items: [...s.items, item] };
        })
      };
    }));
  };

  const updateItem = (catId: string, secId: string, itemId: string, data: Partial<PromptItem>) => {
    setCategories(categories.map(c => {
      if (c.id !== catId) return c;
      return {
        ...c,
        sections: c.sections.map(s => {
          if (s.id !== secId) return s;
          return {
            ...s,
            items: s.items.map(i => i.id === itemId ? { ...i, ...data } : i)
          };
        })
      };
    }));
  };

  const deleteItem = (catId: string, secId: string, itemId: string) => {
    setCategories(categories.map(c => {
      if (c.id !== catId) return c;
      return {
        ...c,
        sections: c.sections.map(s => {
          if (s.id !== secId) return s;
          return {
            ...s,
            items: s.items.filter(i => i.id !== itemId)
          };
        })
      };
    }));
  };

  // Write - Articles
  const addArticle = (article: Article) => {
    setArticles([article, ...articles]);
  };

  const updateArticle = (id: string, data: Partial<Article>) => {
    setArticles(articles.map(a => a.id === id ? { ...a, ...data } : a));
  };

  const deleteArticle = (id: string) => {
    setArticles(articles.filter(a => a.id !== id));
  };

  return (
    <DataContext.Provider value={{
      categories,
      articles,
      getCategory, getSection, getItem, getArticle,
      addCategory, updateCategory, deleteCategory, moveCategory,
      addSection, updateSection, deleteSection,
      addItem, updateItem, deleteItem,
      addArticle, updateArticle, deleteArticle,
      favorites, toggleFavorite, isFavorite, getFavoriteItems,
      searchQuery, setSearchQuery, searchResults,
      toasts, showToast, removeToast
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
