import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { HashRouter, Routes, Route, Link, useParams, Navigate, useLocation } from 'react-router-dom';
import { DataProvider, useData } from './context/DataContext';
import Layout from './components/Layout';
import Tooltip from './components/Tooltip';
import { 
  ArrowRight, ArrowLeft, FileText, Bot, Info, Sparkles, Heart, Search, ExternalLink, 
  Fingerprint, Brain, Target, Feather, Zap, LayoutTemplate, GraduationCap, 
  MessageCircle, Rocket, Cpu, Palette, Briefcase, User, Layers, ArrowDown, Copy, 
  Play, BookOpen, CheckCircle, AlertTriangle, Lightbulb, GalleryHorizontal,
  Check, Circle, Lock, Unlock, X
} from 'lucide-react';
import CopyButton from './components/CopyButton';
import { ItemType, Article, ArticleBlock } from './types';
import Admin from './pages/Admin';

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

// --- Page Navigation Component ---
interface PageNavProps {
  prev?: { to: string; title: string; label: string };
  next?: { to: string; title: string; label: string };
}

const PageNav: React.FC<PageNavProps> = ({ prev, next }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 animate-enter" style={{ animationDelay: '0.1s' }}>
    {prev ? (
      <Link 
        to={prev.to} 
        className="group flex flex-col items-start text-left p-5 rounded-3xl bg-white/40 dark:bg-white/5 border border-stone-200/50 dark:border-white/5 hover:bg-white dark:hover:bg-white/10 hover:border-stone-200 dark:hover:border-white/10 hover:shadow-sm transition-all duration-300"
      >
        <div className="flex items-center gap-2 text-stone-400 text-[10px] font-bold uppercase tracking-wider mb-1.5 group-hover:text-orange-500 transition-colors">
          <ArrowLeft size={14} /> {prev.label}
        </div>
        <div className="text-lg font-bold text-stone-800 dark:text-white group-hover:text-stone-900 dark:group-hover:text-white transition-colors line-clamp-1">
          {prev.title}
        </div>
      </Link>
    ) : <div className="hidden md:block" />}

    {next ? (
      <Link 
        to={next.to} 
        className="group flex flex-col items-start md:items-end text-left md:text-right p-5 rounded-3xl bg-white/40 dark:bg-white/5 border border-stone-200/50 dark:border-white/5 hover:bg-white dark:hover:bg-white/10 hover:border-stone-200 dark:hover:border-white/10 hover:shadow-sm transition-all duration-300"
      >
        <div className="flex items-center gap-2 text-stone-400 text-[10px] font-bold uppercase tracking-wider mb-1.5 group-hover:text-orange-500 transition-colors">
          {next.label} <ArrowRight size={14} />
        </div>
        <div className="text-lg font-bold text-stone-800 dark:text-white group-hover:text-stone-900 dark:group-hover:text-white transition-colors line-clamp-1">
          {next.title}
        </div>
      </Link>
    ) : <div className="hidden md:block" />}
  </div>
);

// --- Global Toast Render Component ---
const GlobalToastContainer = () => {
  const { toasts, removeToast } = useData();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div 
          key={toast.id}
          className={`
            pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl min-w-[300px] border transform transition-all duration-300 animate-enter
            ${toast.type === 'success' ? 'bg-stone-900 text-white border-stone-800' : ''}
            ${toast.type === 'error' ? 'bg-rose-500 text-white border-rose-600' : ''}
            ${toast.type === 'info' ? 'bg-white text-stone-800 border-stone-200' : ''}
          `}
        >
          {toast.type === 'success' && <div className="p-1 rounded-full bg-emerald-500 text-white"><Check size={14} strokeWidth={3} /></div>}
          {toast.type === 'error' && <AlertTriangle size={20} />}
          {toast.type === 'info' && <Info size={20} className="text-stone-400" />}
          
          <div className="flex-1 text-sm font-bold tracking-wide">{toast.message}</div>
          
          <button onClick={() => removeToast(toast.id)} className="opacity-50 hover:opacity-100">
             <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

// --- Prompt Renderer Component (Memoized) ---
// Removed pulse animation to improve performance
const PromptRenderer = React.memo(({ content, isAssistant, title }: { content: string, isAssistant: boolean, title?: string }) => {
  return (
    <div className="flex flex-col gap-6">
      {/* The Content Block */}
      <section className="group relative rounded-[2rem] p-[1px] bg-gradient-to-br from-stone-800 to-stone-900 shadow-2xl shadow-stone-300/50 animate-enter overflow-hidden" style={{ animationDelay: '0.05s' }}>
          {/* Animated Border Effect (Warm) - Simplified opacity transition */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-rose-500 to-orange-500 opacity-10 group-hover:opacity-30 blur-xl transition-opacity duration-500 will-change-opacity" />

          <div className="bg-stone-900/95 backdrop-blur-md rounded-[2rem] p-8 md:p-12 relative z-10 h-full transition-colors duration-300">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-white/10 pb-6">
              <div>
                <h3 className="text-xl font-bold text-stone-100 mb-2 flex items-center gap-3">
                  {title || (isAssistant ? 'System Instructions' : 'Текст промта')}
                </h3>
                <p className="text-stone-500 text-sm font-medium">
                  {isAssistant ? 'Вставьте в настройки GPT' : 'Скопируйте и отправьте в чат'}
                </p>
              </div>
              <div className="flex items-center gap-3 self-start md:self-center">
                <Tooltip content="Открыть ChatGPT" position="top">
                  <a 
                    href="https://chat.openai.com" 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-2 px-5 py-3 rounded-full bg-white/5 text-stone-400 hover:text-white hover:bg-white/10 transition-all text-xs font-bold uppercase tracking-wide"
                  >
                    ChatGPT <ExternalLink size={14} />
                  </a>
                </Tooltip>
                <CopyButton text={content} className="bg-white/10 hover:bg-orange-600 hover:text-white border-transparent text-stone-200" />
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-4 bg-orange-500/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <pre className="font-mono text-base text-stone-200 whitespace-pre-wrap leading-loose overflow-x-auto selection:bg-orange-500/30 p-2 relative z-10">
                {content}
              </pre>
            </div>
          </div>
      </section>
    </div>
  );
});

// --- Article Block Renderer (Memoized) ---
const BlockRenderer: React.FC<{ block: ArticleBlock }> = React.memo(({ block }) => {
  switch (block.type) {
    case 'header':
      return <h2 className="text-3xl font-bold text-stone-800 dark:text-white mt-10 mb-6 tracking-tight">{block.content}</h2>;
    
    case 'text':
      return <div className="prose prose-stone dark:prose-invert max-w-none text-stone-600 dark:text-stone-300 leading-loose whitespace-pre-line mb-6 text-xl font-light">{block.content}</div>;
    
    case 'code':
      return (
        <div className="my-8">
          <PromptRenderer content={block.content} isAssistant={false} title={block.meta || "Код / Промт"} />
        </div>
      );

    case 'image':
      return (
        <figure className="my-10">
          <div className="rounded-[2rem] overflow-hidden border border-stone-200 dark:border-white/10 shadow-soft transform-gpu">
             <img src={block.content} alt={block.meta || 'Image'} className="w-full h-auto" loading="lazy" />
          </div>
          {block.meta && <figcaption className="text-center text-sm text-stone-400 mt-4 font-medium">{block.meta}</figcaption>}
        </figure>
      );

    case 'video':
      return (
        <div className="my-10 rounded-[2rem] overflow-hidden shadow-lg border border-stone-200 dark:border-white/10 bg-black aspect-video">
          <iframe 
            src={block.content} 
            title="Video player" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowFullScreen 
            className="w-full h-full"
            loading="lazy"
          />
        </div>
      );

    case 'tip':
      return (
        <div className="my-8 p-8 rounded-[1.5rem] bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-500/20 flex gap-5">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Lightbulb size={24} />
          </div>
          <div>
             <h4 className="font-bold text-amber-800 dark:text-amber-400 text-sm uppercase tracking-wide mb-2">{block.meta || 'Совет'}</h4>
             <p className="text-amber-900/80 dark:text-amber-200/80 text-base leading-relaxed">{block.content}</p>
          </div>
        </div>
      );

    case 'step':
      return (
        <div className="flex gap-6 my-8 group">
           <div className="flex-shrink-0 flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 flex items-center justify-center text-xl font-bold shadow-lg transition-transform duration-300 group-hover:scale-110">
                 <CheckCircle size={24} />
              </div>
              <div className="w-0.5 h-full bg-stone-200 dark:bg-white/10 my-3 rounded-full"></div>
           </div>
           <div className="pt-1 pb-10">
              {block.meta && <h4 className="text-xl font-bold text-stone-800 dark:text-white mb-3">{block.meta}</h4>}
              <p className="text-stone-600 dark:text-stone-400 text-lg leading-relaxed">{block.content}</p>
           </div>
        </div>
      );

    default:
      return null;
  }
});

// --- Public Pages ---

const CarouselPage = () => {
  return (
    <Layout breadcrumbs={[{ label: 'Конструктор каруселей' }]}>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-enter">
         <div className="w-32 h-32 bg-gradient-to-br from-violet-100 to-fuchsia-100 dark:from-violet-900/20 dark:to-fuchsia-900/20 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-soft">
            <GalleryHorizontal size={56} className="text-violet-500 dark:text-violet-400" strokeWidth={1.5} />
         </div>
         <h1 className="text-5xl font-bold text-stone-800 dark:text-white mb-6 tracking-tight">Конструктор каруселей</h1>
         <p className="text-2xl text-stone-500 dark:text-stone-400 max-w-2xl font-light leading-relaxed">
            Мы работаем над инструментом, который позволит вам создавать вирусные карусели для соцсетей в пару кликов.
         </p>
         <div className="mt-10 px-6 py-3 bg-stone-100 dark:bg-white/10 rounded-full text-stone-500 dark:text-stone-400 text-sm font-bold uppercase tracking-wider">
            Скоро
         </div>
      </div>
    </Layout>
  );
};

const FavoritesPage = () => {
  const { getFavoriteItems } = useData();
  const favoriteItems = useMemo(() => getFavoriteItems(), [getFavoriteItems]);

  return (
    <Layout breadcrumbs={[{ label: 'Избранное' }]}>
       <div className="mb-10 animate-enter">
          <h1 className="text-4xl font-bold text-stone-800 dark:text-white mb-3">Избранное</h1>
          <p className="text-lg text-stone-500 dark:text-stone-400">Ваша личная коллекция промтов и ассистентов.</p>
       </div>

       {favoriteItems.length > 0 ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 animate-enter" style={{ animationDelay: '0.05s' }}>
              {favoriteItems.map(({ item, category, section }) => (
                <Link 
                  key={item.id}
                  to={`/category/${category.id}/section/${section.id}/item/${item.id}`}
                  className="bg-white/70 dark:bg-white/5 backdrop-blur-sm p-6 rounded-[2rem] border border-white/60 dark:border-white/10 shadow-sm hover:shadow-soft hover:-translate-y-1 transition-all duration-200 group will-change-transform"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg ${
                      item.type === ItemType.ASSISTANT ? 'bg-rose-100 text-rose-600' : (item.type === ItemType.SEQUENCE ? 'bg-violet-100 text-violet-600' : 'bg-orange-100 text-orange-600')
                    }`}>
                      {item.type === ItemType.ASSISTANT ? 'Assistant' : (item.type === ItemType.SEQUENCE ? 'Chain' : 'Prompt')}
                    </span>
                    <ArrowRight size={20} className="text-stone-300 group-hover:text-orange-500 transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-stone-800 dark:text-white mb-2 leading-tight group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">{item.title}</h3>
                  <p className="text-sm text-stone-400 line-clamp-1">{category.title}</p>
                </Link>
              ))}
           </div>
       ) : (
         <div className="flex flex-col items-center justify-center py-24 bg-white/40 dark:bg-white/5 rounded-[2.5rem] border border-dashed border-stone-300 dark:border-stone-700 text-center">
            <div className="w-20 h-20 rounded-full bg-stone-100 dark:bg-white/10 flex items-center justify-center text-stone-300 mb-6">
               <Heart size={40} />
            </div>
            <h3 className="text-2xl font-bold text-stone-800 dark:text-white">Пока пусто</h3>
            <p className="text-stone-500 dark:text-stone-400 max-w-xs mt-3 text-lg">Добавляйте полезные промты в избранное, нажимая на сердечко.</p>
            <Link to="/" className="mt-8 px-8 py-4 rounded-xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-bold text-base hover:opacity-90 transition-opacity">
               Перейти в каталог
            </Link>
         </div>
       )}
    </Layout>
  );
}

const InstructionsPage = () => {
  const { articles } = useData();
  const publishedArticles = useMemo(() => articles.filter(a => a.published), [articles]);

  return (
    <Layout breadcrumbs={[{ label: 'Инструкции' }]}>
      <div className="mb-12 animate-enter">
         <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
            <BookOpen size={16} />
            <span>База знаний</span>
         </div>
         <h1 className="text-5xl font-bold text-stone-800 dark:text-white mb-6 tracking-tight">Инструкции и гайды</h1>
         <p className="text-2xl text-stone-500 dark:text-stone-400 font-light max-w-3xl">
            Полезные статьи о том, как эффективно использовать нейросети, настраивать ассистентов и писать идеальные промты.
         </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-enter" style={{ animationDelay: '0.05s' }}>
         {publishedArticles.map((article, idx) => (
            <Link 
              key={article.id} 
              to={`/instructions/${article.id}`}
              className="group flex flex-col bg-white dark:bg-white/5 rounded-[2rem] border border-stone-200 dark:border-white/10 overflow-hidden hover:shadow-soft hover:-translate-y-2 transition-all duration-200 h-full will-change-transform"
            >
               {article.coverImage ? (
                 <div className="h-56 overflow-hidden relative">
                    <img src={article.coverImage} alt={article.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                 </div>
               ) : (
                 <div className="h-56 bg-gradient-to-br from-stone-100 to-stone-200 dark:from-white/5 dark:to-white/10 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute -right-4 -bottom-4 text-stone-300 dark:text-white/5 transform rotate-12 group-hover:scale-110 transition-transform duration-300">
                       <BookOpen size={140} />
                    </div>
                    <BookOpen size={48} className="text-stone-400 relative z-10" />
                 </div>
               )}
               
               <div className="p-8 flex-1 flex flex-col">
                  <div className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">
                     {new Date(article.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
                  </div>
                  <h3 className="text-2xl font-bold text-stone-800 dark:text-white mb-4 leading-tight group-hover:text-orange-600 transition-colors">
                     {article.title}
                  </h3>
                  <p className="text-stone-500 dark:text-stone-400 text-base leading-relaxed line-clamp-3 flex-1">
                     {article.description}
                  </p>
                  
                  <div className="mt-8 flex items-center text-stone-800 dark:text-stone-200 font-bold text-sm uppercase tracking-wide gap-2 group-hover:gap-4 transition-all">
                     Читать статью <ArrowRight size={18} />
                  </div>
               </div>
            </Link>
         ))}
         
         {publishedArticles.length === 0 && (
            <div className="col-span-full py-24 text-center border border-dashed border-stone-200 rounded-[2.5rem] bg-stone-50/50">
               <p className="text-stone-400 font-medium text-lg">Пока нет опубликованных инструкций</p>
            </div>
         )}
      </div>
    </Layout>
  );
}

const ArticleDetailPage = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const { getArticle } = useData();
  const article = useMemo(() => getArticle(articleId || ''), [articleId, getArticle]);

  if (!article) return <Navigate to="/instructions" />;

  return (
    <Layout breadcrumbs={[{ label: 'Инструкции', to: '/instructions' }, { label: article.title }]}>
       <div className="max-w-4xl mx-auto animate-enter pb-24">
          <div className="text-center mb-16">
             <div className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-5">
               {new Date(article.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
             </div>
             <h1 className="text-4xl md:text-6xl font-extrabold text-stone-900 dark:text-white mb-8 leading-tight tracking-tight">
                {article.title}
             </h1>
             <p className="text-2xl text-stone-500 dark:text-stone-400 font-light leading-relaxed max-w-3xl mx-auto">
                {article.description}
             </p>
          </div>
          
          {article.coverImage && (
             <div className="rounded-[3rem] overflow-hidden shadow-soft mb-16 border border-stone-200 dark:border-white/10 transform-gpu">
                <img src={article.coverImage} alt={article.title} className="w-full h-auto max-h-[600px] object-cover" />
             </div>
          )}
          
          <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl rounded-[3rem] p-8 md:p-16 shadow-sm border border-white/50 dark:border-white/5">
             {article.blocks.map((block) => (
                <BlockRenderer key={block.id} block={block} />
             ))}
             
             <div className="mt-20 pt-10 border-t border-stone-200 dark:border-white/10 flex justify-center">
                <Link to="/instructions" className="flex items-center gap-3 px-8 py-4 rounded-full bg-stone-100 dark:bg-white/10 text-stone-600 dark:text-stone-300 font-bold text-base hover:bg-stone-200 dark:hover:bg-white/20 transition-colors">
                   <ArrowRight size={18} className="rotate-180" /> Вернуться к списку
                </Link>
             </div>
          </div>
       </div>
    </Layout>
  );
};

const HomePage = () => {
  const { categories, searchQuery, setSearchQuery, searchResults } = useData();
  const [localSearch, setLocalSearch] = useState(searchQuery);
  
  // Debounce search - Reduced to 150ms for faster feedback
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(localSearch);
    }, 150);
    return () => clearTimeout(handler);
  }, [localSearch, setSearchQuery]);

  const isSearching = searchQuery.trim().length > 0;

  // Memoize search results rendering to prevent unnecessary re-renders when input state changes
  const resultsContent = useMemo(() => {
    if (!isSearching) return null;
    return (
        <div className="mb-20 animate-enter">
          <h2 className="text-3xl font-bold text-stone-800 dark:text-white mb-8 px-2">Результаты поиска</h2>
          {searchResults.length > 0 ? (
             <div className="grid gap-5">
               {searchResults.map(({ item, category, section }) => (
                 <Link 
                    key={item.id}
                    to={`/category/${category.id}/section/${section.id}/item/${item.id}`}
                    className="flex items-center p-6 bg-white/60 dark:bg-white/5 rounded-3xl hover:bg-white dark:hover:bg-white/10 hover:shadow-md transition-all group border border-transparent dark:border-white/5 will-change-transform"
                 >
                    <div className={`p-4 rounded-2xl mr-6 ${
                      item.type === ItemType.ASSISTANT ? 'bg-rose-100 text-rose-500' : (item.type === ItemType.SEQUENCE ? 'bg-violet-100 text-violet-500' : 'bg-orange-100 text-orange-500')
                    }`}>
                      {item.type === ItemType.ASSISTANT ? <Bot size={24} /> : (item.type === ItemType.SEQUENCE ? <Layers size={24} /> : <FileText size={24} />)}
                    </div>
                    <div>
                      <div className="text-xl font-bold text-stone-800 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors mb-1">{item.title}</div>
                      <div className="text-sm text-stone-400 font-medium">{category.title} • {section.title}</div>
                    </div>
                 </Link>
               ))}
             </div>
          ) : (
            <div className="text-center py-16 bg-white/40 dark:bg-white/5 rounded-[2.5rem] border border-stone-200 dark:border-stone-700 border-dashed text-stone-400 text-lg">
              Ничего не найдено
            </div>
          )}
        </div>
    );
  }, [isSearching, searchResults]);

  // Memoize Categories Grid to prevent re-render on every key press in search bar
  const categoriesGrid = useMemo(() => {
    if (isSearching) return null;
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8" id="tour-categories">
          {categories.map((cat, index) => (
            <Link 
              key={cat.id} 
              to={`/category/${cat.id}`}
              // Reduced stagger delay (20ms instead of default/auto)
              className={`clean-card theme-${cat.theme || 'orange'} card-glow-${index % 5} rounded-[2.5rem] animate-enter group`}
              style={{ animationDelay: `${index * 20}ms` }} 
            >
              <div className="aspect-[16/9] w-full p-12 flex flex-col justify-between relative z-10">
                
                {/* Top Tag */}
                <div className="self-start">
                  <div className="inline-flex px-4 py-1.5 rounded-full bg-stone-100 dark:bg-white/10 border border-stone-200 dark:border-white/10 text-stone-500 dark:text-stone-400 text-xs font-bold tracking-wider uppercase mb-4 group-hover:bg-white dark:group-hover:bg-white/20 group-hover:shadow-sm transition-all">
                    Категория
                  </div>
                </div>

                {/* Content */}
                <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h2 className="text-stone-900 dark:text-white text-4xl font-bold mb-3 leading-tight tracking-tight">{cat.title}</h2>
                  <p className="text-stone-500 dark:text-stone-500 text-base font-medium opacity-90 line-clamp-2 leading-relaxed">{cat.description}</p>
                </div>

                {/* Decorative Icon */}
                 <div className="absolute top-10 right-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                   <div className="w-14 h-14 rounded-full bg-stone-50 dark:bg-white/10 flex items-center justify-center text-stone-400">
                      <ArrowRight size={28} />
                   </div>
                 </div>
              </div>
            </Link>
          ))}
        </div>
    );
  }, [isSearching, categories]);

  return (
    <Layout>
      <div className="mb-16 text-center max-w-4xl mx-auto animate-enter relative">
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/60 dark:bg-white/5 backdrop-blur-md shadow-sm border border-stone-100 dark:border-white/10 mb-8 animate-float">
          <Sparkles size={16} className="text-amber-500 fill-amber-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">База знаний</span>
        </div>
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight text-stone-900 dark:text-white mb-10 leading-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-stone-800 to-stone-600 dark:from-white dark:to-stone-400">GPT</span> 
          <span className="text-stone-300 dark:text-stone-600 px-3">·</span> 
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-rose-500">ПРАКТИК</span>
        </h1>
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto relative group z-20" id="tour-search">
           <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
              <Search size={24} className="text-stone-400 group-focus-within:text-orange-500 transition-colors" />
           </div>
           <input 
             type="text" 
             placeholder="Найти промт, ассистента или тему..." 
             className="w-full pl-16 pr-8 py-5 rounded-[1.5rem] bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-soft focus:shadow-glow focus:ring-2 focus:ring-orange-500/20 outline-none text-lg md:text-xl text-stone-800 dark:text-stone-100 placeholder-stone-400 transition-all"
             value={localSearch}
             onChange={(e) => setLocalSearch(e.target.value)}
           />
        </div>
      </div>

      {/* Render Memoized Components */}
      {isSearching ? resultsContent : categoriesGrid}

    </Layout>
  );
};

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { getCategory, categories } = useData();
  const category = useMemo(() => getCategory(categoryId || ''), [categoryId, getCategory]);

  // Calculate Neighbors
  const nav = useMemo(() => {
    if (!category || !categories) return {};
    const idx = categories.findIndex(c => c.id === category.id);
    const prev = idx > 0 ? categories[idx - 1] : null;
    const next = idx < categories.length - 1 ? categories[idx + 1] : null;
    return {
      prev: prev ? { to: `/category/${prev.id}`, title: prev.title, label: 'Предыдущая категория' } : undefined,
      next: next ? { to: `/category/${next.id}`, title: next.title, label: 'Следующая категория' } : undefined
    };
  }, [category, categories]);

  if (!category) return <Navigate to="/" />;

  return (
    <Layout breadcrumbs={[{ label: category.title }]}>
      <div className="mb-8 text-center md:text-left animate-enter">
        <h1 className="text-5xl md:text-6xl font-bold text-stone-800 dark:text-white mb-6 tracking-tight">{category.title}</h1>
        <p className="text-2xl text-stone-500 dark:text-stone-400 font-light max-w-3xl leading-relaxed">{category.description}</p>
      </div>

      {/* Navigation Top */}
      <PageNav prev={nav.prev} next={nav.next} />

      {category.sections.length === 0 ? (
        <div className="text-center py-32 bg-white/40 dark:bg-white/5 backdrop-blur-sm rounded-[2.5rem] border border-dashed border-stone-300/50 dark:border-white/10 animate-scale-in">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white dark:bg-white/10 shadow-sm text-stone-300 mb-6">
            <Sparkles size={40} />
          </div>
          <p className="text-stone-500 font-medium text-xl">В этой категории пока нет разделов</p>
        </div>
      ) : (
        <div className="grid gap-8">
          {category.sections.map((section, index) => {
            const theme = getSectionTheme(section.title);
            const ThemeIcon = theme.icon;
            
            return (
              <Link 
                key={section.id} 
                to={`/category/${category.id}/section/${section.id}`}
                className="group relative flex flex-col md:flex-row md:items-center p-10 rounded-[2.5rem] bg-white/60 dark:bg-white/5 backdrop-blur-md hover:bg-white dark:hover:bg-white/10 hover:shadow-soft transition-all duration-300 border border-white/50 dark:border-white/5 animate-enter will-change-transform"
                style={{ animationDelay: `${index * 20}ms` }}
              >
                <div className="mb-8 md:mb-0 md:mr-10">
                  <div className={`w-28 h-28 rounded-[2rem] bg-gradient-to-br ${theme.bg} ${theme.color} flex items-center justify-center shadow-inner group-hover:shadow-xl group-hover:${theme.shadow} group-hover:scale-105 transition-all duration-300`}>
                    <ThemeIcon size={48} strokeWidth={1.5} className="drop-shadow-sm" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-stone-800 dark:text-white mb-3 group-hover:text-stone-900 dark:group-hover:text-white transition-colors duration-200">{section.title}</h3>
                  <p className="text-lg text-stone-500 dark:text-stone-400 leading-relaxed font-light">
                    {section.description || 'Перейдите, чтобы увидеть материалы.'}
                  </p>
                </div>
                <div className="mt-8 md:mt-0 flex items-center justify-between md:justify-end w-full md:w-auto gap-8">
                  <div className="text-sm font-bold text-stone-300 dark:text-stone-500 uppercase tracking-widest group-hover:text-stone-400 transition-colors">
                    {section.items.length} {section.items.length === 1 ? 'элемент' : 'элемента'}
                  </div>
                  <div className="w-14 h-14 rounded-full bg-white dark:bg-white/10 border border-stone-100 dark:border-white/5 flex items-center justify-center text-stone-400 group-hover:border-orange-400 group-hover:text-orange-500 transition-all duration-300 group-hover:rotate-[-45deg]">
                    <ArrowRight size={24} />
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
  
  const category = useMemo(() => getCategory(categoryId || ''), [categoryId, getCategory]);
  const section = useMemo(() => getSection(categoryId || '', sectionId || ''), [categoryId, sectionId, getSection]);
  
  const [showInstructions, setShowInstructions] = React.useState(true);

  // Calculate Neighbors
  const nav = useMemo(() => {
    if (!category || !section) return {};
    const idx = category.sections.findIndex(s => s.id === section.id);
    const prev = idx > 0 ? category.sections[idx - 1] : null;
    const next = idx < category.sections.length - 1 ? category.sections[idx + 1] : null;
    return {
      prev: prev ? { to: `/category/${category.id}/section/${prev.id}`, title: prev.title, label: 'Предыдущий раздел' } : undefined,
      next: next ? { to: `/category/${category.id}/section/${next.id}`, title: next.title, label: 'Следующий раздел' } : undefined
    };
  }, [category, section]);

  if (!category || !section) return <Navigate to="/" />;

  return (
    <Layout breadcrumbs={[
      { label: category.title, to: `/category/${category.id}` },
      { label: section.title }
    ]}>
      <div className="mb-8 animate-enter">
        <h1 className="text-5xl font-bold text-stone-800 dark:text-white mb-4 tracking-tight">{section.title}</h1>
        <p className="text-2xl text-stone-500 dark:text-stone-400 font-light">{section.description}</p>
      </div>

      {/* Navigation Top */}
      <PageNav prev={nav.prev} next={nav.next} />

      {/* Instructions */}
      {section.instructions && (
          <div className="w-full mb-10 animate-enter" style={{ animationDelay: '0.1s' }}>
             <div className="bg-white/70 dark:bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-sm border border-white/50 dark:border-white/5 hover:shadow-lg transition-all">
                <div 
                  onClick={() => setShowInstructions(!showInstructions)}
                  className="flex items-center justify-between cursor-pointer mb-5"
                >
                  <div className="flex items-center gap-3 text-stone-800 dark:text-white font-bold">
                    <div className="p-2.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-xl">
                      <Info size={20} />
                    </div>
                    <span className="text-base">Как работать</span>
                  </div>
                  <span className="text-stone-400 text-xs font-bold uppercase tracking-wider hover:text-stone-600 transition-colors">
                    {showInstructions ? 'Свернуть' : 'Развернуть'}
                  </span>
                </div>
                
                {showInstructions && (
                  <div className="text-base text-stone-600 dark:text-stone-300 leading-relaxed animate-fadeIn">
                    {section.instructions}
                  </div>
                )}
             </div>
          </div>
        )}

      <div className="flex flex-col gap-10 items-start">
        {/* Main Content */}
        <div className="w-full grid gap-5">
          {section.items.map((item, index) => (
            <div 
              key={item.id}
              className="group flex items-center p-8 bg-white/60 dark:bg-white/5 backdrop-blur-sm rounded-[2.5rem] hover:bg-white dark:hover:bg-white/10 hover:shadow-soft transition-all duration-300 border border-white/50 dark:border-white/5 animate-enter hover:-translate-y-1 relative will-change-transform"
              style={{ animationDelay: `${index * 20}ms` }}
            >
               <Link to={`/category/${category.id}/section/${section.id}/item/${item.id}`} className="absolute inset-0 z-0" />
              <div className={`w-16 h-16 rounded-[1.2rem] flex items-center justify-center mr-8 transition-all duration-300 relative z-10 pointer-events-none ${
                item.type === ItemType.ASSISTANT 
                  ? 'bg-rose-50 text-rose-500 group-hover:bg-rose-400 group-hover:text-white group-hover:shadow-lg group-hover:shadow-rose-200' 
                  : (item.type === ItemType.SEQUENCE 
                     ? 'bg-violet-50 text-violet-500 group-hover:bg-violet-400 group-hover:text-white group-hover:shadow-lg group-hover:shadow-violet-200'
                     : 'bg-orange-50 text-orange-500 group-hover:bg-orange-400 group-hover:text-white group-hover:shadow-lg group-hover:shadow-orange-200')
              }`}>
                {item.type === ItemType.ASSISTANT ? <Bot size={30} /> : (item.type === ItemType.SEQUENCE ? <Layers size={30} /> : <FileText size={30} />)}
              </div>
              <div className="flex-1 min-w-0 relative z-10 pointer-events-none">
                <h3 className="font-bold text-xl text-stone-800 dark:text-white mb-2 truncate group-hover:text-stone-900 dark:group-hover:text-white transition-colors">{item.title}</h3>
                <p className="text-base text-stone-400 truncate group-hover:text-stone-500 transition-colors">{item.description}</p>
              </div>
              
              <div className="flex items-center gap-4 relative z-20">
                 <Tooltip content={isFavorite(item.id) ? "Убрать из избранного" : "В избранное"} position="left">
                   <button 
                      onClick={(e) => { e.preventDefault(); toggleFavorite(item.id); }}
                      className={`p-3 rounded-full transition-all ${isFavorite(item.id) ? 'text-rose-500 bg-rose-50' : 'text-stone-300 hover:text-rose-400 hover:bg-stone-50 dark:hover:bg-white/10'}`}
                   >
                      <Heart size={22} className={isFavorite(item.id) ? "fill-rose-500" : ""} />
                   </button>
                 </Tooltip>
                 <div className="opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 pointer-events-none">
                    <div className="w-12 h-12 rounded-full bg-stone-50 dark:bg-white/10 flex items-center justify-center text-stone-400">
                        <ArrowRight size={20} />
                    </div>
                 </div>
              </div>
            </div>
          ))}
          {section.items.length === 0 && (
            <div className="p-16 text-center bg-white/40 dark:bg-white/5 rounded-[2.5rem] border border-dashed border-stone-300 dark:border-stone-700 text-stone-400 text-lg animate-scale-in">
              В этом разделе пока нет материалов.
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

const ItemDetail = () => {
  const { categoryId, sectionId, itemId } = useParams<{ categoryId: string; sectionId: string; itemId: string }>();
  const { getCategory, getSection, getItem, toggleFavorite, isFavorite } = useData();
  
  const category = useMemo(() => getCategory(categoryId || ''), [categoryId, getCategory]);
  const section = useMemo(() => getSection(categoryId || '', sectionId || ''), [categoryId, sectionId, getSection]);
  const item = useMemo(() => getItem(categoryId || '', sectionId || '', itemId || ''), [categoryId, sectionId, itemId, getItem]);

  // Timeline State for Sequence
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  // Reset timeline when item changes
  useEffect(() => {
    setCompletedSteps(new Set());
  }, [item?.id]);

  const toggleStep = (idx: number) => {
    const newSet = new Set(completedSteps);
    if (newSet.has(idx)) {
      newSet.delete(idx);
    } else {
      newSet.add(idx);
    }
    setCompletedSteps(newSet);
  };

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
      
      <div className="flex flex-col 2xl:flex-row gap-10 2xl:gap-20 items-start max-w-[1400px] mx-auto">
        
        {/* LEFT COLUMN: Context, Instructions, Description */}
        <div className="w-full 2xl:w-[35%] flex flex-col gap-8 animate-enter">
          
          {/* Header Meta */}
          <div className="flex items-center justify-between">
             <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-wide shadow-sm border border-white/50 backdrop-blur-sm ${
              isAssistant 
                ? 'bg-rose-50 text-rose-600' 
                : (isSequence ? 'bg-violet-50 text-violet-600' : 'bg-orange-50 text-orange-600')
             }`}>
              {isAssistant ? <Bot size={18} /> : (isSequence ? <Layers size={18} /> : <FileText size={18} />)}
              {isAssistant ? 'GPT ASSISTANT' : (isSequence ? 'SEQUENCE' : 'PROMPT')}
             </div>

             <Tooltip content={favorite ? "Убрать из избранного" : "В избранное"} position="left">
               <button 
                 onClick={() => toggleFavorite(item.id)}
                 className={`p-3 rounded-full transition-all shadow-sm border ${favorite ? 'bg-rose-50 border-rose-200 text-rose-500' : 'bg-white dark:bg-white/5 border-stone-100 dark:border-white/10 text-stone-400 hover:text-rose-500 hover:border-rose-100'}`}
               >
                  <Heart size={24} className={favorite ? "fill-rose-500" : ""} />
               </button>
             </Tooltip>
          </div>

          {/* Title & Desc */}
          <div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-stone-800 dark:text-white mb-6 leading-tight tracking-tight text-left">
              {item.title}
            </h1>
            <p className="text-xl text-stone-500 dark:text-stone-400 leading-relaxed font-light text-left">
              {item.description}
            </p>
          </div>

          {/* Instructions Block */}
          {item.instructions && (
            <section className="bg-white/60 dark:bg-white/5 backdrop-blur-md rounded-[2.5rem] p-8 shadow-sm border border-white/50 dark:border-white/10 mt-4">
              <h3 className="text-xs font-black text-stone-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                <Info size={16} />
                Инструкция
              </h3>
              <div className="prose prose-stone dark:prose-invert prose-lg max-w-none text-stone-600 dark:text-stone-300 leading-loose whitespace-pre-line">
                {item.instructions}
              </div>
            </section>
          )}
        </div>

        {/* RIGHT COLUMN: The Prompt (Sticky) */}
        <div className="w-full 2xl:w-[65%] 2xl:sticky 2xl:top-32 animate-enter" style={{ animationDelay: '0.1s' }}>
          
          {isSequence ? (
             <div className="relative pl-6 pb-20">
               {/* Interactive Timeline Line */}
               <div className="absolute left-6 top-8 bottom-0 w-1 bg-gradient-to-b from-violet-200 via-stone-200 to-transparent dark:from-violet-900/50 dark:via-white/5 z-0 rounded-full" />
               
               {(item.subPrompts || []).map((sub, idx) => {
                 const isCompleted = completedSteps.has(idx);
                 // Active is the first uncompleted step, OR if this step is checked (allow looking back)
                 // But for focus, we want the *first uncompleted* to be the "Active" one.
                 // Actually, simpler logic:
                 // Locked: If previous step is NOT completed.
                 const isLocked = idx > 0 && !completedSteps.has(idx - 1);
                 const isActive = !isCompleted && !isLocked;

                 return (
                   <div 
                      key={idx} 
                      className={`relative z-10 mb-16 last:mb-0 transition-all duration-500 ${isLocked ? 'opacity-40 blur-[2px] pointer-events-none grayscale' : 'opacity-100'}`}
                   >
                     {/* Header with Connector */}
                     <div className="flex items-center gap-6 mb-6">
                       <button 
                          onClick={() => toggleStep(idx)}
                          disabled={isLocked}
                          className={`
                            w-12 h-12 rounded-full flex items-center justify-center border-4 shadow-lg transition-all duration-300 z-20 relative
                            ${isCompleted 
                               ? 'bg-emerald-500 border-emerald-200 text-white scale-90' 
                               : (isActive ? 'bg-white dark:bg-stone-800 border-violet-500 text-violet-500 scale-110 shadow-violet-200' : 'bg-stone-100 dark:bg-white/10 border-stone-200 dark:border-stone-700 text-stone-400')
                            }
                          `}
                       >
                         {isCompleted ? <Check size={20} strokeWidth={4} /> : (isLocked ? <Lock size={18} /> : <div className="font-bold text-lg">{idx + 1}</div>)}
                       </button>

                       <div className="flex-1">
                          <h4 className={`text-2xl font-bold transition-colors ${isCompleted ? 'text-stone-400 line-through' : 'text-stone-800 dark:text-white'}`}>
                            {sub.title}
                          </h4>
                          {isActive && (
                            <div className="text-violet-500 text-xs font-bold uppercase tracking-widest mt-1 animate-pulse">Текущий шаг</div>
                          )}
                       </div>

                       {/* Action: Checkbox equivalent */}
                       <div className="mr-2">
                          <button 
                            onClick={() => toggleStep(idx)}
                            className={`px-5 py-2 rounded-xl text-sm font-bold border transition-all flex items-center gap-2 ${
                              isCompleted 
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100' 
                              : 'bg-white text-stone-500 border-stone-200 hover:border-violet-300 hover:text-violet-600'
                            }`}
                          >
                             {isCompleted ? 'Выполнено' : 'Отметить'}
                             {isCompleted ? <CheckCircle size={16} /> : <Circle size={16} />}
                          </button>
                       </div>
                     </div>

                     {/* Content Card */}
                     <div className={`pl-18 transition-all duration-500 ${isCompleted ? 'opacity-50 scale-[0.98]' : 'scale-100'}`}>
                        {/* We use a div wrapper to control visual state of the renderer */}
                        <div className={`${isActive ? 'ring-4 ring-violet-100 dark:ring-violet-900/20 rounded-[2.2rem]' : ''}`}>
                          <PromptRenderer content={sub.content} isAssistant={false} title={sub.title} />
                        </div>
                     </div>
                   </div>
                 );
               })}
               
               {/* Final Success Message if all steps done */}
               {item.subPrompts && item.subPrompts.length > 0 && completedSteps.size === item.subPrompts.length && (
                  <div className="mt-12 ml-6 p-8 bg-emerald-50 dark:bg-emerald-900/20 rounded-[2rem] border border-emerald-100 dark:border-emerald-500/20 text-center animate-enter">
                     <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-800 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-100 mx-auto mb-4 shadow-sm">
                        <Sparkles size={32} />
                     </div>
                     <h3 className="text-2xl font-bold text-emerald-800 dark:text-emerald-200 mb-2">Цепочка завершена!</h3>
                     <p className="text-emerald-700 dark:text-emerald-300">Вы успешно прошли все этапы.</p>
                  </div>
               )}
             </div>
          ) : (
            <>
              <PromptRenderer content={item.content} isAssistant={isAssistant} />

              {/* Sub-prompts for Assistants */}
              {isAssistant && item.subPrompts && item.subPrompts.length > 0 && (
                <div className="mt-10">
                  <h3 className="text-2xl font-bold text-stone-800 dark:text-white mb-8 pl-2">Дополнительные промты</h3>
                  <div className="grid gap-6">
                    {item.subPrompts.map((sub, idx) => (
                      <div key={idx} className="bg-white/80 dark:bg-white/5 backdrop-blur-md rounded-[2rem] p-8 hover:shadow-soft transition-all duration-300 border border-stone-100/50 dark:border-white/5">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                          <h4 className="font-bold text-stone-800 dark:text-white text-lg">{sub.title}</h4>
                          <CopyButton text={sub.content} label="Копировать" className="scale-100" />
                        </div>
                        <div className="font-mono text-sm text-stone-500 dark:text-stone-400 leading-loose p-6 bg-stone-50 dark:bg-black/20 rounded-2xl border border-stone-100 dark:border-white/5">
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
        <GlobalToastContainer />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/instructions" element={<InstructionsPage />} />
          <Route path="/instructions/:articleId" element={<ArticleDetailPage />} />
          <Route path="/carousel" element={<CarouselPage />} />
          
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