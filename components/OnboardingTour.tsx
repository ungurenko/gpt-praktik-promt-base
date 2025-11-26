
import React, { useEffect } from 'react';
// @ts-ignore
import { driver } from 'driver.js';

const OnboardingTour: React.FC = () => {
  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('onboarding_completed');

    if (!hasCompletedOnboarding) {
      const driverObj = driver({
        showProgress: true,
        allowClose: true,
        popoverClass: 'gpt-theme',
        doneBtnText: 'Завершить',
        nextBtnText: 'Далее',
        prevBtnText: 'Назад',
        // We use the destroy event to save state so it doesn't run again
        onDestroy: () => {
          localStorage.setItem('onboarding_completed', 'true');
        },
        steps: [
          { 
            popover: { 
              title: 'Добро пожаловать в GPT-ПРАКТИК', 
              description: 'Давай я быстро покажу, как найти идеальный промт за 30 секунд.',
              nextBtnText: 'Погнали'
            } 
          },
          { 
            element: '#tour-search', 
            popover: { 
              title: 'Умный поиск', 
              description: 'Начни отсюда. Введи тему, например "Reels" или "Анализ ЦА", чтобы быстро найти нужный инструмент.' 
            } 
          },
          { 
            element: '#tour-categories', 
            popover: { 
              title: 'Категории', 
              description: 'Или выбери готовую подборку инструментов под свою задачу из каталога.' 
            } 
          },
          { 
            element: '#tour-settings', 
            popover: { 
              title: 'Настройки', 
              description: 'Тут можно переключить тему и настроить профиль администратора.' 
            } 
          },
        ]
      });

      // Small delay to ensure DOM is ready
      setTimeout(() => {
        driverObj.drive();
      }, 1000);
    }
  }, []);

  return null;
};

export default OnboardingTour;
