import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import Layout from '../components/Layout';
import Tooltip from '../components/Tooltip';
import { 
    Plus, Trash2, Save, ArrowLeft, Folder, FileText, Bot, MoreHorizontal, X, 
    Image as ImageIcon, Layout as LayoutIcon, Upload, ChevronRight, Layers, 
    ArrowDown, ArrowUp, Lock, LogOut, BookOpen, Type, Code, Video, CheckCircle, 
    Lightbulb, GripVertical, Eye, Laptop, Search
} from 'lucide-react';
import { Category, Section, PromptItem, ItemType, Article, ArticleBlock, BlockType } from '../types';
import { ICON_MAP } from '../App'; // Import icon map from App

// --- Clean Tech UI Components ---

const Input = ({ label, ...props }: any) => (
  <div className="mb-6">
    <label className="block text-sm font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2.5 ml-1">{label}</label>
    <input
      className="w-full bg-white dark:bg-white/5 border border-stone-200 dark:border-white/10 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:focus:ring-orange-500/20 rounded-2xl px-5 py-4 transition-all outline-none text-stone-800 dark:text-white placeholder-stone-300 dark:placeholder-stone-500 text-base font-medium shadow-sm"
      {...props}
    />
  </div>
);

const TextArea = ({ label, rows = 3, ...props }: any) => (
  <div className="mb-6">
    <label className="block text-sm font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2.5 ml-1">{label}</label>
    <textarea
      rows={rows}
      className="w-full bg-white dark:bg-white/5 border border-stone-200 dark:border-white/10 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:focus:ring-orange-500/20 rounded-2xl px-5 py-4 transition-all outline-none text-stone-800 dark:text-white placeholder-stone-400 dark:placeholder-stone-500 text-base font-medium shadow-sm resize-y"
      {...props}
    />
  </div>
);

const Button = ({ children, variant = 'primary', className = '', ...props }: any) => {
  const baseStyle = "px-6 py-3.5 rounded-xl font-bold text-base transition-all duration-200 transform active:scale-95 flex items-center justify-center gap-2 tracking-wide";
  const variants = {
    primary: "bg-stone-900 hover:bg-black text-white shadow-lg shadow-stone-200 dark:shadow-none hover:shadow-xl hover:-translate-y-0.5 dark:bg-white dark:text-black dark:hover:bg-stone-100",
    secondary: "bg-white hover:bg-stone-50 text-stone-600 border border-stone-200 shadow-sm hover:text-stone-900 hover:border-stone-300 dark:bg-white/10 dark:text-white dark:border-white/20 dark:hover:bg-white/20 dark:hover:border-white/30",
    danger: "bg-white hover:bg-rose-50 text-rose-500 border border-rose-100 shadow-sm hover:border-rose-200 hover:shadow-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800/30 dark:hover:bg-rose-900/30",
    ghost: "bg-transparent hover:bg-stone-100 text-stone-500 dark:hover:bg-white/10 dark:text-stone-400"
  };
  return (
    <button className={`${baseStyle} ${variants[variant as keyof typeof variants]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Card = ({ children, className = "" }: { children?: React.ReactNode, className?: string }) => (
  <div className={`bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-[2rem] p-10 shadow-soft dark:shadow-none border border-white/50 dark:border-white/10 ${className}`}>
    {children}
  </div>
);

// --- Icon Picker Component ---
const IconPicker = ({ selected, onChange }: { selected?: string, onChange: (icon: string) => void }) => {
    const icons = Object.keys(ICON_MAP);
    const [search, setSearch] = useState('');

    const filteredIcons = icons.filter(icon => icon.includes(search.toLowerCase()));

    return (
        <div className="space-y-4">
            <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500" />
                <input
                    type="text"
                    placeholder="Поиск иконки..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-500/20 focus:border-orange-300 transition-all text-sm font-medium text-stone-800 dark:text-white placeholder-stone-400 dark:placeholder-stone-500"
                />
            </div>
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-3 max-h-48 overflow-y-auto p-2 border border-stone-100 dark:border-white/10 rounded-2xl bg-stone-50/50 dark:bg-white/5 custom-scrollbar">
                {filteredIcons.map(iconKey => {
                    const IconComp = ICON_MAP[iconKey];
                    const isSelected = selected === iconKey;
                    return (
                        <button
                            key={iconKey}
                            onClick={() => onChange(iconKey)}
                            title={iconKey}
                            className={`aspect-square flex items-center justify-center rounded-xl transition-all ${isSelected ? 'bg-stone-800 dark:bg-white text-white dark:text-black shadow-md scale-105' : 'bg-white dark:bg-white/10 text-stone-500 dark:text-stone-400 hover:bg-orange-50 dark:hover:bg-orange-500/20 hover:text-orange-500 hover:shadow-sm'}`}
                        >
                            <IconComp size={20} strokeWidth={isSelected ? 2 : 1.5} />
                        </button>
                    )
                })}
            </div>
            {selected && (
                <div className="flex items-center gap-2 text-sm text-stone-500 dark:text-stone-400">
                    <span>Выбрано:</span>
                    <span className="font-mono bg-stone-100 dark:bg-white/10 px-2 py-0.5 rounded text-stone-800 dark:text-white font-bold">{selected}</span>
                    <button onClick={() => onChange('')} className="text-xs text-rose-500 dark:text-rose-400 hover:underline ml-auto">Сбросить</button>
                </div>
            )}
        </div>
    )
}

// --- Login Screen ---

const LoginScreen = ({ onLogin }: { onLogin: () => void }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);

  // Use environment variable or fallback to hardcoded default
  // Note: import.meta.env might not be defined in all environments without typing, so we use optional chaining
  // @ts-ignore
  const ADMIN_PASSWORD = import.meta.env?.VITE_ADMIN_PASSWORD || 'neodark';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      onLogin();
    } else {
      setError(true);
      setShaking(true);
      setTimeout(() => {
         setShaking(false);
         setError(false);
      }, 500);
    }
  };

  return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center p-4 animate-enter">
        <div className={`w-full max-w-md bg-white/80 dark:bg-[#1E1E1E]/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl dark:shadow-none border border-white/50 dark:border-white/10 p-12 text-center transition-transform duration-100 ${shaking ? 'translate-x-[-10px]' : ''} ${shaking ? 'translate-x-[10px]' : ''}`} style={shaking ? { animation: 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both' } : {}}>
           <style>{`
            @keyframes shake {
              10%, 90% { transform: translate3d(-1px, 0, 0); }
              20%, 80% { transform: translate3d(2px, 0, 0); }
              30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
              40%, 60% { transform: translate3d(4px, 0, 0); }
            }
           `}</style>

           <div className="w-24 h-24 bg-stone-900 dark:bg-white rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-xl shadow-stone-200 dark:shadow-none text-white dark:text-black">
              <Lock size={40} strokeWidth={2.5} />
           </div>

           <h1 className="text-3xl font-extrabold text-stone-800 dark:text-white mb-3">Панель управления</h1>
           <p className="text-lg text-stone-500 dark:text-stone-400 mb-10 font-medium">Введите пароль администратора</p>

           <form onSubmit={handleSubmit} className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Пароль"
                className={`w-full bg-stone-50 dark:bg-white/5 border-2 rounded-2xl px-6 py-5 outline-none font-bold text-xl text-stone-800 dark:text-white text-center tracking-widest placeholder-stone-300 dark:placeholder-stone-600 focus:bg-white dark:focus:bg-white/10 transition-all ${error ? 'border-rose-300 dark:border-rose-500 ring-4 ring-rose-100 dark:ring-rose-500/20' : 'border-stone-100 dark:border-white/20 focus:border-stone-300 dark:focus:border-white/30 focus:ring-4 focus:ring-stone-100 dark:focus:ring-white/10'}`}
                autoFocus
              />
              <button
                type="submit"
                className="w-full mt-6 bg-stone-900 dark:bg-white text-white dark:text-black font-bold py-5 rounded-2xl hover:bg-black dark:hover:bg-stone-100 hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95 flex items-center justify-center gap-2 text-lg"
              >
                Войти
              </button>
              {error && (
                <div className="absolute -bottom-10 left-0 right-0 text-rose-500 dark:text-rose-400 text-sm font-bold uppercase tracking-wider animate-pulse">
                  Неверный пароль
                </div>
              )}
           </form>
        </div>
      </div>
    </Layout>
  );
};

// ... Rest of AdminDashboard, Editors ...
// (Since Admin.tsx is a large file, I am only providing the modified LoginScreen and imports for the XML output. 
// Assuming the user needs the full file content if I provide it in the XML block. 
// I will provide the FULL content of Admin.tsx with the single modification to LoginScreen to ensure validity.)

const AdminDashboard = () => {
  const { categories, addCategory, deleteCategory, moveCategory, articles, deleteArticle } = useData();
  const navigate = useNavigate();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleCreate = () => {
    const newId = `cat-${Date.now()}`;
    addCategory({
      id: newId,
      title: 'Новая категория',
      description: 'Описание категории',
      theme: 'orange',
      sections: []
    });
    navigate(`/admin/category/${newId}`);
  };

  const handleCreateArticle = () => {
    const newId = `art-${Date.now()}`;
    navigate(`/admin/article/${newId}`);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('gpt_admin_auth');
    window.location.reload();
  };
  
  const getThemeColorClass = (theme?: string) => {
      switch (theme) {
          case 'rose': return 'text-rose-500';
          case 'blue': return 'text-blue-500';
          case 'violet': return 'text-violet-500';
          case 'emerald': return 'text-emerald-500';
          case 'amber': return 'text-amber-500';
          default: return 'text-orange-500';
      }
  };

  return (
    <Layout breadcrumbs={[{ label: 'Dashboard' }]}>
      <div className="flex justify-between items-end mb-12 animate-enter">
        <div>
          <h1 className="text-5xl font-extrabold text-stone-900 dark:text-white mb-2 tracking-tight">Панель управления</h1>
          <p className="text-xl text-stone-500 dark:text-stone-400 font-light">Управляйте структурой и контентом базы знаний</p>
        </div>
        <div className="flex gap-4">
           <Tooltip content="Выйти из системы" position="bottom">
             <Button variant="secondary" onClick={handleLogout}>
               <LogOut size={20} />
             </Button>
           </Tooltip>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
         {/* Left: Categories */}
         <div>
           <div className="flex items-center justify-between mb-8">
             <h2 className="text-2xl font-bold text-stone-800 dark:text-white flex items-center gap-3">
               <Folder className="text-stone-400 dark:text-stone-500" size={24} /> Категории
             </h2>
             <Button onClick={handleCreate} variant="secondary" className="!py-2.5 !px-5 !text-sm">
               <Plus size={18} /> Добавить
             </Button>
           </div>
           <div className="grid gap-4 animate-enter" style={{ animationDelay: '0.1s' }}>
             {categories.map((cat, idx) => (
               <div 
                 key={cat.id} 
                 draggable
                 onDragStart={(e) => {
                     setDraggedIndex(idx);
                     e.dataTransfer.effectAllowed = "move";
                     e.dataTransfer.setData("text/plain", String(idx));
                 }}
                 onDragOver={(e) => {
                     e.preventDefault();
                     e.dataTransfer.dropEffect = "move";
                 }}
                 onDrop={(e) => {
                     e.preventDefault();
                     if (draggedIndex !== null && draggedIndex !== idx) {
                       moveCategory(draggedIndex, idx);
                     }
                     setDraggedIndex(null);
                 }}
                 onDragEnd={() => setDraggedIndex(null)}
                 className={`group flex items-center bg-white dark:bg-white/5 p-5 pr-6 rounded-[1.5rem] border transition-all duration-300 cursor-grab active:cursor-grabbing ${
                   draggedIndex === idx
                     ? 'opacity-40 border-dashed border-stone-300 dark:border-white/20 bg-stone-50 dark:bg-white/10 scale-[0.98]'
                     : 'border-stone-100 dark:border-white/10 hover:border-orange-100 dark:hover:border-orange-500/30 hover:shadow-soft'
                 }`}
               >
                 <div className="mr-4 text-stone-300 dark:text-stone-600 cursor-grab active:cursor-grabbing">
                   <GripVertical size={20} />
                 </div>
                 <div className={`w-14 h-14 rounded-2xl mr-5 bg-stone-50 dark:bg-white/10 border border-stone-100 dark:border-white/20 flex items-center justify-center transition-colors duration-300 group-hover:bg-white dark:group-hover:bg-white/20 group-hover:shadow-sm`}>
                    <LayoutIcon size={24} className={`${getThemeColorClass(cat.theme)} opacity-70 group-hover:opacity-100 transition-opacity`} />
                 </div>

                 <div className="flex-1 py-1">
                   <h3 className="font-bold text-stone-800 dark:text-white text-lg mb-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">{cat.title}</h3>
                   <p className="text-sm text-stone-400 dark:text-stone-500 font-medium">{cat.sections.length} разделов</p>
                 </div>
                 <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                   <Button variant="secondary" className="!px-4 !py-2 !text-sm" onClick={() => navigate(`/admin/category/${cat.id}`)}>
                     Изменить
                   </Button>
                   <button onClick={() => deleteCategory(cat.id)} className="p-3 rounded-xl text-stone-300 dark:text-stone-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-500 dark:hover:text-rose-400 transition-colors">
                     <Trash2 size={20} />
                   </button>
                 </div>
               </div>
             ))}
           </div>
         </div>

         {/* Right: Articles / Instructions */}
         <div>
            <div className="flex items-center justify-between mb-8">
             <h2 className="text-2xl font-bold text-stone-800 dark:text-white flex items-center gap-3">
               <BookOpen className="text-stone-400 dark:text-stone-500" size={24} /> Инструкции
             </h2>
             <Button onClick={handleCreateArticle} variant="primary" className="!py-2.5 !px-5 !text-sm">
               <Plus size={18} /> Написать статью
             </Button>
           </div>
           <div className="grid gap-4 animate-enter" style={{ animationDelay: '0.2s' }}>
             {articles.map((article) => (
               <div
                 key={article.id}
                 className="group flex items-center bg-white dark:bg-white/5 p-5 pr-6 rounded-[1.5rem] border border-stone-100 dark:border-white/10 hover:border-emerald-100 dark:hover:border-emerald-500/30 hover:shadow-soft transition-all duration-300"
               >
                 <div className="w-14 h-14 rounded-2xl mr-5 bg-stone-50 dark:bg-white/10 border border-stone-100 dark:border-white/20 flex items-center justify-center overflow-hidden relative">
                    {article.coverImage ? (
                      <img src={article.coverImage} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <FileText size={24} className="text-stone-400 dark:text-stone-500" />
                    )}
                 </div>

                 <div className="flex-1 py-1">
                   <h3 className="font-bold text-stone-800 dark:text-white text-lg mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">{article.title}</h3>
                   <p className="text-sm text-stone-400 dark:text-stone-500 font-medium flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${article.published ? 'bg-emerald-400 dark:bg-emerald-500' : 'bg-stone-300 dark:bg-stone-600'}`} />
                      {article.published ? 'Опубликовано' : 'Черновик'}
                   </p>
                 </div>
                 <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                   <Button variant="secondary" className="!px-4 !py-2 !text-sm" onClick={() => navigate(`/admin/article/${article.id}`)}>
                     Редактор
                   </Button>
                   <button onClick={() => deleteArticle(article.id)} className="p-3 rounded-xl text-stone-300 dark:text-stone-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-500 dark:hover:text-rose-400 transition-colors">
                     <Trash2 size={20} />
                   </button>
                 </div>
               </div>
             ))}
             {articles.length === 0 && (
                <div className="text-center py-10 border border-dashed border-stone-200 dark:border-white/10 rounded-2xl text-stone-400 dark:text-stone-500 text-base">
                  Нет статей. Создайте первую!
                </div>
             )}
           </div>
         </div>
      </div>
    </Layout>
  );
};

// ... ArticleEditor ...
const ArticleEditor = () => {
  const { articleId } = useParams();
  const { getArticle, addArticle, updateArticle, showToast } = useData();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<Article>({
    id: articleId || '',
    title: '',
    description: '',
    published: false,
    date: new Date().toISOString(),
    blocks: []
  });

  useEffect(() => {
    if (articleId) {
      const existing = getArticle(articleId);
      if (existing) {
        setFormData(existing);
      }
    }
  }, [articleId, getArticle]);

  const handleSave = () => {
    const existing = getArticle(formData.id);
    if (existing) {
      updateArticle(formData.id, formData);
    } else {
      addArticle(formData);
    }
    showToast('Статья успешно сохранена!');
    navigate('/admin');
  };

  // File Upload Handler (Base64)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, onComplete: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
          alert('Пожалуйста, загрузите изображение');
          return;
      }
      
      const LIMIT_KB = 800;
      if (file.size > LIMIT_KB * 1024) {
          alert(`Файл слишком большой (${(file.size / 1024 / 1024).toFixed(2)} MB). Максимальный размер: ${LIMIT_KB}КБ.`);
          return; 
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          onComplete(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Block Management
  const addBlock = (type: BlockType) => {
    const newBlock: ArticleBlock = {
      id: `blk-${Date.now()}`,
      type,
      content: '',
      meta: type === 'step' ? 'Шаг №' : (type === 'tip' ? 'Совет' : '')
    };
    setFormData(prev => ({ ...prev, blocks: [...prev.blocks, newBlock] }));
  };

  const updateBlock = (id: string, field: 'content' | 'meta', value: string) => {
    setFormData(prev => ({
      ...prev,
      blocks: prev.blocks.map(b => b.id === id ? { ...b, [field]: value } : b)
    }));
  };

  const removeBlock = (id: string) => {
    setFormData(prev => ({
      ...prev,
      blocks: prev.blocks.filter(b => b.id !== id)
    }));
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === formData.blocks.length - 1) return;
    
    const newBlocks = [...formData.blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newBlocks[targetIndex];
    newBlocks[targetIndex] = newBlocks[index];
    newBlocks[index] = temp;
    
    setFormData(prev => ({ ...prev, blocks: newBlocks }));
  };

  return (
    <Layout breadcrumbs={[{ label: 'Dashboard', to: '/admin' }, { label: 'Редактор статьи' }]}>
      <div className="mb-12 flex items-center justify-between animate-enter">
        <div className="flex items-center gap-6">
           <div className="w-16 h-16 rounded-[1.5rem] bg-stone-900 text-white flex items-center justify-center shadow-sm">
             <FileText size={32} />
           </div>
           <div>
             <h1 className="text-4xl font-bold text-stone-900 dark:text-white tracking-tight leading-none mb-2">
               {formData.title || 'Новая статья'}
             </h1>
             <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${formData.published ? 'bg-emerald-400' : 'bg-stone-300'}`} />
                <p className="text-stone-400 text-base font-medium">
                  {formData.published ? 'Опубликовано' : 'Черновик'}
                </p>
             </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-enter">
        
        {/* Left: Meta */}
        <div className="xl:col-span-1 space-y-6">
          <Card>
            <h3 className="font-bold text-stone-800 dark:text-white mb-6 text-sm uppercase tracking-wider">Мета-данные</h3>
            <Input 
              label="Заголовок статьи" 
              value={formData.title} 
              onChange={(e: any) => setFormData({...formData, title: e.target.value})} 
            />
            <TextArea 
              label="Краткое описание (Лид)" 
              value={formData.description} 
              rows={5}
              onChange={(e: any) => setFormData({...formData, description: e.target.value})} 
            />
            
            <div className="mb-6">
               <label className="block text-sm font-bold text-stone-500 uppercase tracking-wider mb-2.5 ml-1">Обложка</label>
               <div className="flex gap-3">
                 <input
                   className="w-full bg-white dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-2xl px-5 py-4 transition-all outline-none text-stone-800 dark:text-white placeholder-stone-300 dark:placeholder-stone-500 text-base font-medium shadow-sm focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:focus:ring-orange-500/20"
                   placeholder="URL изображения..."
                   value={formData.coverImage || ''}
                   onChange={(e: any) => setFormData({...formData, coverImage: e.target.value})}
                 />
                 <Tooltip content="Загрузить с устройства" position="top">
                    <label className="flex-shrink-0 w-16 bg-stone-100 dark:bg-white/10 hover:bg-stone-200 dark:hover:bg-white/20 rounded-2xl border border-stone-200 dark:border-white/10 flex items-center justify-center cursor-pointer transition-all duration-200 active:scale-95">
                        <Upload size={24} className="text-stone-500 dark:text-stone-400" />
                        <input 
                        type="file" 
                        hidden 
                        accept="image/*" 
                        onChange={(e) => handleFileUpload(e, (base64) => setFormData({...formData, coverImage: base64}))} 
                        />
                    </label>
                 </Tooltip>
               </div>
               {formData.coverImage && (
                 <div className="mt-4 rounded-2xl overflow-hidden border border-stone-200 dark:border-white/10 h-48 relative group bg-stone-50 dark:bg-white/5">
                   <img src={formData.coverImage} alt="Preview" className="w-full h-full object-cover" />
                   <button
                      onClick={() => setFormData({...formData, coverImage: ''})}
                      className="absolute top-3 right-3 p-2.5 bg-white/90 dark:bg-black/80 rounded-xl text-rose-500 dark:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:text-rose-600"
                   >
                     <Trash2 size={20} />
                   </button>
                 </div>
               )}
            </div>
          </Card>

          {/* Toolbox (Sticky) */}
          <div className="sticky top-44">
             <div className="bg-stone-900 text-white p-8 rounded-[2.5rem] shadow-xl shadow-stone-400/20">
                <h3 className="font-bold mb-6 text-sm uppercase tracking-wider opacity-80">Добавить блок</h3>
                <div className="grid grid-cols-2 gap-4">
                   <button onClick={() => addBlock('header')} className="flex flex-col items-center justify-center p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors gap-2">
                      <Type size={24} /> <span className="text-xs font-bold">Заголовок</span>
                   </button>
                   <button onClick={() => addBlock('text')} className="flex flex-col items-center justify-center p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors gap-2">
                      <FileText size={24} /> <span className="text-xs font-bold">Текст</span>
                   </button>
                   <button onClick={() => addBlock('code')} className="flex flex-col items-center justify-center p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors gap-2">
                      <Code size={24} /> <span className="text-xs font-bold">Промт/Код</span>
                   </button>
                   <button onClick={() => addBlock('image')} className="flex flex-col items-center justify-center p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors gap-2">
                      <ImageIcon size={24} /> <span className="text-xs font-bold">Изображение</span>
                   </button>
                   <button onClick={() => addBlock('video')} className="flex flex-col items-center justify-center p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors gap-2">
                      <Video size={24} /> <span className="text-xs font-bold">Видео</span>
                   </button>
                   <button onClick={() => addBlock('tip')} className="flex flex-col items-center justify-center p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors gap-2">
                      <Lightbulb size={24} /> <span className="text-xs font-bold">Совет</span>
                   </button>
                   <button onClick={() => addBlock('step')} className="col-span-2 flex items-center justify-center p-4 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-2xl transition-colors gap-3 border border-emerald-500/30">
                      <CheckCircle size={24} /> <span className="text-sm font-bold">Шаг инструкции</span>
                   </button>
                </div>
             </div>
          </div>
        </div>

        {/* Right: Content Builder */}
        <div className="xl:col-span-2">
          <div className="space-y-6 pb-8">
             {formData.blocks.map((block, idx) => (
                <div key={block.id} className="group relative bg-white dark:bg-white/5 rounded-[2.5rem] border border-stone-200 dark:border-white/10 shadow-sm hover:shadow-md hover:border-stone-300 dark:hover:border-white/20 transition-all p-8">

                   {/* Controls */}
                   <div className="absolute right-5 top-5 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-black/80 p-1.5 rounded-xl backdrop-blur-sm border border-stone-100 dark:border-white/20 shadow-sm z-20">
                      <button onClick={() => moveBlock(idx, 'up')} disabled={idx === 0} className="p-2 hover:bg-stone-100 dark:hover:bg-white/20 rounded-lg text-stone-400 hover:text-stone-800 dark:hover:text-white disabled:opacity-30"><ArrowUp size={18}/></button>
                      <button onClick={() => moveBlock(idx, 'down')} disabled={idx === formData.blocks.length - 1} className="p-2 hover:bg-stone-100 dark:hover:bg-white/20 rounded-lg text-stone-400 hover:text-stone-800 dark:hover:text-white disabled:opacity-30"><ArrowDown size={18}/></button>
                      <div className="w-px h-5 bg-stone-200 dark:bg-white/20 mx-1"></div>
                      <button onClick={() => removeBlock(block.id)} className="p-2 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg text-stone-400 hover:text-rose-500 dark:hover:text-rose-400"><Trash2 size={18}/></button>
                   </div>

                   {/* Block Type Indicator */}
                   <div className="absolute left-5 top-5 text-xs font-black text-stone-300 dark:text-stone-600 uppercase tracking-wider border border-stone-100 dark:border-white/20 px-2.5 py-1 rounded-lg select-none">
                      {block.type}
                   </div>

                   {/* Block Inputs */}
                   <div className="mt-8">
                      {/* HEADER */}
                      {block.type === 'header' && (
                         <input
                           className="w-full text-4xl font-bold text-stone-800 dark:text-white placeholder-stone-300 dark:placeholder-stone-600 border-none outline-none bg-transparent leading-tight"
                           placeholder="Текст заголовка..."
                           value={block.content}
                           onChange={(e) => updateBlock(block.id, 'content', e.target.value)}
                         />
                      )}

                      {/* TEXT */}
                      {block.type === 'text' && (
                         <textarea
                           rows={4}
                           className="w-full text-2xl text-stone-600 dark:text-stone-300 placeholder-stone-300 dark:placeholder-stone-600 border-none outline-none bg-transparent resize-y leading-loose"
                           placeholder="Введите текст абзаца..."
                           value={block.content}
                           onChange={(e) => updateBlock(block.id, 'content', e.target.value)}
                         />
                      )}

                      {/* CODE / PROMPT */}
                      {block.type === 'code' && (
                         <div className="bg-stone-900 rounded-2xl p-6">
                            <div className="mb-3 flex items-center gap-3 border-b border-stone-700 pb-3">
                               <Code size={16} className="text-stone-500"/>
                               <input 
                                  className="bg-transparent text-stone-400 text-sm font-bold uppercase w-full outline-none placeholder-stone-600"
                                  placeholder="Название (например: SYSTEM PROMPT)"
                                  value={block.meta || ''}
                                  onChange={(e) => updateBlock(block.id, 'meta', e.target.value)}
                               />
                            </div>
                            <textarea 
                              rows={8}
                              className="w-full text-base font-mono text-stone-200 placeholder-stone-700 border-none outline-none bg-transparent resize-y leading-loose"
                              placeholder="Вставьте код или текст промта..."
                              value={block.content}
                              onChange={(e) => updateBlock(block.id, 'content', e.target.value)}
                            />
                         </div>
                      )}

                      {/* IMAGE / VIDEO */}
                      {(block.type === 'image' || block.type === 'video') && (
                         <div className="space-y-4">
                            <div className="flex items-center gap-4 bg-stone-50 p-3 rounded-2xl border border-stone-100">
                               <div className="p-3 bg-white rounded-xl text-stone-400 shadow-sm">
                                  {block.type === 'image' ? <ImageIcon size={24}/> : <Video size={24}/>}
                               </div>
                               <div className="flex-1 flex gap-3">
                                 <input 
                                    className="bg-transparent text-base font-medium text-stone-700 w-full outline-none placeholder-stone-400"
                                    placeholder={block.type === 'image' ? "URL или загрузите файл ->" : "URL видео (YouTube)..."}
                                    value={block.content.length > 50 ? (block.content.substring(0, 50) + '...') : block.content}
                                    onChange={(e) => updateBlock(block.id, 'content', e.target.value)}
                                    disabled={block.content.startsWith('data:image')}
                                 />
                                 
                                 {block.type === 'image' && (
                                    <>
                                      {block.content && (
                                         <button 
                                            onClick={() => updateBlock(block.id, 'content', '')}
                                            className="p-2.5 rounded-xl hover:bg-white text-stone-400 hover:text-rose-500"
                                         >
                                            <X size={20} />
                                         </button>
                                      )}
                                      <label className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-stone-200 shadow-sm cursor-pointer hover:bg-stone-100 transition-colors">
                                          <Upload size={16} className="text-stone-600" />
                                          <span className="text-xs font-bold text-stone-600 whitespace-nowrap">Файл</span>
                                          <input 
                                            type="file" 
                                            hidden 
                                            accept="image/*"
                                            onChange={(e) => handleFileUpload(e, (base64) => updateBlock(block.id, 'content', base64))} 
                                          />
                                      </label>
                                    </>
                                 )}
                               </div>
                            </div>
                            {block.type === 'image' && (
                               <input 
                                  className="text-sm text-center w-full text-stone-400 bg-transparent outline-none placeholder-stone-300"
                                  placeholder="Подпись к изображению (необязательно)"
                                  value={block.meta || ''}
                                  onChange={(e) => updateBlock(block.id, 'meta', e.target.value)}
                               />
                            )}
                            {block.content && (
                               <div className="rounded-2xl overflow-hidden border border-stone-100 max-h-96 bg-stone-50 flex items-center justify-center">
                                  {block.type === 'image' ? (
                                     <img src={block.content} alt="" className="h-full w-full object-contain" />
                                  ) : (
                                     <div className="text-stone-400 text-sm p-6">Preview available after save</div>
                                  )}
                               </div>
                            )}
                         </div>
                      )}

                      {/* TIP */}
                      {block.type === 'tip' && (
                         <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex gap-4">
                            <div className="mt-1 text-amber-400"><Lightbulb size={24}/></div>
                            <div className="flex-1">
                               <input 
                                  className="bg-transparent text-amber-800 text-sm font-bold uppercase w-full outline-none placeholder-amber-300/50 mb-1.5"
                                  placeholder="Заголовок (например: ВАЖНО)"
                                  value={block.meta || ''}
                                  onChange={(e) => updateBlock(block.id, 'meta', e.target.value)}
                               />
                               <textarea 
                                  rows={2}
                                  className="w-full text-lg text-amber-900/80 placeholder-amber-800/30 border-none outline-none bg-transparent resize-y"
                                  placeholder="Текст совета..."
                                  value={block.content}
                                  onChange={(e) => updateBlock(block.id, 'content', e.target.value)}
                               />
                            </div>
                         </div>
                      )}

                      {/* STEP */}
                      {block.type === 'step' && (
                         <div className="flex gap-5">
                            <div className="w-12 h-12 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-400 font-bold">
                               <CheckCircle size={24} />
                            </div>
                            <div className="flex-1 space-y-2">
                               <input 
                                  className="bg-transparent text-stone-800 font-bold text-xl w-full outline-none placeholder-stone-300"
                                  placeholder="Заголовок шага"
                                  value={block.meta || ''}
                                  onChange={(e) => updateBlock(block.id, 'meta', e.target.value)}
                               />
                               <textarea 
                                  rows={2}
                                  className="w-full text-lg text-stone-500 placeholder-stone-300 border-none outline-none bg-transparent resize-y"
                                  placeholder="Описание действий..."
                                  value={block.content}
                                  onChange={(e) => updateBlock(block.id, 'content', e.target.value)}
                               />
                            </div>
                         </div>
                      )}

                   </div>
                </div>
             ))}
             
             {formData.blocks.length === 0 && (
                <div className="text-center py-24 border-2 border-dashed border-stone-200 rounded-[2.5rem] text-stone-400">
                   <p className="mb-4 font-medium text-lg">Статья пуста</p>
                   <p className="text-sm max-w-xs mx-auto">Используйте панель слева (или сверху на мобильных), чтобы добавить блоки контента.</p>
                </div>
             )}
          </div>
        </div>

      </div>

      <div className="mt-12 p-8 bg-white rounded-[2.5rem] border border-stone-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 animate-enter">
        <div className="text-stone-500 text-base font-medium pl-2">
            Готовы опубликовать изменения?
        </div>
        <div className="flex gap-4 w-full md:w-auto">
            <Button variant="secondary" onClick={() => navigate('/admin')} className="flex-1 md:flex-none justify-center">Отмена</Button>
            <Button onClick={() => setFormData({...formData, published: !formData.published})} variant="secondary" className="flex-1 md:flex-none justify-center">
                {formData.published ? 'Снять с публикации' : 'Опубликовать'}
            </Button>
            <Button onClick={handleSave} className="flex-1 md:flex-none justify-center"><Save size={18} strokeWidth={3} /> Сохранить</Button>
        </div>
    </div>
    </Layout>
  );
};


const CategoryEditor = () => {
  const { categoryId } = useParams();
  const { getCategory, updateCategory, addSection, deleteSection, addCategoryItem, deleteCategoryItem, showToast } = useData();
  const navigate = useNavigate();
  const category = getCategory(categoryId!);

  const [formData, setFormData] = useState<Partial<Category>>({});

  useEffect(() => {
    if (category) setFormData(category);
  }, [category]);

  if (!category) return <div>Category not found</div>;

  const handleSave = () => {
    updateCategory(category.id, formData);
    showToast('Категория успешно сохранена!');
    navigate('/admin');
  };

  const handleAddSection = () => {
    const newId = `sec-${Date.now()}`;
    addSection(category.id, {
      id: newId,
      title: 'Новый раздел',
      description: 'Описание раздела',
      items: []
    });
    navigate(`/admin/category/${category.id}/section/${newId}`);
  };

  const handleAddCategoryItem = (type: ItemType) => {
    const newId = `item-${Date.now()}`;
    addCategoryItem(category.id, {
      id: newId,
      title: type === ItemType.SEQUENCE ? 'Новая связка' : (type === ItemType.ASSISTANT ? 'Новый ассистент' : 'Новый промт'),
      description: 'Краткое описание',
      instructions: '',
      content: '',
      type: type,
      subPrompts: []
    });
    navigate(`/admin/category/${category.id}/item/${newId}`);
  };

  const themes = [
    { id: 'orange', color: '#FF5500' },
    { id: 'rose', color: '#F43F5E' },
    { id: 'blue', color: '#3B82F6' },
    { id: 'violet', color: '#8B5CF6' },
    { id: 'emerald', color: '#10B981' },
    { id: 'amber', color: '#F59E0B' },
  ];

  return (
    <Layout breadcrumbs={[{ label: 'Dashboard', to: '/admin' }, { label: 'Редактирование категории' }]}>
      <div className="mb-12 flex items-center justify-between animate-enter">
        <div className="flex items-center gap-6">
           <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-sm bg-gradient-to-br from-stone-50 to-white border border-stone-100`}>
             <LayoutIcon size={32} className={`theme-${formData.theme || 'orange'} text-current`} />
           </div>
           <div>
             <h1 className="text-4xl font-bold text-stone-900 tracking-tight leading-none mb-2">
               {formData.title || 'Название'}
             </h1>
             <p className="text-stone-400 text-base font-medium">Настройка категории</p>
           </div>
        </div>
        <div className="flex gap-4">
          <Button variant="secondary" onClick={() => navigate('/admin')}>Отмена</Button>
          <Button onClick={handleSave}><Save size={18} strokeWidth={3} /> Сохранить</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-enter" style={{ animationDelay: '0.1s' }}>
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <h3 className="font-bold text-stone-800 dark:text-white mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
              Основные настройки
            </h3>
            <Input
              label="Название"
              value={formData.title || ''}
              onChange={(e: any) => setFormData({...formData, title: e.target.value})}
            />
            <TextArea
              label="Описание"
              value={formData.description || ''}
              onChange={(e: any) => setFormData({...formData, description: e.target.value})}
            />

            <div className="mb-2">
              <label className="block text-sm font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-3 ml-1">Акцент (Градиент)</label>
              <div className="flex flex-wrap gap-3">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setFormData({ ...formData, theme: t.id as any })}
                    className={`w-12 h-12 rounded-2xl border-2 transition-all relative shadow-sm ${
                      (formData.theme || 'orange') === t.id
                        ? 'border-stone-800 dark:border-white scale-105 ring-4 ring-stone-100 dark:ring-white/20'
                        : 'border-transparent hover:scale-105 hover:shadow-md'
                    }`}
                    style={{ background: t.color }}
                    title={t.id}
                  >
                     {(formData.theme || 'orange') === t.id && (
                       <div className="absolute inset-0 flex items-center justify-center">
                         <div className="w-3 h-3 bg-white rounded-full shadow-sm" />
                       </div>
                     )}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {/* Direct Category Items */}
          <Card>
            <div className="flex justify-between items-center mb-8">
               <div>
                 <h3 className="font-bold text-stone-800 dark:text-white text-xl">Промпты категории</h3>
                 <p className="text-stone-400 dark:text-stone-500 text-sm font-medium mt-1">Прямые промпты без разделов</p>
               </div>
               <div className="flex gap-3">
                 <Button variant="secondary" className="!py-2 !px-4 !text-xs" onClick={() => handleAddCategoryItem(ItemType.PROMPT)}>
                   <Plus size={16} /> Промт
                 </Button>
                 <Button variant="secondary" className="!py-2 !px-4 !text-xs" onClick={() => handleAddCategoryItem(ItemType.SEQUENCE)}>
                   <Plus size={16} /> Связка
                 </Button>
                 <Button variant="secondary" className="!py-2 !px-4 !text-xs" onClick={() => handleAddCategoryItem(ItemType.ASSISTANT)}>
                   <Plus size={16} /> Ассистент
                 </Button>
               </div>
            </div>

            {(!category.items || category.items.length === 0) ? (
              <div className="text-center py-12 bg-stone-50/50 dark:bg-white/5 rounded-3xl border border-dashed border-stone-200 dark:border-white/10">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white dark:bg-white/10 text-stone-300 dark:text-stone-600 mb-4 shadow-sm">
                  <FileText size={24} />
                </div>
                <p className="text-stone-400 dark:text-stone-500 font-medium text-base">Промпты без разделов отсутствуют</p>
                <p className="text-stone-400 dark:text-stone-600 text-sm mt-1">Добавьте прямые промпты или создайте разделы ниже</p>
              </div>
            ) : (
              <div className="space-y-4">
                {(category.items || []).map((item, idx) => (
                  <div key={item.id} className="flex items-center justify-between p-6 rounded-2xl bg-white dark:bg-white/5 border border-stone-100 dark:border-white/10 hover:border-emerald-200 dark:hover:border-emerald-500/30 hover:shadow-soft transition-all group animate-enter" style={{ animationDelay: `${idx * 0.05}s` }}>
                    <div className="flex items-center gap-5">
                      <div className={`p-3 rounded-xl ${item.type === ItemType.ASSISTANT ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400' : (item.type === ItemType.SEQUENCE ? 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400' : 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400')}`}>
                        {item.type === ItemType.ASSISTANT ? <Bot size={24} /> : (item.type === ItemType.SEQUENCE ? <Layers size={24} /> : <FileText size={24} />)}
                      </div>
                      <div>
                        <div className="font-bold text-stone-800 dark:text-white text-lg">{item.title}</div>
                        <div className="text-sm text-stone-400 dark:text-stone-500 truncate max-w-[300px] font-medium mt-1 flex items-center gap-2">
                          <span className="uppercase text-[10px] tracking-wider bg-stone-100 dark:bg-white/10 px-2 py-0.5 rounded">
                            {item.type === ItemType.SEQUENCE ? 'Цепочка' : (item.type === ItemType.ASSISTANT ? 'Ассистент' : 'Промт')}
                          </span>
                          {item.description}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                      <Button variant="secondary" className="!px-4 !py-2 !text-sm" onClick={() => navigate(`/admin/category/${categoryId}/item/${item.id}`)}>
                        Изменить
                      </Button>
                      <Tooltip content="Удалить элемент" position="top">
                        <button onClick={() => deleteCategoryItem(category.id, item.id)} className="p-3 text-stone-300 dark:text-stone-600 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-colors">
                          <Trash2 size={20} />
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Sections */}
          <Card>
            <div className="flex justify-between items-center mb-8">
               <div>
                 <h3 className="font-bold text-stone-800 dark:text-white text-xl">Разделы категории</h3>
                 <p className="text-stone-400 dark:text-stone-500 text-sm font-medium mt-1">Структура контента с подразделами</p>
               </div>
               <Button variant="secondary" className="!py-2.5 !px-5 !text-sm" onClick={handleAddSection}>
                 <Plus size={18} /> Добавить раздел
               </Button>
            </div>

            {category.sections.length === 0 ? (
              <div className="text-center py-12 bg-stone-50/50 dark:bg-white/5 rounded-3xl border border-dashed border-stone-200 dark:border-white/10">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white dark:bg-white/10 text-stone-300 dark:text-stone-600 mb-4 shadow-sm">
                  <Folder size={24} />
                </div>
                <p className="text-stone-400 dark:text-stone-500 font-medium text-base">В этой категории пока нет разделов</p>
              </div>
            ) : (
              <div className="space-y-4">
                {category.sections.map((sec, idx) => (
                  <div key={sec.id} className="flex items-center justify-between p-6 rounded-2xl bg-white dark:bg-white/5 border border-stone-100 dark:border-white/10 hover:border-orange-200 dark:hover:border-orange-500/30 hover:shadow-soft transition-all group animate-enter" style={{ animationDelay: `${idx * 0.05}s` }}>
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-xl bg-stone-50 dark:bg-white/10 flex items-center justify-center text-stone-400 dark:text-stone-500 group-hover:text-orange-500 dark:group-hover:text-orange-400 group-hover:bg-orange-50 dark:group-hover:bg-orange-500/20 transition-colors">
                        <Folder size={24} />
                      </div>
                      <div>
                        <div className="font-bold text-stone-800 dark:text-white text-lg group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">{sec.title}</div>
                        <div className="text-sm text-stone-400 dark:text-stone-500 font-medium mt-0.5">{sec.items.length} элементов</div>
                      </div>
                    </div>
                    <div className="flex gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                      <Button variant="secondary" className="!px-4 !py-2 !text-sm" onClick={() => navigate(`/admin/category/${category.id}/section/${sec.id}`)}>
                        Открыть
                      </Button>
                      <Tooltip content="Удалить раздел" position="top">
                        <button onClick={() => deleteSection(category.id, sec.id)} className="p-3 text-stone-300 dark:text-stone-600 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-colors">
                          <Trash2 size={20} />
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
};

// --- Section Editor ---

const SectionEditor = () => {
  const { categoryId, sectionId } = useParams();
  const { getSection, updateSection, addItem, deleteItem, showToast } = useData();
  const navigate = useNavigate();
  const section = getSection(categoryId!, sectionId!);
  
  const [formData, setFormData] = useState<Partial<Section>>({});

  useEffect(() => {
    if (section) setFormData(section);
  }, [section]);

  if (!section) return <div>Section not found</div>;

  const handleSave = () => {
    updateSection(categoryId!, sectionId!, formData);
    showToast('Раздел сохранен!', 'success');
  };

  const handleAddItem = (type: ItemType) => {
    const newId = `item-${Date.now()}`;
    addItem(categoryId!, sectionId!, {
      id: newId,
      title: type === ItemType.SEQUENCE ? 'Новая связка' : (type === ItemType.ASSISTANT ? 'Новый ассистент' : 'Новый промт'),
      description: 'Краткое описание',
      instructions: '',
      content: '',
      type: type,
      subPrompts: []
    });
    navigate(`/admin/category/${categoryId}/section/${sectionId}/item/${newId}`);
  };

  return (
    <Layout breadcrumbs={[
        { label: 'Dashboard', to: '/admin' }, 
        { label: 'Категория', to: `/admin/category/${categoryId}` },
        { label: 'Редактирование раздела' }
    ]}>
      <div className="mb-12 flex items-center justify-between animate-enter">
        <div className="flex items-center gap-6">
           <div className="w-16 h-16 rounded-[1.5rem] bg-white border border-stone-100 text-blue-500 shadow-sm flex items-center justify-center">
             <Folder size={32} strokeWidth={2} />
           </div>
           <div>
             <h1 className="text-4xl font-bold text-stone-900 tracking-tight leading-none mb-2">
               {formData.title || 'Название раздела'}
             </h1>
             <p className="text-stone-400 text-base font-medium">Настройка контента</p>
           </div>
        </div>
        <div className="flex gap-4">
          <Button variant="secondary" onClick={() => navigate(`/admin/category/${categoryId}`)}>Назад</Button>
          <Button onClick={handleSave}><Save size={18} strokeWidth={3} /> Сохранить</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-enter" style={{ animationDelay: '0.1s' }}>
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <h3 className="font-bold text-stone-800 mb-6 flex items-center gap-2">
               <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
               Настройки
            </h3>
            <Input 
              label="Название" 
              value={formData.title || ''} 
              onChange={(e: any) => setFormData({...formData, title: e.target.value})} 
            />
            <TextArea 
              label="Краткое описание" 
              value={formData.description || ''} 
              onChange={(e: any) => setFormData({...formData, description: e.target.value})} 
            />
            <div className="mb-6">
               <label className="block text-sm font-bold text-stone-500 uppercase tracking-wider mb-2.5 ml-1">Иконка раздела</label>
               <IconPicker 
                  selected={formData.icon} 
                  onChange={(icon) => setFormData({...formData, icon})} 
               />
            </div>
            <TextArea 
              label="Инструкция (Справа)" 
              value={formData.instructions || ''} 
              rows={6}
              onChange={(e: any) => setFormData({...formData, instructions: e.target.value})} 
            />
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <div className="flex justify-between items-center mb-8">
               <div>
                 <h3 className="font-bold text-stone-800 text-xl">Контент</h3>
                 <p className="text-stone-400 text-sm font-medium mt-1">Промты, связки и ассистенты</p>
               </div>
               <div className="flex gap-3">
                 <Button variant="secondary" className="!py-2 !px-4 !text-xs" onClick={() => handleAddItem(ItemType.PROMPT)}>
                   <Plus size={16} /> Промт
                 </Button>
                 <Button variant="secondary" className="!py-2 !px-4 !text-xs" onClick={() => handleAddItem(ItemType.SEQUENCE)}>
                   <Plus size={16} /> Связка (Цепочка)
                 </Button>
                 <Button variant="secondary" className="!py-2 !px-4 !text-xs" onClick={() => handleAddItem(ItemType.ASSISTANT)}>
                   <Plus size={16} /> Ассистент
                 </Button>
               </div>
            </div>
            
            <div className="space-y-4">
              {section.items.map((item, idx) => (
                <div key={item.id} className="flex items-center justify-between p-6 rounded-2xl bg-white border border-stone-100 hover:border-blue-200 hover:shadow-soft transition-all group animate-enter" style={{ animationDelay: `${idx * 0.05}s` }}>
                  <div className="flex items-center gap-5">
                    <div className={`p-3 rounded-xl ${item.type === ItemType.ASSISTANT ? 'bg-rose-50 text-rose-600' : (item.type === ItemType.SEQUENCE ? 'bg-violet-50 text-violet-600' : 'bg-orange-50 text-orange-600')}`}>
                      {item.type === ItemType.ASSISTANT ? <Bot size={24} /> : (item.type === ItemType.SEQUENCE ? <Layers size={24} /> : <FileText size={24} />)}
                    </div>
                    <div>
                      <div className="font-bold text-stone-800 text-lg">{item.title}</div>
                      <div className="text-sm text-stone-400 truncate max-w-[300px] font-medium mt-1 flex items-center gap-2">
                        <span className="uppercase text-[10px] tracking-wider bg-stone-100 px-2 py-0.5 rounded">
                          {item.type === ItemType.SEQUENCE ? 'Цепочка' : (item.type === ItemType.ASSISTANT ? 'Ассистент' : 'Промт')}
                        </span>
                        {item.description}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                    <Button variant="secondary" className="!px-4 !py-2 !text-sm" onClick={() => navigate(`/admin/category/${categoryId}/section/${sectionId}/item/${item.id}`)}>
                      Изменить
                    </Button>
                    <Tooltip content="Удалить элемент" position="top">
                      <button onClick={() => deleteItem(categoryId!, sectionId!, item.id)} className="p-3 text-stone-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors">
                        <Trash2 size={20} />
                      </button>
                    </Tooltip>
                  </div>
                </div>
              ))}
              {section.items.length === 0 && (
                 <div className="text-center py-16 bg-stone-50/50 rounded-3xl border border-dashed border-stone-200">
                   <p className="text-stone-400 font-medium text-base">Список пуст</p>
                 </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

// --- Category Item Editor (Direct items, no section) ---
const CategoryItemEditor = () => {
  const { categoryId, itemId } = useParams();
  const { getCategoryItem, updateCategoryItem, showToast } = useData();
  const navigate = useNavigate();
  const item = getCategoryItem(categoryId!, itemId!);

  const [formData, setFormData] = useState<Partial<PromptItem>>({});

  useEffect(() => {
    if (item) setFormData(item);
  }, [item]);

  if (!item) return <div>Item not found</div>;

  const handleSave = () => {
    updateCategoryItem(categoryId!, itemId!, formData);
    showToast('Промт успешно сохранен!');
    navigate(`/admin/category/${categoryId}`);
  };

  // Helpers for sub-prompts (used in Assistants and Sequences)
  const handleAddSubPrompt = () => {
    const current = formData.subPrompts || [];
    setFormData({
      ...formData,
      subPrompts: [...current, { title: `Шаг ${current.length + 1}`, content: '' }]
    });
  };

  const handleUpdateSubPrompt = (idx: number, field: 'title' | 'content', value: string) => {
    const current = [...(formData.subPrompts || [])];
    current[idx] = { ...current[idx], [field]: value };
    setFormData({ ...formData, subPrompts: current });
  };

  const handleDeleteSubPrompt = (idx: number) => {
    const current = [...(formData.subPrompts || [])];
    current.splice(idx, 1);
    setFormData({ ...formData, subPrompts: current });
  };

  const isAssistant = formData.type === ItemType.ASSISTANT;
  const isSequence = formData.type === ItemType.SEQUENCE;

  return (
    <Layout breadcrumbs={[
        { label: 'Категория', to: `/admin/category/${categoryId}` },
        { label: 'Редактор' }
    ]}>
      <div className="max-w-5xl mx-auto animate-enter">
        <div className="flex items-center justify-between mb-12">
           <div className="flex items-center gap-6">
              <div className={`w-16 h-16 rounded-[1.5rem] border border-stone-100 dark:border-white/10 flex items-center justify-center shadow-sm ${
                isAssistant ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400' : (isSequence ? 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400' : 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400')
              }`}>
                {isAssistant ? <Bot size={30} /> : (isSequence ? <Layers size={30} /> : <FileText size={30} />)}
              </div>
              <div>
                <h1 className="text-4xl font-bold text-stone-900 dark:text-white tracking-tight leading-none mb-2">
                  Редактирование
                </h1>
                <p className="text-stone-400 dark:text-stone-500 text-base font-medium">
                  {isAssistant ? 'GPT Ассистент' : (isSequence ? 'Связка промтов' : 'Промт')}
                </p>
              </div>
           </div>
           <div className="flex gap-4">
             <Button variant="secondary" onClick={() => navigate(-1)}>Отмена</Button>
             <Button onClick={handleSave}><Save size={18} strokeWidth={3} /> Сохранить</Button>
           </div>
        </div>

        <div className="grid gap-8">
          <Card>
            <h3 className="font-bold text-stone-800 dark:text-white mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-stone-800 dark:bg-white"></span>
              Базовая информация
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <Input
                label="Заголовок"
                value={formData.title || ''}
                onChange={(e: any) => setFormData({...formData, title: e.target.value})}
              />
              <div className="mb-6">
                 <label className="block text-sm font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2.5 ml-1">Тип элемента</label>
                 <div className="relative">
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value as ItemType})}
                      className="w-full bg-white dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:focus:ring-orange-500/20 transition-all text-base font-medium text-stone-800 dark:text-white shadow-sm appearance-none"
                    >
                      <option value={ItemType.PROMPT}>Промт (Один запрос)</option>
                      <option value={ItemType.SEQUENCE}>Связка (Несколько шагов)</option>
                      <option value={ItemType.ASSISTANT}>Ассистент (Настройка GPT)</option>
                    </select>
                    <div className="absolute right-5 top-1/2 transform -translate-y-1/2 pointer-events-none text-stone-400 dark:text-stone-500">
                      <ChevronRight size={20} className="rotate-90" />
                    </div>
                 </div>
              </div>
            </div>
            <Input
                label="Краткое описание (Для списка)"
                value={formData.description || ''}
                onChange={(e: any) => setFormData({...formData, description: e.target.value})}
            />
          </Card>

          <Card>
            <h3 className="font-bold text-stone-800 dark:text-white mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-stone-800 dark:bg-white"></span>
              Детали контента
            </h3>
            <TextArea
              label="Инструкция по использованию (Общая)"
              value={formData.instructions || ''}
              rows={4}
              onChange={(e: any) => setFormData({...formData, instructions: e.target.value})}
            />

             {!isSequence && (
               <div className="mb-4">
                 <label className="block text-sm font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-3 ml-1">
                   {isAssistant ? "Custom Instructions (Системный промт)" : "Текст промта"}
                 </label>
                 <textarea
                    rows={18}
                    className="w-full bg-stone-900 border border-stone-800 rounded-2xl px-8 py-8 transition-all outline-none text-stone-200 font-mono text-base leading-loose shadow-inner resize-y focus:ring-4 focus:ring-stone-800/50"
                    value={formData.content || ''}
                    onChange={(e: any) => setFormData({...formData, content: e.target.value})}
                 />
               </div>
             )}
          </Card>

          {/* Dynamic List for Sequences (and Assistants) */}
          {(isSequence || isAssistant) && (
            <div className="border-t border-stone-200 dark:border-white/10 pt-10 mt-4">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-2xl font-bold text-stone-800 dark:text-white">
                   {isSequence ? 'Шаги связки (Цепочка)' : 'Дополнительные промты'}
                 </h3>
                 <Button variant="secondary" className="!py-2.5 !px-5 !text-sm" onClick={handleAddSubPrompt}>
                   <Plus size={18} /> Добавить шаг
                 </Button>
              </div>

              <div className="space-y-6">
                 {(formData.subPrompts || []).map((sub, idx) => (
                   <div key={idx} className="bg-white dark:bg-white/5 p-8 rounded-[2rem] border border-stone-200 dark:border-white/10 shadow-sm relative group hover:border-orange-200 dark:hover:border-orange-500/30 transition-all">
                      <div className="absolute left-0 top-0 bottom-0 w-2 bg-stone-100 dark:bg-white/10 rounded-l-[2rem] group-hover:bg-orange-400 transition-colors"></div>
                      <div className="flex justify-between items-start mb-6 pl-3">
                         <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-stone-100 dark:bg-white/10 flex items-center justify-center text-stone-500 dark:text-stone-400 text-sm font-bold">
                              {idx + 1}
                            </div>
                            <input
                              type="text"
                              className="bg-transparent font-bold text-xl text-stone-800 dark:text-white border-b border-transparent hover:border-stone-200 dark:hover:border-white/20 focus:border-orange-400 outline-none transition-all w-full"
                              value={sub.title}
                              onChange={(e) => handleUpdateSubPrompt(idx, 'title', e.target.value)}
                              placeholder="Название шага"
                            />
                         </div>
                         <button onClick={() => handleDeleteSubPrompt(idx)} className="text-stone-300 dark:text-stone-600 hover:text-rose-500 dark:hover:text-rose-400 transition-colors">
                           <X size={24} />
                         </button>
                      </div>
                      <textarea
                         rows={8}
                         className="w-full bg-stone-50 dark:bg-white/5 border border-stone-100 dark:border-white/10 rounded-2xl px-6 py-5 outline-none focus:bg-white dark:focus:bg-white/10 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-500/20 transition-all text-base font-mono text-stone-600 dark:text-stone-300 resize-y leading-relaxed"
                         value={sub.content}
                         onChange={(e) => handleUpdateSubPrompt(idx, 'content', e.target.value)}
                         placeholder="Текст промта для этого шага..."
                      />
                   </div>
                 ))}
                 {(formData.subPrompts || []).length === 0 && (
                    <div className="text-center py-16 border-2 border-dashed border-stone-200 dark:border-white/10 rounded-[2.5rem] text-stone-400 dark:text-stone-500 text-lg">
                       Добавьте шаги для этой цепочки
                    </div>
                 )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

// ... ItemEditor and Admin (Unchanged) ...
const ItemEditor = () => {
  const { categoryId, sectionId, itemId } = useParams();
  const { getItem, updateItem, showToast } = useData();
  const navigate = useNavigate();
  const item = getItem(categoryId!, sectionId!, itemId!);

  const [formData, setFormData] = useState<Partial<PromptItem>>({});

  useEffect(() => {
    if (item) setFormData(item);
  }, [item]);

  if (!item) return <div>Item not found</div>;

  const handleSave = () => {
    updateItem(categoryId!, sectionId!, itemId!, formData);
    showToast('Промт успешно сохранен!');
    navigate(`/admin/category/${categoryId}/section/${sectionId}`);
  };

  // Helpers for sub-prompts (used in Assistants and Sequences)
  const handleAddSubPrompt = () => {
    const current = formData.subPrompts || [];
    setFormData({ 
      ...formData, 
      subPrompts: [...current, { title: `Шаг ${current.length + 1}`, content: '' }] 
    });
  };

  const handleUpdateSubPrompt = (idx: number, field: 'title' | 'content', value: string) => {
    const current = [...(formData.subPrompts || [])];
    current[idx] = { ...current[idx], [field]: value };
    setFormData({ ...formData, subPrompts: current });
  };

  const handleDeleteSubPrompt = (idx: number) => {
    const current = [...(formData.subPrompts || [])];
    current.splice(idx, 1);
    setFormData({ ...formData, subPrompts: current });
  };

  const isAssistant = formData.type === ItemType.ASSISTANT;
  const isSequence = formData.type === ItemType.SEQUENCE;

  return (
    <Layout breadcrumbs={[
        { label: 'Раздел', to: `/admin/category/${categoryId}/section/${sectionId}` },
        { label: 'Редактор' }
    ]}>
      <div className="max-w-5xl mx-auto animate-enter">
        <div className="flex items-center justify-between mb-12">
           <div className="flex items-center gap-6">
              <div className={`w-16 h-16 rounded-[1.5rem] border border-stone-100 flex items-center justify-center shadow-sm ${
                isAssistant ? 'bg-rose-50 text-rose-600' : (isSequence ? 'bg-violet-50 text-violet-600' : 'bg-orange-50 text-orange-600')
              }`}>
                {isAssistant ? <Bot size={30} /> : (isSequence ? <Layers size={30} /> : <FileText size={30} />)}
              </div>
              <div>
                <h1 className="text-4xl font-bold text-stone-900 tracking-tight leading-none mb-2">
                  Редактирование
                </h1>
                <p className="text-stone-400 text-base font-medium">
                  {isAssistant ? 'GPT Ассистент' : (isSequence ? 'Связка промтов' : 'Промт')}
                </p>
              </div>
           </div>
           <div className="flex gap-4">
             <Button variant="secondary" onClick={() => navigate(-1)}>Отмена</Button>
             <Button onClick={handleSave}><Save size={18} strokeWidth={3} /> Сохранить</Button>
           </div>
        </div>

        <div className="grid gap-8">
          <Card>
            <h3 className="font-bold text-stone-800 mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-stone-800"></span>
              Базовая информация
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <Input 
                label="Заголовок" 
                value={formData.title || ''} 
                onChange={(e: any) => setFormData({...formData, title: e.target.value})} 
              />
              <div className="mb-6">
                 <label className="block text-sm font-bold text-stone-500 uppercase tracking-wider mb-2.5 ml-1">Тип элемента</label>
                 <div className="relative">
                    <select 
                      value={formData.type} 
                      onChange={(e) => setFormData({...formData, type: e.target.value as ItemType})}
                      className="w-full bg-white border border-stone-200 rounded-2xl px-5 py-4 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all text-base font-medium text-stone-800 shadow-sm appearance-none"
                    >
                      <option value={ItemType.PROMPT}>Промт (Один запрос)</option>
                      <option value={ItemType.SEQUENCE}>Связка (Несколько шагов)</option>
                      <option value={ItemType.ASSISTANT}>Ассистент (Настройка GPT)</option>
                    </select>
                    <div className="absolute right-5 top-1/2 transform -translate-y-1/2 pointer-events-none text-stone-400">
                      <ChevronRight size={20} className="rotate-90" />
                    </div>
                 </div>
              </div>
            </div>
            <Input 
                label="Краткое описание (Для списка)" 
                value={formData.description || ''} 
                onChange={(e: any) => setFormData({...formData, description: e.target.value})} 
            />
          </Card>

          <Card>
            <h3 className="font-bold text-stone-800 mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-stone-800"></span>
              Детали контента
            </h3>
            <TextArea 
              label="Инструкция по использованию (Общая)" 
              value={formData.instructions || ''} 
              rows={4}
              onChange={(e: any) => setFormData({...formData, instructions: e.target.value})} 
            />
             
             {!isSequence && (
               <div className="mb-4">
                 <label className="block text-sm font-bold text-stone-500 uppercase tracking-wider mb-3 ml-1">
                   {isAssistant ? "Custom Instructions (Системный промт)" : "Текст промта"}
                 </label>
                 <textarea 
                    rows={18}
                    className="w-full bg-stone-900 border border-stone-800 rounded-2xl px-8 py-8 transition-all outline-none text-stone-200 font-mono text-base leading-loose shadow-inner resize-y focus:ring-4 focus:ring-stone-800/50"
                    value={formData.content || ''}
                    onChange={(e: any) => setFormData({...formData, content: e.target.value})} 
                 />
               </div>
             )}
          </Card>

          {/* Dynamic List for Sequences (and Assistants) */}
          {(isSequence || isAssistant) && (
            <div className="border-t border-stone-200 pt-10 mt-4">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-2xl font-bold text-stone-800">
                   {isSequence ? 'Шаги связки (Цепочка)' : 'Дополнительные промты'}
                 </h3>
                 <Button variant="secondary" className="!py-2.5 !px-5 !text-sm" onClick={handleAddSubPrompt}>
                   <Plus size={18} /> Добавить шаг
                 </Button>
              </div>

              <div className="space-y-6">
                 {(formData.subPrompts || []).map((sub, idx) => (
                   <div key={idx} className="bg-white p-8 rounded-[2rem] border border-stone-200 shadow-sm relative group hover:border-orange-200 transition-all">
                      <div className="absolute left-0 top-0 bottom-0 w-2 bg-stone-100 rounded-l-[2rem] group-hover:bg-orange-400 transition-colors"></div>
                      <div className="flex justify-between items-start mb-6 pl-3">
                         <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 text-sm font-bold">
                              {idx + 1}
                            </div>
                            <input 
                              type="text" 
                              className="bg-transparent font-bold text-xl text-stone-800 border-b border-transparent hover:border-stone-200 focus:border-orange-400 outline-none transition-all w-full"
                              value={sub.title}
                              onChange={(e) => handleUpdateSubPrompt(idx, 'title', e.target.value)}
                              placeholder="Название шага"
                            />
                         </div>
                         <button onClick={() => handleDeleteSubPrompt(idx)} className="text-stone-300 hover:text-rose-500 transition-colors">
                           <X size={24} />
                         </button>
                      </div>
                      <textarea 
                         rows={8}
                         className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-5 outline-none focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all text-base font-mono text-stone-600 resize-y leading-relaxed"
                         value={sub.content}
                         onChange={(e) => handleUpdateSubPrompt(idx, 'content', e.target.value)}
                         placeholder="Текст промта для этого шага..."
                      />
                   </div>
                 ))}
                 {(formData.subPrompts || []).length === 0 && (
                    <div className="text-center py-16 border-2 border-dashed border-stone-200 rounded-[2.5rem] text-stone-400 text-lg">
                       Добавьте шаги для этой цепочки
                    </div>
                 )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};


const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
     return sessionStorage.getItem('gpt_admin_auth') === 'true';
  });

  const handleLogin = () => {
    sessionStorage.setItem('gpt_admin_auth', 'true');
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />

      <Route path="/category/:categoryId" element={<CategoryEditor />} />
      <Route path="/category/:categoryId/item/:itemId" element={<CategoryItemEditor />} />
      <Route path="/category/:categoryId/section/:sectionId" element={<SectionEditor />} />
      <Route path="/category/:categoryId/section/:sectionId/item/:itemId" element={<ItemEditor />} />

      <Route path="/article/:articleId" element={<ArticleEditor />} />
    </Routes>
  );
};

export default Admin;