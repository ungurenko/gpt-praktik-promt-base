
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Category, Section, PromptItem, ItemType } from '../types';
import { supabase } from '../supabaseClient';
import { CATEGORIES as INITIAL_DATA } from '../data';

interface DataContextType {
  categories: Category[];
  loading: boolean;
  // Read
  getCategory: (id: string) => Category | undefined;
  getSection: (catId: string, secId: string) => Section | undefined;
  getItem: (catId: string, secId: string, itemId: string) => PromptItem | undefined;
  // Write - Category
  addCategory: (category: Category) => Promise<void>;
  updateCategory: (id: string, data: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  // Write - Section
  addSection: (catId: string, section: Section) => Promise<void>;
  updateSection: (catId: string, secId: string, data: Partial<Section>) => Promise<void>;
  deleteSection: (catId: string, secId: string) => Promise<void>;
  // Write - Item
  addItem: (catId: string, secId: string, item: PromptItem) => Promise<void>;
  updateItem: (catId: string, secId: string, itemId: string, data: Partial<PromptItem>) => Promise<void>;
  deleteItem: (catId: string, secId: string, itemId: string) => Promise<void>;
  // Favorites
  favorites: string[];
  toggleFavorite: (itemId: string) => void;
  isFavorite: (itemId: string) => boolean;
  getFavoriteItems: () => { item: PromptItem, category: Category, section: Section }[];
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: { item: PromptItem, category: Category, section: Section }[];
  // Migration Helper
  uploadInitialData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // --- Favorites (Keep in LocalStorage for user preference) ---
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('gpt-practicum-favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [searchQuery, setSearchQuery] = useState('');

  // --- Fetch Data from Supabase ---
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Categories
      const { data: catsData, error: catsError } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: true });

      if (catsError) throw catsError;
      if (!catsData) return;

      // Fetch Sections
      const { data: secsData, error: secsError } = await supabase
        .from('sections')
        .select('*')
        .order('created_at', { ascending: true });

      if (secsError) throw secsError;

      // Fetch Items
      const { data: itemsData, error: itemsError } = await supabase
        .from('items')
        .select('*')
        .order('created_at', { ascending: true });

      if (itemsError) throw itemsError;

      // Reconstruct Hierarchy
      const fullCategories: Category[] = catsData.map((cat: any) => {
        const catSections = secsData
          ?.filter((s: any) => s.category_id === cat.id)
          .map((sec: any) => {
            const secItems = itemsData
              ?.filter((i: any) => i.section_id === sec.id)
              .map((item: any) => ({
                ...item,
                subPrompts: item.sub_prompts // Map DB column back to camelCase
              })) || [];
            
            return { ...sec, items: secItems };
          }) || [];
          
        return { ...cat, sections: catSections };
      });

      setCategories(fullCategories);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem('gpt-practicum-favorites', JSON.stringify(favorites));
  }, [favorites]);

  // --- Migration Tool (One time use) ---
  const uploadInitialData = async () => {
    // 1. Clear existing
    await supabase.from('items').delete().neq('id', '0');
    await supabase.from('sections').delete().neq('id', '0');
    await supabase.from('categories').delete().neq('id', '0');

    for (const cat of INITIAL_DATA) {
      // Insert Category
      await supabase.from('categories').insert({
        id: cat.id,
        title: cat.title,
        description: cat.description,
        theme: cat.theme
      });

      for (const sec of cat.sections) {
        // Insert Section
        await supabase.from('sections').insert({
          id: sec.id,
          category_id: cat.id,
          title: sec.title,
          description: sec.description,
          instructions: sec.instructions
        });

        for (const item of sec.items) {
          // Insert Item
          await supabase.from('items').insert({
            id: item.id,
            section_id: sec.id,
            title: item.title,
            description: item.description,
            instructions: item.instructions,
            content: item.content,
            type: item.type,
            sub_prompts: item.subPrompts // JSONB
          });
        }
      }
    }
    await fetchData();
    alert('Data uploaded to Supabase!');
  };


  // --- Write Operations (Now Sync with DB) ---

  const addCategory = async (category: Category) => {
    // Clean data: remove 'sections' before sending to DB
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { sections, ...dbData } = category;
    const { error } = await supabase.from('categories').insert(dbData);
    if (error) console.error("Supabase Error:", error);
    else fetchData();
  };

  const updateCategory = async (id: string, data: Partial<Category>) => {
    // Clean data: remove 'sections' before sending to DB
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { sections, ...dbData } = data;
    const { error } = await supabase.from('categories').update(dbData).eq('id', id);
    if (error) console.error("Supabase Error:", error);
    else fetchData();
  };

  const deleteCategory = async (id: string) => {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (!error) fetchData();
  };

  const addSection = async (catId: string, section: Section) => {
    // Clean data: remove 'items' before sending to DB
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { items, ...dbData } = section;
    const { error } = await supabase.from('sections').insert({
      ...dbData,
      category_id: catId
    });
    if (error) console.error("Supabase Error:", error);
    else fetchData();
  };

  const updateSection = async (catId: string, secId: string, data: Partial<Section>) => {
    // Clean data: remove 'items' before sending to DB
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { items, ...dbData } = data;
    const { error } = await supabase.from('sections').update(dbData).eq('id', secId);
    if (error) console.error("Supabase Error:", error);
    else fetchData();
  };

  const deleteSection = async (catId: string, secId: string) => {
    const { error } = await supabase.from('sections').delete().eq('id', secId);
    if (!error) fetchData();
  };

  const addItem = async (catId: string, secId: string, item: PromptItem) => {
    const { error } = await supabase.from('items').insert({
      id: item.id,
      section_id: secId,
      title: item.title,
      description: item.description,
      instructions: item.instructions,
      content: item.content,
      type: item.type,
      sub_prompts: item.subPrompts
    });
    if (!error) fetchData();
  };

  const updateItem = async (catId: string, secId: string, itemId: string, data: Partial<PromptItem>) => {
    // Need to map subPrompts to sub_prompts for DB
    const dbData: any = { ...data };
    if (data.subPrompts) {
      dbData.sub_prompts = data.subPrompts;
      delete dbData.subPrompts;
    }

    const { error } = await supabase.from('items').update(dbData).eq('id', itemId);
    if (!error) fetchData();
  };

  const deleteItem = async (catId: string, secId: string, itemId: string) => {
    const { error } = await supabase.from('items').delete().eq('id', itemId);
    if (!error) fetchData();
  };


  // --- Helpers (Same as before) ---
  const toggleFavorite = (itemId: string) => {
    setFavorites(prev => 
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  const isFavorite = (itemId: string) => favorites.includes(itemId);

  const getAllItemsWithContext = () => {
    const results: { item: PromptItem, category: Category, section: Section }[] = [];
    categories.forEach(cat => {
      cat.sections.forEach(sec => {
        sec.items.forEach(item => {
          results.push({ item, category: cat, section: sec });
        });
      });
    });
    return results;
  };

  const getFavoriteItems = () => {
    const all = getAllItemsWithContext();
    return all.filter(x => favorites.includes(x.item.id));
  };

  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const all = getAllItemsWithContext();
    const lowerQ = searchQuery.toLowerCase();
    return all.filter(x => 
      x.item.title.toLowerCase().includes(lowerQ) || 
      x.item.description.toLowerCase().includes(lowerQ)
    );
  }, [categories, searchQuery]);

  const getCategory = (id: string) => categories.find(c => c.id === id);
  const getSection = (catId: string, secId: string) => {
    const cat = getCategory(catId);
    return cat?.sections.find(s => s.id === secId);
  };
  const getItem = (catId: string, secId: string, itemId: string) => {
    const sec = getSection(catId, secId);
    return sec?.items.find(i => i.id === itemId);
  };

  return (
    <DataContext.Provider value={{
      categories, loading,
      getCategory, getSection, getItem,
      addCategory, updateCategory, deleteCategory,
      addSection, updateSection, deleteSection,
      addItem, updateItem, deleteItem,
      favorites, toggleFavorite, isFavorite, getFavoriteItems,
      searchQuery, setSearchQuery, searchResults,
      uploadInitialData
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
