'use strict';

const STORAGE_KEYS = {
  savedPalettes: 'colorpal.savedPalettes',
  appTheme: 'colorpal.appTheme',
  lang: 'colorpal.lang',
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
};

let currentPalette = [];
let savedPalettes = readStoredPalettes();
let toastTimer = null;

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
}

function readStoredPalettes() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEYS.savedPalettes) || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
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
  currentPalette = generatePalette(elements.themeFilter.value);
  renderPalette(currentPalette);
  renderSavedPalettes();
  bindEvents();
  registerServiceWorker();
}

init();
