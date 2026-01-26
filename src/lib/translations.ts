// Translations for Russian (ru) and Kazakh (kk)

export type Language = 'ru' | 'kk';

export const translations = {
  ru: {
    // Common
    loading: 'Загрузка...',
    error: 'Ошибка',
    success: 'Успешно',
    save: 'Сохранить',
    cancel: 'Отмена',
    back: 'Назад',
    next: 'Далее',
    submit: 'Отправить',
    retry: 'Повторить',
    
    // Network errors
    network_error: 'Сервис временно недоступен. Проверьте интернет-соединение.',
    
    // Language selection
    select_language: 'Выберите язык',
    language_ru: '🇷🇺 Русский',
    language_kk: '🇰🇿 Қазақша',
    
    // Registration
    registration: 'Регистрация',
    agent_number: 'Номер агента',
    agent_number_placeholder: 'Введите номер агента',
    mentor_number: 'Номер наставника',
    mentor_number_placeholder: 'Введите номер наставника',
    full_name: 'Полное имя',
    full_name_placeholder: 'Введите ваше имя',
    phone: 'Телефон',
    phone_placeholder: '+7 (___) ___-__-__',
    goal: 'Цель дохода через 90 дней',
    goal_placeholder: 'Например: 500000',
    register: 'Зарегистрироваться',
    field_required: 'Это поле обязательно',
    registration_success: 'Регистрация успешна!',
    
    // Error reasons from backend
    agent_not_found: 'Агент не найден в системе',
    mentor_not_found: 'Наставник не найден в системе',
    already_registered: 'Вы уже зарегистрированы',
    invalid_data: 'Неверные данные',
    
    // Navigation
    nav_progress: 'Прогресс',
    nav_team: 'Команда',
    nav_stats: 'Статистика',
    nav_settings: 'Настройки',
    
    // Cabinet / Progress
    my_progress: 'Мой прогресс',
    day_of_program: 'День программы',
    stage: 'Этап',
    status: 'Статус',
    todays_content: 'Контент дня',
    tasks: 'Задачи',
    fill_report: 'Заполнить отчёт',
    watch_video: 'Смотреть видео',
    
    // Stages
    stage_novice: 'Новичок',
    stage_mentor: 'Наставник',
    stage_leader: 'Лидер',
    stage_completed: 'Завершено',
    
    // Status
    status_active: 'Активный',
    status_paused: 'Приостановлен',
    status_completed: 'Завершён',
    
    // Report
    daily_report: 'Отчёт за день',
    report_submitted: 'Отчёт принят!',
    report_error: 'Ошибка отправки отчёта',
    
    // Team
    my_team: 'Моя команда',
    students: 'Ученики',
    no_students: 'У вас пока нет учеников',
    view: 'Смотреть',
    last_activity: 'Последняя активность',
    
    // Student card
    student_details: 'Карточка ученика',
    report_history: 'История отчётов',
    write_telegram: 'Написать в Telegram',
    copy_message: 'Скопировать сообщение',
    message_copied: 'Сообщение скопировано!',
    
    // Statistics
    statistics: 'Статистика',
    total_students: 'Всего учеников',
    active_students: 'Активные',
    warning_students: 'Требуют внимания',
    inactive_students: 'Неактивные',
    by_stages: 'По этапам',
    reports_7_days: 'Отчёты за 7 дней',
    done: 'Выполнено',
    partial: 'Частично',
    missed: 'Пропущено',
    
    // Settings
    settings: 'Настройки',
    change_language: 'Сменить язык',
    language_updated: 'Язык обновлён',
    current_language: 'Текущий язык',
    
    // Welcome
    welcome: 'Добро пожаловать в',
    freedom_life: 'Freedom Life 5×5',
    start_journey: 'Начните свой путь к финансовой свободе',
  },
  
  kk: {
    // Common
    loading: 'Жүктелуде...',
    error: 'Қате',
    success: 'Сәтті',
    save: 'Сақтау',
    cancel: 'Болдырмау',
    back: 'Артқа',
    next: 'Келесі',
    submit: 'Жіберу',
    retry: 'Қайталау',
    
    // Network errors
    network_error: 'Сервис уақытша қолжетімсіз. Интернет қосылымын тексеріңіз.',
    
    // Language selection
    select_language: 'Тілді таңдаңыз',
    language_ru: '🇷🇺 Русский',
    language_kk: '🇰🇿 Қазақша',
    
    // Registration
    registration: 'Тіркелу',
    agent_number: 'Агент нөмірі',
    agent_number_placeholder: 'Агент нөмірін енгізіңіз',
    mentor_number: 'Тәлімгер нөмірі',
    mentor_number_placeholder: 'Тәлімгер нөмірін енгізіңіз',
    full_name: 'Толық аты-жөні',
    full_name_placeholder: 'Атыңызды енгізіңіз',
    phone: 'Телефон',
    phone_placeholder: '+7 (___) ___-__-__',
    goal: '90 күндегі табыс мақсаты',
    goal_placeholder: 'Мысалы: 500000',
    register: 'Тіркелу',
    field_required: 'Бұл өріс міндетті',
    registration_success: 'Тіркелу сәтті!',
    
    // Error reasons from backend
    agent_not_found: 'Агент жүйеде табылмады',
    mentor_not_found: 'Тәлімгер жүйеде табылмады',
    already_registered: 'Сіз бұрын тіркелгенсіз',
    invalid_data: 'Қате деректер',
    
    // Navigation
    nav_progress: 'Прогресс',
    nav_team: 'Команда',
    nav_stats: 'Статистика',
    nav_settings: 'Баптаулар',
    
    // Cabinet / Progress
    my_progress: 'Менің прогресім',
    day_of_program: 'Бағдарлама күні',
    stage: 'Кезең',
    status: 'Күйі',
    todays_content: 'Бүгінгі мазмұн',
    tasks: 'Тапсырмалар',
    fill_report: 'Есеп толтыру',
    watch_video: 'Бейнені қарау',
    
    // Stages
    stage_novice: 'Жаңадан бастаған',
    stage_mentor: 'Тәлімгер',
    stage_leader: 'Лидер',
    stage_completed: 'Аяқталды',
    
    // Status
    status_active: 'Белсенді',
    status_paused: 'Тоқтатылған',
    status_completed: 'Аяқталған',
    
    // Report
    daily_report: 'Күнделікті есеп',
    report_submitted: 'Есеп қабылданды!',
    report_error: 'Есеп жіберу қатесі',
    
    // Team
    my_team: 'Менің командам',
    students: 'Шәкірттер',
    no_students: 'Сізде әзірге шәкірттер жоқ',
    view: 'Қарау',
    last_activity: 'Соңғы белсенділік',
    
    // Student card
    student_details: 'Шәкірт картасы',
    report_history: 'Есептер тарихы',
    write_telegram: 'Telegram-ға жазу',
    copy_message: 'Хабарламаны көшіру',
    message_copied: 'Хабарлама көшірілді!',
    
    // Statistics
    statistics: 'Статистика',
    total_students: 'Барлық шәкірттер',
    active_students: 'Белсенді',
    warning_students: 'Назар аударуды қажет етеді',
    inactive_students: 'Белсенді емес',
    by_stages: 'Кезеңдер бойынша',
    reports_7_days: '7 күндегі есептер',
    done: 'Орындалды',
    partial: 'Жартылай',
    missed: 'Жіберілді',
    
    // Settings
    settings: 'Баптаулар',
    change_language: 'Тілді өзгерту',
    language_updated: 'Тіл жаңартылды',
    current_language: 'Ағымдағы тіл',
    
    // Welcome
    welcome: 'Қош келдіңіз',
    freedom_life: 'Freedom Life 5×5',
    start_journey: 'Қаржылық еркіндікке жол бастаңыз',
  },
} as const;

export type TranslationKey = keyof typeof translations.ru;

export function t(key: TranslationKey, language: Language): string {
  return translations[language][key] || translations.ru[key] || key;
}
