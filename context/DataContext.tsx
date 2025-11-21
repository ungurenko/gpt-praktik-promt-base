import React, { createContext, useContext, useState, useEffect } from 'react';
import { Category, Section, PromptItem, ItemType } from '../types';
import { CATEGORIES as INITIAL_DATA } from '../data';

interface DataContextType {
  categories: Category[];
  // Read
  getCategory: (id: string) => Category | undefined;
  getSection: (catId: string, secId: string) => Section | undefined;
  getItem: (catId: string, secId: string, itemId: string) => PromptItem | undefined;
  // Write - Category
  addCategory: (category: Category) => void;
  updateCategory: (id: string, data: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  // Write - Section
  addSection: (catId: string, section: Section) => void;
  updateSection: (catId: string, secId: string, data: Partial<Section>) => void;
  deleteSection: (catId: string, secId: string) => void;
  // Write - Item
  addItem: (catId: string, secId: string, item: PromptItem) => void;
  updateItem: (catId: string, secId: string, itemId: string, data: Partial<PromptItem>) => void;
  deleteItem: (catId: string, secId: string, itemId: string) => void;
  // Favorites
  favorites: string[]; // Array of item IDs
  toggleFavorite: (itemId: string) => void;
  isFavorite: (itemId: string) => boolean;
  getFavoriteItems: () => { item: PromptItem, category: Category, section: Section }[];
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: { item: PromptItem, category: Category, section: Section }[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem('gpt-practicum-data');
      return saved ? JSON.parse(saved) : INITIAL_DATA;
    } catch (e) {
      console.error("Failed to parse data from local storage", e);
      return INITIAL_DATA;
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

  useEffect(() => {
    localStorage.setItem('gpt-practicum-data', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('gpt-practicum-favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Favorites Logic
  const toggleFavorite = (itemId: string) => {
    setFavorites(prev => 
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  const isFavorite = (itemId: string) => favorites.includes(itemId);

  // Helper to flatten structure for search and favorites
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

  return (
    <DataContext.Provider value={{
      categories,
      getCategory, getSection, getItem,
      addCategory, updateCategory, deleteCategory,
      addSection, updateSection, deleteSection,
      addItem, updateItem, deleteItem,
      favorites, toggleFavorite, isFavorite, getFavoriteItems,
      searchQuery, setSearchQuery, searchResults
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