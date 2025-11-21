import { Category, ItemType } from './types';

export const CATEGORIES: Category[] = [
  {
    id: 'analysis',
    title: 'Анализ ЦА',
    description: 'Найди скрытые смыслы',
    imageUrl: 'https://picsum.photos/seed/analysis/400/200',
    sections: [
      {
        id: 'analysis-prompts',
        title: 'Промты: Распаковка личности',
        description: 'Базовые инструменты для глубокого анализа аудитории.',
        instructions: 'В этом разделе собраны промты, которые помогут вам сегментировать аудиторию. Используйте их последовательно: сначала общий анализ, затем детализация аватаров.',
        items: [
          {
            id: 'avatar-creation',
            title: 'Создание аватара клиента',
            type: ItemType.PROMPT,
            description: 'Генерирует детальный портрет идеального клиента на основе базовых вводных.',
            instructions: 'Вставьте описание вашей ниши и продукта в квадратные скобки. Не меняйте структуру запроса.',
            content: `Действуй как опытный маркетолог с 10-летним стажем.
Твоя задача — создать детальный аватар клиента для ниши: [ОПИСАНИЕ НИШИ] и продукта: [ОПИСАНИЕ ПРОДУКТА].

Опиши следующие пункты:
1. Социально-демографические характеристики.
2. Психографика (ценности, страхи, мечты).
3. Боли и потребности, которые закрывает продукт.
4. Возражения при покупке.`
          },
          {
            id: 'pain-points',
            title: 'Выявление скрытых болей',
            type: ItemType.PROMPT,
            description: 'Помогает найти неочевидные проблемы аудитории для использования в контенте.',
            instructions: 'Используйте этот промт после того, как определитесь с базовым аватаром.',
            content: `Проанализируй целевую аудиторию: [ОПИСАНИЕ АУДИТОРИИ].
Напиши список из 10 скрытых, неочевидных болей, в которых эти люди могут не признаваться даже себе.
Для каждой боли предложи тему поста, который мягко затронет эту проблему.`
          }
        ]
      },
      {
        id: 'analysis-assistants',
        title: 'GPT-Ассистенты: Маркетолог',
        items: [
          {
            id: 'assistant-strategist',
            title: 'Ассистент: Главный Стратег',
            type: ItemType.ASSISTANT,
            description: 'Настроенный бот, который помнит контекст вашего проекта и критикует идеи.',
            instructions: 'Скопируйте текст ниже в поле "Custom Instructions" вашего ChatGPT или создайте нового GPTs.',
            content: `Role: Ты — Senior Marketing Strategist.
Tone: Профессиональный, критичный, ориентированный на данные.
Task: Твоя цель — подвергать сомнению гипотезы пользователя, искать логические дыры в маркетинговых стратегиях и предлагать улучшения на основе поведенческой психологии.
Никогда не хвали идею просто так. Всегда предлагай альтернативу.`,
            subPrompts: [
              { title: 'Критика оффера', content: 'Прокритикуй мой текущий оффер: [ТЕКСТ ОФФЕРА]. Найди 3 слабых места.' },
              { title: 'Поиск конкурентов', content: 'Какие неочевидные конкуренты могут быть у продукта [ПРОДУКТ]?' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'content-strategy',
    title: 'Контент-стратегия',
    description: 'Под разные типы контента',
    imageUrl: 'https://picsum.photos/seed/strategy/400/200',
    sections: [
      {
        id: 'plan-generation',
        title: 'Генерация контент-планов',
        instructions: 'Используйте эти промты для планирования на месяц вперед.',
        items: [
          {
            id: 'month-plan',
            title: 'Контент-план на месяц',
            type: ItemType.PROMPT,
            description: 'Создает сбалансированный план публикаций (продающие, развлекательные, полезные).',
            instructions: 'Укажите частоту постинга и основные цели месяца.',
            content: `Создай контент-план для Instagram на 30 дней.
Ниша: [НИША].
Цель месяца: [ЦЕЛЬ, НАПРИМЕР: ПРОДАЖА КУРСА].
Частота: 1 пост в день + 3 сторис.
Используй формулу 40% пользы, 30% личности, 30% продаж.
Выдай результат в виде таблицы.`
          }
        ]
      }
    ]
  },
  {
    id: 'style-voice',
    title: 'Твой стиль речи',
    description: 'Чтобы ChatGPT писал как ты',
    imageUrl: 'https://picsum.photos/seed/voice/400/200',
    sections: [
      {
        id: 'tone-of-voice',
        title: 'Настройка Tone of Voice',
        items: [
          {
            id: 'analyze-style',
            title: 'Анализ авторского стиля',
            type: ItemType.PROMPT,
            description: 'Скармливаете GPT свои тексты, чтобы он научился вашему слогу.',
            instructions: 'Соберите 3-5 своих лучших текстов и вставьте их в промт.',
            content: `Я отправлю тебе несколько примеров моих текстов.
Твоя задача — проанализировать мой стиль письма (tone of voice).
Выдели особенности:
1. Длина предложений.
2. Использование сленга или терминологии.
3. Эмоциональная окраска.
4. Структура абзацев.
После анализа составь инструкцию для себя, как писать в моем стиле.
Вот тексты: [ВСТАВИТЬ ТЕКСТЫ]`
          }
        ]
      }
    ]
  },
  {
    id: 'engineering',
    title: 'Промт-инженеринг',
    description: 'Чтобы решать любую задачу',
    imageUrl: 'https://picsum.photos/seed/engineer/400/200',
    sections: [
      {
        id: 'advanced-techniques',
        title: 'Продвинутые техники',
        items: [
          {
            id: 'chain-of-thought',
            title: 'Chain of Thought (Цепочка мыслей)',
            type: ItemType.PROMPT,
            description: 'Заставляет модель рассуждать пошагово перед ответом.',
            instructions: 'Добавляйте этот фрагмент к сложным логическим задачам.',
            content: `[ВАША ЗАДАЧА]

Перед тем как дать окончательный ответ, рассуждай пошагово. Опиши ход своих мыслей, рассмотри разные варианты решения и выбери лучший. Начинай ответ с фразы "Давай подумаем..."`
          }
        ]
      }
    ]
  },
  {
    id: 'posts',
    title: 'Посты',
    description: 'Для телеграм, инстаграм',
    imageUrl: 'https://picsum.photos/seed/posts/400/200',
    sections: []
  },
  {
    id: 'training',
    title: 'Обучение ChatGPT',
    description: 'Под свою личность',
    imageUrl: 'https://picsum.photos/seed/training/400/200',
    sections: []
  }
];

export function getCategory(id: string) {
  return CATEGORIES.find(c => c.id === id);
}

export function getSection(categoryId: string, sectionId: string) {
  const category = getCategory(categoryId);
  return category?.sections.find(s => s.id === sectionId);
}

export function getItem(categoryId: string, sectionId: string, itemId: string) {
  const section = getSection(categoryId, sectionId);
  return section?.items.find(i => i.id === itemId);
}