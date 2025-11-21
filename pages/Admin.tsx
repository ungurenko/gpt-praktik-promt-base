import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import Layout from '../components/Layout';
import { Plus, Trash2, Save, ArrowLeft, Folder, FileText, Bot, MoreHorizontal, X, Image as ImageIcon, Layout as LayoutIcon, Upload, ChevronRight, Layers, ArrowDown, GripVertical, Database, Lock, LogOut, Check } from 'lucide-react';
import { Category, Section, PromptItem, ItemType } from '../types';

// --- Clean Tech UI Components ---

const Input = ({ label, ...props }: any) => (
  <div className="mb-5">
    <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2 ml-1">{label}</label>
    <input 
      className="w-full bg-white border border-stone-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 rounded-xl px-4 py-3.5 transition-all outline-none text-stone-800 placeholder-stone-300 text-sm font-medium shadow-sm"
      {...props}
    />
  </div>
);

const TextArea = ({ label, rows = 3, ...props }: any) => (
  <div className="mb-5">
    <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2 ml-1">{label}</label>
    <textarea 
      rows={rows}
      className="w-full bg-white border border-stone-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 rounded-xl px-4 py-3.5 transition-all outline-none text-stone-800 placeholder-stone-400 text-sm font-medium shadow-sm resize-y"
      {...props}
    />
  </div>
);

const Button = ({ children, variant = 'primary', className = '', ...props }: any) => {
  const baseStyle = "px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 transform active:scale-95 flex items-center justify-center gap-2 tracking-wide";
  const variants = {
    primary: "bg-stone-900 hover:bg-black text-white shadow-lg shadow-stone-200 hover:shadow-xl hover:-translate-y-0.5",
    secondary: "bg-white hover:bg-stone-50 text-stone-600 border border-stone-200 shadow-sm hover:text-stone-900 hover:border-stone-300",
    danger: "bg-white hover:bg-rose-50 text-rose-500 border border-rose-100 shadow-sm hover:border-rose-200 hover:shadow-rose-100",
    ghost: "bg-transparent hover:bg-stone-100 text-stone-500"
  };
  return (
    <button className={`${baseStyle} ${variants[variant as keyof typeof variants]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Card = ({ children, className = "" }: { children?: React.ReactNode, className?: string }) => (
  <div className={`bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 shadow-soft border border-white/50 ${className}`}>
    {children}
  </div>
);

// --- Admin Login Screen ---

const AdminLogin = ({ onLogin }: { onLogin: (status: boolean) => void }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'neodark') {
      onLogin(true);
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-stone-50/50">
      <div className="w-full max-w-md animate-enter">
        <div className="bg-white/80 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-2xl shadow-stone-200 border border-white">
           <div className="text-center mb-8">
             <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-stone-900 text-white mb-6 shadow-lg shadow-stone-300">
               <Lock size={28} strokeWidth={2.5} />
             </div>
             <h1 className="text-2xl font-extrabold text-stone-900 mb-2">Доступ запрещен</h1>
             <p className="text-stone-500 text-sm font-medium">Введите пароль администратора для входа</p>
           </div>

           <form onSubmit={handleSubmit}>
             <div className="mb-6 relative">
               <input 
                 type="password" 
                 autoFocus
                 className={`w-full bg-stone-50 border ${error ? 'border-rose-300 bg-rose-50 text-rose-900' : 'border-stone-200'} focus:border-orange-400 focus:ring-4 focus:ring-orange-100 rounded-xl px-4 py-4 transition-all outline-none text-stone-800 placeholder-stone-400 text-center text-lg font-bold tracking-widest shadow-inner`}
                 placeholder="••••••••"
                 value={password}
                 onChange={(e) => { setPassword(e.target.value); setError(false); }}
               />
               {error && (
                 <p className="absolute -bottom-6 left-0 right-0 text-center text-xs font-bold text-rose-500 animate-pulse">Неверный пароль</p>
               )}
             </div>
             <Button className="w-full py-4 !text-base !rounded-2xl" onClick={handleSubmit}>
               Войти в систему
             </Button>
           </form>
        </div>
        <div className="text-center mt-8">
           <Link to="/" className="text-stone-400 text-xs font-bold uppercase tracking-widest hover:text-stone-600 transition-colors">
             Вернуться на главную
           </Link>
        </div>
      </div>
    </div>
  );
};

// --- Admin Dashboard (Categories List) ---

const AdminDashboard = ({ onLogout }: { onLogout: () => void }) => {
  const { categories, addCategory, deleteCategory, loading, uploadInitialData } = useData();
  const navigate = useNavigate();

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

  const handleMigration = async () => {
    if(confirm('ВНИМАНИЕ: Это полностью перезапишет базу данных в Supabase данными из файла data.ts. Вы уверены?')) {
        await uploadInitialData();
    }
  }

  if (loading) {
    return (
        <Layout>
            <div className="flex items-center justify-center h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        </Layout>
    )
  }

  return (
    <Layout breadcrumbs={[{ label: 'Dashboard' }]}>
      <div className="flex justify-between items-end mb-12 animate-enter">
        <div>
          <h1 className="text-4xl font-extrabold text-stone-900 mb-2 tracking-tight">Панель управления</h1>
          <p className="text-lg text-stone-500 font-light">Управляйте структурой и контентом базы знаний</p>
        </div>
        <div className="flex gap-3">
            <Button variant="ghost" onClick={onLogout} title="Выйти">
                <LogOut size={18} />
            </Button>
            <Button variant="secondary" onClick={handleMigration} title="Загрузить исходные данные в БД">
                <Database size={18} />
                Миграция
            </Button>
            <Button onClick={handleCreate}>
            <Plus size={18} strokeWidth={3} />
            Создать категорию
            </Button>
        </div>
      </div>

      <div className="grid gap-4 animate-enter" style={{ animationDelay: '0.1s' }}>
        {categories.map((cat, idx) => (
          <div key={cat.id} className="group flex items-center bg-white p-5 pr-6 rounded-[2rem] border border-stone-100 hover:border-orange-100 hover:shadow-soft hover:-translate-y-1 transition-all duration-300">
            <div className={`w-16 h-16 rounded-2xl mr-6 flex items-center justify-center transition-colors duration-300 mesh-bg-${cat.theme || 'orange'}`}>
               <div className={`w-4 h-4 rounded-full bg-white opacity-50 shadow-sm`}></div>
            </div>
            <div className="flex-1 py-1">
              <h3 className="font-bold text-stone-800 text-lg mb-1 group-hover:text-orange-600 transition-colors">{cat.title}</h3>
              <p className="text-sm text-stone-400 font-medium flex items-center gap-2">
                <span className="bg-stone-100 text-stone-500 px-2 py-0.5 rounded-md text-xs">
                  {cat.sections.length} {cat.sections.length === 1 ? 'раздел' : 'разделов'}
                </span>
                <span className="w-1 h-1 rounded-full bg-stone-300"></span>
                <span>{cat.description}</span>
              </p>
            </div>
            <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
              <Button variant="secondary" className="!px-5 !py-2.5 !text-xs" onClick={() => navigate(`/admin/category/${cat.id}`)}>
                Редактировать
              </Button>
              <button onClick={() => deleteCategory(cat.id)} className="p-3 rounded-xl text-stone-400 hover:bg-rose-50 hover:text-rose-500 transition-colors border border-transparent hover:border-rose-100">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

const CategoryEditor = () => {
  const { categoryId } = useParams();
  const { getCategory, updateCategory, addSection, deleteSection } = useData();
  const navigate = useNavigate();
  const category = getCategory(categoryId!);
  
  const [formData, setFormData] = useState<Partial<Category>>({});

  useEffect(() => {
    if (category) setFormData(category);
  }, [category]);

  if (!category) return <div>Category not found</div>;

  const handleSave = async () => {
    await updateCategory(category.id, formData);
    navigate('/admin');
  };

  const handleAddSection = async () => {
    const newId = `sec-${Date.now()}`;
    await addSection(category.id, {
      id: newId,
      title: 'Новый раздел',
      description: 'Описание раздела',
      items: []
    });
    navigate(`/admin/category/${category.id}/section/${newId}`);
  };

  const themes = [
    { id: 'orange', label: 'Sunset', desc: 'Orange & Pink' },
    { id: 'rose', label: 'Passion', desc: 'Red & Rose' },
    { id: 'blue', label: 'Ocean', desc: 'Deep Blue' },
    { id: 'violet', label: 'Cosmic', desc: 'Purple & Violet' },
    { id: 'emerald', label: 'Nature', desc: 'Green & Teal' },
    { id: 'amber', label: 'Luxury', desc: 'Gold & Dark' },
  ];

  return (
    <Layout breadcrumbs={[{ label: 'Dashboard', to: '/admin' }, { label: 'Редактирование категории' }]}>
      <div className="mb-10 flex items-center justify-between animate-enter">
        <div className="flex items-center gap-5">
           <div className={`w-14 h-14 rounded-[1.2rem] flex items-center justify-center shadow-sm mesh-bg-${formData.theme || 'orange'}`}>
             <LayoutIcon size={28} className="text-white" />
           </div>
           <div>
             <h1 className="text-3xl font-bold text-stone-900 tracking-tight leading-none mb-1">
               {formData.title || 'Название'}
             </h1>
             <p className="text-stone-400 text-sm font-medium">Настройка категории</p>
           </div>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => navigate('/admin')}>Отмена</Button>
          <Button onClick={handleSave}><Save size={16} strokeWidth={3} /> Сохранить</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-enter" style={{ animationDelay: '0.1s' }}>
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <h3 className="font-bold text-stone-800 mb-6 flex items-center gap-2">
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
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-3 ml-1">Фон карточки (Mesh Gradient)</label>
              <div className="grid grid-cols-2 gap-3">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setFormData({ ...formData, theme: t.id as any })}
                    className={`relative group rounded-2xl h-20 w-full overflow-hidden transition-all ${
                      (formData.theme || 'orange') === t.id
                        ? 'ring-4 ring-stone-800 shadow-xl transform scale-105 z-10' 
                        : 'ring-1 ring-stone-200 hover:ring-orange-300 hover:scale-105'
                    }`}
                  >
                     {/* The Gradient Preview */}
                     <div className={`absolute inset-0 mesh-bg-${t.id}`} />
                     
                     {/* Label */}
                     <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/10">
                        {(formData.theme || 'orange') === t.id && (
                            <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center shadow-md mb-1">
                                <Check size={14} strokeWidth={4} />
                            </div>
                        )}
                        <span className="text-white text-[10px] font-bold uppercase tracking-widest shadow-black drop-shadow-md">
                            {t.label}
                        </span>
                     </div>
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <div className="flex justify-between items-center mb-8">
               <div>
                 <h3 className="font-bold text-stone-800 text-lg">Разделы категории</h3>
                 <p className="text-stone-400 text-xs font-medium mt-1">Структура контента внутри категории</p>
               </div>
               <Button variant="secondary" className="!py-2 !px-4 !text-xs" onClick={handleAddSection}>
                 <Plus size={16} /> Добавить раздел
               </Button>
            </div>
            
            {category.sections.length === 0 ? (
              <div className="text-center py-12 bg-stone-50/50 rounded-3xl border border-dashed border-stone-200">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white text-stone-300 mb-3 shadow-sm">
                  <Folder size={20} />
                </div>
                <p className="text-stone-400 font-medium text-sm">В этой категории пока нет разделов</p>
              </div>
            ) : (
              <div className="space-y-3">
                {category.sections.map((sec, idx) => (
                  <div key={sec.id} className="flex items-center justify-between p-5 rounded-2xl bg-white border border-stone-100 hover:border-orange-200 hover:shadow-soft transition-all group animate-enter" style={{ animationDelay: `${idx * 0.05}s` }}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-stone-50 flex items-center justify-center text-stone-400 group-hover:text-orange-500 group-hover:bg-orange-50 transition-colors">
                        <Folder size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-stone-800 text-sm group-hover:text-orange-600 transition-colors">{sec.title}</div>
                        <div className="text-xs text-stone-400 font-medium mt-0.5">{sec.items.length} элементов</div>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                      <Button variant="secondary" className="!px-3 !py-1.5 !text-xs" onClick={() => navigate(`/admin/category/${category.id}/section/${sec.id}`)}>
                        Открыть
                      </Button>
                      <button onClick={() => deleteSection(category.id, sec.id)} className="p-2 text-stone-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
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

const SectionEditor = () => {
  const { categoryId, sectionId } = useParams();
  const { getSection, updateSection, addItem, deleteItem } = useData();
  const navigate = useNavigate();
  const section = getSection(categoryId!, sectionId!);
  
  const [formData, setFormData] = useState<Partial<Section>>({});

  useEffect(() => {
    if (section) setFormData(section);
  }, [section]);

  if (!section) return <div>Section not found</div>;

  const handleSave = async () => {
    await updateSection(categoryId!, sectionId!, formData);
  };

  const handleAddItem = async (type: ItemType) => {
    const newId = `item-${Date.now()}`;
    await addItem(categoryId!, sectionId!, {
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
      <div className="mb-10 flex items-center justify-between animate-enter">
        <div className="flex items-center gap-5">
           <div className="w-14 h-14 rounded-[1.2rem] bg-white border border-stone-100 text-blue-500 shadow-sm flex items-center justify-center">
             <Folder size={26} strokeWidth={2} />
           </div>
           <div>
             <h1 className="text-3xl font-bold text-stone-900 tracking-tight leading-none mb-1">
               {formData.title || 'Название раздела'}
             </h1>
             <p className="text-stone-400 text-sm font-medium">Настройка контента</p>
           </div>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => navigate(`/admin/category/${categoryId}`)}>Назад</Button>
          <Button onClick={handleSave}><Save size={16} strokeWidth={3} /> Сохранить</Button>
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
                 <h3 className="font-bold text-stone-800 text-lg">Контент</h3>
                 <p className="text-stone-400 text-xs font-medium mt-1">Промты, связки и ассистенты</p>
               </div>
               <div className="flex gap-2">
                 <Button variant="secondary" className="!py-2 !px-3 !text-xs" onClick={() => handleAddItem(ItemType.PROMPT)}>
                   <Plus size={14} /> Промт
                 </Button>
                 <Button variant="secondary" className="!py-2 !px-3 !text-xs" onClick={() => handleAddItem(ItemType.SEQUENCE)}>
                   <Plus size={14} /> Связка (Цепочка)
                 </Button>
                 <Button variant="secondary" className="!py-2 !px-3 !text-xs" onClick={() => handleAddItem(ItemType.ASSISTANT)}>
                   <Plus size={14} /> Ассистент
                 </Button>
               </div>
            </div>
            
            <div className="space-y-3">
              {section.items.map((item, idx) => (
                <div key={item.id} className="flex items-center justify-between p-5 rounded-2xl bg-white border border-stone-100 hover:border-blue-200 hover:shadow-soft transition-all group animate-enter" style={{ animationDelay: `${idx * 0.05}s` }}>
                  <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-xl ${item.type === ItemType.ASSISTANT ? 'bg-rose-50 text-rose-600' : (item.type === ItemType.SEQUENCE ? 'bg-violet-50 text-violet-600' : 'bg-orange-50 text-orange-600')}`}>
                      {item.type === ItemType.ASSISTANT ? <Bot size={20} /> : (item.type === ItemType.SEQUENCE ? <Layers size={20} /> : <FileText size={20} />)}
                    </div>
                    <div>
                      <div className="font-bold text-stone-800 text-sm">{item.title}</div>
                      <div className="text-xs text-stone-400 truncate max-w-[300px] font-medium mt-0.5 flex items-center gap-2">
                        <span className="uppercase text-[9px] tracking-wider bg-stone-100 px-1.5 py-0.5 rounded">
                          {item.type === ItemType.SEQUENCE ? 'Цепочка' : (item.type === ItemType.ASSISTANT ? 'Ассистент' : 'Промт')}
                        </span>
                        {item.description}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                    <Button variant="secondary" className="!px-3 !py-1.5 !text-xs" onClick={() => navigate(`/admin/category/${categoryId}/section/${sectionId}/item/${item.id}`)}>
                      Изменить
                    </Button>
                    <button onClick={() => deleteItem(categoryId!, sectionId!, item.id)} className="p-2 text-stone-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {section.items.length === 0 && (
                 <div className="text-center py-12 bg-stone-50/50 rounded-3xl border border-dashed border-stone-200">
                   <p className="text-stone-400 font-medium text-sm">Список пуст</p>
                 </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

const ItemEditor = () => {
  const { categoryId, sectionId, itemId } = useParams();
  const { getItem, updateItem } = useData();
  const navigate = useNavigate();
  const item = getItem(categoryId!, sectionId!, itemId!);
  
  const [formData, setFormData] = useState<Partial<PromptItem>>({});

  useEffect(() => {
    if (item) setFormData(item);
  }, [item]);

  if (!item) return <div>Item not found</div>;

  const handleSave = async () => {
    await updateItem(categoryId!, sectionId!, itemId!, formData);
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
      <div className="max-w-4xl mx-auto animate-enter">
        <div className="flex items-center justify-between mb-10">
           <div className="flex items-center gap-5">
              <div className={`w-14 h-14 rounded-[1.2rem] border border-stone-100 flex items-center justify-center shadow-sm ${
                isAssistant ? 'bg-rose-50 text-rose-600' : (isSequence ? 'bg-violet-50 text-violet-600' : 'bg-orange-50 text-orange-600')
              }`}>
                {isAssistant ? <Bot size={26} /> : (isSequence ? <Layers size={26} /> : <FileText size={26} />)}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-stone-900 tracking-tight leading-none mb-1">
                  Редактирование
                </h1>
                <p className="text-stone-400 text-sm font-medium">
                  {isAssistant ? 'GPT Ассистент' : (isSequence ? 'Связка промтов' : 'Промт')}
                </p>
              </div>
           </div>
           <div className="flex gap-3">
             <Button variant="secondary" onClick={() => navigate(-1)}>Отмена</Button>
             <Button onClick={handleSave}><Save size={16} strokeWidth={3} /> Сохранить</Button>
           </div>
        </div>

        <div className="grid gap-8">
          <Card>
            <h3 className="font-bold text-stone-800 mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-stone-800"></span>
              Базовая информация
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Input 
                label="Заголовок" 
                value={formData.title || ''} 
                onChange={(e: any) => setFormData({...formData, title: e.target.value})} 
              />
              <div className="mb-5">
                 <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2 ml-1">Тип элемента</label>
                 <div className="relative">
                    <select 
                      value={formData.type} 
                      onChange={(e) => setFormData({...formData, type: e.target.value as ItemType})}
                      className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3.5 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all text-sm font-medium text-stone-800 shadow-sm appearance-none"
                    >
                      <option value={ItemType.PROMPT}>Промт (Один запрос)</option>
                      <option value={ItemType.SEQUENCE}>Связка (Несколько шагов)</option>
                      <option value={ItemType.ASSISTANT}>Ассистент (Настройка GPT)</option>
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-stone-400">
                      <ChevronRight size={16} className="rotate-90" />
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
               <div className="mb-2">
                 <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2 ml-1">
                   {isAssistant ? "Custom Instructions (Системный промт)" : "Текст промта"}
                 </label>
                 <textarea 
                    rows={16}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-6 py-6 transition-all outline-none text-stone-200 font-mono text-sm leading-relaxed shadow-inner resize-y focus:ring-4 focus:ring-stone-800/50"
                    value={formData.content || ''}
                    onChange={(e: any) => setFormData({...formData, content: e.target.value})} 
                 />
               </div>
             )}
          </Card>

          {/* Dynamic List for Sequences (and Assistants) */}
          {(isSequence || isAssistant) && (
            <div className="border-t border-stone-200 pt-8 mt-2">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-xl font-bold text-stone-800">
                   {isSequence ? 'Шаги связки (Цепочка)' : 'Дополнительные промты'}
                 </h3>
                 <Button variant="secondary" className="!py-2 !px-4 !text-xs" onClick={handleAddSubPrompt}>
                   <Plus size={16} /> Добавить шаг
                 </Button>
              </div>

              <div className="space-y-6">
                 {(formData.subPrompts || []).map((sub, idx) => (
                   <div key={idx} className="bg-white p-6 rounded-[2rem] border border-stone-200 shadow-sm relative group hover:border-orange-200 transition-all">
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-stone-100 rounded-l-[2rem] group-hover:bg-orange-400 transition-colors"></div>
                      <div className="flex justify-between items-start mb-4 pl-2">
                         <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 text-xs font-bold">
                              {idx + 1}
                            </div>
                            <input 
                              type="text" 
                              className="bg-transparent font-bold text-stone-800 border-b border-transparent hover:border-stone-200 focus:border-orange-400 outline-none transition-all"
                              value={sub.title}
                              onChange={(e) => handleUpdateSubPrompt(idx, 'title', e.target.value)}
                              placeholder="Название шага"
                            />
                         </div>
                         <button onClick={() => handleDeleteSubPrompt(idx)} className="text-stone-300 hover:text-rose-500 transition-colors">
                           <X size={18} />
                         </button>
                      </div>
                      <textarea 
                         rows={6}
                         className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all text-sm font-mono text-stone-600 resize-y"
                         value={sub.content}
                         onChange={(e) => handleUpdateSubPrompt(idx, 'content', e.target.value)}
                         placeholder="Текст промта для этого шага..."
                      />
                   </div>
                 ))}
                 {(formData.subPrompts || []).length === 0 && (
                    <div className="text-center py-10 border-2 border-dashed border-stone-200 rounded-3xl text-stone-400">
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
    return localStorage.getItem('gpt_admin_auth') === 'true';
  });

  const handleLogin = (status: boolean) => {
    setIsAuthenticated(status);
    if (status) {
        localStorage.setItem('gpt_admin_auth', 'true');
    }
  };

  const handleLogout = () => {
      setIsAuthenticated(false);
      localStorage.removeItem('gpt_admin_auth');
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <Routes>
      <Route path="/" element={<AdminDashboard onLogout={handleLogout} />} />
      <Route path="/category/:categoryId" element={<CategoryEditor />} />
      <Route path="/category/:categoryId/section/:sectionId" element={<SectionEditor />} />
      <Route path="/category/:categoryId/section/:sectionId/item/:itemId" element={<ItemEditor />} />
    </Routes>
  );
};

export default Admin;