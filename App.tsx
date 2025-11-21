import React, { useEffect, useState, useMemo } from 'react';
import { HashRouter, Routes, Route, Link, useParams, Navigate, useLocation } from 'react-router-dom';
import { DataProvider, useData } from './context/DataContext';
import Layout from './components/Layout';
import Admin from './pages/Admin';
import { 
  ArrowRight, FileText, Bot, Info, Sparkles, Heart, Search, ExternalLink, 
  Fingerprint, Brain, Target, Feather, Zap, LayoutTemplate, GraduationCap, 
  MessageCircle, Rocket, Cpu, Palette, Briefcase, User, Layers, ArrowDown
} from 'lucide-react';
import CopyButton from './components/CopyButton';
import { ItemType } from './types';

// --- ScrollToTop Helper ---
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    const main = document.querySelector('main');
    if (main) main.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
};

// --- Helper: Smart Icon System ---
const getSectionTheme = (title: string) => {
  const t = title.toLowerCase();
  
  if (t.includes('распаков') || t.includes('личност') || t.includes('аватар')) {
    return { icon: Fingerprint, color: 'text-rose-500', bg: 'from-rose-100 to-rose-200', shadow: 'shadow-rose-200' };
  }
  if (t.includes('маркетолог') || t.includes('продаж') || t.includes('оффер')) {
    return { icon: Target, color: 'text-red-500', bg: 'from-red-100 to-orange-100', shadow: 'shadow-red-200' };
  }
  if (t.includes('контент') || t.includes('план')) {
    return { icon: LayoutTemplate, color: 'text-violet-500', bg: 'from-violet-100 to-purple-100', shadow: 'shadow-violet-200' };
  }
  if (t.includes('стиль') || t.includes('voice') || t.includes('текст')) {
    return { icon: Feather, color: 'text-fuchsia-500', bg: 'from-fuchsia-100 to-pink-100', shadow: 'shadow-fuchsia-200' };
  }
  if (t.includes('промт') || t.includes('инженер') || t.includes('техник')) {
    return { icon: Cpu, color: 'text-cyan-600', bg: 'from-cyan-100 to-sky-100', shadow: 'shadow-cyan-200' };
  }
  if (t.includes('обучен') || t.includes('навык')) {
    return { icon: GraduationCap, color: 'text-emerald-600', bg: 'from-emerald-100 to-teal-100', shadow: 'shadow-emerald-200' };
  }
  if (t.includes('пост') || t.includes('соцсет')) {
    return { icon: MessageCircle, color: 'text-blue-500', bg: 'from-blue-100 to-indigo-100', shadow: 'shadow-blue-200' };
  }
  if (t.includes('стратег')) {
    return { icon: Brain, color: 'text-amber-600', bg: 'from-amber-100 to-orange-100', shadow: 'shadow-amber-200' };
  }
  
  // Default
  return { icon: Sparkles, color: 'text-stone-500', bg: 'from-stone-100 to-stone-200', shadow: 'shadow-stone-200' };
};

// --- Prompt Renderer Component ---
const PromptRenderer = ({ content, isAssistant, title }: { content: string, isAssistant: boolean, title?: string }) => {
  return (
    <div className="flex flex-col gap-6">
      {/* The Content Block */}
      <section className="group relative rounded-[2rem] p-[1px] bg-gradient-to-br from-stone-800 to-stone-900 shadow-2xl shadow-stone-300/50 animate-enter overflow-hidden" style={{ animationDelay: '0.2s' }}>
          {/* Animated Border Effect (Warm) */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-rose-500 to-orange-500 opacity-20 group-hover:opacity-40 blur-xl transition-opacity duration-700 animate-pulse-slow" />

          <div className="bg-stone-900/95 backdrop-blur-xl rounded-[2rem] p-6 md:p-10 relative z-10 h-full transition-colors duration-500">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6 border-b border-white/10 pb-6">
              <div>
                <h3 className="text-lg font-bold text-stone-100 mb-1 flex items-center gap-3">
                  {title || (isAssistant ? 'System Instructions' : 'Текст промта')}
                </h3>
                <p className="text-stone-500 text-xs font-medium">
                  {isAssistant ? 'Вставьте в настройки GPT' : 'Скопируйте и отправьте в чат'}
                </p>
              </div>
              <div className="flex items-center gap-3 self-start md:self-center">
                <a 
                  href="https://chat.openai.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/5 text-stone-400 hover:text-white hover:bg-white/10 transition-all text-xs font-bold uppercase tracking-wide"
                >
                  ChatGPT <ExternalLink size={12} />
                </a>
                <CopyButton text={content} className="bg-white/10 hover:bg-orange-600 hover:text-white border-transparent text-stone-200" />
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-4 bg-orange-500/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <pre className="font-mono text-sm text-stone-200 whitespace-pre-wrap leading-relaxed overflow-x-auto selection:bg-orange-500/30 p-2 relative z-10">
                {content}
              </pre>
            </div>
          </div>
      </section>
    </div>
  );
}

// --- Public Pages Refactored to use Context ---

const HomePage = () => {
  const { categories, getFavoriteItems, searchQuery, setSearchQuery, searchResults } = useData();
  const favoriteItems = getFavoriteItems();

  const isSearching = searchQuery.trim().length > 0;

  return (
    <Layout>
      <div className="mb-12 text-center max-w-3xl mx-auto animate-enter relative">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md shadow-sm border border-stone-100 mb-6 animate-float">
          <Sparkles size={14} className="text-amber-500 fill-amber-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500">База знаний</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-stone-900 mb-8 leading-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-stone-800 to-stone-600">GPT</span> 
          <span className="text-stone-300 px-2">·</span> 
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-rose-500">ПРАКТИК</span>
        </h1>
        
        {/* Search Bar */}
        <div className="max-w-xl mx-auto relative group z-20">
           <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search size={20} className="text-stone-400 group-focus-within:text-orange-500 transition-colors" />
           </div>
           <input 
             type="text" 
             placeholder="Найти промт, ассистента или тему..." 
             className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/50 shadow-soft focus:shadow-glow focus:ring-2 focus:ring-orange-500/20 outline-none text-stone-800 placeholder-stone-400 transition-all"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
           />
        </div>
      </div>

      {/* Search Results */}
      {isSearching && (
        <div className="mb-16 animate-enter">
          <h2 className="text-2xl font-bold text-stone-800 mb-6 px-2">Результаты поиска</h2>
          {searchResults.length > 0 ? (
             <div className="grid gap-4">
               {searchResults.map(({ item, category, section }) => (
                 <Link 
                    key={item.id}
                    to={`/category/${category.id}/section/${section.id}/item/${item.id}`}
                    className="flex items-center p-4 bg-white/60 rounded-2xl hover:bg-white hover:shadow-md transition-all group"
                 >
                    <div className={`p-3 rounded-xl mr-4 ${
                      item.type === ItemType.ASSISTANT ? 'bg-rose-100 text-rose-500' : (item.type === ItemType.SEQUENCE ? 'bg-violet-100 text-violet-500' : 'bg-orange-100 text-orange-500')
                    }`}>
                      {item.type === ItemType.ASSISTANT ? <Bot size={20} /> : (item.type === ItemType.SEQUENCE ? <Layers size={20} /> : <FileText size={20} />)}
                    </div>
                    <div>
                      <div className="font-bold text-stone-800 group-hover:text-orange-600 transition-colors">{item.title}</div>
                      <div className="text-xs text-stone-400">{category.title} • {section.title}</div>
                    </div>
                 </Link>
               ))}
             </div>
          ) : (
            <div className="text-center py-10 bg-white/40 rounded-3xl border border-stone-200 border-dashed text-stone-400">
              Ничего не найдено
            </div>
          )}
        </div>
      )}

      {/* Favorites Section */}
      {!isSearching && favoriteItems.length > 0 && (
        <div className="mb-16 animate-enter">
           <div className="flex items-center gap-3 mb-6 px-2">
              <Heart size={24} className="fill-rose-400 text-rose-500" />
              <h2 className="text-2xl font-bold text-stone-800">Мой набор</h2>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoriteItems.map(({ item, category, section }) => (
                <Link 
                  key={item.id}
                  to={`/category/${category.id}/section/${section.id}/item/${item.id}`}
                  className="bg-white/70 backdrop-blur-sm p-5 rounded-[2rem] border border-white/60 shadow-sm hover:shadow-soft hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg ${
                      item.type === ItemType.ASSISTANT ? 'bg-rose-100 text-rose-600' : (item.type === ItemType.SEQUENCE ? 'bg-violet-100 text-violet-600' : 'bg-orange-100 text-orange-600')
                    }`}>
                      {item.type === ItemType.ASSISTANT ? 'Assistant' : (item.type === ItemType.SEQUENCE ? 'Chain' : 'Prompt')}
                    </span>
                    <ArrowRight size={16} className="text-stone-300 group-hover:text-orange-500 transition-colors" />
                  </div>
                  <h3 className="font-bold text-stone-800 mb-1 leading-tight group-hover:text-orange-700 transition-colors">{item.title}</h3>
                  <p className="text-xs text-stone-400 line-clamp-1">{category.title}</p>
                </Link>
              ))}
           </div>
        </div>
      )}

      {/* Categories Grid (Using Mesh Gradients) */}
      {!isSearching && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((cat, index) => (
            <Link 
              key={cat.id} 
              to={`/category/${cat.id}`}
              // USE mesh-card-base AND mesh-bg-{theme} classes. The text is automatically white due to mesh-card-base
              className={`mesh-card-base mesh-bg-${cat.theme || 'orange'} rounded-[2.5rem] animate-enter group`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="aspect-[16/9] w-full p-10 flex flex-col justify-between relative z-10">
                
                {/* Top Tag */}
                <div className="self-start">
                  <div className="inline-flex px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-[10px] font-bold tracking-wider uppercase mb-3 shadow-sm">
                    Категория
                  </div>
                </div>

                {/* Content */}
                <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <h2 className="text-3xl font-bold mb-2 leading-tight tracking-tight drop-shadow-md">{cat.title}</h2>
                  <p className="text-white/80 text-sm font-medium line-clamp-2 leading-relaxed">{cat.description}</p>
                </div>

                {/* Decorative Icon */}
                 <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                   <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
                      <ArrowRight size={24} />
                   </div>
                 </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </Layout>
  );
};

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { getCategory } = useData();
  const category = getCategory(categoryId || '');

  if (!category) return <Navigate to="/" />;

  return (
    <Layout breadcrumbs={[{ label: category.title }]}>
      <div className="mb-12 text-center md:text-left animate-enter">
        <h1 className="text-4xl md:text-5xl font-bold text-stone-800 mb-4 tracking-tight">{category.title}</h1>
        <p className="text-xl text-stone-500 font-light max-w-2xl">{category.description}</p>
      </div>

      {category.sections.length === 0 ? (
        <div className="text-center py-24 bg-white/40 backdrop-blur-sm rounded-[2.5rem] border border-dashed border-stone-300/50 animate-scale-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-sm text-stone-300 mb-6">
            <Sparkles size={32} />
          </div>
          <p className="text-stone-500 font-medium text-lg">В этой категории пока нет разделов</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {category.sections.map((section, index) => {
            const theme = getSectionTheme(section.title);
            const ThemeIcon = theme.icon;
            
            return (
              <Link 
                key={section.id} 
                to={`/category/${category.id}/section/${section.id}`}
                className="group relative flex flex-col md:flex-row md:items-center p-8 rounded-[2.5rem] bg-white/60 backdrop-blur-md hover:bg-white hover:shadow-soft transition-all duration-500 border border-white/50 animate-enter"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mb-6 md:mb-0 md:mr-8">
                  <div className={`w-24 h-24 rounded-[2rem] bg-gradient-to-br ${theme.bg} ${theme.color} flex items-center justify-center shadow-inner group-hover:shadow-xl group-hover:${theme.shadow} group-hover:scale-105 transition-all duration-500`}>
                    <ThemeIcon size={40} strokeWidth={1.5} className="drop-shadow-sm" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-stone-800 mb-2 group-hover:text-stone-900 transition-colors duration-300">{section.title}</h3>
                  <p className="text-stone-500 leading-relaxed font-light">
                    {section.description || 'Перейдите, чтобы увидеть материалы.'}
                  </p>
                </div>
                <div className="mt-6 md:mt-0 flex items-center justify-between md:justify-end w-full md:w-auto gap-6">
                  <div className="text-xs font-bold text-stone-300 uppercase tracking-widest group-hover:text-stone-400 transition-colors">
                    {section.items.length} {section.items.length === 1 ? 'элемент' : 'элемента'}
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white border border-stone-100 flex items-center justify-center text-stone-400 group-hover:border-orange-400 group-hover:text-orange-500 transition-all duration-300 group-hover:rotate-[-45deg]">
                    <ArrowRight size={20} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </Layout>
  );
};

const SectionPage = () => {
  const { categoryId, sectionId } = useParams<{ categoryId: string; sectionId: string }>();
  const { getCategory, getSection, toggleFavorite, isFavorite } = useData();
  const category = getCategory(categoryId || '');
  const section = getSection(categoryId || '', sectionId || '');
  const [showInstructions, setShowInstructions] = React.useState(true);

  if (!category || !section) return <Navigate to="/" />;

  return (
    <Layout breadcrumbs={[
      { label: category.title, to: `/category/${category.id}` },
      { label: section.title }
    ]}>
      <div className="mb-12 animate-enter">
        <h1 className="text-4xl font-bold text-stone-800 mb-3 tracking-tight">{section.title}</h1>
        <p className="text-xl text-stone-500 font-light">{section.description}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Main Content */}
        <div className="flex-1 w-full grid gap-4">
          {section.items.map((item, index) => (
            <div 
              key={item.id}
              className="group flex items-center p-6 bg-white/60 backdrop-blur-sm rounded-[2rem] hover:bg-white hover:shadow-soft transition-all duration-500 border border-white/50 animate-enter hover:-translate-y-1 relative"
              style={{ animationDelay: `${index * 75}ms` }}
            >
               <Link to={`/category/${category.id}/section/${section.id}/item/${item.id}`} className="absolute inset-0 z-0" />
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mr-6 transition-all duration-500 relative z-10 pointer-events-none ${
                item.type === ItemType.ASSISTANT 
                  ? 'bg-rose-50 text-rose-500 group-hover:bg-rose-400 group-hover:text-white group-hover:shadow-lg group-hover:shadow-rose-200' 
                  : (item.type === ItemType.SEQUENCE 
                     ? 'bg-violet-50 text-violet-500 group-hover:bg-violet-400 group-hover:text-white group-hover:shadow-lg group-hover:shadow-violet-200'
                     : 'bg-orange-50 text-orange-500 group-hover:bg-orange-400 group-hover:text-white group-hover:shadow-lg group-hover:shadow-orange-200')
              }`}>
                {item.type === ItemType.ASSISTANT ? <Bot size={26} /> : (item.type === ItemType.SEQUENCE ? <Layers size={26} /> : <FileText size={26} />)}
              </div>
              <div className="flex-1 min-w-0 relative z-10 pointer-events-none">
                <h3 className="font-bold text-lg text-stone-800 mb-1 truncate group-hover:text-stone-900 transition-colors">{item.title}</h3>
                <p className="text-sm text-stone-400 truncate group-hover:text-stone-500 transition-colors">{item.description}</p>
              </div>
              
              <div className="flex items-center gap-3 relative z-20">
                 <button 
                    onClick={(e) => { e.preventDefault(); toggleFavorite(item.id); }}
                    className={`p-2 rounded-full transition-all ${isFavorite(item.id) ? 'text-rose-500 bg-rose-50' : 'text-stone-300 hover:text-rose-400 hover:bg-stone-50'}`}
                 >
                    <Heart size={20} className={isFavorite(item.id) ? "fill-rose-500" : ""} />
                 </button>
                 <div className="opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 pointer-events-none">
                    <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-stone-400">
                        <ArrowRight size={16} />
                    </div>
                 </div>
              </div>
            </div>
          ))}
          {section.items.length === 0 && (
            <div className="p-10 text-center bg-white/40 rounded-[2rem] border border-dashed border-stone-300 text-stone-400 animate-scale-in">
              В этом разделе пока нет материалов.
            </div>
          )}
        </div>

        {/* Instructions Sidebar (Desktop) / Block (Mobile) */}
        {section.instructions && (
          <div className="w-full lg:w-80 flex-shrink-0 animate-enter" style={{ animationDelay: '0.3s' }}>
             <div className="bg-white/70 backdrop-blur-xl p-6 rounded-[2rem] shadow-sm border border-white/50 sticky top-28 transition-all duration-500 hover:shadow-lg">
                <div 
                  onClick={() => setShowInstructions(!showInstructions)}
                  className="flex items-center justify-between cursor-pointer mb-4"
                >
                  <div className="flex items-center gap-3 text-stone-800 font-bold">
                    <div className="p-2 bg-amber-100 text-amber-700 rounded-xl">
                      <Info size={18} />
                    </div>
                    <span className="text-sm">Как работать</span>
                  </div>
                  <span className="text-stone-400 text-xs font-medium hover:text-stone-600 transition-colors">
                    {showInstructions ? 'Свернуть' : 'Развернуть'}
                  </span>
                </div>
                
                {showInstructions && (
                  <div className="text-sm text-stone-500 leading-relaxed animate-fadeIn">
                    {section.instructions}
                  </div>
                )}
             </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

const ItemDetail = () => {
  const { categoryId, sectionId, itemId } = useParams<{ categoryId: string; sectionId: string; itemId: string }>();
  const { getCategory, getSection, getItem, toggleFavorite, isFavorite } = useData();
  const category = getCategory(categoryId || '');
  const section = getSection(categoryId || '', sectionId || '');
  const item = getItem(categoryId || '', sectionId || '', itemId || '');

  if (!category || !section || !item) return <Navigate to="/" />;

  const isAssistant = item.type === ItemType.ASSISTANT;
  const isSequence = item.type === ItemType.SEQUENCE;
  const favorite = isFavorite(item.id);

  return (
    <Layout breadcrumbs={[
      { label: category.title, to: `/category/${category.id}` },
      { label: section.title, to: `/category/${category.id}/section/${section.id}` },
      { label: item.title }
    ]}>
      
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start max-w-7xl mx-auto">
        
        {/* LEFT COLUMN: Context, Instructions, Description */}
        <div className="w-full lg:w-[40%] flex flex-col gap-6 animate-enter">
          
          {/* Header Meta */}
          <div className="flex items-center justify-between">
             <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide shadow-sm border border-white/50 backdrop-blur-sm ${
              isAssistant 
                ? 'bg-rose-50 text-rose-600' 
                : (isSequence ? 'bg-violet-50 text-violet-600' : 'bg-orange-50 text-orange-600')
             }`}>
              {isAssistant ? <Bot size={16} /> : (isSequence ? <Layers size={16} /> : <FileText size={16} />)}
              {isAssistant ? 'GPT ASSISTANT' : (isSequence ? 'SEQUENCE' : 'PROMPT')}
             </div>

             <button 
               onClick={() => toggleFavorite(item.id)}
               className={`p-2.5 rounded-full transition-all shadow-sm border ${favorite ? 'bg-rose-50 border-rose-200 text-rose-500' : 'bg-white border-stone-100 text-stone-400 hover:text-rose-500 hover:border-rose-100'}`}
               title={favorite ? "Убрать из избранного" : "В избранное"}
             >
                <Heart size={20} className={favorite ? "fill-rose-500" : ""} />
             </button>
          </div>

          {/* Title & Desc */}
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-stone-800 mb-4 leading-tight tracking-tight text-left">
              {item.title}
            </h1>
            <p className="text-lg text-stone-500 leading-relaxed font-light text-left">
              {item.description}
            </p>
          </div>

          {/* Instructions Block */}
          {item.instructions && (
            <section className="bg-white/60 backdrop-blur-md rounded-[2rem] p-6 shadow-sm border border-white/50 mt-2">
              <h3 className="text-xs font-black text-stone-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Info size={14} />
                Инструкция
              </h3>
              <div className="prose prose-stone prose-sm max-w-none text-stone-600 leading-7 whitespace-pre-line">
                {item.instructions}
              </div>
            </section>
          )}
        </div>

        {/* RIGHT COLUMN: The Prompt (Sticky) */}
        <div className="w-full lg:w-[60%] lg:sticky lg:top-32 animate-enter" style={{ animationDelay: '0.1s' }}>
          
          {isSequence ? (
            <div className="relative">
              {/* Vertical connecting line */}
              <div className="absolute left-8 top-6 bottom-6 w-0.5 bg-gradient-to-b from-orange-200 via-violet-200 to-transparent z-0" />
              
              {(item.subPrompts || []).map((sub, idx) => (
                <div key={idx} className="relative z-10 mb-8 last:mb-0">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-white border-4 border-stone-50 shadow-lg flex items-center justify-center text-xl font-black text-stone-300">
                      {idx + 1}
                    </div>
                    <div className="font-bold text-stone-800 text-lg">{sub.title}</div>
                  </div>
                  <div className="pl-8">
                     <PromptRenderer content={sub.content} isAssistant={false} title={sub.title} />
                  </div>
                  {idx < (item.subPrompts || []).length - 1 && (
                     <div className="pl-8 my-4 flex justify-center">
                       <ArrowDown size={24} className="text-stone-200 animate-bounce" />
                     </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <>
              <PromptRenderer content={item.content} isAssistant={isAssistant} />

              {/* Sub-prompts for Assistants */}
              {isAssistant && item.subPrompts && item.subPrompts.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-stone-800 mb-6 pl-2">Дополнительные промты</h3>
                  <div className="grid gap-4">
                    {item.subPrompts.map((sub, idx) => (
                      <div key={idx} className="bg-white/80 backdrop-blur-md rounded-[1.5rem] p-6 hover:shadow-soft transition-all duration-300 border border-stone-100/50">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                          <h4 className="font-bold text-stone-800 text-sm">{sub.title}</h4>
                          <CopyButton text={sub.content} label="Копировать" className="scale-90" />
                        </div>
                        <div className="font-mono text-xs text-stone-500 leading-relaxed p-4 bg-stone-50 rounded-xl border border-stone-100">
                          {sub.content}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <DataProvider>
      <HashRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="/category/:categoryId/section/:sectionId" element={<SectionPage />} />
          <Route path="/category/:categoryId/section/:sectionId/item/:itemId" element={<ItemDetail />} />
          
          {/* Admin Routes */}
          <Route path="/admin/*" element={<Admin />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </DataProvider>
  );
};

export default App;