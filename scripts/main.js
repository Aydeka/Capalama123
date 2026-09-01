'use strict';

const STORAGE_KEYS = {
  savedPalettes: 'colorpal.savedPalettes',
  savedPlans: 'colorpal.savedPlans',
  appTheme: 'colorpal.appTheme',
  lang: 'colorpal.lang',
};

const DEFAULT_FURNITURE = [
  { id: 1, name: 'Диван', width: 2.4, depth: 1.2, qty: 1 },
  { id: 2, name: 'Шкаф', width: 1.8, depth: 0.6, qty: 1 },
  { id: 3, name: 'Стол', width: 1.2, depth: 0.8, qty: 1 },
  { id: 4, name: 'Кровать', width: 1.8, depth: 2, qty: 1 },
];

let furnitureItems = DEFAULT_FURNITURE.map((item) => ({ ...item }));

const ROOM_TEMPLATES = {
  apartment: {
    label: { ru: 'Квартира', en: 'Apartment' },
    headline: { ru: 'Гармоничная схема для квартиры', en: 'A balanced setup for an apartment' },
    summary: {
      ru: 'Подходит для семьи, когда важно совмещать отдых, хранение и функциональную кухню в одной логике.',
      en: 'Works well for families who need a comfortable blend of rest, storage, and functional kitchen zones.',
    },
    zones: [
      { name: { ru: 'Гостиная', en: 'Living room' }, share: 0.36, note: { ru: 'Диван, свет и зона ТВ в центре.', en: 'Sofa, lighting, and TV area in the center.' } },
      { name: { ru: 'Спальня', en: 'Bedroom' }, share: 0.22, note: { ru: 'Спальное место отделено ширмой или стеллажом.', en: 'Sleeping area separated by a screen or shelving.' } },
      { name: { ru: 'Кухня', en: 'Kitchen' }, share: 0.2, note: { ru: 'Рабочий треугольник и минимум перегородок.', en: 'Work triangle and minimal barriers.' } },
      { name: { ru: 'Хранение', en: 'Storage' }, share: 0.14, note: { ru: 'Высокие шкафы до потолка для экономии места.', en: 'Tall built-ins to save space and improve storage.' } },
      { name: { ru: 'Прихожая', en: 'Entry' }, share: 0.08, note: { ru: 'Вешалка, зеркало и банкетка в узком входе.', en: 'Hook rail, mirror, and bench in a compact entry.' } },
    ],
    shopping: {
      ru: ['Шкаф в коридор 1 шт', 'Диван 2-3 м', 'Стол 120–160 см', 'Лампы на 2 зоны'],
      en: ['Hall cabinet x1', 'Sofa 2-3 m', 'Table 120–160 cm', 'Lighting for 2 zones'],
    },
  },
  studio: {
    label: { ru: 'Студия', en: 'Studio' },
    headline: { ru: 'Открытая планировка для студии', en: 'Open-plan layout for a studio' },
    summary: {
      ru: 'Лучше всего работает через мягкие границы: ковры, шкафы и световые линии.',
      en: 'Works best with soft boundaries: rugs, storage walls, and light zoning.',
    },
    zones: [
      { name: { ru: 'Жилая зона', en: 'Living area' }, share: 0.42, note: { ru: 'Кровать можно скрыть в шкафу или делать спальным диваном.', en: 'Bed can be hidden in storage or used as a sofa bed.' } },
      { name: { ru: 'Рабочая зона', en: 'Work zone' }, share: 0.18, note: { ru: 'Письменный стол у окна, максимум 1–2 предмета.', en: 'Desk by the window, kept minimal and compact.' } },
      { name: { ru: 'Кухня', en: 'Kitchen' }, share: 0.2, note: { ru: 'Глухая барная линия разделяет функцию и хранение.', en: 'A slim bar counter separates work and living zones.' } },
      { name: { ru: 'Хранение', en: 'Storage' }, share: 0.12, note: { ru: 'Платяной шкаф по одной стене рядом с входом.', en: 'Wardrobe along one wall by the entry.' } },
      { name: { ru: 'Вход', en: 'Entry' }, share: 0.08, note: { ru: 'Небольшая консоль и зеркало для логики пространства.', en: 'Small console and mirror to keep the entry clear.' } },
    ],
    shopping: {
      ru: ['Кровать-диван 1 шт', 'Стеллаж 1–2 шт', 'Барная стойка 1 шт', 'Точечные светильники 4–6 шт'],
      en: ['Sofa bed x1', 'Shelving x1-2', 'Bar counter x1', 'Spot lights x4-6'],
    },
  },
  kitchen: {
    label: { ru: 'Кухня', en: 'Kitchen' },
    headline: { ru: 'Функциональная кухня по принципу рабочего треугольника', en: 'Functional kitchen using a work-triangle layout' },
    summary: {
      ru: 'Винил, плитка и хранение под столешницей важнее декоративных перегородок.',
      en: 'Tiles, durable surfaces, and under-counter storage matter more than decorative partitions.',
    },
    zones: [
      { name: { ru: 'Рабочая зона', en: 'Work zone' }, share: 0.34, note: { ru: 'Плита, раковина и холодильник — близко, но не впритык.', en: 'Stove, sink, and fridge stay close but not cramped.' } },
      { name: { ru: 'Столовая', en: 'Dining' }, share: 0.26, note: { ru: 'Стол на 2–4 места, максимум 1-2 посадочных места.', en: 'Dining for 2–4 places, compact and efficient.' } },
      { name: { ru: 'Хранение', en: 'Storage' }, share: 0.22, note: { ru: 'Верхние шкафы и встроенные секции до потолка.', en: 'High cabinets and built-in sections to the ceiling.' } },
      { name: { ru: 'Переход', en: 'Passage' }, share: 0.1, note: { ru: 'Минимум 80 см для комфортного прохода.', en: 'At least 80 cm for comfortable movement.' } },
      { name: { ru: 'Бар', en: 'Bar' }, share: 0.08, note: { ru: 'Включается как зона питания или рабочий стол.', en: 'Works as a meal prep or casual dining surface.' } },
    ],
    shopping: {
      ru: ['Столешница 1 шт', 'Шкафы до потолка 2–3 м', 'Свет под фасадом 1 набор', 'Плитка 2–3 кв. м'],
      en: ['Countertop x1', 'Cabinets 2–3 m', 'Undercabinet lights x1', 'Tiles 2–3 sq m'],
    },
  },
  living: {
    label: { ru: 'Гостиная', en: 'Living room' },
    headline: { ru: 'Комфортный зал для отдыха и приёма гостей', en: 'Comfortable living room for relaxing and hosting' },
    summary: {
      ru: 'Свет и симметрия важнее перегруженности мебелью: лучше меньше, но хорошо.',
      en: 'Lighting and balance matter more than filling every corner with furniture.',
    },
    zones: [
      { name: { ru: 'Сидячая зона', en: 'Seating zone' }, share: 0.38, note: { ru: 'Диван и два кресла в одной оси.', en: 'Sofa and two chairs aligned on one axis.' } },
      { name: { ru: 'Телевизор', en: 'Media' }, share: 0.18, note: { ru: 'Экран на расстоянии 1,5–2 м от дивана.', en: 'Screen set 1.5–2 m from the sofa.' } },
      { name: { ru: 'Книжная зона', en: 'Reading corner' }, share: 0.14, note: { ru: 'Кресло и лампа создают уют.', en: 'Armchair and lamp add a cozy reading corner.' } },
      { name: { ru: 'Хранение', en: 'Storage' }, share: 0.18, note: { ru: 'Шкаф или стеллаж вдоль стены.', en: 'Cabinet or shelving along the wall.' } },
      { name: { ru: 'Переход', en: 'Flow' }, share: 0.12, note: { ru: 'Не перегружайте проход широкими предметами.', en: 'Leave a clear path for movement and circulation.' } },
    ],
    shopping: {
      ru: ['Диван 2–3 м', 'Кресло 2 шт', 'Журнальный стол 1 шт', 'Торшер 2 шт'],
      en: ['Sofa 2–3 m', 'Chair x2', 'Coffee table x1', 'Floor lamp x2'],
    },
  },
  house: {
    label: { ru: 'Дом', en: 'House' },
    headline: { ru: 'Дом: зонирование для всего пространства', en: 'House: overall zoning for the whole space' },
    summary: {
      ru: 'В частном доме лучше делать одну тёплую и одну спокойную зону, чтобы не перегружать интерьер.',
      en: 'In a private home, it helps to balance warm living areas with calmer, quieter rooms.',
    },
    zones: [
      { name: { ru: 'Центр дома', en: 'Core living' }, share: 0.34, note: { ru: 'Комната для семьи и гостей с центральным светом.', en: 'Family and guest area with a central light source.' } },
      { name: { ru: 'Спальня', en: 'Bedroom' }, share: 0.2, note: { ru: 'Спокойная зона возле окна для тишины.', en: 'Quiet zone near a window for rest.' } },
      { name: { ru: 'Кухня', en: 'Kitchen' }, share: 0.16, note: { ru: 'Площадь зависит от готовки и приёма гостей.', en: 'Size depends on cooking and gathering patterns.' } },
      { name: { ru: 'Хранение', en: 'Storage' }, share: 0.18, note: { ru: 'Шкафы в проходах экономят полезное пространство.', en: 'Storage in hallways saves usable room.' } },
      { name: { ru: 'Техническая зона', en: 'Utility' }, share: 0.12, note: { ru: 'Стиральная машина, сушилка и сушильный шкаф.', en: 'Washer, dryer, and utility cabinet.' } },
    ],
    shopping: {
      ru: ['Семейный диван 1 шт', 'Спальный комплект 1 шт', 'Потолочные светильники 3–4 шт', 'Встроенные шкафы 2 шт'],
      en: ['Family sofa x1', 'Bedroom set x1', 'Ceiling lights x3-4', 'Built-in cabinets x2'],
    },
  },
};

const STYLE_LIBRARY = {
  scandi: {
    colors: ['#F5F1E8', '#D7C9B2', '#839D8B', '#324B44', '#D5825F'],
    materials: {
      ru: ['Натуральное дерево', 'Льняной текстиль', 'Матовая керамика', 'Мягкий свет'],
      en: ['Natural wood', 'Linen textiles', 'Matte ceramics', 'Soft lighting'],
    },
  },
  loft: {
    colors: ['#D9D2C5', '#6E6258', '#B96A4C', '#3E4045', '#EADDC5'],
    materials: {
      ru: ['Кирпичная или бетонная фактура', 'Металл', 'Тёмная древесина', 'Текстиль в грубых тонах'],
      en: ['Brick or concrete texture', 'Metal', 'Dark wood', 'Textile in raw tones'],
    },
  },
  minimalism: {
    colors: ['#F3F4F6', '#D9E0E8', '#7F8CA5', '#222831', '#E8C7B7'],
    materials: {
      ru: ['Гладкие фасады', 'Матовое стекло', 'Белый бетон', 'Простые светильники'],
      en: ['Smooth fronts', 'Matte glass', 'White concrete', 'Simple fixtures'],
    },
  },
  warm: {
    colors: ['#F7E6D0', '#D79D6F', '#B6704A', '#745647', '#F3D3A3'],
    materials: {
      ru: ['Тёплый массив', 'Текстиль в бежевых тонах', 'Мягкая шерсть', 'Тёплый свет 2700K'],
      en: ['Warm timber', 'Beige upholstery', 'Soft wool', 'Warm 2700K lighting'],
    },
  },
  modern: {
    colors: ['#EDF1F5', '#C8D5DB', '#4B6B7C', '#1F2937', '#E6B99B'],
    materials: {
      ru: ['Высокий глянец', 'Ламинированные панели', 'Хром и стекло', 'Световые линии'],
      en: ['High-gloss surfaces', 'Laminated panels', 'Chrome and glass', 'Linear lighting'],
    },
  },
};

const LAYOUT_LIBRARY = {
  apartment: [
    { label: { ru: 'Диван', en: 'Sofa' }, x: 1, y: 1, w: 3, h: 2, tone: 'primary' },
    { label: { ru: 'ТВ', en: 'TV' }, x: 4, y: 1, w: 2, h: 1, tone: 'secondary' },
    { label: { ru: 'Кровать', en: 'Bed' }, x: 1, y: 3, w: 2, h: 2, tone: 'secondary' },
    { label: { ru: 'Шкаф', en: 'Wardrobe' }, x: 4, y: 3, w: 2, h: 2, tone: 'secondary' },
    { label: { ru: 'Стол', en: 'Table' }, x: 3, y: 5, w: 2, h: 1, tone: 'primary' },
  ],
  studio: [
    { label: { ru: 'Кровать', en: 'Bed' }, x: 1, y: 1, w: 2, h: 2, tone: 'primary' },
    { label: { ru: 'Диван', en: 'Sofa' }, x: 3, y: 1, w: 3, h: 2, tone: 'primary' },
    { label: { ru: 'Стол', en: 'Desk' }, x: 1, y: 4, w: 2, h: 1, tone: 'secondary' },
    { label: { ru: 'Кухня', en: 'Kitchen' }, x: 4, y: 4, w: 2, h: 2, tone: 'secondary' },
    { label: { ru: 'Шкаф', en: 'Storage' }, x: 1, y: 5, w: 2, h: 1, tone: 'secondary' },
  ],
  kitchen: [
    { label: { ru: 'Плита', en: 'Cooktop' }, x: 1, y: 1, w: 2, h: 2, tone: 'primary' },
    { label: { ru: 'Мойка', en: 'Sink' }, x: 3, y: 1, w: 2, h: 2, tone: 'primary' },
    { label: { ru: 'Холод', en: 'Fridge' }, x: 5, y: 1, w: 1, h: 2, tone: 'secondary' },
    { label: { ru: 'Стол', en: 'Table' }, x: 2, y: 4, w: 2, h: 2, tone: 'secondary' },
    { label: { ru: 'Шкаф', en: 'Storage' }, x: 4, y: 4, w: 2, h: 2, tone: 'secondary' },
  ],
  living: [
    { label: { ru: 'Диван', en: 'Sofa' }, x: 1, y: 1, w: 3, h: 2, tone: 'primary' },
    { label: { ru: 'Кресло', en: 'Chair' }, x: 4, y: 1, w: 2, h: 1, tone: 'secondary' },
    { label: { ru: 'ТВ', en: 'TV' }, x: 4, y: 2, w: 2, h: 1, tone: 'secondary' },
    { label: { ru: 'Стол', en: 'Table' }, x: 2, y: 4, w: 2, h: 1, tone: 'primary' },
    { label: { ru: 'Полка', en: 'Shelf' }, x: 1, y: 5, w: 2, h: 1, tone: 'secondary' },
  ],
  house: [
    { label: { ru: 'Диван', en: 'Sofa' }, x: 1, y: 1, w: 3, h: 2, tone: 'primary' },
    { label: { ru: 'Кровать', en: 'Bed' }, x: 4, y: 1, w: 2, h: 2, tone: 'secondary' },
    { label: { ru: 'Кухня', en: 'Kitchen' }, x: 1, y: 4, w: 2, h: 2, tone: 'secondary' },
    { label: { ru: 'Шкаф', en: 'Storage' }, x: 3, y: 4, w: 2, h: 2, tone: 'secondary' },
    { label: { ru: 'Утил', en: 'Utility' }, x: 5, y: 4, w: 1, h: 2, tone: 'secondary' },
  ],
};

const I18N = {
  ru: {
    htmlLang: 'ru',
    locale: 'ru-RU',
    title: 'Capalama - генератор цветовых палитр',
    description: 'Capalama - генератор цветовых палитр на JavaScript.',
    eyebrow: 'Генератор HEX-палитр',
    pageTitle: 'Создавайте гармоничные цветовые комбинации за секунды.',
    intro:
      'Выберите стиль, сгенерируйте палитру, скопируйте HEX-коды или сохраните удачные варианты для будущих проектов.',
    themeFilterLabel: 'Тема палитры',
    generate: 'Сгенерировать палитру',
    copyAll: 'Скопировать все',
    save: 'Сохранить палитру',
    download: 'Скачать PNG',
    collection: 'Коллекция',
    savedTitle: 'Сохранённые палитры',
    clearAll: 'Очистить все',
    footer: 'Capalama помогает быстро подобрать цвета для интерфейсов, брендинга и презентаций.',
    copy: 'Скопировать',
    emptySaved: 'Пока нет сохранённых палитр. Сохраните удачную комбинацию, и она появится здесь.',
    themeLight: 'Светлая',
    themeDark: 'Тёмная',
    themeToggleAria: 'Переключить тему',
    langButton: 'EN',
    langToggleAria: 'Switch to English',
    controlsAria: 'Настройки генерации',
    paletteAria: 'Текущая цветовая палитра',
    actionsAria: 'Действия с палитрой',
    plannerEyebrow: 'Помощник по планировке',
    plannerTitle: 'Подбор комнаты по площади',
    roomAreaLabel: 'Площадь, м²',
    roomTypeLabel: 'Тип помещения',
    roomStyleLabel: 'Стиль',
    roomWidthLabel: 'Ширина комнаты, м',
    roomDepthLabel: 'Глубина комнаты, м',
    plannerButton: 'Собрать план',
    sizeTitle: 'Размеры мебели',
    addItem: 'Добавить',
    zonesTitle: 'Зонирование',
    paletteTitle: 'Палитра',
    layoutTitle: 'Схема расстановки',
    materialsTitle: 'Материалы',
    shoppingTitle: 'Что купить',
    budgetTitle: 'Краткая смета',
    summaryWindow: 'Сводка',
    furnitureWindow: 'Мебель',
    planWindow: 'Схема',
    apartment: 'Квартира',
    studio: 'Студия',
    kitchen: 'Кухня',
    living: 'Гостиная',
    house: 'Дом',
    scandi: 'Сканди',
    loft: 'Лофт',
    minimalism: 'Минимализм',
    warm: 'Тёплый',
    modern: 'Современный',
    copied: (hex) => `Скопировано: ${hex}`,
    colorAria: (hex) => `Цвет ${hex}`,
    copyAria: (hex) => `Скопировать ${hex}`,
    loadSavedAria: (index) => `Загрузить сохранённую палитру ${index}`,
    paletteLoaded: 'Палитра загружена',
    alreadySaved: 'Эта палитра уже сохранена',
    paletteSaved: 'Палитра сохранена',
    exportLoading: 'Библиотека экспорта ещё загружается',
    pngDownloaded: 'PNG скачан',
    paletteReady: 'Новая палитра готова',
    allCopied: 'Все HEX-коды скопированы',
    savedCleared: 'Сохранённые палитры очищены',
    themes: {
      random: 'Случайная',
      pastel: 'Пастель',
      neon: 'Неон',
      monochrome: 'Монохром',
      dark: 'Тёмная',
      light: 'Светлая',
    },
  },
  en: {
    htmlLang: 'en',
    locale: 'en-US',
    title: 'Capalama - color palette generator',
    description: 'Capalama - a JavaScript color palette generator.',
    eyebrow: 'HEX palette generator',
    pageTitle: 'Create harmonious color combinations in seconds.',
    intro:
      'Choose a style, generate a palette, copy HEX codes, or save the ones you like for future projects.',
    themeFilterLabel: 'Palette theme',
    generate: 'Generate palette',
    copyAll: 'Copy all',
    save: 'Save palette',
    download: 'Download PNG',
    collection: 'Collection',
    savedTitle: 'Saved palettes',
    clearAll: 'Clear all',
    footer: 'Capalama helps you quickly pick colors for interfaces, branding, and presentations.',
    copy: 'Copy',
    emptySaved: 'No saved palettes yet. Save a combination you like, and it will appear here.',
    themeLight: 'Light',
    themeDark: 'Dark',
    themeToggleAria: 'Toggle theme',
    langButton: 'RU',
    langToggleAria: 'Переключить на русский',
    controlsAria: 'Generation settings',
    paletteAria: 'Current color palette',
    actionsAria: 'Palette actions',
    plannerEyebrow: 'Layout assistant',
    plannerTitle: 'Room planning by square footage',
    roomAreaLabel: 'Area, m²',
    roomTypeLabel: 'Room type',
    roomStyleLabel: 'Style',
    roomWidthLabel: 'Room width, m',
    roomDepthLabel: 'Room depth, m',
    plannerButton: 'Build plan',
    sizeTitle: 'Furniture sizes',
    addItem: 'Add',
    zonesTitle: 'Zoning',
    paletteTitle: 'Palette',
    layoutTitle: 'Furniture layout',
    materialsTitle: 'Materials',
    shoppingTitle: 'Shopping list',
    budgetTitle: 'Quick estimate',
    summaryWindow: 'Summary',
    furnitureWindow: 'Furniture',
    planWindow: 'Plan',
    apartment: 'Apartment',
    studio: 'Studio',
    kitchen: 'Kitchen',
    living: 'Living room',
    house: 'House',
    scandi: 'Scandi',
    loft: 'Loft',
    minimalism: 'Minimalism',
    warm: 'Warm',
    modern: 'Modern',
    copied: (hex) => `Copied: ${hex}`,
    colorAria: (hex) => `Color ${hex}`,
    copyAria: (hex) => `Copy ${hex}`,
    loadSavedAria: (index) => `Load saved palette ${index}`,
    paletteLoaded: 'Palette loaded',
    alreadySaved: 'This palette is already saved',
    paletteSaved: 'Palette saved',
    exportLoading: 'Export library is still loading',
    pngDownloaded: 'PNG downloaded',
    paletteReady: 'New palette is ready',
    allCopied: 'All HEX codes copied',
    savedCleared: 'Saved palettes cleared',
    themes: {
      random: 'Random',
      pastel: 'Pastel',
      neon: 'Neon',
      monochrome: 'Monochrome',
      dark: 'Dark',
      light: 'Light',
    },
  },
};

let currentLang = 'ru';

const t = (key, ...args) => {
  const value = I18N[currentLang][key];
  return typeof value === 'function' ? value(...args) : value;
};

const elements = {
  root: document.documentElement,
  palette: document.querySelector('#palette'),
  savedList: document.querySelector('#savedList'),
  themeFilter: document.querySelector('#themeFilter'),
  generateBtn: document.querySelector('#generateBtn'),
  copyAllBtn: document.querySelector('#copyAllBtn'),
  saveBtn: document.querySelector('#saveBtn'),
  downloadBtn: document.querySelector('#downloadBtn'),
  clearSavedBtn: document.querySelector('#clearSavedBtn'),
  themeToggle: document.querySelector('#themeToggle'),
  langToggle: document.querySelector('#langToggle'),
  toast: document.querySelector('#toast'),
  metaDescription: document.querySelector('meta[name="description"]'),
  roomArea: document.querySelector('#roomArea'),
  roomType: document.querySelector('#roomType'),
  roomStyle: document.querySelector('#roomStyle'),
  plannerBtn: document.querySelector('#plannerBtn'),
  plannerSummary: document.querySelector('#plannerSummary'),
  plannerZones: document.querySelector('#plannerZones'),
  plannerPalette: document.querySelector('#plannerPalette'),
  plannerLayout: document.querySelector('#plannerLayout'),
  plannerMaterials: document.querySelector('#plannerMaterials'),
  plannerShopping: document.querySelector('#plannerShopping'),
  plannerBudget: document.querySelector('#plannerBudget'),
  roomWidth: document.querySelector('#roomWidth'),
  roomDepth: document.querySelector('#roomDepth'),
  openFurnitureModalBtn: document.querySelector('#openFurnitureModalBtn'),
  closeFurnitureModalBtn: document.querySelector('#closeFurnitureModalBtn'),
  addFurnitureBtn: document.querySelector('#addFurnitureBtn'),
  plannerFurnitureModal: document.querySelector('#plannerFurnitureModal'),
  plannerFurnitureList: document.querySelector('#plannerFurnitureList'),
  plannerFit: document.querySelector('#plannerFit'),
  savePlanBtn: document.querySelector('#savePlanBtn'),
  savedPlansList: document.querySelector('#savedPlansList'),
  plannerWindowButtons: document.querySelectorAll('[data-planner-window]'),
  plannerWindowPanels: document.querySelectorAll('[data-planner-window-panel]'),
};

let currentPalette = [];
let savedPalettes = readStoredPalettes();
let savedPlans = readStoredPlans();
let toastTimer = null;

function setPlannerWindow(windowName) {
  if (windowName !== 'furniture') {
    toggleFurnitureModal(false);
  }

  elements.plannerWindowButtons.forEach((button) => {
    const isActive = button.dataset.plannerWindow === windowName;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-selected', String(isActive));
  });

  elements.plannerWindowPanels.forEach((panel) => {
    panel.classList.toggle('is-active', panel.dataset.plannerWindowPanel === windowName);
  });
}

const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const hslToHex = (hue, saturation, lightness) => {
  const h = hue / 360;
  const s = saturation / 100;
  const l = lightness / 100;

  const hueToRgb = (p, q, t) => {
    let value = t;
    if (value < 0) value += 1;
    if (value > 1) value -= 1;
    if (value < 1 / 6) return p + (q - p) * 6 * value;
    if (value < 1 / 2) return q;
    if (value < 2 / 3) return p + (q - p) * (2 / 3 - value) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const rgb = [hueToRgb(p, q, h + 1 / 3), hueToRgb(p, q, h), hueToRgb(p, q, h - 1 / 3)];

  return `#${rgb
    .map((channel) =>
      Math.round(channel * 255)
        .toString(16)
        .padStart(2, '0')
    )
    .join('')
    .toUpperCase()}`;
};

function generateColor(theme, index, baseHue) {
  const hueShift = index * randomBetween(18, 44);
  const hue = (baseHue + hueShift + randomBetween(-8, 8) + 360) % 360;

  switch (theme) {
    case 'pastel':
      return hslToHex(hue, randomBetween(42, 64), randomBetween(76, 88));
    case 'neon':
      return hslToHex(hue, randomBetween(88, 100), randomBetween(50, 62));
    case 'monochrome': {
      const lightness = clamp(18 + index * 15 + randomBetween(-4, 4), 12, 88);
      return hslToHex(baseHue, randomBetween(20, 42), lightness);
    }
    case 'dark':
      return hslToHex(hue, randomBetween(46, 78), randomBetween(14, 32));
    case 'light':
      return hslToHex(hue, randomBetween(24, 58), randomBetween(82, 96));
    case 'random':
    default:
      return hslToHex(hue, randomBetween(48, 88), randomBetween(34, 74));
  }
}

function generatePalette(theme = 'random') {
  const baseHue = randomBetween(0, 359);
  return Array.from({ length: 5 }, (_, index) => generateColor(theme, index, baseHue));
}

function renderPalette(palette) {
  elements.palette.innerHTML = '';

  palette.forEach((hex, index) => {
    const card = document.createElement('article');
    card.className = 'color-card is-entering';
    card.style.transitionDelay = `${index * 42}ms`;
    card.setAttribute('aria-label', t('colorAria', hex));

    card.innerHTML = `
      <button class="color-swatch" type="button" style="background: ${hex}" aria-label="${t('copyAria', hex)}"></button>
      <div class="color-meta">
        <span class="hex-code">${hex}</span>
        <button class="copy-color" type="button">${t('copy')}</button>
      </div>
    `;

    card.addEventListener('click', () => copyText(hex, t('copied', hex)));
    elements.palette.append(card);
    requestAnimationFrame(() => card.classList.remove('is-entering'));
  });
}

function renderSavedPalettes() {
  elements.savedList.innerHTML = '';

  if (!savedPalettes.length) {
    elements.savedList.innerHTML = `<p class="empty-state">${t('emptySaved')}</p>`;
    return;
  }

  savedPalettes.forEach((entry, index) => {
    const button = document.createElement('button');
    button.className = 'saved-palette';
    button.type = 'button';
    button.setAttribute('aria-label', t('loadSavedAria', index + 1));

    button.innerHTML = `
      <span class="saved-palette__colors" aria-hidden="true">
        ${entry.colors.map((color) => `<span style="background: ${color}"></span>`).join('')}
      </span>
      <span class="saved-palette__label">${themeLabelForEntry(entry)} · ${formatSavedDate(entry)}</span>
    `;

    button.addEventListener('click', () => {
      currentPalette = [...entry.colors];
      renderPalette(currentPalette);
      showToast(t('paletteLoaded'));
    });

    elements.savedList.append(button);
  });
}

async function copyText(text, message) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(message);
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.append(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
    showToast(message);
  }
}

function saveCurrentPalette() {
  const exists = savedPalettes.some((entry) => entry.colors.join() === currentPalette.join());

  if (exists) {
    showToast(t('alreadySaved'));
    return;
  }

  const now = Date.now();
  const entry = {
    colors: [...currentPalette],
    themeKey: elements.themeFilter.value,
    theme: I18N[currentLang].themes[elements.themeFilter.value],
    createdAtMs: now,
    createdAt: formatDate(now),
  };

  savedPalettes = [entry, ...savedPalettes].slice(0, 24);
  localStorage.setItem(STORAGE_KEYS.savedPalettes, JSON.stringify(savedPalettes));
  renderSavedPalettes();
  showToast(t('paletteSaved'));
}

async function downloadPalettePng() {
  if (!window.html2canvas) {
    showToast(t('exportLoading'));
    return;
  }

  const canvas = await window.html2canvas(elements.palette, {
    backgroundColor: getComputedStyle(document.body).backgroundColor,
    scale: 2,
  });
  const link = document.createElement('a');
  link.download = `capalama-${Date.now()}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
  showToast(t('pngDownloaded'));
}

function formatDate(timestamp) {
  return new Intl.DateTimeFormat(I18N[currentLang].locale, {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(timestamp));
}

function formatSavedDate(entry) {
  return entry.createdAtMs ? formatDate(entry.createdAtMs) : entry.createdAt;
}

function themeLabelForEntry(entry) {
  if (entry.themeKey && I18N[currentLang].themes[entry.themeKey]) {
    return I18N[currentLang].themes[entry.themeKey];
  }

  for (const dict of Object.values(I18N)) {
    for (const [key, label] of Object.entries(dict.themes)) {
      if (label === entry.theme) {
        return I18N[currentLang].themes[key];
      }
    }
  }

  return entry.theme;
}

function buildFurnitureLayout(roomType, roomWidth, roomDepth, items) {
  const fallback = LAYOUT_LIBRARY[roomType] || LAYOUT_LIBRARY.apartment;
  const activeItems = (Array.isArray(items) ? items : []).filter((item) => Number(item.width) > 0 && Number(item.depth) > 0);

  if (!activeItems.length) {
    return fallback.map((item) => ({
      ...item,
      label: item.label?.[currentLang] || item.label?.ru || item.label,
      width: item.width ?? item.w,
      height: item.height ?? item.h,
    }));
  }

  const roomW = Number(roomWidth) || 4.5;
  const roomD = Number(roomDepth) || 5.5;
  let cursorX = 8;
  let cursorY = 8;

  const blocks = activeItems.map((item, index) => {
    const width = Number(item.width) || 1;
    const depth = Number(item.depth) || 1;
    const baseWidth = clamp((width / roomW) * 100, 12, 68);
    const baseHeight = clamp((depth / roomD) * 100, 12, 68);

    const block = {
      label: item.name || (currentLang === 'ru' ? 'Предмет' : 'Item'),
      x: cursorX,
      y: cursorY,
      width: baseWidth,
      height: baseHeight,
      tone: index % 2 === 0 ? 'primary' : 'secondary',
    };

    cursorX += baseWidth + 8;
    if (cursorX + baseWidth > 88) {
      cursorX = 8;
      cursorY += baseHeight + 10;
    }

    return block;
  });

  return blocks.length ? blocks : fallback;
}

function generateRoomPlan(areaValue, roomType, style, roomWidth, roomDepth) {
  const area = Number(areaValue) || 42;
  const template = ROOM_TEMPLATES[roomType] || ROOM_TEMPLATES.apartment;
  const styleConfig = STYLE_LIBRARY[style] || STYLE_LIBRARY.scandi;
  const layout = buildFurnitureLayout(roomType, roomWidth, roomDepth, furnitureItems);

  const zones = template.zones.map((zone) => ({
    name: zone.name[currentLang] || zone.name.ru,
    size: Number((area * zone.share).toFixed(1)),
    note: zone.note[currentLang] || zone.note.ru,
  }));

  const estimate = Math.round(area * (roomType === 'kitchen' ? 1450 : roomType === 'studio' ? 1200 : 1100));

  return {
    headline: template.headline[currentLang] || template.headline.ru,
    summary: template.summary[currentLang] || template.summary.ru,
    zones,
    palette: styleConfig.colors,
    materials: styleConfig.materials[currentLang] || styleConfig.materials.ru,
    shopping: (template.shopping[currentLang] || template.shopping.ru).slice(),
    roomLabel: template.label[currentLang] || template.label.ru,
    roomStyle: I18N[currentLang][style] || style,
    layout,
    estimate,
  };
}

function toggleFurnitureModal(isOpen) {
  if (!elements.plannerFurnitureModal) return;
  elements.plannerFurnitureModal.classList.toggle('is-open', isOpen);
  elements.plannerFurnitureModal.setAttribute('aria-hidden', String(!isOpen));
}

function renderFurnitureList() {
  if (!furnitureItems.length) {
    elements.plannerFurnitureList.innerHTML = `
      <div class="planner-empty-state">
        ${currentLang === 'ru' ? 'Пока нет мебели в комнате. Добавьте первый предмет.' : 'No furniture yet. Add the first item.'}
      </div>
    `;
    return;
  }

  elements.plannerFurnitureList.innerHTML = furnitureItems
    .map(
      (item, index) => `
        <div class="planner-furniture-item" data-index="${index}">
          <label>
            <span>${currentLang === 'ru' ? 'Название' : 'Name'}</span>
            <input data-role="name" value="${item.name}" />
          </label>
          <label>
            <span>${currentLang === 'ru' ? 'Шир.' : 'W'}</span>
            <input data-role="width" type="number" min="0.2" step="0.1" value="${item.width}" />
          </label>
          <label>
            <span>${currentLang === 'ru' ? 'Глуб.' : 'D'}</span>
            <input data-role="depth" type="number" min="0.2" step="0.1" value="${item.depth}" />
          </label>
          <label>
            <span>${currentLang === 'ru' ? 'Кол.' : 'Qty'}</span>
            <input data-role="qty" type="number" min="1" step="1" value="${item.qty}" />
          </label>
          <button class="planner-furniture-remove" type="button" data-remove-index="${index}" aria-label="${currentLang === 'ru' ? 'Удалить предмет' : 'Remove item'}">×</button>
        </div>
      `
    )
    .join('');

  elements.plannerFurnitureList.querySelectorAll('[data-role]').forEach((input) => {
    input.addEventListener('input', (event) => {
      const row = event.target.closest('.planner-furniture-item');
      const index = Number(row.dataset.index);
      const role = event.target.dataset.role;
      const nextValue = role === 'name' ? event.target.value : Number(event.target.value);
      furnitureItems[index][role] = nextValue;
      renderPlannerResult();
    });
  });

  elements.plannerFurnitureList.querySelectorAll('[data-remove-index]').forEach((button) => {
    button.addEventListener('click', (event) => {
      const index = Number(event.target.dataset.removeIndex);
      furnitureItems.splice(index, 1);
      renderFurnitureList();
      renderPlannerResult();
    });
  });
}

function getFurnitureFitSummary() {
  const roomWidth = Number(elements.roomWidth?.value) || 4.5;
  const roomDepth = Number(elements.roomDepth?.value) || 5.5;
  const roomArea = roomWidth * roomDepth;

  const items = furnitureItems.map((item) => {
    const width = Number(item.width) || 0;
    const depth = Number(item.depth) || 0;
    const qty = Number(item.qty) || 1;
    const footprint = width * depth * qty;
    const tooLarge = width > roomWidth || depth > roomDepth;
    const fit = footprint <= roomArea * 0.82 && !tooLarge;
    return {
      name: item.name || (currentLang === 'ru' ? 'Предмет' : 'Item'),
      fit,
      tooLarge,
      footprint,
      size: `${width} × ${depth} m`,
    };
  });

  const summary = {
    roomArea,
    totalFootprint: items.reduce((sum, item) => sum + item.footprint, 0),
    fitRatio: Math.round((items.filter((item) => item.fit).length / Math.max(items.length, 1)) * 100),
    items,
  };

  return summary;
}

function renderPlannerResult() {
  const areaValue = Number(elements.roomArea?.value) || 42;
  const roomType = elements.roomType?.value || 'apartment';
  const roomStyle = elements.roomStyle?.value || 'scandi';
  const roomWidthValue = Number(elements.roomWidth?.value) || 4.5;
  const roomDepthValue = Number(elements.roomDepth?.value) || 5.5;
  const roomRatioInput = roomWidthValue / roomDepthValue;
  const planWidth = Math.sqrt(areaValue * roomRatioInput);
  const planDepth = Math.sqrt(areaValue / roomRatioInput);
  const plan = generateRoomPlan(areaValue, roomType, roomStyle, planWidth, planDepth);

  elements.plannerSummary.innerHTML = `
    <p class="planner-summary__meta">${plan.roomLabel} · ${plan.roomStyle} · ${areaValue} м²</p>
    <h3>${plan.headline}</h3>
    <p>${plan.summary}</p>
  `;

  elements.plannerZones.innerHTML = plan.zones
    .map(
      (zone) => `
        <article class="planner-zone-card">
          <div class="planner-zone-card__head">
            <span>${zone.name}</span>
            <strong>${zone.size} м²</strong>
          </div>
          <p>${zone.note}</p>
        </article>
      `
    )
    .join('');

  elements.plannerPalette.innerHTML = plan.palette
    .map(
      (color) => `
        <div class="planner-color" style="background:${color};">
          <span>${color}</span>
        </div>
      `
    )
    .join('');

  const roomRatio = Math.max(roomWidthValue / planDepth, 0.55);
  const doorX = Math.min(82, Math.max(16, 20 + (roomRatio - 0.7) * 26));
  const doorY = 84;

  elements.plannerLayout.innerHTML = `
    <div class="planner-room-shell" style="--room-ratio:${roomRatio};">
      <div class="planner-room-outline" aria-label="План комнаты">
        <span class="planner-room-dimension planner-room-dimension--width">${planWidth.toFixed(1)} м</span>
        <span class="planner-room-dimension planner-room-dimension--depth">${planDepth.toFixed(1)} м</span>
        <span class="planner-window planner-window--top" aria-label="Окно"></span>
        <span class="planner-window planner-window--side" aria-label="Окно"></span>
        <span class="planner-door" style="left:${doorX}%; top:${doorY}%;">
          <span class="planner-door__leaf"></span>
          <span class="planner-door__swing"></span>
        </span>
        ${plan.layout
          .map(
            (item) => `
              <div
                class="planner-furniture ${item.tone === 'secondary' ? 'planner-furniture--secondary' : ''}"
                style="left:${item.x}%; top:${item.y}%; width:${item.width}%; height:${item.height}%;"
                title="${item.label || (currentLang === 'ru' ? 'Предмет' : 'Item')}"
              >
                ${item.label || (currentLang === 'ru' ? 'Предмет' : 'Item')}
              </div>
            `
          )
          .join('')}
      </div>
    </div>
  `;

  elements.plannerMaterials.innerHTML = plan.materials
    .map((item) => `<li>${item}</li>`)
    .join('');

  elements.plannerShopping.innerHTML = plan.shopping
    .map((item) => `<li>${item}</li>`)
    .join('');

  const fitSummary = getFurnitureFitSummary();
  const fitStatus = !fitSummary.items.length
    ? currentLang === 'ru' ? 'Нет мебели' : 'No furniture'
    : fitSummary.items.every((item) => item.fit)
      ? currentLang === 'ru' ? 'Всё влезает' : 'All fit'
      : currentLang === 'ru' ? 'Нужна корректировка' : 'Needs adjustment';

  elements.plannerFit.innerHTML = `
    <div class="planner-fit__summary">
      <span>${currentLang === 'ru' ? 'Проверка по размерам' : 'Fit check'}</span>
      <strong>${fitStatus}</strong>
    </div>
    <div class="planner-fit__list">
      ${fitSummary.items.length
        ? fitSummary.items
            .map(
              (item) => `
                <div class="planner-fit__item">
                  <span>${item.name} (${item.size})</span>
                  <span>${item.fit ? (currentLang === 'ru' ? 'влезает' : 'fits') : (currentLang === 'ru' ? 'проверить' : 'review')}</span>
                </div>
              `
            )
            .join('')
        : `<div class="planner-fit__item"><span>${currentLang === 'ru' ? 'Добавьте мебель' : 'Add furniture'}</span><span>—</span></div>`}
    </div>
  `;

  const budgetLabel = currentLang === 'ru' ? 'Ориентир' : 'Estimate';
  elements.plannerBudget.innerHTML = `
    <div class="planner-budget__item">
      <span>${budgetLabel}</span>
      <strong>≈ ${plan.estimate.toLocaleString(currentLang === 'ru' ? 'ru-RU' : 'en-US')} ₽</strong>
    </div>
    <div class="planner-budget__item">
      <span>${currentLang === 'ru' ? 'Мебель' : 'Furniture'}</span>
      <strong>≈ ${Math.round(plan.estimate * 0.52).toLocaleString(currentLang === 'ru' ? 'ru-RU' : 'en-US')} ₽</strong>
    </div>
    <div class="planner-budget__item">
      <span>${currentLang === 'ru' ? 'Отделка' : 'Finishing'}</span>
      <strong>≈ ${Math.round(plan.estimate * 0.48).toLocaleString(currentLang === 'ru' ? 'ru-RU' : 'en-US')} ₽</strong>
    </div>
  `;
}

function applyStaticTexts() {
  const dict = I18N[currentLang];
  document.documentElement.lang = dict.htmlLang;
  document.title = dict.title;
  if (elements.metaDescription) {
    elements.metaDescription.setAttribute('content', dict.description);
  }

  document.querySelectorAll('[data-i18n]').forEach((node) => {
    const key = node.dataset.i18n;
    if (typeof dict[key] === 'string') {
      node.textContent = dict[key];
    }
  });

  document.querySelectorAll('[data-i18n-aria]').forEach((node) => {
    const key = node.dataset.i18nAria;
    if (typeof dict[key] === 'string') {
      node.setAttribute('aria-label', dict[key]);
    }
  });

  document.querySelectorAll('[data-i18n-theme]').forEach((option) => {
    option.textContent = dict.themes[option.dataset.i18nTheme];
  });

  document.querySelectorAll('[data-i18n-room]').forEach((option) => {
    option.textContent = dict[option.dataset.i18nRoom];
  });

  document.querySelectorAll('[data-i18n-style]').forEach((option) => {
    option.textContent = dict[option.dataset.i18nStyle];
  });

  elements.langToggle.setAttribute('aria-label', dict.langToggleAria);
  elements.langToggle.querySelector('.theme-toggle__text').textContent = dict.langButton;
}

function setLanguage(lang) {
  currentLang = I18N[lang] ? lang : 'ru';
  localStorage.setItem(STORAGE_KEYS.lang, currentLang);
  applyStaticTexts();
  setAppTheme(elements.root.dataset.theme || 'dark');
  renderPalette(currentPalette);
  renderSavedPalettes();
  renderPlannerResult();
}

function readStoredPalettes() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEYS.savedPalettes) || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function readStoredPlans() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEYS.savedPlans) || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function renderSavedPlans() {
  if (!elements.savedPlansList) return;

  elements.savedPlansList.innerHTML = '';

  if (!savedPlans.length) {
    elements.savedPlansList.innerHTML = `
      <div class="planner-empty-state">
        ${currentLang === 'ru' ? 'Ещё нет сохранённых планов.' : 'No saved plans yet.'}
      </div>
    `;
    return;
  }

  savedPlans.forEach((plan, index) => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'planner-saved-plan';
    item.innerHTML = `
      <span class="planner-saved-plan__name">${plan.roomType ? (I18N[currentLang][plan.roomType] || plan.roomType) : 'Plan'} · ${plan.roomArea || 42} м²</span>
      <span class="planner-saved-plan__meta">${plan.roomStyle ? (I18N[currentLang][plan.roomStyle] || plan.roomStyle) : ''}</span>
    `;

    item.addEventListener('click', () => {
      if (!plan || !plan.furniture) return;

      elements.roomArea.value = plan.roomArea || 42;
      elements.roomType.value = plan.roomType || 'apartment';
      elements.roomStyle.value = plan.roomStyle || 'scandi';
      elements.roomWidth.value = plan.roomWidth || 4.5;
      elements.roomDepth.value = plan.roomDepth || 5.5;
      furnitureItems = Array.isArray(plan.furniture) ? plan.furniture.map((item) => ({ ...item })) : [...DEFAULT_FURNITURE];
      renderFurnitureList();
      renderPlannerResult();
      showToast(currentLang === 'ru' ? 'План загружен' : 'Plan loaded');
    });

    elements.savedPlansList.append(item);
  });
}

function setAppTheme(theme) {
  elements.root.dataset.theme = theme;
  localStorage.setItem(STORAGE_KEYS.appTheme, theme);

  const isLight = theme === 'light';
  elements.themeToggle.querySelector('.theme-toggle__icon').textContent = isLight ? '☀' : '☾';
  elements.themeToggle.querySelector('.theme-toggle__text').textContent = isLight
    ? t('themeLight')
    : t('themeDark');
  elements.themeToggle.setAttribute('aria-label', t('themeToggleAria'));
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add('is-visible');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    elements.toast.classList.remove('is-visible');
  }, 1800);
}

function bindEvents() {
  elements.plannerWindowButtons.forEach((button) => {
    button.addEventListener('click', () => setPlannerWindow(button.dataset.plannerWindow));
  });

  elements.generateBtn.addEventListener('click', () => {
    currentPalette = generatePalette(elements.themeFilter.value);
    renderPalette(currentPalette);
    showToast(t('paletteReady'));
  });

  elements.copyAllBtn.addEventListener('click', () => {
    copyText(currentPalette.join(' '), t('allCopied'));
  });

  elements.saveBtn.addEventListener('click', saveCurrentPalette);
  elements.downloadBtn.addEventListener('click', downloadPalettePng);
  elements.plannerBtn.addEventListener('click', () => {
    renderPlannerResult();
    showToast(currentLang === 'ru' ? 'План готов' : 'Plan ready');
  });

  elements.openFurnitureModalBtn?.addEventListener('click', () => {
    toggleFurnitureModal(true);
  });

  elements.closeFurnitureModalBtn?.addEventListener('click', () => {
    toggleFurnitureModal(false);
  });

  elements.plannerFurnitureModal?.addEventListener('click', (event) => {
    if (event.target === elements.plannerFurnitureModal) {
      toggleFurnitureModal(false);
    }
  });

  elements.addFurnitureBtn.addEventListener('click', () => {
    furnitureItems.push({ id: Date.now(), name: currentLang === 'ru' ? 'Предмет' : 'Item', width: 1.2, depth: 0.7, qty: 1 });
    renderFurnitureList();
    renderPlannerResult();
    toggleFurnitureModal(false);
  });

  elements.savePlanBtn?.addEventListener('click', () => {
    const planSnapshot = {
      roomArea: Number(elements.roomArea?.value) || 42,
      roomType: elements.roomType?.value || 'apartment',
      roomStyle: elements.roomStyle?.value || 'scandi',
      roomWidth: Number(elements.roomWidth?.value) || 4.5,
      roomDepth: Number(elements.roomDepth?.value) || 5.5,
      furniture: furnitureItems.map((item) => ({ ...item })),
      savedAt: Date.now(),
    };

    const exists = savedPlans.some((plan) => JSON.stringify(plan.furniture) === JSON.stringify(planSnapshot.furniture)
      && plan.roomType === planSnapshot.roomType
      && Number(plan.roomArea) === Number(planSnapshot.roomArea));

    if (!exists) {
      savedPlans = [planSnapshot, ...savedPlans].slice(0, 8);
      localStorage.setItem(STORAGE_KEYS.savedPlans, JSON.stringify(savedPlans));
      renderSavedPlans();
    }

    showToast(currentLang === 'ru' ? 'План сохранён' : 'Plan saved');
  });

  [elements.roomArea, elements.roomType, elements.roomStyle, elements.roomWidth, elements.roomDepth].forEach((field) => {
    if (!field) return;
    field.addEventListener('input', renderPlannerResult);
    field.addEventListener('change', renderPlannerResult);
  });

  elements.clearSavedBtn.addEventListener('click', () => {
    savedPalettes = [];
    localStorage.removeItem(STORAGE_KEYS.savedPalettes);
    renderSavedPalettes();
    showToast(t('savedCleared'));
  });

  elements.themeToggle.addEventListener('click', () => {
    const nextTheme = elements.root.dataset.theme === 'light' ? 'dark' : 'light';
    setAppTheme(nextTheme);
  });

  elements.langToggle.addEventListener('click', () => {
    setLanguage(currentLang === 'ru' ? 'en' : 'ru');
  });
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('./service-worker.js').catch(() => {
      console.info('Service worker недоступен в этом окружении.');
    });
  }
}

function readStoredLang() {
  const stored = localStorage.getItem(STORAGE_KEYS.lang);
  if (stored === 'ru' || stored === 'en') return stored;
  return navigator.language.toLowerCase().startsWith('en') ? 'en' : 'ru';
}

function init() {
  currentLang = readStoredLang();
  const storedTheme = localStorage.getItem(STORAGE_KEYS.appTheme) || 'dark';
  applyStaticTexts();
  setAppTheme(storedTheme);
  renderFurnitureList();
  currentPalette = generatePalette(elements.themeFilter.value);
  renderPalette(currentPalette);
  renderSavedPalettes();
  renderSavedPlans();
  renderPlannerResult();
  bindEvents();
  registerServiceWorker();
}

toggleFurnitureModal(false);
  init();
