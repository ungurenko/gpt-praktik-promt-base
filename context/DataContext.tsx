
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Category, Section, PromptItem, ItemType, Article } from '../types';
import { CATEGORIES as INITIAL_DATA } from '../data';
import { supabase } from '../supabase';
import { Sparkles } from 'lucide-react';

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
      { id: 'b5', type: 'code', content: 'Я предоставлю тебе несколько примеров моих текстов. Твоя задача:\n1. Проанализировать тон (Tone of Voice).\n2. Выделить структуру предложений и длину абзацев.\n3. Запомнить использование сленга или терминов.\n\nПосле этого я попрошу тебя написать новый текст, и ты должен будешь имитировать этот стиль.\n\nВот примеры:\n[ВСТАВИТЬ ТЕКСТ 1]\n[ВСТАВЬТЕ ТЕКСТ 2]', meta: 'Промт для анализа стиля' },
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

const DATA_CACHE_KEY = 'gpt-practicum-data-cache-v1';

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
  // State
  loading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // --- State ---
  const [categories, setCategories] = useState<Category[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  // Favorites remain in localStorage for now (user preference)
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('gpt-practicum-favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState<Toast[]>([]);

  // --- Toast Logic ---
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // --- Data Loading & Seeding (Optimized) ---
  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    // 1. Try to load from LocalStorage Cache first (Instant UI)
    try {
        const cached = localStorage.getItem(DATA_CACHE_KEY);
        if (cached) {
            const parsed = JSON.parse(cached);
            setCategories(parsed.categories || []);
            setArticles(parsed.articles || []);
            setLoading(false); // Immediate interaction for returning users
        } else {
            setLoading(true); // Show spinner only for first-time users
        }
    } catch (e) {
        console.warn('Cache parse error', e);
        setLoading(true);
    }

    // 2. Fetch fresh data from Supabase in background
    await fetchRemoteData();
  };

  const fetchRemoteData = async (retrySeeding = true) => {
    try {
      // Parallel Fetching for speed
      const [catsRes, secsRes, itemsRes, artsRes] = await Promise.all([
        supabase.from('categories').select('*').order('index', { ascending: true }),
        supabase.from('sections').select('*').order('index', { ascending: true }),
        supabase.from('items').select('*').order('index', { ascending: true }),
        supabase.from('articles').select('*').order('date', { ascending: false })
      ]);

      if (catsRes.error) throw catsRes.error;
      
      // Check if DB is empty and we need to seed
      if (catsRes.data?.length === 0 && retrySeeding) {
          await seedDatabase();
          // Recursively fetch again, but don't retry seeding to avoid infinite loop
          return fetchRemoteData(false);
      }

      // Reconstruct Hierarchy
      const fullCategories = (catsRes.data || []).map(cat => ({
        ...cat,
        sections: (secsRes.data || [])
          .filter(sec => sec.category_id === cat.id)
          .map(sec => ({
            ...sec,
            items: (itemsRes.data || [])
              .filter(item => item.section_id === sec.id)
              .map(item => ({
                id: item.id,
                title: item.title,
                description: item.description,
                instructions: item.instructions,
                content: item.content,
                type: item.type as ItemType,
                subPrompts: item.sub_prompts, // Map snake_case from DB
                index: item.index
              }))
          }))
      }));

      // Map Articles
      const fullArticles = (artsRes.data || []).map(art => ({
        id: art.id,
        title: art.title,
        description: art.description,
        published: art.published,
        date: art.date,
        coverImage: art.cover_image, // Map snake_case
        blocks: art.blocks
      }));

      // Update State
      setCategories(fullCategories);
      setArticles(fullArticles);
      setLoading(false);

      // Update Cache
      try {
        localStorage.setItem(DATA_CACHE_KEY, JSON.stringify({
            categories: fullCategories,
            articles: fullArticles,
            timestamp: Date.now()
        }));
      } catch (e) {
        console.warn('Cache write failed (likely quota exceeded)', e);
      }

    } catch (error) {
      console.error('Error fetching remote data:', error);
      // If we have cache, we stay on cache. If not, we might show error or stay loading.
      if (categories.length === 0) {
         showToast('Ошибка подключения к базе данных', 'error');
         setLoading(false); // Stop infinite spinner even on error
      }
    }
  };

  const seedDatabase = async () => {
    console.log("Seeding Database...");
    
    // Seed Categories
    const catRows = INITIAL_DATA.map((c, idx) => ({
      id: c.id, 
      title: c.title, 
      description: c.description, 
      theme: c.theme, 
      index: idx
    }));
    const { error: catError } = await supabase.from('categories').insert(catRows);
    if (catError) console.error("Error seeding categories:", catError);

    // Seed Sections
    const secRows: any[] = [];
    INITIAL_DATA.forEach(c => {
      c.sections.forEach((s, sIdx) => {
        secRows.push({
          id: s.id,
          category_id: c.id,
          title: s.title,
          description: s.description,
          instructions: s.instructions,
          icon: s.icon,
          index: sIdx
        });
      });
    });
    if (secRows.length > 0) await supabase.from('sections').insert(secRows);

    // Seed Items
    const itemRows: any[] = [];
    INITIAL_DATA.forEach(c => {
      c.sections.forEach(s => {
        s.items.forEach((i, iIdx) => {
          itemRows.push({
            id: i.id,
            section_id: s.id,
            title: i.title,
            description: i.description,
            instructions: i.instructions,
            content: i.content,
            type: i.type,
            sub_prompts: i.subPrompts,
            index: iIdx
          });
        });
      });
    });
    if (itemRows.length > 0) await supabase.from('items').insert(itemRows);

    // Seed Articles
    const artRows = INITIAL_ARTICLES.map(a => ({
      id: a.id,
      title: a.title,
      description: a.description,
      cover_image: a.coverImage,
      published: a.published,
      date: a.date,
      blocks: a.blocks
    }));
    await supabase.from('articles').insert(artRows);
    console.log("Seeding complete.");
  };

  // --- CRUD Operations (Updated to refresh Cache) ---

  const refreshCache = (newCats: Category[], newArts: Article[]) => {
      try {
        localStorage.setItem(DATA_CACHE_KEY, JSON.stringify({
            categories: newCats,
            articles: newArts,
            timestamp: Date.now()
        }));
      } catch (e) { console.warn('Cache update failed'); }
  };

  // Write - Category
  const addCategory = async (category: Category) => {
    const newCat = { 
      id: category.id, 
      title: category.title, 
      description: category.description, 
      theme: category.theme, 
      index: categories.length // Put at end
    };
    
    // Optimistic Update
    const updated = [...categories, category];
    setCategories(updated);
    refreshCache(updated, articles);
    
    const { error } = await supabase.from('categories').insert([newCat]);
    if (error) {
        console.error(error);
        showToast("Ошибка при создании категории", "error");
        fetchRemoteData(false); // Revert on error
    }
  };

  const updateCategory = async (id: string, data: Partial<Category>) => {
    const updated = categories.map(c => c.id === id ? { ...c, ...data } : c);
    setCategories(updated);
    refreshCache(updated, articles);
    
    const { error } = await supabase.from('categories').update(data).eq('id', id);
    if (error) {
        console.error(error);
        showToast("Ошибка сохранения", "error");
    }
  };

  const deleteCategory = async (id: string) => {
    const updated = categories.filter(c => c.id !== id);
    setCategories(updated);
    refreshCache(updated, articles);

    await supabase.from('categories').delete().eq('id', id);
  };

  const moveCategory = async (fromIndex: number, toIndex: number) => {
    if (fromIndex < 0 || fromIndex >= categories.length || toIndex < 0 || toIndex >= categories.length) return;
    
    const newCategories = [...categories];
    const [movedItem] = newCategories.splice(fromIndex, 1);
    newCategories.splice(toIndex, 0, movedItem);
    
    setCategories(newCategories);
    refreshCache(newCategories, articles);

    // Update indexes in DB
    const updates = newCategories.map((c, idx) => ({ id: c.id, index: idx }));
    for (const update of updates) {
        await supabase.from('categories').update({ index: update.index }).eq('id', update.id);
    }
  };

  // Write - Section
  const addSection = async (catId: string, section: Section) => {
    const parent = categories.find(c => c.id === catId);
    if (!parent) return;

    const newSec = {
        id: section.id,
        category_id: catId,
        title: section.title,
        description: section.description,
        instructions: section.instructions,
        icon: section.icon,
        index: parent.sections.length
    };

    const updated = categories.map(c => {
      if (c.id !== catId) return c;
      return { ...c, sections: [...c.sections, section] };
    });
    setCategories(updated);
    refreshCache(updated, articles);

    const { error } = await supabase.from('sections').insert([newSec]);
    if (error) console.error(error);
  };

  const updateSection = async (catId: string, secId: string, data: Partial<Section>) => {
    const updated = categories.map(c => {
      if (c.id !== catId) return c;
      return {
        ...c,
        sections: c.sections.map(s => s.id === secId ? { ...s, ...data } : s)
      };
    });
    setCategories(updated);
    refreshCache(updated, articles);

    const { error } = await supabase.from('sections').update(data).eq('id', secId);
    if (error) console.error(error);
  };

  const deleteSection = async (catId: string, secId: string) => {
    const updated = categories.map(c => {
      if (c.id !== catId) return c;
      return {
        ...c,
        sections: c.sections.filter(s => s.id !== secId)
      };
    });
    setCategories(updated);
    refreshCache(updated, articles);
    await supabase.from('sections').delete().eq('id', secId);
  };

  // Write - Item
  const addItem = async (catId: string, secId: string, item: PromptItem) => {
    const cat = categories.find(c => c.id === catId);
    const sec = cat?.sections.find(s => s.id === secId);
    if (!sec) return;

    const newItem = {
        id: item.id,
        section_id: secId,
        title: item.title,
        description: item.description,
        instructions: item.instructions,
        content: item.content,
        type: item.type,
        sub_prompts: item.subPrompts,
        index: sec.items.length
    };

    const updated = categories.map(c => {
      if (c.id !== catId) return c;
      return {
        ...c,
        sections: c.sections.map(s => {
          if (s.id !== secId) return s;
          return { ...s, items: [...s.items, item] };
        })
      };
    });
    setCategories(updated);
    refreshCache(updated, articles);

    const { error } = await supabase.from('items').insert([newItem]);
    if (error) console.error(error);
  };

  const updateItem = async (catId: string, secId: string, itemId: string, data: Partial<PromptItem>) => {
    const updated = categories.map(c => {
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
    });
    setCategories(updated);
    refreshCache(updated, articles);

    // Map TS fields to DB fields
    const dbUpdate: any = { ...data };
    if (data.subPrompts) {
        dbUpdate.sub_prompts = data.subPrompts;
        delete dbUpdate.subPrompts;
    }

    const { error } = await supabase.from('items').update(dbUpdate).eq('id', itemId);
    if (error) console.error(error);
  };

  const deleteItem = async (catId: string, secId: string, itemId: string) => {
    const updated = categories.map(c => {
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
    });
    setCategories(updated);
    refreshCache(updated, articles);
    await supabase.from('items').delete().eq('id', itemId);
  };

  // Write - Articles
  const addArticle = async (article: Article) => {
    const updated = [article, ...articles];
    setArticles(updated);
    refreshCache(categories, updated);
    
    const dbArticle = {
        id: article.id,
        title: article.title,
        description: article.description,
        cover_image: article.coverImage,
        published: article.published,
        date: article.date,
        blocks: article.blocks
    };

    const { error } = await supabase.from('articles').insert([dbArticle]);
    if (error) {
        console.error(error);
        showToast('Ошибка публикации', 'error');
    }
  };

  const updateArticle = async (id: string, data: Partial<Article>) => {
    const updated = articles.map(a => a.id === id ? { ...a, ...data } : a);
    setArticles(updated);
    refreshCache(categories, updated);

    const dbUpdate: any = { ...data };
    if (data.coverImage) {
        dbUpdate.cover_image = data.coverImage;
        delete dbUpdate.coverImage;
    }

    const { error } = await supabase.from('articles').update(dbUpdate).eq('id', id);
    if (error) console.error(error);
  };

  const deleteArticle = async (id: string) => {
    const updated = articles.filter(a => a.id !== id);
    setArticles(updated);
    refreshCache(categories, updated);
    await supabase.from('articles').delete().eq('id', id);
  };


  // --- Helper: Favorites & Search ---
  
  useEffect(() => {
    localStorage.setItem('gpt-practicum-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (itemId: string) => {
    setFavorites(prev => 
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  const isFavorite = (itemId: string) => favorites.includes(itemId);

  // Cache flattened items
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
  const getSection = (catId: string, secId: string) => getCategory(catId)?.sections.find(s => s.id === secId);
  const getItem = (catId: string, secId: string, itemId: string) => getSection(catId, secId)?.items.find(i => i.id === itemId);
  const getArticle = (id: string) => articles.find(a => a.id === id);

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
      toasts, showToast, removeToast,
      loading
    }}>
      {loading ? (
        <div className="fixed inset-0 bg-stone-50 dark:bg-[#121212] flex flex-col items-center justify-center z-[100] transition-colors duration-300">
           <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-rose-400 blur-xl opacity-20 animate-pulse"></div>
              <div className="w-20 h-20 rounded-[2rem] bg-stone-900 dark:bg-white flex items-center justify-center relative z-10 shadow-xl">
                 <Sparkles className="text-orange-500 animate-pulse" size={32} />
              </div>
           </div>
           <div className="mt-8 flex flex-col items-center gap-2">
              <h1 className="text-2xl font-bold text-stone-900 dark:text-white tracking-tight">GPT-ПРАКТИК</h1>
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: '0s' }}></div>
                 <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                 <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <p className="text-stone-400 text-sm font-medium mt-1">Подключаем базу знаний...</p>
           </div>
        </div>
      ) : children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
