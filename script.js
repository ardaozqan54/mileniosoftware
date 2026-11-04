const projectSection = document.querySelector('.project-section');
const projectSteps = [...document.querySelectorAll('.project-step')];
const screens = [...document.querySelectorAll('.screen-state')];
const progressFill = document.querySelector('#step-progress-fill');
const trackerSteps = [...document.querySelectorAll('[data-tracker-step]')];
const currentIndex = document.querySelector('#current-index');
const projectStatus = document.querySelector('#project-status');
const workspaceSection = document.querySelector('#workspace-section');
const browserPage = document.querySelector('#browser-page');
const browser = document.querySelector('#workspace-browser');
const labButtons = [...document.querySelectorAll('[data-lab-step]')];

const recruitingAscii = String.raw`
      M\               /M
      M \             / M
      M  \           /  M
      M   \         /   M
      M    \       /    M
      M     \     /     M
      M      \   /      M
      M       \ /       M
      M        V        M
      M                 M
      M I L E N I O  /  S O F T W A R E
`;
console.log('%c' + recruitingAscii, 'color:#888;font:12px/1.15 monospace;');
console.log('%cMilenio Laboratuvarına hoş geldin. Buraya kadar geldiysen kod kalitesine önem veriyorsun demektir. contact@mileniosoftware.com üzerinden bizimle iletişime geç.', 'color:#888;font:13px/1.5 monospace;');

let currentLanguage = 'tr';
const supportedLanguages = ['tr', 'en', 'de', 'fr', 'es', 'it', 'ru', 'zh', 'ja', 'pt'];
const themeLabels = {
  tr:['AÇIK MOD','KOYU MOD','Açık moda geç','Koyu moda geç'], en:['LIGHT MODE','DARK MODE','Switch to light mode','Switch to dark mode'],
  de:['HELLER MODUS','DUNKLER MODUS','Hellen Modus aktivieren','Dunklen Modus aktivieren'], fr:['MODE CLAIR','MODE SOMBRE','Activer le mode clair','Activer le mode sombre'],
  es:['MODO CLARO','MODO OSCURO','Activar modo claro','Activar modo oscuro'], it:['MODALITÀ CHIARA','MODALITÀ SCURA','Attiva modalità chiara','Attiva modalità scura'],
  ru:['СВЕТЛАЯ ТЕМА','ТЁМНАЯ ТЕМА','Включить светлую тему','Включить тёмную тему'],
  zh:['浅色模式','深色模式','切换到浅色模式','切换到深色模式'],
  ja:['ライトモード','ダークモード','ライトモードに切り替え','ダークモードに切り替え'],
  pt:['MODO CLARO','MODO ESCURO','Ativar modo claro','Ativar modo escuro'],
};
try {
  const savedLanguage = window.localStorage.getItem('milenio-language');
  currentLanguage = supportedLanguages.includes(savedLanguage) ? savedLanguage : 'tr';
} catch {
  currentLanguage = 'tr';
}
const heroBlueprint = document.querySelector('#hero-blueprint');
const heroTitle = document.querySelector('.hero-copy h1');
const globalSpotlight = document.querySelector('.global-spotlight');
let globalSpotlightFrame = 0;
let globalSpotlightX = window.innerWidth / 2;
let globalSpotlightY = window.innerHeight / 2;

if (globalSpotlight) {
  globalSpotlight.style.transform = `translate3d(${globalSpotlightX - 190}px, ${globalSpotlightY - 190}px, 0)`;
  window.addEventListener('pointermove', (event) => {
    globalSpotlightX = event.clientX;
    globalSpotlightY = event.clientY;
    if (globalSpotlightFrame) return;
    globalSpotlightFrame = window.requestAnimationFrame(() => {
      globalSpotlight.style.transform = `translate3d(${globalSpotlightX - 190}px, ${globalSpotlightY - 190}px, 0)`;
      globalSpotlightFrame = 0;
    });
  }, { passive:true });
}

if (heroBlueprint) {
  const heroGridline = heroBlueprint.parentElement.querySelector('.hero-gridline');
  const spokes = heroBlueprint.querySelector('.blueprint-spokes');
  const outerOrbit = heroBlueprint.querySelector('.blueprint-orbit--outer');
  const middleOrbit = heroBlueprint.querySelector('.blueprint-orbit--middle');
  const innerOrbit = heroBlueprint.querySelector('.blueprint-orbit--inner');
  const backLayer = heroBlueprint.querySelector('.blueprint-layer--back');
  const middleLayer = heroBlueprint.querySelector('.blueprint-layer--middle');
  const frontLayer = heroBlueprint.querySelector('.blueprint-layer--front');
  const focusLayer = document.createElement('div');
  focusLayer.className = 'blueprint-focus';
  [backLayer, middleLayer, frontLayer].forEach((layer) => {
    const focusedCopy = layer.cloneNode(true);
    focusedCopy.removeAttribute('class');
    focusedCopy.classList.add('blueprint-layer');
    focusLayer.append(focusedCopy);
  });
  heroBlueprint.append(focusLayer);
  const focusLayers = [...focusLayer.querySelectorAll('.blueprint-layer')];
  const focusSpokes = focusLayer.querySelector('.blueprint-spokes');
  const focusOrbits = [...focusLayer.querySelectorAll('.blueprint-orbit')];
  const dataRain = document.createElement('div');
  dataRain.className = 'blueprint-data-rain';
  const rainGlyphs = '01{}<>/\\';
  for (let index = 0; index < 12; index += 1) {
    const drop = document.createElement('span');
    drop.textContent = Array.from({ length: 5 }, (_, glyphIndex) => rainGlyphs[(index * 3 + glyphIndex * 5) % rainGlyphs.length]).join('\n');
    drop.style.setProperty('--drop-x', `${7 + ((index * 37) % 90)}%`);
    drop.style.setProperty('--drop-delay', `${(index % 6) * -.31}s`);
    dataRain.append(drop);
  }
  heroBlueprint.append(dataRain);
  const reduceBlueprintMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const introStartedAt = performance.now();
  let targetScroll = Math.max(0, window.scrollY);
  let easedScroll = 0;
  let scrollVelocity = 0;
  let previousFrame = introStartedAt;
  let animationFrame = 0;
  let targetSpotX = window.innerWidth / 2;
  let targetSpotY = window.innerHeight / 2;
  let easedSpotX = targetSpotX;
  let easedSpotY = targetSpotY;
  let targetSpotOpacity = 1;
  let easedSpotOpacity = 1;

  function setSpotlight(event) {
    const bounds = heroBlueprint.getBoundingClientRect();
    targetSpotX = event.clientX - bounds.left;
    targetSpotY = event.clientY - bounds.top;
    targetSpotOpacity = 1;
    requestBlueprintFrame();
  }

  function clearSpotlight() {
    targetSpotOpacity = 1;
    requestBlueprintFrame();
  }

  heroBlueprint.parentElement.addEventListener('pointermove', setSpotlight, { passive:true });
  heroBlueprint.parentElement.addEventListener('pointerleave', clearSpotlight, { passive:true });

  function clamp01(value) {
    return Math.max(0, Math.min(1, value));
  }

  function updateBlueprint(now) {
    const frameScale = Math.min(2, Math.max(.5, (now - previousFrame) / 16.667));
    previousFrame = now;

    const scrollError = targetScroll - easedScroll;
    if (reduceBlueprintMotion) {
      easedScroll = targetScroll;
      scrollVelocity = 0;
    } else {
      scrollVelocity += scrollError * .085 * frameScale;
      scrollVelocity *= Math.pow(.78, frameScale);
      easedScroll += scrollVelocity * frameScale;
      if (Math.abs(scrollError) < .1 && Math.abs(scrollVelocity) < .1) {
        easedScroll = targetScroll;
        scrollVelocity = 0;
      }
    }

    const elapsed = now - introStartedAt;
    const introProgress = reduceBlueprintMotion ? 1 : clamp01(elapsed / 2000);
    const introEase = 1 - ((1 - introProgress) ** 3);
    const automaticFade = clamp01((elapsed - 2000) / 2000);
    const scrollProgress = clamp01(easedScroll / 380);
    const opacity = Math.min(1 - automaticFade, 1 - scrollProgress);
    const scrollAngle = easedScroll * .05;
    const spotSmoothing = reduceBlueprintMotion ? 1 : .18 * frameScale;
    easedSpotX += (targetSpotX - easedSpotX) * spotSmoothing;
    easedSpotY += (targetSpotY - easedSpotY) * spotSmoothing;
    easedSpotOpacity += (targetSpotOpacity - easedSpotOpacity) * spotSmoothing;

    focusLayer.style.setProperty('--spot-x', `${easedSpotX.toFixed(1)}px`);
    focusLayer.style.setProperty('--spot-y', `${easedSpotY.toFixed(1)}px`);
    focusLayer.style.opacity = String(easedSpotOpacity);

    const dissolveProgress = Math.max(automaticFade, scrollProgress);
    dataRain.classList.toggle('is-dissolving', dissolveProgress > 0 && opacity > 0);
    dataRain.style.opacity = String(Math.min(.7, dissolveProgress * .7) * opacity);

    if (heroTitle) {
      heroTitle.style.setProperty('--hero-letter-spacing', `${(easedScroll * .03).toFixed(3)}px`);
      heroTitle.style.opacity = String(1 - scrollProgress);
    }

    const frontScale = 1 + scrollProgress * .16;
    const middleScale = 1 + scrollProgress * .06;
    const backScale = 1 - scrollProgress * .035;

    backLayer.style.opacity = String(opacity);
    middleLayer.style.opacity = String(opacity);
    frontLayer.style.opacity = String(opacity);
    frontLayer.style.transform = `translate3d(0,0,140px) scale(${frontScale})`;
    middleLayer.style.transform = `translate3d(0,0,0) scale(${middleScale})`;
    backLayer.style.transform = `translate3d(0,0,-140px) scale(${backScale})`;
    focusLayers[0].style.transform = backLayer.style.transform;
    focusLayers[1].style.transform = middleLayer.style.transform;
    focusLayers[2].style.transform = frontLayer.style.transform;
    outerOrbit.style.transform = `translateZ(0) rotate(${45 * introEase + scrollAngle * 1.35}deg)`;
    middleOrbit.style.transform = `translateZ(0) rotate(${24 * introEase + scrollAngle * .72}deg)`;
    innerOrbit.style.transform = `translateZ(0) rotate(${-45 * introEase - scrollAngle * .9}deg)`;
    spokes.style.transform = `translateZ(0) rotate(${-45 * introEase - scrollAngle * .42}deg)`;
    focusSpokes.style.transform = spokes.style.transform;
    focusOrbits.forEach((orbit, index) => {
      const originalOrbit = index === 0 ? middleOrbit : index === 1 ? innerOrbit : outerOrbit;
      orbit.style.transform = originalOrbit.style.transform;
    });

    if (heroGridline) {
      heroGridline.style.opacity = String(opacity);
      heroGridline.style.transform = `translateZ(0) scale(${1 + scrollProgress * .1})`;
    }

    const spotlightMoving = Math.abs(targetSpotX - easedSpotX) > .2 || Math.abs(targetSpotY - easedSpotY) > .2 || Math.abs(targetSpotOpacity - easedSpotOpacity) > .01;
    if (elapsed < 4000 || Math.abs(targetScroll - easedScroll) > .1 || Math.abs(scrollVelocity) > .1 || spotlightMoving) {
      animationFrame = window.requestAnimationFrame(updateBlueprint);
    } else {
      animationFrame = 0;
    }
  }

  function requestBlueprintFrame() {
    if (animationFrame) return;
    animationFrame = window.requestAnimationFrame(updateBlueprint);
  }

  window.addEventListener('scroll', () => {
    targetScroll = Math.max(0, window.scrollY);
    requestBlueprintFrame();
  }, { passive:true });
  requestBlueprintFrame();
}

const stepLabels = {
  tr: ['LABORATUVAR: FİKİR VE MİMARİ', 'LABORATUVAR: TEMİZ KOD', 'LABORATUVAR: MOBİL PROTOTİP'],
  en: ['LAB: IDEA & ARCHITECTURE', 'LAB: CLEAN CODE', 'LAB: MOBILE PROTOTYPE'],
  de: ['LABOR: IDEE & ARCHITEKTUR', 'LABOR: SAUBERER CODE', 'LABOR: MOBILER PROTOTYP'],
  fr: ['LABORATOIRE : IDÉE & ARCHITECTURE', 'LABORATOIRE : CODE ÉPURÉ', 'LABORATOIRE : PROTOTYPE MOBILE'],
  es: ['LABORATORIO: IDEA Y ARQUITECTURA', 'LABORATORIO: CÓDIGO LIMPIO', 'LABORATORIO: PROTOTIPO MÓVIL'],
  it: ['LABORATORIO: IDEA E ARCHITETTURA', 'LABORATORIO: CODICE PULITO', 'LABORATORIO: PROTOTIPO MOBILE'],
  ru: ['ЛАБОРАТОРИЯ: ИДЕЯ И АРХИТЕКТУРА', 'ЛАБОРАТОРИЯ: ЧИСТЫЙ КОД', 'ЛАБОРАТОРИЯ: МОБИЛЬНЫЙ ПРОТОТИП'],
  zh: ['实验室：构思与架构', '实验室：整洁代码', '实验室：移动原型'],
  ja: ['ラボ：アイデアと設計', 'ラボ：クリーンコード', 'ラボ：モバイルプロトタイプ'],
  pt: ['LABORATÓRIO: IDEIA E ARQUITETURA', 'LABORATÓRIO: CÓDIGO LIMPO', 'LABORATÓRIO: PROTÓTIPO MÓVEL'],
};
const screenLabels = {
  tr: ['FİKİR GELİŞTİRME', 'ZANAAT', 'YİNELEME'],
  en: ['IDEA DEVELOPMENT', 'CRAFT', 'ITERATION'],
  de: ['IDEENENTWICKLUNG', 'HANDWERK', 'ITERATION'],
  fr: ['DÉVELOPPEMENT D’IDÉES', 'SAVOIR-FAIRE', 'ITÉRATION'],
  es: ['DESARROLLO DE IDEAS', 'OFICIO', 'ITERACIÓN'],
  it: ['SVILUPPO DELLE IDEE', 'MESTIERE', 'ITERAZIONE'],
  ru: ['РАЗРАБОТКА ИДЕИ', 'МАСТЕРСТВО', 'ИТЕРАЦИЯ'],
  zh: ['构思开发', '精工实现', '迭代改进'],
  ja: ['アイデア開発', '実装', '反復改善'],
  pt: ['DESENVOLVIMENTO DA IDEIA', 'IMPLEMENTAÇÃO', 'ITERAÇÃO'],
};
const pageLabels = {
  tr: ['/laboratuvar/fikir', '/laboratuvar/zanaat', '/laboratuvar/yineleme'],
  en: ['/lab/idea', '/lab/craft', '/lab/iteration'],
  de: ['/labor/idee', '/labor/handwerk', '/labor/iteration'],
  fr: ['/laboratoire/idee', '/laboratoire/savoir-faire', '/laboratoire/iteration'],
  es: ['/laboratorio/idea', '/laboratorio/oficio', '/laboratorio/iteracion'],
  it: ['/laboratorio/idea', '/laboratorio/mestiere', '/laboratorio/iterazione'],
  ru: ['/laboratoriya/ideya', '/laboratoriya/masterstvo', '/laboratoriya/iteratsiya'],
  zh: ['/实验室/构思', '/实验室/实现', '/实验室/迭代'],
  ja: ['/ラボ/アイデア', '/ラボ/実装', '/ラボ/反復'],
  pt: ['/laboratorio/ideia', '/laboratorio/execucao', '/laboratorio/iteracao'],
};

let framePending = false;
let activeStep = -1;

function setActiveLabButton(index) {
  labButtons.forEach((button, buttonIndex) => {
    const isActive = buttonIndex === index;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
}

function updateProject() {
  const bounds = projectSection.getBoundingClientRect();
  const travel = Math.max(1, projectSection.offsetHeight - window.innerHeight);
  const isStackedLayout = window.innerWidth <= 600 && window.innerHeight <= 600;
  const rawProgress = isStackedLayout
    ? (window.innerHeight - browser.getBoundingClientRect().top) / (browser.getBoundingClientRect().height + window.innerHeight)
    : -bounds.top / travel;
  const progress = Math.max(0, Math.min(0.999999, rawProgress));
  const nextStep = Math.min(2, Math.floor(progress * 3));
  const localProgress = progress * 3 - nextStep;

  if (nextStep !== activeStep) {
    activeStep = nextStep;
    projectSteps.forEach((step, index) => {
      step.classList.toggle('is-active', index === activeStep);
    });
    screens.forEach((screen, index) => {
      screen.classList.toggle('is-visible', index === activeStep);
    });
    trackerSteps.forEach((step, index) => {
      step.classList.toggle('is-active', index === activeStep);
      step.classList.toggle('is-complete', index < activeStep);
      if (index === activeStep) step.setAttribute('aria-current', 'step');
      else step.removeAttribute('aria-current');
    });

    setActiveLabButton(activeStep);
    currentIndex.textContent = String(activeStep + 1).padStart(2, '0');
    projectStatus.textContent = stepLabels[currentLanguage][activeStep];
    workspaceSection.textContent = screenLabels[currentLanguage][activeStep];
    browserPage.textContent = pageLabels[currentLanguage][activeStep];
  }

  progressFill.style.transform = `translateY(${progress * 200}%)`;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  browser.style.transform = !reduceMotion && window.innerWidth > 600
    ? `translateY(${(localProgress - 0.5) * -7}px)`
    : '';

  framePending = false;
}

function requestProjectUpdate() {
  if (framePending) return;
  framePending = true;
  window.requestAnimationFrame(updateProject);
}

function scrollToLabStep(step) {
  const progress = (step + 0.5) / 3;
  const bounds = projectSection.getBoundingClientRect();
  const sectionTop = window.scrollY + bounds.top;
  const isStackedLayout = window.innerWidth <= 600 && window.innerHeight <= 600;
  const targetY = isStackedLayout
    ? window.scrollY + browser.getBoundingClientRect().top - window.innerHeight + progress * (browser.offsetHeight + window.innerHeight)
    : sectionTop + progress * Math.max(1, projectSection.offsetHeight - window.innerHeight);

  const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ? 'auto'
    : 'smooth';

  window.scrollTo({ top: Math.max(0, targetY), behavior });
}

window.addEventListener('scroll', requestProjectUpdate, { passive: true });
window.addEventListener('resize', requestProjectUpdate);
labButtons.forEach((button) => {
  button.addEventListener('click', () => {
    scrollToLabStep(Number(button.dataset.labStep));
  });
});

updateProject();

const siteHeader = document.querySelector('.site-header');
const mobileMenuToggle = document.querySelector('#mobile-menu-toggle');
const siteNavigation = document.querySelector('#site-navigation');
let headerFramePending = false;

function setMobileMenuOpen(open) {
  mobileMenuToggle.setAttribute('aria-expanded', String(open));
  mobileMenuToggle.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç');
  siteNavigation.classList.toggle('is-open', open);
}

mobileMenuToggle.addEventListener('click', () => {
  setMobileMenuOpen(mobileMenuToggle.getAttribute('aria-expanded') !== 'true');
});
siteNavigation.addEventListener('click', (event) => {
  if (event.target.closest('a')) setMobileMenuOpen(false);
});
document.addEventListener('pointerdown', (event) => {
  if (!event.target.closest('.site-header') && mobileMenuToggle.getAttribute('aria-expanded') === 'true') {
    setMobileMenuOpen(false);
  }
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && mobileMenuToggle.getAttribute('aria-expanded') === 'true') {
    setMobileMenuOpen(false);
    mobileMenuToggle.focus();
  }
});
window.addEventListener('resize', () => {
  if (window.matchMedia('(min-width: 601px)').matches) setMobileMenuOpen(false);
}, { passive:true });

function updateHeaderStyle() {
  const currentScrollY = window.scrollY;

  if (currentScrollY <= 0) {
    siteHeader.classList.remove('is-scrolled');
  } else {
    siteHeader.classList.add('is-scrolled');
  }

  headerFramePending = false;
}

function requestHeaderStyleUpdate() {
  if (headerFramePending) return;
  headerFramePending = true;
  window.requestAnimationFrame(updateHeaderStyle);
}

if (window.scrollY > 0) {
  siteHeader.classList.add('is-scrolled');
}

window.addEventListener('scroll', requestHeaderStyleUpdate, { passive: true });

const themeToggle = document.querySelector('#theme-toggle');
const themeColor = document.querySelector('meta[name="theme-color"]');

function applyTheme(theme, savePreference = true) {
  const isLight = theme === 'light';

  document.documentElement.dataset.theme = isLight ? 'light' : 'dark';
  themeToggle.setAttribute('aria-pressed', String(isLight));
  themeToggle.setAttribute('aria-label', isLight ? themeLabels[currentLanguage][3] : themeLabels[currentLanguage][2]);
  themeToggle.querySelector('.theme-toggle-icon').textContent = isLight ? '☾' : '☼';
  themeToggle.querySelector('.theme-toggle-label').textContent = isLight ? themeLabels[currentLanguage][1] : themeLabels[currentLanguage][0];
  themeColor.setAttribute('content', isLight ? '#f5f5f7' : '#080808');

  if (savePreference) {
    try {
      window.localStorage.setItem('milenio-theme', isLight ? 'light' : 'dark');
    } catch {
      // The theme still works when browser storage is unavailable.
    }
  }
}

let savedTheme = 'dark';
try {
  savedTheme = window.localStorage.getItem('milenio-theme') || 'dark';
} catch {
  // Use dark mode when browser storage is unavailable.
}

applyTheme(savedTheme, false);
themeToggle.addEventListener('click', () => {
  const nextTheme = document.documentElement.dataset.theme === 'dark'
    ? 'light'
    : 'dark';
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (document.startViewTransition && !prefersReducedMotion) {
    document.startViewTransition(() => applyTheme(nextTheme));
    return;
  }

  if (!prefersReducedMotion) {
    document.documentElement.classList.add('theme-colors-moving');
    window.setTimeout(() => {
      document.documentElement.classList.remove('theme-colors-moving');
    }, 720);
  }
  applyTheme(nextTheme);
});

document.querySelector('#year').textContent = new Date().getFullYear();

const form = document.querySelector('#contact-form');
const formMessage = document.querySelector('#form-message');
const terminalOutput = document.querySelector('#terminal-output');
const deliveryIsland = document.querySelector('#delivery-island');
const commandFields = [form.elements.email, form.elements.name];
let deliveryIslandTimer = 0;
let deliveryIslandHideTimer = 0;

function hideDeliveryIsland() {
  window.clearTimeout(deliveryIslandHideTimer);
  if (deliveryIsland.hidden) return;
  deliveryIsland.classList.remove('is-visible');
  deliveryIsland.classList.add('is-hiding');
  deliveryIslandHideTimer = window.setTimeout(() => {
    deliveryIsland.hidden = true;
    deliveryIsland.classList.remove('is-hiding');
  }, 340);
}

function showDeliveryIsland() {
  window.clearTimeout(deliveryIslandTimer);
  window.clearTimeout(deliveryIslandHideTimer);
  deliveryIsland.hidden = false;
  deliveryIsland.classList.remove('is-hiding');
  window.requestAnimationFrame(() => deliveryIsland.classList.add('is-visible'));
  deliveryIslandTimer = window.setTimeout(hideDeliveryIsland, 3000);
}

const formStatusMessages = {
  tr:{sending:'Mesaj gönderiliyor…',success:'Mesajınız iletildi. Teşekkürler.',failure:'Mesaj gönderilemedi. Lütfen biraz sonra tekrar deneyin.'},
  en:{sending:'Sending message…',success:'Your message was sent. Thank you.',failure:'Message could not be sent. Please try again shortly.'},
  de:{sending:'Nachricht wird gesendet…',success:'Ihre Nachricht wurde gesendet. Vielen Dank.',failure:'Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es später erneut.'},
  fr:{sending:'Envoi du message…',success:'Votre message a été envoyé. Merci.',failure:'Le message n’a pas pu être envoyé. Réessayez dans un instant.'},
  es:{sending:'Enviando mensaje…',success:'Tu mensaje se ha enviado. Gracias.',failure:'No se pudo enviar el mensaje. Inténtalo de nuevo.'},
  it:{sending:'Invio del messaggio…',success:'Il tuo messaggio è stato inviato. Grazie.',failure:'Impossibile inviare il messaggio. Riprova tra poco.'},
  ru:{sending:'Отправка сообщения…',success:'Сообщение отправлено. Спасибо.',failure:'Не удалось отправить сообщение. Попробуйте ещё раз позже.'},
  zh:{sending:'正在发送消息……',success:'消息已发送，谢谢。',failure:'消息发送失败，请稍后重试。'},
  ja:{sending:'メッセージを送信中……',success:'メッセージを送信しました。ありがとうございます。',failure:'送信できませんでした。しばらくしてからもう一度お試しください。'},
  pt:{sending:'Enviando mensagem…',success:'Sua mensagem foi enviada. Obrigado.',failure:'Não foi possível enviar. Tente novamente em instantes.'},
};

const terminalCommands = {
  '/durum': '[ Sistem: Kararlı // Stüdyo: Milenio Software // Çalışma biçimi: Tek kişilik bağımsız geliştirme ]',
  '/status': '[ Sistem: Kararlı // Stüdyo: Milenio Software // Çalışma biçimi: Tek kişilik bağımsız geliştirme ]',
  '/yardim': '[ Kullanılabilir komutlar: /durum , /temizle , /sistem ]',
  '/help': '[ Kullanılabilir komutlar: /durum , /temizle , /sistem ]',
  '/sistem': '[ Sistem: Kararlı // Çalışma zamanı: Saf JavaScript // Bağımlılık: 0 ]',
  '/system': '[ Sistem: Kararlı // Çalışma zamanı: Saf JavaScript // Bağımlılık: 0 ]',
};
const terminalCommandsEn = {
  '/durum': '[ System: Stable // Studio: Milenio Software // Mode: Independent Solo Build ]',
  '/status': '[ System: Stable // Studio: Milenio Software // Mode: Independent Solo Build ]',
  '/yardim': '[ Available commands: /status , /clear , /system ]',
  '/help': '[ Available commands: /status , /clear , /system ]',
  '/sistem': '[ System: Stable // Runtime: Vanilla JavaScript // Dependencies: 0 ]',
  '/system': '[ System: Stable // Runtime: Vanilla JavaScript // Dependencies: 0 ]',
};

function writeTerminalOutput(message, command) {
  const line = document.createElement('p');
  line.className = 'terminal-output-line mono';
  line.dataset.command = command;
  line.textContent = message;
  terminalOutput.append(line);
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function translateEnglishPhrase(phrase, language = currentLanguage) {
  if (language === 'en') return phrase;
  const dictionary = { ...(englishTranslations[language] || {}), ...(extraTranslations[language] || {}), ...(mobileStudioTranslations[language] || {}) };
  if (dictionary[phrase]) return dictionary[phrase];
  return Object.entries(dictionary)
    .sort(([left], [right]) => right.length - left.length)
    .reduce((result, [english, translated]) => result.replaceAll(english, translated), phrase);
}

function terminalMessage(command, language = currentLanguage) {
  return language === 'tr'
    ? terminalCommands[command]
    : translateEnglishPhrase(terminalCommandsEn[command], language);
}

function runTerminalCommand(field) {
  const command = field.value.trim().toLowerCase();

  if (command === '/clear' || command === '/temizle') {
    terminalOutput.replaceChildren();
  } else if (Object.prototype.hasOwnProperty.call(terminalCommands, command)) {
    writeTerminalOutput(terminalMessage(command), command);
  } else {
    return false;
  }

  field.value = '';
  return true;
}

commandFields.forEach((field) => {
  field.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && runTerminalCommand(field)) {
      event.preventDefault();
    }
  });

  field.addEventListener('blur', () => {
    runTerminalCommand(field);
  });
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  if (form.dataset.submitting === 'true') return;

  const submitButton = form.querySelector('[type="submit"]');
  const messages = formStatusMessages[currentLanguage];

  form.dataset.submitting = 'true';
  form.dataset.status = 'sending';
  submitButton.disabled = true;
  formMessage.textContent = messages.sending;

  fetch(form.action, {
    method: 'POST',
    body: new FormData(form),
    headers: { Accept: 'application/json' },
  })
    .then(async (response) => {
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.errors?.length) throw new Error('Formspree rejected the submission');
      form.reset();
      form.dataset.status = 'success';
      terminalOutput.replaceChildren();
      formMessage.textContent = '';
      showDeliveryIsland();
    })
    .catch(() => {
      form.dataset.status = 'failure';
      formMessage.textContent = messages.failure;
    })
    .finally(() => {
      delete form.dataset.submitting;
      submitButton.disabled = false;
    });
});

const languageToggle = document.querySelector('#language-toggle');
const languageMenu = document.querySelector('#language-menu');
let languageMenuTimer = 0;
const revealParagraphs = [...document.querySelectorAll('.hero-bottom p, .about-content > p, .contact-intro > p')];
const revealParagraphsTr = revealParagraphs.map((paragraph) => paragraph.textContent);
const revealParagraphsByLanguage = {
  tr: revealParagraphsTr,
  en: [
  'We build independent mobile apps and digital tools that simplify complex processes. We focus on long-lasting, high-performance systems without the weight of large libraries.',
  'Every build should begin with a clear problem and careful execution. As an independent software studio, we explore ideas and share our process openly.',
  'Have an idea, a question, or a problem to solve? Leave a message and let’s start a conversation.',
  ],
  de: [
    'Wir entwickeln unabhängige mobile Apps und digitale Werkzeuge, die komplexe Abläufe vereinfachen. Ohne schwerfällige Bibliotheken konzentrieren wir uns auf langlebige, leistungsstarke Systeme.',
    'Jede Entwicklung beginnt mit einem klaren Problem und sorgfältiger Umsetzung. Als unabhängiges Softwarestudio erforschen wir Ideen und teilen unseren Prozess offen.',
    'Haben Sie eine Idee, eine Frage oder ein Problem? Hinterlassen Sie eine Nachricht und lassen Sie uns sprechen.',
  ],
  fr: [
    'Nous créons des applications mobiles indépendantes et des outils numériques qui simplifient les processus complexes. Sans bibliothèques lourdes, nous privilégions des systèmes durables et performants.',
    'Chaque réalisation part d’un problème clair et d’une exécution soignée. Studio logiciel indépendant, nous explorons les idées et partageons notre démarche.',
    'Une idée, une question ou un problème à résoudre ? Laissez-nous un message et commençons à échanger.',
  ],
  es: [
    'Creamos aplicaciones móviles independientes y herramientas digitales que simplifican procesos complejos. Sin bibliotecas pesadas, nos centramos en sistemas duraderos y de alto rendimiento.',
    'Cada desarrollo parte de un problema claro y una ejecución cuidadosa. Como estudio independiente, exploramos ideas y compartimos nuestro proceso.',
    '¿Tienes una idea, una pregunta o un problema que resolver? Déjanos un mensaje y empecemos a conversar.',
  ],
  it: [
    'Sviluppiamo app mobili indipendenti e strumenti digitali che semplificano processi complessi. Senza librerie pesanti, puntiamo su sistemi duraturi e performanti.',
    'Ogni sviluppo nasce da un problema chiaro e da un’esecuzione attenta. Come studio indipendente esploriamo idee e condividiamo il nostro processo.',
    'Hai un’idea, una domanda o un problema da risolvere? Lascia un messaggio e iniziamo a parlarne.',
  ],
  ru: [
    'Мы создаём независимые мобильные приложения и цифровые инструменты, упрощающие сложные процессы. Без тяжёлых библиотек разрабатываем долговечные и быстрые системы.',
    'Каждая разработка начинается с ясной задачи и внимательной реализации. Мы независимая студия: исследуем идеи и открыто делимся процессом.',
    'Есть идея, вопрос или задача? Оставьте сообщение — начнём разговор.',
  ],
  zh: [
    '我们开发独立移动应用和数字工具，简化复杂流程。避免臃肿的库，专注构建持久、高性能的系统。',
    '每个项目都从明确的问题和周密的执行开始。作为独立软件工作室，我们探索创意并公开分享开发过程。',
    '有想法、问题或需要解决的难题？给我们留言，让我们开始交流。',
  ],
  ja: [
    '複雑な業務をシンプルにする、独立系モバイルアプリとデジタルツールを開発します。大きなライブラリに頼らず、長く使える高性能なシステムを目指します。',
    '明確な課題と丁寧な実装から開発を始めます。独立系ソフトウェアスタジオとして、アイデアを探り、制作過程を公開しています。',
    'アイデアや質問、解決したい課題がありますか？メッセージをお寄せください。',
  ],
  pt: [
    'Desenvolvemos aplicativos móveis independentes e ferramentas digitais que simplificam processos complexos. Sem bibliotecas pesadas, focamos em sistemas duradouros e eficientes.',
    'Cada projeto começa com um problema claro e uma execução cuidadosa. Como estúdio independente, exploramos ideias e compartilhamos nosso processo.',
    'Tem uma ideia, dúvida ou problema para resolver? Envie uma mensagem e vamos conversar.',
  ],
};
const textTranslations = {
  'Laboratuvar':'Lab', 'Projeler':'Projects', 'Yaklaşım':'Approach', 'İletişim':'Contact',
  '[ GELİŞTİRME SÜRÜYOR ]':'[ DEVELOPMENT IN PROGRESS ]',
  'BAĞIMSIZ YAZILIM STÜDYOSU':'INDEPENDENT SOFTWARE STUDIO',
  '/ YAZILIM SİSTEMLERİ':'/ SOFTWARE SYSTEMS', 'Geleceğin Mobil Sistemleri':'Mobile Systems for the Future',
  'MS—001 ':'MS—001 ', 'Projeleri keşfet':'Explore projects',
  'LABORATUVAR':'LAB', 'GELİŞTİRME SÜREÇLERİ':'DEVELOPMENT PROCESS',
  'Laboratuvar: geliştirme süreçleri':'Lab: development process', 'Geliştirme süreçleri':'Development process',
  '01_KONSEPT / SAF FİKİR':'01_CONCEPT / PURE IDEA',
  'Her proje bir soruyla başlar. Genç bir startup refleksiyle önce sorunun özünü ve mobil dünyadaki karşılığını netleştirir, mimariyi kurarız.':'Every project begins with a question. With a startup mindset, we clarify the core problem and its place in the mobile world, then shape the architecture.',
  '[ aşama: planlama ]':'[ stage: planning ]', '02_ZANAAT / TEMİZ KOD':'02_CRAFT / CLEAN CODE',
  'İhtiyacımız olmayan hiçbir hazır aracı uygulamalarımıza eklemiyoruz. Sıfır bağımlılık (Zero-dependency) prensibiyle, her satırı hız ve pil tasarrufu odaklı yazıyoruz.':'We add no ready-made tools that we do not need. Following a zero-dependency principle, we write every line for speed and battery efficiency.',
  '[ altyapı: saf_kod ]':'[ infrastructure: pure_code ]', '03_YİNELEME / PROTOTİP':'03_ITERATION / PROTOTYPE',
  'Fikirleri hızla çalışan mobil prototiplere dönüştürürüz. Deneysel yaklaşımlarla arayüzü ve performansı en yalın hale getirene kadar optimize ederiz.':'We quickly turn ideas into working mobile prototypes. We refine the interface and performance through experiments until both are as lean as possible.',
  '[ sürüm: test_aşamasında ]':'[ build: in_testing ]', 'Fikir':'Idea', 'Saf kod':'Pure code', 'İterasyon':'Iteration',
  'ÇALIŞMA ALANI':'WORKSPACE', 'YEREL ÖNİZLEME':'LOCAL PREVIEW', 'ÇALIŞMA ALANI /':'WORKSPACE /',
  'çalışma-alanı.milenio.yerel':'workspace.milenio.local',
  'FİKİR GELİŞTİRME':'IDEA DEVELOPMENT', 'MİLENIO SOFTWARE / LABORATUVAR':'MILENIO SOFTWARE / LAB',
  'Önce sorunu anla. Sonra çöz.':'Think first. Then build.', 'PROBLEM ALANI':'PROBLEM SPACE',
  'GİRDİ':'INPUT', 'MODEL':'MODEL', 'MANTIK':'LOGIC', 'PLAN':'PLAN', 'MİMARİ NOTLAR':'ARCHITECTURE NOTES',
  'Problemi tanımla':'Define the problem', 'Karmaşıklığı sadeleştir':'Simplify complexity', 'Mimariyi kur':'Shape the architecture',
  '[ odak: yalın_mantık ]':'[ focus: lean_logic ]', 'ÖNCE SORUNU ANLA, SONRA ÇÖZ':'THINK FIRST, THEN CODE',
  'MİLENIO SOFTWARE / ZANAAT':'MILENIO SOFTWARE / CRAFT', 'İhtiyaç kadar kod. Gerektiği kadar araç.':'Light. Fast. From scratch.',
  'CSS / GÖRSEL KATMAN':'CSS / VISUAL LAYER', 'DÜZEN':'LAYOUT', 'STİL':'STYLE', 'GELİŞTİRME':'DEVELOPMENT',
  'GELİŞTİRME İLKELERİ':'BUILD PRINCIPLES', 'Saf JavaScript':'Vanilla JavaScript', 'Modern CSS':'Modern CSS',
  'Sıfır bağımlılık':'Zero dependencies', '[ altyapı: saf_js ]':'[ stack: vanilla_js ]',
  'GEREKSİZ BAĞIMLILIK YOK':'LEAN CSS · NO HEAVY LIBRARIES',
  'MİLENIO SOFTWARE / YİNELEME':'MILENIO SOFTWARE / ITERATION', 'Deneyerek iyileştir.':'Improve through iteration.',
  'YİNELEME':'ITERATION', 'ETKİNLİK':'ACTIVITY', 'DURUM':'STATUS', 'Fikir → çalışan arayüz':'Idea → working interface',
  'TEST EDİLİYOR':'IN TESTING', 'Gözlem → öğrenim':'Observation → learning', 'İNCELEME':'REVIEW',
  'Kod → iyileştirme':'Code → improvement', 'GELİŞTİRİLİYOR':'IN DEVELOPMENT', 'Yeni yaklaşım':'New approach',
  'SÜRÜYOR':'IN PROGRESS', '[ depo: etkin_dal ]':'[ repository: active_branch ]', 'İNŞA ET · ÖĞREN · İYİLEŞTİR':'BUILD · LEARN · IMPROVE',
  'PROTOTİP DÖNGÜSÜ: ETKİN':'PROTOTYPE LOOP: ACTIVE', 'GERİ BİLDİRİM → İYİLEŞTİRME':'FEEDBACK → IMPROVEMENT',
  'SÜRÜMÜ ÖNİZLE':'PREVIEW BUILD', 'ŞEK. 01 — LABORATUVAR / GELİŞTİRME SÜRECİ':'FIG. 01 — LAB / DEVELOPMENT PROCESS',
  'AŞAĞI KAYDIR':'SCROLL TO EXPLORE', '[01/03 KONSEPT]':'[01/03 CONCEPT]', '[02/03 ZANAAT]':'[02/03 CRAFT]', '[03/03 YİNELEME]':'[03/03 ITERATION]',
  '[ roadmap: 2026 / 2027 ]':'[ roadmap: 2026 / 2027 ]', 'YOL HARİTASI':'ROADMAP',
  'Aşama 01:':'Stage 01:', 'Stüdyonun felsefesinin ve minimalist web çekirdeğinin kurulması':'Establishing the studio philosophy and minimalist web core', '[ TAMAMLANDI ]':'[ COMPLETE ]',
  'Aşama 02:':'Stage 02:', 'Deneysel mobil arayüzlerin ve batarya dostu mimarilerin prototiplenmesi':'Prototyping experimental mobile interfaces and battery-friendly architectures', '[ SÜREÇTE ]':'[ IN PROGRESS ]',
  'Aşama 03:':'Stage 03:', 'İlk bağımsız mobil araçların App Store ve Google Play üzerinde yayınlanması':'Releasing the first independent mobile tools on the App Store and Google Play', '[ PLANLANIYOR ]':'[ PLANNED ]',
  'Milenio İşletim Sistemi':'Milenio Operating System', '[ durum: alfa / özel_çekirdek ]':'[ status: alpha / custom_kernel ]',
  'Vertex Veri Hattı':'Vertex Pipeline', '[ durum: aktif_geliştirme / veri_altyapısı ]':'[ status: active_build / data_infrastructure ]',
  '02 — İLKELER':'02 — PRINCIPLES', 'NASIL ÜRETİYORUZ':'HOW WE BUILD', 'SADE TASARIM':'SIMPLICITY BY DESIGN',
  'Az söz.':'Less talk.', 'Sağlam iş.':'Built well.',
  '01 / NETLİK':'01 / CLARITY', 'Önce problemi anla.':'Understand the problem first.', '02 / USTALIK':'02 / CRAFT',
  'Önce problemi anla, mobil deneyimi sadeleştir.':'Understand the problem first; simplify the mobile experience.',
  'Arayüz akışlarına ve kodun hafifliğine özen göster.':'Care about interface flows and lightweight code.', '03 / DÜRÜSTLÜK':'03 / HONESTY', 'Geliştirme süreçlerini şeffaf ve yalın tut.':'Keep development transparent and lean.',
  '03 — ÇALIŞMA ALANLARI':'03 — CAPABILITIES', 'Çalışma alanlarımız':'Capabilities & technology',
  'TEMEL ODAK':'CORE FOCUS', 'Bağımsız Mobil Araçlar':'Independent Mobile Tools',
  'Karmaşık günlük işleri akıllı telefonlarda saniyeler içinde çözen minimalist mobil uygulamalar.':'Minimal mobile apps that solve complex everyday tasks on a smartphone in seconds.',
  'Yalın Kullanıcı Deneyimi':'Lean User Experience',
  'Ekranı gereksiz buton, reklam veya şişirilmiş animasyonlarla doldurmayan; doğrudan çözüme odaklanan arayüzler.':'Interfaces that skip clutter, ads, and excessive animation to focus on the solution.',
  'Performans Mühendisliği':'Performance Engineering',
  'Telefonun işlemcisini yormayan ve bataryayı sömürmeyen optimize edilmiş sistemler.':'Optimized systems that go easy on the processor and battery.',
  'TEKNOLOJİLER':'TECHNOLOGIES', 'Saf JavaScript (ES6+)':'Vanilla JavaScript (ES6+)',
  'Temiz, kütüphanesiz ve hızlı mantık yapısı.':'Clean, dependency-free logic built for speed.',
  'Modern CSS / Grid':'Modern CSS / Grid', 'Esnek ve her ekrana kusursuz oturan brütalist tasarımlar.':'Flexible, brutalist designs that adapt cleanly to every screen.',
  'Hafif Node.js':'Lightweight Node.js', 'Arka planda uygulamalarımızı besleyen, sunucuyu yormayan veri mimarisi.':'A lean data architecture that powers our apps without burdening the server.',
  'Mobil Sistem Mimarisi':'Mobile Systems Architecture', 'Mobil platformlar için optimize edilmiş mantık modelleri.':'Logic models optimized for mobile platforms.',
  'BİZİM FARKIMIZ':'WHAT SETS US APART', 'Gereksiz Bağımlılıkları Azaltma':'Fewer Unnecessary Dependencies',
  'Hazır kütüphanelerin hantallığından kaçıp uygulama boyutunu düşük tutuyoruz.':'We avoid the weight of off-the-shelf libraries and keep app sizes small.',
  'Minimum Kaynak Tüketimi':'Minimal Resource Use', 'İnternet kotasını ve cihaz belleğini koruyan akıllı algoritmalar geliştiriyoruz.':'We build smart algorithms that conserve data and device memory.',
  'Zanaatkâr Kod Kalitesi':'Crafted Code', 'Yapay zekâ üretimi genel şablonlara yaslanmadan, her satırı düşünerek saf kod yazıyoruz.':'We write and review every line ourselves instead of relying on generic AI-generated templates.',
  '04 — İLETİŞİM':'04 — CONTACT', 'BİZE ULAŞIN':'OPEN CHANNEL',
  'İLETİŞİM':'LET’S TALK', 'Fikirleri':'Let’s talk about', 'konuşalım.':'ideas.',
  'Bir startup fikriniz mi var, saf kod felsefesini mi tartışmak istiyorsunuz yoksa sadece selam mı vermek istiyorsunuz? Doğrudan kurucuya ulaşın.':'Have a startup idea, want to discuss the philosophy of pure code, or just say hello? Reach out directly to the founder.',
  '[ FORM: AŞAĞIDA ] ↓':'[ CONTACT: FORM BELOW ] ↓',
  '[ FORM: SAĞDA ] →':'[ CONTACT: FORM ON THE RIGHT ] →',
  'milenio-software — iletişim':'milenio-software — contact', 'HAZIR':'READY', 'milenio-software:~$ eposta_gir:':'milenio-software:~$ enter_email:',
  'milenio-software:~$ isim_gir:':'milenio-software:~$ enter_name:', 'milenio-software:~$ mesajiniz':'milenio-software:~$ project_idea:',
  'Adınız soyadınız':'Your name', 'Mesajınızı buraya bırakın...':'Leave your message here...',
  '[form: yalnızca_doğrulama]':'[form: validation_only]', 'MESAJ GÖNDER':'SEND MESSAGE', 'Terminal çıktısı':'Terminal output',
  'MILENIO SOFTWARE © ':'MILENIO SOFTWARE © ', 'ÖZENLE GELİŞTİRİLDİ':'BUILT WITH CARE', 'BAŞA DÖN ↑':'BACK TO TOP ↑',
};
const englishTranslations = {
  de: {
    'Lab':'Labor', 'Approach':'Ansatz', 'Contact':'Kontakt', '[ DEVELOPMENT IN PROGRESS ]':'[ ENTWICKLUNG LÄUFT ]',
    'INDEPENDENT SOFTWARE STUDIO':'UNABHÄNGIGES SOFTWARESTUDIO', 'Systems for the Future':'Systeme für die Zukunft',
    'DEVELOPMENT PROCESS':'ENTWICKLUNGSPROZESS', 'CONCEPT / IDEA':'KONZEPT / IDEE', 'CRAFT / PURE CODE':'HANDWERK / KLARER CODE',
    'ITERATION / PROTOTYPE':'ITERATION / PROTOTYP', '[ stage: planning ]':'[ phase: planung ]',
    '[ environment: local_server ]':'[ umgebung: lokaler_server ]', '[ build: testing ]':'[ build: testphase ]',
    'WORKSPACE':'ARBEITSBEREICH', 'LOCAL PREVIEW':'LOKALE VORSCHAU', 'IDEA DEVELOPMENT':'IDEENENTWICKLUNG', 'Idea':'Idee', 'Pure code':'Klarer Code', 'Iteration':'Iteration',
    'Think first. Then build.':'Erst denken. Dann bauen.', 'PROBLEM SPACE':'PROBLEMBEREICH', 'ARCHITECTURE NOTES':'ARCHITEKTURNOTIZEN',
    'Define the problem':'Problem definieren', 'Simplify complexity':'Komplexität vereinfachen', 'Shape the architecture':'Architektur entwerfen',
    'Light. Fast. From scratch.':'Leicht. Schnell. Von Grund auf.', 'BUILD PRINCIPLES':'ENTWICKLUNGSPRINZIPIEN', 'Zero dependencies':'Keine Abhängigkeiten',
    'Improve through iteration.':'Durch Iteration verbessern.', 'ACTIVITY':'AKTIVITÄT', 'STATUS':'STATUS',
    'IN TESTING':'IM TEST', 'REVIEW':'PRÜFUNG', 'IN DEVELOPMENT':'IN ENTWICKLUNG', 'ACTIVE BUILDS':'AKTUELLE PROJEKTE',
    'Milenio Operating System':'Milenio Betriebssystem',
    'Every Milenio Software project starts on a digital whiteboard. We shape the architecture in our minds before writing code, turning complex problems into simpler ones.':'Jedes Projekt von Milenio Software beginnt am digitalen Whiteboard. Wir entwerfen die Architektur zuerst im Kopf und machen komplexe Probleme einfacher.',
    'We avoid ready-made templates and bloated libraries. Every experimental interface is built from scratch with pure CSS and JavaScript for speed.':'Wir verzichten auf fertige Vorlagen und überladene Bibliotheken. Jede experimentelle Oberfläche entsteht für maximale Geschwindigkeit mit CSS und JavaScript von Grund auf.',
    'Speed is a startup’s strongest tool. We turn ideas into working prototypes, learn from mistakes, and improve the code every day.':'Geschwindigkeit ist das stärkste Werkzeug eines Start-ups. Wir machen Ideen zu Prototypen, lernen aus Fehlern und verbessern den Code täglich.',
    'Every build should address a clear problem with thoughtful execution. As an independent software studio, we explore ideas and share our process openly.':'Jede Entwicklung sollte ein klares Problem sorgfältig lösen. Als unabhängiges Softwarestudio erforschen wir Ideen und teilen unseren Prozess offen.',
    'HOW WE BUILD':'WIE WIR ENTWICKELN', 'SIMPLICITY BY DESIGN':'EINFACHHEIT IM DESIGN',
    'Less talk.':'Weniger Worte.', 'Built well.':'Gut gebaut.', 'CLARITY':'KLARHEIT', 'CRAFT':'HANDWERK', 'HONESTY':'EHRLICHKEIT',
    'CAPABILITIES':'KOMPETENZEN', 'Capabilities & technology':'Kompetenzen & Technologie', 'CORE':'KERN', 'STACK':'TECHNOLOGIEN', 'FOCUS':'FOKUS',
    'OPEN CHANNEL':'DIREKTER KONTAKT', 'LET’S BUILD TOGETHER':'LASS UNS ZUSAMMEN BAUEN', 'Let’s':'Lass uns', 'build something.':'etwas bauen.',
    '[ CONTACT: FORM BELOW ] ↓':'[ KONTAKTFORMULAR UNTEN ] ↓', '[ CONTACT: FORM ON THE RIGHT ] →':'[ KONTAKTFORMULAR RECHTS ] →',
    'READY':'BEREIT', 'VALIDATE FORM':'FORMULAR PRÜFEN', 'PREVIEW BUILD':'VORSCHAU', 'SCROLL TO EXPLORE':'ZUM ENTDECKEN SCROLLEN',
    'BUILT WITH CARE':'MIT SORGFALT GEBAUT', 'BACK TO TOP ↑':'NACH OBEN ↑', 'LIGHT MODE':'HELLER MODUS', 'DARK MODE':'DUNKLER MODUS',
    'Custom Web Applications':'Individuelle Webanwendungen', 'API Architecture':'API-Architektur', 'Performance Engineering':'Performance Engineering',
    'Modern CSS / Grid':'Modernes CSS / Grid', 'Nextflow Pipeline':'Nextflow-Pipeline', 'Zero-Dependency Development':'Entwicklung ohne Abhängigkeiten',
    'Scalable Infrastructure':'Skalierbare Infrastruktur', 'Clean Code Optimization':'Saubere Codeoptimierung',
    '[ status: alpha / custom_kernel ]':'[ status: alpha / eigener_kernel ]', '[ status: active_build / data_infrastructure ]':'[ status: in_entwicklung / daten_infrastruktur ]',
    '[ System: Stable // Studio: Milenio Software // Mode: Independent Solo Build ]':'[ System: stabil // Studio: Milenio Software // Modus: unabhängiger Einzelaufbau ]',
    '[ Available commands: /status , /clear , /system ]':'[ Verfügbare Befehle: /status , /clear , /system ]',
    '[ System: Stable // Runtime: Vanilla JavaScript // Dependencies: 0 ]':'[ System: stabil // Laufzeit: Vanilla JavaScript // Abhängigkeiten: 0 ]',
    'VALIDATION_ONLY':'NUR_VALIDIERUNG', 'enter_email:':'E-Mail_eingeben:', 'enter_name:':'Name_eingeben:', 'project_context:':'projektkontext:',
  },
  fr: {
    'Lab':'Laboratoire', 'Approach':'Approche', 'Contact':'Contact', '[ DEVELOPMENT IN PROGRESS ]':'[ DÉVELOPPEMENT EN COURS ]',
    'INDEPENDENT SOFTWARE STUDIO':'STUDIO LOGICIEL INDÉPENDANT', 'Systems for the Future':'Les systèmes de demain',
    'DEVELOPMENT PROCESS':'PROCESSUS DE DÉVELOPPEMENT', 'CONCEPT / IDEA':'CONCEPT / IDÉE', 'CRAFT / PURE CODE':'SAVOIR-FAIRE / CODE ÉPURÉ',
    'ITERATION / PROTOTYPE':'ITÉRATION / PROTOTYPE', '[ stage: planning ]':'[ étape : planification ]',
    '[ environment: local_server ]':'[ environnement : serveur_local ]', '[ build: testing ]':'[ build : en_test ]',
    'WORKSPACE':'ESPACE DE TRAVAIL', 'LOCAL PREVIEW':'APERÇU LOCAL', 'IDEA DEVELOPMENT':'DÉVELOPPEMENT D’IDÉE', 'Idea':'Idée', 'Pure code':'Code épuré', 'Iteration':'Itération',
    'Think first. Then build.':'Penser d’abord. Construire ensuite.', 'PROBLEM SPACE':'ESPACE DU PROBLÈME', 'ARCHITECTURE NOTES':'NOTES D’ARCHITECTURE',
    'Define the problem':'Définir le problème', 'Simplify complexity':'Simplifier la complexité', 'Shape the architecture':'Concevoir l’architecture',
    'Light. Fast. From scratch.':'Léger. Rapide. Conçu de zéro.', 'BUILD PRINCIPLES':'PRINCIPES DE DÉVELOPPEMENT', 'Zero dependencies':'Zéro dépendance',
    'Improve through iteration.':'Améliorer par itération.', 'ACTIVITY':'ACTIVITÉ', 'STATUS':'STATUT', 'IN TESTING':'EN TEST', 'REVIEW':'EN REVUE',
    'IN DEVELOPMENT':'EN DÉVELOPPEMENT', 'ACTIVE BUILDS':'PROJETS EN COURS', 'Milenio Operating System':'Système d’exploitation Milenio',
    'Every Milenio Software project starts on a digital whiteboard. We shape the architecture in our minds before writing code, turning complex problems into simpler ones.':'Chaque projet Milenio Software commence sur un tableau numérique. Nous concevons l’architecture avant le code pour simplifier les problèmes complexes.',
    'We avoid ready-made templates and bloated libraries. Every experimental interface is built from scratch with pure CSS and JavaScript for speed.':'Nous évitons les modèles prêts à l’emploi et les bibliothèques lourdes. Chaque interface expérimentale est créée de zéro en CSS et JavaScript pour aller vite.',
    'Speed is a startup’s strongest tool. We turn ideas into working prototypes, learn from mistakes, and improve the code every day.':'La vitesse est le meilleur atout d’une jeune entreprise. Nous transformons les idées en prototypes, apprenons de nos erreurs et améliorons le code chaque jour.',
    'Every build should address a clear problem with thoughtful execution. As an independent software studio, we explore ideas and share our process openly.':'Chaque réalisation doit répondre à un problème clair avec soin. Studio logiciel indépendant, nous explorons les idées et partageons ouvertement notre démarche.',
    'HOW WE BUILD':'NOTRE MÉTHODE', 'SIMPLICITY BY DESIGN':'LA SIMPLICITÉ PAR LE DESIGN', 'Less talk.':'Moins de mots.', 'Built well.':'Bien construit.',
    'CLARITY':'CLARTÉ', 'CRAFT':'SAVOIR-FAIRE', 'HONESTY':'HONNÊTETÉ', 'CAPABILITIES':'COMPÉTENCES',
    'Capabilities & technology':'Compétences & technologies', 'CORE':'FONDAMENTAUX', 'STACK':'TECHNOLOGIES', 'FOCUS':'FOCUS',
    'OPEN CHANNEL':'CONTACT DIRECT', 'LET’S BUILD TOGETHER':'CONSTRUISONS ENSEMBLE', 'Let’s':'Construisons', 'build something.':'quelque chose.',
    '[ CONTACT: FORM BELOW ] ↓':'[ FORMULAIRE DE CONTACT CI-DESSOUS ] ↓', '[ CONTACT: FORM ON THE RIGHT ] →':'[ FORMULAIRE DE CONTACT À DROITE ] →',
    'READY':'PRÊT', 'VALIDATE FORM':'VALIDER LE FORMULAIRE', 'PREVIEW BUILD':'APERÇU', 'SCROLL TO EXPLORE':'FAITES DÉFILER POUR EXPLORER',
    'BUILT WITH CARE':'CONÇU AVEC SOIN', 'BACK TO TOP ↑':'RETOUR EN HAUT ↑', 'LIGHT MODE':'MODE CLAIR', 'DARK MODE':'MODE SOMBRE',
    'Custom Web Applications':'Applications web sur mesure', 'API Architecture':'Architecture API', 'Performance Engineering':'Ingénierie de la performance',
    'Modern CSS / Grid':'CSS moderne / Grid', 'Nextflow Pipeline':'Pipeline Nextflow', 'Zero-Dependency Development':'Développement sans dépendances',
    'Scalable Infrastructure':'Infrastructure évolutive', 'Clean Code Optimization':'Optimisation du code',
    '[ status: alpha / custom_kernel ]':'[ statut : alpha / noyau_personnalisé ]', '[ status: active_build / data_infrastructure ]':'[ statut : développement / infrastructure_données ]',
    '[ System: Stable // Studio: Milenio Software // Mode: Independent Solo Build ]':'[ Système : stable // Studio : Milenio Software // Mode : développement indépendant ]',
    '[ Available commands: /status , /clear , /system ]':'[ Commandes disponibles : /status , /clear , /system ]',
    '[ System: Stable // Runtime: Vanilla JavaScript // Dependencies: 0 ]':'[ Système : stable // Exécution : JavaScript natif // Dépendances : 0 ]',
    'enter_email:':'saisir_email:', 'enter_name:':'saisir_nom:', 'project_context:':'contexte_projet:',
  },
  es: {
    'Lab':'Laboratorio', 'Approach':'Enfoque', 'Contact':'Contacto', '[ DEVELOPMENT IN PROGRESS ]':'[ DESARROLLO EN CURSO ]',
    'INDEPENDENT SOFTWARE STUDIO':'ESTUDIO DE SOFTWARE INDEPENDIENTE', 'Systems for the Future':'Sistemas para el futuro',
    'DEVELOPMENT PROCESS':'PROCESO DE DESARROLLO', 'CONCEPT / IDEA':'CONCEPTO / IDEA', 'CRAFT / PURE CODE':'OFICIO / CÓDIGO LIMPIO',
    'ITERATION / PROTOTYPE':'ITERACIÓN / PROTOTIPO', '[ stage: planning ]':'[ fase: planificación ]',
    '[ environment: local_server ]':'[ entorno: servidor_local ]', '[ build: testing ]':'[ build: en_pruebas ]',
    'WORKSPACE':'ESPACIO DE TRABAJO', 'LOCAL PREVIEW':'VISTA LOCAL', 'IDEA DEVELOPMENT':'DESARROLLO DE IDEAS', 'Idea':'Idea', 'Pure code':'Código limpio', 'Iteration':'Iteración',
    'Think first. Then build.':'Piensa primero. Construye después.', 'PROBLEM SPACE':'ESPACIO DEL PROBLEMA', 'ARCHITECTURE NOTES':'NOTAS DE ARQUITECTURA',
    'Define the problem':'Definir el problema', 'Simplify complexity':'Simplificar la complejidad', 'Shape the architecture':'Diseñar la arquitectura',
    'Light. Fast. From scratch.':'Ligero. Rápido. Desde cero.', 'BUILD PRINCIPLES':'PRINCIPIOS DE DESARROLLO', 'Zero dependencies':'Cero dependencias',
    'Improve through iteration.':'Mejorar mediante iteraciones.', 'ACTIVITY':'ACTIVIDAD', 'STATUS':'ESTADO', 'IN TESTING':'EN PRUEBAS', 'REVIEW':'REVISIÓN',
    'IN DEVELOPMENT':'EN DESARROLLO', 'ACTIVE BUILDS':'PROYECTOS ACTIVOS', 'Milenio Operating System':'Sistema Operativo Milenio',
    'Every Milenio Software project starts on a digital whiteboard. We shape the architecture in our minds before writing code, turning complex problems into simpler ones.':'Cada proyecto de Milenio Software comienza en una pizarra digital. Diseñamos la arquitectura antes de escribir código para simplificar problemas complejos.',
    'We avoid ready-made templates and bloated libraries. Every experimental interface is built from scratch with pure CSS and JavaScript for speed.':'Evitamos plantillas y bibliotecas pesadas. Creamos cada interfaz experimental desde cero con CSS y JavaScript para lograr la máxima velocidad.',
    'Speed is a startup’s strongest tool. We turn ideas into working prototypes, learn from mistakes, and improve the code every day.':'La velocidad es la mejor herramienta de una startup. Convertimos ideas en prototipos, aprendemos de los errores y mejoramos el código cada día.',
    'Every build should address a clear problem with thoughtful execution. As an independent software studio, we explore ideas and share our process openly.':'Cada desarrollo debe resolver un problema claro con cuidado. Como estudio independiente, exploramos ideas y compartimos nuestro proceso con transparencia.',
    'HOW WE BUILD':'CÓMO CONSTRUIMOS', 'SIMPLICITY BY DESIGN':'SIMPLICIDAD EN EL DISEÑO', 'Less talk.':'Menos palabras.', 'Built well.':'Bien construido.',
    'CLARITY':'CLARIDAD', 'CRAFT':'OFICIO', 'HONESTY':'HONESTIDAD', 'CAPABILITIES':'CAPACIDADES',
    'Capabilities & technology':'Capacidades y tecnología', 'CORE':'BASE', 'STACK':'TECNOLOGÍAS', 'FOCUS':'ENFOQUE',
    'OPEN CHANNEL':'CONTACTO DIRECTO', 'LET’S BUILD TOGETHER':'CONSTRUYAMOS JUNTOS', 'Let’s':'Vamos a', 'build something.':'crear algo.',
    '[ CONTACT: FORM BELOW ] ↓':'[ FORMULARIO DE CONTACTO ABAJO ] ↓', '[ CONTACT: FORM ON THE RIGHT ] →':'[ FORMULARIO DE CONTACTO A LA DERECHA ] →',
    'READY':'LISTO', 'VALIDATE FORM':'VALIDAR FORMULARIO', 'PREVIEW BUILD':'VISTA PREVIA', 'SCROLL TO EXPLORE':'DESLIZA PARA EXPLORAR',
    'BUILT WITH CARE':'HECHO CON CUIDADO', 'BACK TO TOP ↑':'VOLVER ARRIBA ↑', 'LIGHT MODE':'MODO CLARO', 'DARK MODE':'MODO OSCURO',
    'Custom Web Applications':'Aplicaciones web a medida', 'API Architecture':'Arquitectura de API', 'Performance Engineering':'Ingeniería del rendimiento',
    'Modern CSS / Grid':'CSS moderno / Grid', 'Nextflow Pipeline':'Pipeline de Nextflow', 'Zero-Dependency Development':'Desarrollo sin dependencias',
    'Scalable Infrastructure':'Infraestructura escalable', 'Clean Code Optimization':'Optimización de código limpio',
    '[ status: alpha / custom_kernel ]':'[ estado: alfa / núcleo_personalizado ]', '[ status: active_build / data_infrastructure ]':'[ estado: en_desarrollo / infraestructura_de_datos ]',
    '[ System: Stable // Studio: Milenio Software // Mode: Independent Solo Build ]':'[ Sistema: estable // Estudio: Milenio Software // Modo: desarrollo independiente ]',
    '[ Available commands: /status , /clear , /system ]':'[ Comandos disponibles: /status , /clear , /system ]',
    '[ System: Stable // Runtime: Vanilla JavaScript // Dependencies: 0 ]':'[ Sistema: estable // Ejecución: JavaScript nativo // Dependencias: 0 ]',
    'enter_email:':'introducir_email:', 'enter_name:':'introducir_nombre:', 'project_context:':'contexto_del_proyecto:',
  },
  it: {
    'Lab':'Laboratorio', 'Approach':'Approccio', 'Contact':'Contatti', '[ DEVELOPMENT IN PROGRESS ]':'[ SVILUPPO IN CORSO ]',
    'INDEPENDENT SOFTWARE STUDIO':'STUDIO SOFTWARE INDIPENDENTE', 'Systems for the Future':'Sistemi per il futuro',
    'DEVELOPMENT PROCESS':'PROCESSO DI SVILUPPO', 'CONCEPT / IDEA':'CONCETTO / IDEA', 'CRAFT / PURE CODE':'MESTIERE / CODICE PURO',
    'ITERATION / PROTOTYPE':'ITERAZIONE / PROTOTIPO', '[ stage: planning ]':'[ fase: pianificazione ]',
    '[ environment: local_server ]':'[ ambiente: server_locale ]', '[ build: testing ]':'[ build: in_test ]',
    'WORKSPACE':'AREA DI LAVORO', 'LOCAL PREVIEW':'ANTEPRIMA LOCALE', 'IDEA DEVELOPMENT':'SVILUPPO DELL’IDEA', 'Idea':'Idea', 'Pure code':'Codice puro', 'Iteration':'Iterazione',
    'Think first. Then build.':'Prima pensa. Poi costruisci.', 'PROBLEM SPACE':'SPAZIO DEL PROBLEMA', 'ARCHITECTURE NOTES':'NOTE DI ARCHITETTURA',
    'Define the problem':'Definire il problema', 'Simplify complexity':'Semplificare la complessità', 'Shape the architecture':'Dare forma all’architettura',
    'Light. Fast. From scratch.':'Leggero. Veloce. Da zero.', 'BUILD PRINCIPLES':'PRINCIPI DI SVILUPPO', 'Zero dependencies':'Zero dipendenze',
    'Improve through iteration.':'Migliorare con l’iterazione.', 'ACTIVITY':'ATTIVITÀ', 'STATUS':'STATO', 'IN TESTING':'IN TEST', 'REVIEW':'REVISIONE',
    'IN DEVELOPMENT':'IN SVILUPPO', 'ACTIVE BUILDS':'PROGETTI ATTIVI', 'Milenio Operating System':'Sistema Operativo Milenio',
    'Every Milenio Software project starts on a digital whiteboard. We shape the architecture in our minds before writing code, turning complex problems into simpler ones.':'Ogni progetto Milenio Software inizia su una lavagna digitale. Progettiamo l’architettura prima del codice per semplificare problemi complessi.',
    'We avoid ready-made templates and bloated libraries. Every experimental interface is built from scratch with pure CSS and JavaScript for speed.':'Evitiamo modelli pronti e librerie pesanti. Creiamo ogni interfaccia sperimentale da zero con CSS e JavaScript per la massima velocità.',
    'Speed is a startup’s strongest tool. We turn ideas into working prototypes, learn from mistakes, and improve the code every day.':'La velocità è lo strumento più forte di una startup. Trasformiamo idee in prototipi, impariamo dagli errori e miglioriamo il codice ogni giorno.',
    'Every build should address a clear problem with thoughtful execution. As an independent software studio, we explore ideas and share our process openly.':'Ogni sviluppo deve risolvere un problema chiaro con cura. Come studio indipendente, esploriamo idee e condividiamo apertamente il nostro processo.',
    'HOW WE BUILD':'COME COSTRUIAMO', 'SIMPLICITY BY DESIGN':'SEMPLICITÀ NEL DESIGN', 'Less talk.':'Poche parole.', 'Built well.':'Costruito bene.',
    'CLARITY':'CHIAREZZA', 'CRAFT':'MESTIERE', 'HONESTY':'ONESTÀ', 'CAPABILITIES':'COMPETENZE',
    'Capabilities & technology':'Competenze e tecnologie', 'CORE':'FONDAMENTA', 'STACK':'TECNOLOGIE', 'FOCUS':'FOCUS',
    'OPEN CHANNEL':'CONTATTO DIRETTO', 'LET’S BUILD TOGETHER':'COSTRUIAMO INSIEME', 'Let’s':'Costruiamo', 'build something.':'qualcosa.',
    '[ CONTACT: FORM BELOW ] ↓':'[ MODULO DI CONTATTO SOTTO ] ↓', '[ CONTACT: FORM ON THE RIGHT ] →':'[ MODULO DI CONTATTO A DESTRA ] →',
    'READY':'PRONTO', 'VALIDATE FORM':'VALIDA IL MODULO', 'PREVIEW BUILD':'ANTEPRIMA', 'SCROLL TO EXPLORE':'SCORRI PER ESPLORARE',
    'BUILT WITH CARE':'COSTRUITO CON CURA', 'BACK TO TOP ↑':'TORNA SU ↑', 'LIGHT MODE':'MODALITÀ CHIARA', 'DARK MODE':'MODALITÀ SCURA',
    'Custom Web Applications':'Applicazioni web su misura', 'API Architecture':'Architettura API', 'Performance Engineering':'Ingegneria delle prestazioni',
    'Modern CSS / Grid':'CSS moderno / Grid', 'Nextflow Pipeline':'Pipeline Nextflow', 'Zero-Dependency Development':'Sviluppo senza dipendenze',
    'Scalable Infrastructure':'Infrastruttura scalabile', 'Clean Code Optimization':'Ottimizzazione del codice pulito',
    '[ status: alpha / custom_kernel ]':'[ stato: alfa / kernel_personalizzato ]', '[ status: active_build / data_infrastructure ]':'[ stato: sviluppo_attivo / infrastruttura_dati ]',
    '[ System: Stable // Studio: Milenio Software // Mode: Independent Solo Build ]':'[ Sistema: stabile // Studio: Milenio Software // Modalità: sviluppo indipendente ]',
    '[ Available commands: /status , /clear , /system ]':'[ Comandi disponibili: /status , /clear , /system ]',
    '[ System: Stable // Runtime: Vanilla JavaScript // Dependencies: 0 ]':'[ Sistema: stabile // Runtime: JavaScript puro // Dipendenze: 0 ]',
    'enter_email:':'inserisci_email:', 'enter_name:':'inserisci_nome:', 'project_context:':'contesto_progetto:',
  },
  ru: {
    'Lab':'Лаборатория', 'Approach':'Подход', 'Contact':'Контакты', '[ DEVELOPMENT IN PROGRESS ]':'[ РАЗРАБОТКА ПРОДОЛЖАЕТСЯ ]',
    'INDEPENDENT SOFTWARE STUDIO':'НЕЗАВИСИМАЯ СТУДИЯ РАЗРАБОТКИ', 'Systems for the Future':'Системы будущего',
    'DEVELOPMENT PROCESS':'ПРОЦЕСС РАЗРАБОТКИ', 'CONCEPT / IDEA':'КОНЦЕПЦИЯ / ИДЕЯ', 'CRAFT / PURE CODE':'МАСТЕРСТВО / ЧИСТЫЙ КОД',
    'ITERATION / PROTOTYPE':'ИТЕРАЦИЯ / ПРОТОТИП', '[ stage: planning ]':'[ этап: планирование ]',
    '[ environment: local_server ]':'[ среда: локальный_сервер ]', '[ build: testing ]':'[ сборка: тестирование ]',
    'WORKSPACE':'РАБОЧАЯ ОБЛАСТЬ', 'LOCAL PREVIEW':'ЛОКАЛЬНЫЙ ПРОСМОТР', 'IDEA DEVELOPMENT':'РАЗРАБОТКА ИДЕИ', 'Idea':'Идея', 'Pure code':'Чистый код', 'Iteration':'Итерация',
    'Think first. Then build.':'Сначала подумай. Потом создавай.', 'PROBLEM SPACE':'ОБЛАСТЬ ПРОБЛЕМЫ', 'ARCHITECTURE NOTES':'ЗАМЕТКИ ОБ АРХИТЕКТУРЕ',
    'Define the problem':'Определить проблему', 'Simplify complexity':'Упростить сложность', 'Shape the architecture':'Продумать архитектуру',
    'Light. Fast. From scratch.':'Легко. Быстро. С нуля.', 'BUILD PRINCIPLES':'ПРИНЦИПЫ РАЗРАБОТКИ', 'Zero dependencies':'Без зависимостей',
    'Improve through iteration.':'Совершенствовать итерациями.', 'ACTIVITY':'АКТИВНОСТЬ', 'STATUS':'СТАТУС', 'IN TESTING':'ТЕСТИРУЕТСЯ', 'REVIEW':'ПРОВЕРКА',
    'IN DEVELOPMENT':'В РАЗРАБОТКЕ', 'ACTIVE BUILDS':'АКТИВНЫЕ ПРОЕКТЫ', 'Milenio Operating System':'Операционная система Milenio',
    'Every Milenio Software project starts on a digital whiteboard. We shape the architecture in our minds before writing code, turning complex problems into simpler ones.':'Каждый проект Milenio Software начинается с цифровой доски. Мы продумываем архитектуру до написания кода и упрощаем сложные задачи.',
    'We avoid ready-made templates and bloated libraries. Every experimental interface is built from scratch with pure CSS and JavaScript for speed.':'Мы не используем шаблоны и тяжёлые библиотеки. Каждый экспериментальный интерфейс создаём с нуля на CSS и JavaScript ради скорости.',
    'Speed is a startup’s strongest tool. We turn ideas into working prototypes, learn from mistakes, and improve the code every day.':'Скорость — главный инструмент стартапа. Мы превращаем идеи в прототипы, учимся на ошибках и ежедневно улучшаем код.',
    'Every build should address a clear problem with thoughtful execution. As an independent software studio, we explore ideas and share our process openly.':'Каждая разработка должна решать ясную задачу с вниманием к деталям. Мы независимая студия, исследуем идеи и открыто делимся процессом.',
    'HOW WE BUILD':'КАК МЫ СОЗДАЁМ', 'SIMPLICITY BY DESIGN':'ПРОСТОТА В ДИЗАЙНЕ', 'Less talk.':'Меньше слов.', 'Built well.':'Создано качественно.',
    'CLARITY':'ЯСНОСТЬ', 'CRAFT':'МАСТЕРСТВО', 'HONESTY':'ЧЕСТНОСТЬ', 'CAPABILITIES':'ВОЗМОЖНОСТИ',
    'Capabilities & technology':'Возможности и технологии', 'CORE':'ОСНОВА', 'STACK':'ТЕХНОЛОГИИ', 'FOCUS':'ФОКУС',
    'OPEN CHANNEL':'ПРЯМОЙ КОНТАКТ', 'LET’S BUILD TOGETHER':'СОЗДАДИМ ВМЕСТЕ', 'Let’s':'Давайте', 'build something.':'создадим нечто.',
    '[ CONTACT: FORM BELOW ] ↓':'[ КОНТАКТНАЯ ФОРМА НИЖЕ ] ↓', '[ CONTACT: FORM ON THE RIGHT ] →':'[ КОНТАКТНАЯ ФОРМА СПРАВА ] →',
    'READY':'ГОТОВО', 'VALIDATE FORM':'ПРОВЕРИТЬ ФОРМУ', 'PREVIEW BUILD':'ПРЕДПРОСМОТР', 'SCROLL TO EXPLORE':'ПРОКРУТИТЕ ДЛЯ ОБЗОРА',
    'BUILT WITH CARE':'СОЗДАНО С ЗАБОТОЙ', 'BACK TO TOP ↑':'НАВЕРХ ↑', 'LIGHT MODE':'СВЕТЛАЯ ТЕМА', 'DARK MODE':'ТЁМНАЯ ТЕМА',
    'Custom Web Applications':'Веб-приложения на заказ', 'API Architecture':'Архитектура API', 'Performance Engineering':'Оптимизация производительности',
    'Modern CSS / Grid':'Современный CSS / Grid', 'Nextflow Pipeline':'Конвейер Nextflow', 'Zero-Dependency Development':'Разработка без зависимостей',
    'Scalable Infrastructure':'Масштабируемая инфраструктура', 'Clean Code Optimization':'Оптимизация чистого кода',
    '[ status: alpha / custom_kernel ]':'[ статус: альфа / собственное_ядро ]', '[ status: active_build / data_infrastructure ]':'[ статус: активная_разработка / инфраструктура_данных ]',
    '[ System: Stable // Studio: Milenio Software // Mode: Independent Solo Build ]':'[ Система: стабильна // Студия: Milenio Software // Режим: независимая разработка ]',
    '[ Available commands: /status , /clear , /system ]':'[ Доступные команды: /status , /clear , /system ]',
    '[ System: Stable // Runtime: Vanilla JavaScript // Dependencies: 0 ]':'[ Система: стабильна // Среда: Vanilla JavaScript // Зависимостей: 0 ]',
    'enter_email:':'введите_email:', 'enter_name:':'введите_имя:', 'project_context:':'описание_проекта:',
  },
  zh: {
    'Lab':'实验室', 'Approach':'理念', 'Contact':'联系', '[ DEVELOPMENT IN PROGRESS ]':'[ 正在开发 ]',
    'INDEPENDENT SOFTWARE STUDIO':'独立软件工作室', 'Systems for the Future':'面向未来的系统',
    'DEVELOPMENT PROCESS':'开发流程', 'CONCEPT / IDEA':'概念 / 构思', 'CRAFT / PURE CODE':'匠心 / 纯粹代码',
    'ITERATION / PROTOTYPE':'迭代 / 原型', '[ stage: planning ]':'[ 阶段：规划 ]', '[ environment: local_server ]':'[ 环境：本地服务器 ]', '[ build: testing ]':'[ 构建：测试中 ]',
    'WORKSPACE':'工作区', 'LOCAL PREVIEW':'本地预览', 'IDEA DEVELOPMENT':'构思开发', 'Idea':'构思', 'Pure code':'纯粹代码', 'Iteration':'迭代',
    'Think first. Then build.':'先思考，再构建。', 'PROBLEM SPACE':'问题空间', 'ARCHITECTURE NOTES':'架构笔记', 'Define the problem':'定义问题', 'Simplify complexity':'化繁为简', 'Shape the architecture':'规划架构',
    'Light. Fast. From scratch.':'轻量。快速。从零开始。', 'BUILD PRINCIPLES':'构建原则', 'Zero dependencies':'零依赖', 'Improve through iteration.':'通过迭代持续改进。',
    'ACTIVITY':'活动', 'STATUS':'状态', 'IN TESTING':'测试中', 'REVIEW':'审核中', 'IN DEVELOPMENT':'开发中', 'ACTIVE BUILDS':'进行中的项目',
    'HOW WE BUILD':'我们的构建方式', 'SIMPLICITY BY DESIGN':'以简驭繁', 'Less talk.':'少说。', 'Built well.':'做好。', 'CLARITY':'清晰', 'CRAFT':'匠心', 'HONESTY':'诚实',
    'CAPABILITIES':'能力', 'Capabilities & technology':'能力与技术', 'CORE':'核心', 'STACK':'技术栈', 'FOCUS':'重点',
    'OPEN CHANNEL':'直接联系', 'LET’S BUILD TOGETHER':'一起构建', 'Let’s':'一起', 'build something.':'打造新事物。',
    '[ CONTACT: FORM BELOW ] ↓':'[ 联系表单：下方 ] ↓', '[ CONTACT: FORM ON THE RIGHT ] →':'[ 联系表单：右侧 ] →',
    'READY':'就绪', 'VALIDATE FORM':'发送消息', 'PREVIEW BUILD':'预览版本', 'SCROLL TO EXPLORE':'向下滚动以探索', 'BUILT WITH CARE':'用心构建', 'BACK TO TOP ↑':'返回顶部 ↑',
    'LIGHT MODE':'浅色模式', 'DARK MODE':'深色模式', 'Custom Web Applications':'定制 Web 应用', 'API Architecture':'API 架构', 'Performance Engineering':'性能工程',
    'Modern CSS / Grid':'现代 CSS / Grid', 'Nextflow Pipeline':'Nextflow 流水线', 'Zero-Dependency Development':'零依赖开发', 'Scalable Infrastructure':'可扩展基础设施', 'Clean Code Optimization':'精简代码优化',
    'Workspace':'工作区', 'Repository':'代码仓库', 'Preview':'预览', 'Submit':'发送', 'Your name':'您的姓名', 'Tell us a little about your project...':'请简单介绍您的项目……',
    'THINK FIRST, THEN CODE':'先思考，再编码', 'LEAN CSS · NO HEAVY LIBRARIES':'精简 CSS · 无臃肿库', 'BUILD · LEARN · IMPROVE':'构建 · 学习 · 改进',
    'SCROLL TO EXPLORE':'向下滚动以探索', 'FIG. 01 — LAB / DEVELOPMENT PROCESS':'图 01 — 实验室 / 开发流程',
    'enter_email:':'输入邮箱：', 'enter_name:':'输入姓名：', 'project_context:':'项目详情：',
    '[ CONTACT: FORM BELOW ] ↓':'[ 联系表单：下方 ] ↓', '[ CONTACT: FORM ON THE RIGHT ] →':'[ 联系表单：右侧 ] →',
  },
  ja: {
    'Lab':'ラボ', 'Approach':'理念', 'Contact':'お問い合わせ', '[ DEVELOPMENT IN PROGRESS ]':'[ 開発中 ]',
    'INDEPENDENT SOFTWARE STUDIO':'独立系ソフトウェアスタジオ', 'Systems for the Future':'未来のためのシステム',
    'DEVELOPMENT PROCESS':'開発プロセス', 'CONCEPT / IDEA':'コンセプト / アイデア', 'CRAFT / PURE CODE':'技術 / ピュアコード',
    'ITERATION / PROTOTYPE':'反復 / プロトタイプ', '[ stage: planning ]':'[ 段階：計画 ]', '[ environment: local_server ]':'[ 環境：ローカルサーバー ]', '[ build: testing ]':'[ ビルド：テスト中 ]',
    'WORKSPACE':'ワークスペース', 'LOCAL PREVIEW':'ローカルプレビュー', 'IDEA DEVELOPMENT':'アイデア開発', 'Idea':'アイデア', 'Pure code':'ピュアコード', 'Iteration':'反復',
    'Think first. Then build.':'まず考える。それから作る。', 'PROBLEM SPACE':'課題領域', 'ARCHITECTURE NOTES':'アーキテクチャノート', 'Define the problem':'課題を定義する', 'Simplify complexity':'複雑さをシンプルに', 'Shape the architecture':'設計を組み立てる',
    'Light. Fast. From scratch.':'軽く。速く。ゼロから。', 'BUILD PRINCIPLES':'開発原則', 'Zero dependencies':'依存ゼロ', 'Improve through iteration.':'反復して改善する。',
    'ACTIVITY':'アクティビティ', 'STATUS':'ステータス', 'IN TESTING':'テスト中', 'REVIEW':'レビュー', 'IN DEVELOPMENT':'開発中', 'ACTIVE BUILDS':'進行中のプロジェクト',
    'HOW WE BUILD':'開発への取り組み', 'SIMPLICITY BY DESIGN':'設計でシンプルに', 'Less talk.':'言葉は少なく。', 'Built well.':'丁寧に作る。', 'CLARITY':'明快さ', 'CRAFT':'技術', 'HONESTY':'誠実さ',
    'CAPABILITIES':'技術領域', 'Capabilities & technology':'技術と対応領域', 'CORE':'コア', 'STACK':'技術スタック', 'FOCUS':'注力分野',
    'OPEN CHANNEL':'お問い合わせ', 'LET’S BUILD TOGETHER':'一緒に作りましょう', 'Let’s':'一緒に', 'build something.':'何かを作りましょう。',
    '[ CONTACT: FORM BELOW ] ↓':'[ お問い合わせフォーム：下 ] ↓', '[ CONTACT: FORM ON THE RIGHT ] →':'[ お問い合わせフォーム：右 ] →',
    'READY':'準備完了', 'VALIDATE FORM':'メッセージを送信', 'PREVIEW BUILD':'プレビュー', 'SCROLL TO EXPLORE':'スクロールして探索', 'BUILT WITH CARE':'丁寧に構築', 'BACK TO TOP ↑':'トップへ戻る ↑',
    'LIGHT MODE':'ライトモード', 'DARK MODE':'ダークモード', 'Custom Web Applications':'カスタム Web アプリ', 'API Architecture':'API アーキテクチャ', 'Performance Engineering':'パフォーマンスエンジニアリング',
    'Modern CSS / Grid':'モダン CSS / Grid', 'Nextflow Pipeline':'Nextflow パイプライン', 'Zero-Dependency Development':'依存ゼロの開発', 'Scalable Infrastructure':'拡張可能なインフラ', 'Clean Code Optimization':'クリーンコードの最適化',
    'Your name':'お名前', 'Tell us a little about your project...':'プロジェクトについてお聞かせください……',
    'THINK FIRST, THEN CODE':'まず考え、それからコードを書く', 'LEAN CSS · NO HEAVY LIBRARIES':'軽量 CSS · 重いライブラリなし', 'BUILD · LEARN · IMPROVE':'作る · 学ぶ · 改善する',
    'FIG. 01 — LAB / DEVELOPMENT PROCESS':'図 01 — ラボ / 開発プロセス', 'enter_email:':'メールアドレス：', 'enter_name:':'名前：', 'project_context:':'プロジェクト概要：',
  },
  pt: {
    'Lab':'Laboratório', 'Approach':'Abordagem', 'Contact':'Contato', '[ DEVELOPMENT IN PROGRESS ]':'[ DESENVOLVIMENTO EM ANDAMENTO ]',
    'INDEPENDENT SOFTWARE STUDIO':'ESTÚDIO INDEPENDENTE DE SOFTWARE', 'Systems for the Future':'Sistemas para o futuro',
    'DEVELOPMENT PROCESS':'PROCESSO DE DESENVOLVIMENTO', 'CONCEPT / IDEA':'CONCEITO / IDEIA', 'CRAFT / PURE CODE':'OFÍCIO / CÓDIGO PURO',
    'ITERATION / PROTOTYPE':'ITERAÇÃO / PROTÓTIPO', '[ stage: planning ]':'[ etapa: planejamento ]', '[ environment: local_server ]':'[ ambiente: servidor_local ]', '[ build: testing ]':'[ versão: em_teste ]',
    'WORKSPACE':'ÁREA DE TRABALHO', 'LOCAL PREVIEW':'PRÉVIA LOCAL', 'IDEA DEVELOPMENT':'DESENVOLVIMENTO DA IDEIA', 'Idea':'Ideia', 'Pure code':'Código puro', 'Iteration':'Iteração',
    'Think first. Then build.':'Pense primeiro. Depois construa.', 'PROBLEM SPACE':'ESPAÇO DO PROBLEMA', 'ARCHITECTURE NOTES':'NOTAS DE ARQUITETURA', 'Define the problem':'Defina o problema', 'Simplify complexity':'Simplifique a complexidade', 'Shape the architecture':'Desenhe a arquitetura',
    'Light. Fast. From scratch.':'Leve. Rápido. Do zero.', 'BUILD PRINCIPLES':'PRINCÍPIOS DE DESENVOLVIMENTO', 'Zero dependencies':'Zero dependências', 'Improve through iteration.':'Melhore a cada iteração.',
    'ACTIVITY':'ATIVIDADE', 'STATUS':'STATUS', 'IN TESTING':'EM TESTE', 'REVIEW':'REVISÃO', 'IN DEVELOPMENT':'EM DESENVOLVIMENTO', 'ACTIVE BUILDS':'PROJETOS EM ANDAMENTO',
    'HOW WE BUILD':'COMO DESENVOLVEMOS', 'SIMPLICITY BY DESIGN':'SIMPLICIDADE NO DESIGN', 'Less talk.':'Menos conversa.', 'Built well.':'Bem construído.', 'CLARITY':'CLAREZA', 'CRAFT':'OFÍCIO', 'HONESTY':'HONESTIDADE',
    'CAPABILITIES':'COMPETÊNCIAS', 'Capabilities & technology':'Competências e tecnologias', 'CORE':'ESSENCIAL', 'STACK':'TECNOLOGIAS', 'FOCUS':'FOCO',
    'OPEN CHANNEL':'CONTATO DIRETO', 'LET’S BUILD TOGETHER':'VAMOS CONSTRUIR JUNTOS', 'Let’s':'Vamos', 'build something.':'criar algo.',
    '[ CONTACT: FORM BELOW ] ↓':'[ FORMULÁRIO DE CONTATO: ABAIXO ] ↓', '[ CONTACT: FORM ON THE RIGHT ] →':'[ FORMULÁRIO DE CONTATO: À DIREITA ] →',
    'READY':'PRONTO', 'VALIDATE FORM':'ENVIAR MENSAGEM', 'PREVIEW BUILD':'VISUALIZAR VERSÃO', 'SCROLL TO EXPLORE':'ROLE PARA EXPLORAR', 'BUILT WITH CARE':'FEITO COM CUIDADO', 'BACK TO TOP ↑':'VOLTAR AO TOPO ↑',
    'LIGHT MODE':'MODO CLARO', 'DARK MODE':'MODO ESCURO', 'Custom Web Applications':'Aplicações Web personalizadas', 'API Architecture':'Arquitetura de API', 'Performance Engineering':'Engenharia de desempenho',
    'Modern CSS / Grid':'CSS moderno / Grid', 'Nextflow Pipeline':'Pipeline Nextflow', 'Zero-Dependency Development':'Desenvolvimento sem dependências', 'Scalable Infrastructure':'Infraestrutura escalável', 'Clean Code Optimization':'Otimização de código limpo',
    'Your name':'Seu nome', 'Tell us a little about your project...':'Conte um pouco sobre seu projeto...',
    'THINK FIRST, THEN CODE':'PENSE PRIMEIRO, DEPOIS CODIFIQUE', 'LEAN CSS · NO HEAVY LIBRARIES':'CSS enxuto · sem bibliotecas pesadas', 'BUILD · LEARN · IMPROVE':'CONSTRUIR · APRENDER · MELHORAR',
    'FIG. 01 — LAB / DEVELOPMENT PROCESS':'FIG. 01 — LABORATÓRIO / PROCESSO DE DESENVOLVIMENTO', 'enter_email:':'digite_email:', 'enter_name:':'digite_nome:', 'project_context:':'detalhes_do_projeto:',
  },
};
const extraTranslations = {
  zh: {
    '/ SOFTWARE SYSTEMS':'/ 软件系统', 'LAB':'实验室', 'DEVELOPMENT PROCESS':'开发流程',
    'Explore projects':'探索项目', 'Lab: development process':'实验室：开发流程', 'Development process':'开发流程',
    'WORKSPACE /':'工作区 /', 'workspace.milenio.local':'workspace.milenio.local', 'MILENIO SOFTWARE / LAB':'MILENIO SOFTWARE / 实验室',
    'INPUT':'输入', 'MODEL':'模型', 'LOGIC':'逻辑', 'PLAN':'计划', '[ focus: lean_logic ]':'[ 重点：精简逻辑 ]',
    'MILENIO SOFTWARE / CRAFT':'MILENIO SOFTWARE / 匠心', '[ stack: vanilla_js ]':'[ 技术栈：原生_js ]', 'MILENIO SOFTWARE / ITERATION':'MILENIO SOFTWARE / 迭代',
    'ITERATION':'迭代', 'Idea → working interface':'想法 → 可运行界面', '[ repository: active_branch ]':'[ 代码库：活跃分支 ]',
    'PROTOTYPE LOOP: ACTIVE':'原型循环：运行中', 'FEEDBACK → IMPROVEMENT':'反馈 → 改进',
    '[ status: alpha / custom_kernel ]':'[ 状态：alpha / 自定义内核 ]', '[ status: active_build / data_infrastructure ]':'[ 状态：开发中 / 数据基础设施 ]',
    '02 — PRINCIPLES':'02 — 原则', '03 — CAPABILITIES':'03 — 能力', 'Vanilla JavaScript (ES6+)':'原生 JavaScript (ES6+)', '04 — CONTACT':'04 — 联系',
    'milenio-software — contact':'milenio-software — 联系', 'milenio-software:~$ enter_email:':'milenio-software:~$ 输入邮箱：',
    'milenio-software:~$ enter_name:':'milenio-software:~$ 输入姓名：', 'milenio-software:~$ project_context:':'milenio-software:~$ 项目详情：',
    '[form: validation_only]':'[表单：仅验证]', 'Terminal output':'终端输出',
    'MILENIO SOFTWARE © ':'MILENIO SOFTWARE © ',
    'Every Milenio Software project starts on a digital whiteboard. We shape the architecture in our minds before writing code, turning complex problems into simpler ones.':'Milenio Software 的每个项目都从数字白板开始。我们先规划架构，再编写代码，将复杂问题化繁为简。',
    'We avoid ready-made templates and bloated libraries. Every experimental interface is built from scratch with pure CSS and JavaScript for speed.':'我们不使用现成模板或臃肿的库。每个实验性界面都用纯 CSS 和 JavaScript 从零构建，追求速度。',
    'Speed is a startup’s strongest tool. We turn ideas into working prototypes, learn from mistakes, and improve the code every day.':'速度是创业团队最有力的工具。我们将想法变成可运行的原型，从错误中学习并持续改进代码。',
    'Every build should address a clear problem with thoughtful execution. As an independent software studio, we explore ideas and share our process openly.':'每次开发都应以周密实现解决明确问题。作为独立软件工作室，我们探索想法并公开分享过程。',
    '01_CONCEPT / IDEA':'01_概念 / 构思', '02_CRAFT / PURE CODE':'02_匠心 / 纯粹代码', '03_ITERATION / PROTOTYPE':'03_迭代 / 原型',
    'CSS / VISUAL LAYER':'CSS / 视觉层', 'LAYOUT':'布局', 'STYLE':'样式', 'DEVELOPMENT':'开发', 'Vanilla JavaScript':'原生 JavaScript', 'Modern CSS':'现代 CSS',
    'Observation → learning':'观察 → 学习', 'Code → improvement':'代码 → 改进', 'New approach':'新方案', 'IN PROGRESS':'进行中',
    'Milenio Operating System':'Milenio 操作系统', 'Vertex Pipeline':'Vertex 数据管线',
    '01 / CLARITY':'01 / 清晰', 'Understand the problem first.':'先理解问题。', '02 / CRAFT':'02 / 匠心', 'Care about the details.':'关注细节。', '03 / HONESTY':'03 / 诚信', 'Share the truth as it is.':'如实分享。',
    '[ System: Stable // Studio: Milenio Software // Mode: Independent Solo Build ]':'[ 系统：稳定 // 工作室：Milenio Software // 模式：独立开发 ]',
    '[ Available commands: /status , /clear , /system ]':'[ 可用命令：/status , /clear , /system ]',
    '[ System: Stable // Runtime: Vanilla JavaScript // Dependencies: 0 ]':'[ 系统：稳定 // 运行环境：原生 JavaScript // 依赖：0 ]',
  },
  ja: {
    '/ SOFTWARE SYSTEMS':'/ ソフトウェアシステム', 'LAB':'ラボ', 'DEVELOPMENT PROCESS':'開発プロセス',
    'Explore projects':'プロジェクトを見る', 'Lab: development process':'ラボ：開発プロセス', 'Development process':'開発プロセス',
    'WORKSPACE /':'ワークスペース /', 'workspace.milenio.local':'workspace.milenio.local', 'MILENIO SOFTWARE / LAB':'MILENIO SOFTWARE / ラボ',
    'INPUT':'入力', 'MODEL':'モデル', 'LOGIC':'ロジック', 'PLAN':'計画', '[ focus: lean_logic ]':'[ 注力：シンプルなロジック ]',
    'MILENIO SOFTWARE / CRAFT':'MILENIO SOFTWARE / 技術', '[ stack: vanilla_js ]':'[ 技術スタック：ピュア_js ]', 'MILENIO SOFTWARE / ITERATION':'MILENIO SOFTWARE / 反復',
    'ITERATION':'反復', 'Idea → working interface':'アイデア → 動く画面', '[ repository: active_branch ]':'[ リポジトリ：作業ブランチ ]',
    'PROTOTYPE LOOP: ACTIVE':'プロトタイプループ：稼働中', 'FEEDBACK → IMPROVEMENT':'フィードバック → 改善',
    '[ status: alpha / custom_kernel ]':'[ 状態：alpha / 独自カーネル ]', '[ status: active_build / data_infrastructure ]':'[ 状態：開発中 / データ基盤 ]',
    '02 — PRINCIPLES':'02 — 原則', '03 — CAPABILITIES':'03 — 技術領域', 'Vanilla JavaScript (ES6+)':'ピュア JavaScript (ES6+)', '04 — CONTACT':'04 — お問い合わせ',
    'milenio-software — contact':'milenio-software — お問い合わせ', 'milenio-software:~$ enter_email:':'milenio-software:~$ メールアドレス：',
    'milenio-software:~$ enter_name:':'milenio-software:~$ 名前：', 'milenio-software:~$ project_context:':'milenio-software:~$ プロジェクト概要：',
    '[form: validation_only]':'[フォーム：入力確認]', 'Terminal output':'ターミナル出力',
    'MILENIO SOFTWARE © ':'MILENIO SOFTWARE © ',
    'Every Milenio Software project starts on a digital whiteboard. We shape the architecture in our minds before writing code, turning complex problems into simpler ones.':'Milenio Software のプロジェクトはデジタルホワイトボードから始まります。コードを書く前に構成を考え、複雑な課題をシンプルにします。',
    'We avoid ready-made templates and bloated libraries. Every experimental interface is built from scratch with pure CSS and JavaScript for speed.':'既製テンプレートや大きなライブラリは使いません。実験的な画面も純粋な CSS と JavaScript でゼロから作り、速度を追求します。',
    'Speed is a startup’s strongest tool. We turn ideas into working prototypes, learn from mistakes, and improve the code every day.':'スピードはスタートアップの強みです。アイデアを動くプロトタイプにし、失敗から学び、毎日コードを改善します。',
    'Every build should address a clear problem with thoughtful execution. As an independent software studio, we explore ideas and share our process openly.':'明確な課題に丁寧な実装で応えることを大切にしています。独立系スタジオとして、アイデアを探り、制作過程を公開します。',
    '01_CONCEPT / IDEA':'01_コンセプト / アイデア', '02_CRAFT / PURE CODE':'02_技術 / ピュアコード', '03_ITERATION / PROTOTYPE':'03_反復 / プロトタイプ',
    'CSS / VISUAL LAYER':'CSS / ビジュアルレイヤー', 'LAYOUT':'レイアウト', 'STYLE':'スタイル', 'DEVELOPMENT':'開発', 'Vanilla JavaScript':'ピュア JavaScript', 'Modern CSS':'モダン CSS',
    'Observation → learning':'観察 → 学び', 'Code → improvement':'コード → 改善', 'New approach':'新しいアプローチ', 'IN PROGRESS':'進行中',
    'Milenio Operating System':'Milenio オペレーティングシステム', 'Vertex Pipeline':'Vertex データパイプライン',
    '01 / CLARITY':'01 / 明快さ', 'Understand the problem first.':'まず課題を理解する。', '02 / CRAFT':'02 / 技術', 'Care about the details.':'細部まで大切に。', '03 / HONESTY':'03 / 誠実さ', 'Share the truth as it is.':'ありのままを共有する。',
    '[ System: Stable // Studio: Milenio Software // Mode: Independent Solo Build ]':'[ システム：安定 // スタジオ：Milenio Software // モード：独立開発 ]',
    '[ Available commands: /status , /clear , /system ]':'[ 使用可能なコマンド：/status , /clear , /system ]',
    '[ System: Stable // Runtime: Vanilla JavaScript // Dependencies: 0 ]':'[ システム：安定 // 実行環境：ピュア JavaScript // 依存：0 ]',
  },
  pt: {
    '/ SOFTWARE SYSTEMS':'/ SISTEMAS DE SOFTWARE', 'LAB':'LABORATÓRIO', 'DEVELOPMENT PROCESS':'PROCESSO DE DESENVOLVIMENTO',
    'Explore projects':'Explorar projetos', 'Lab: development process':'Laboratório: processo de desenvolvimento', 'Development process':'Processo de desenvolvimento',
    'WORKSPACE /':'ÁREA DE TRABALHO /', 'workspace.milenio.local':'workspace.milenio.local', 'MILENIO SOFTWARE / LAB':'MILENIO SOFTWARE / LABORATÓRIO',
    'INPUT':'ENTRADA', 'MODEL':'MODELO', 'LOGIC':'LÓGICA', 'PLAN':'PLANO', '[ focus: lean_logic ]':'[ foco: lógica_enxuta ]',
    'MILENIO SOFTWARE / CRAFT':'MILENIO SOFTWARE / OFÍCIO', '[ stack: vanilla_js ]':'[ tecnologias: js_puro ]', 'MILENIO SOFTWARE / ITERATION':'MILENIO SOFTWARE / ITERAÇÃO',
    'ITERATION':'ITERAÇÃO', 'Idea → working interface':'Ideia → interface funcional', '[ repository: active_branch ]':'[ repositório: branch_ativa ]',
    'PROTOTYPE LOOP: ACTIVE':'CICLO DE PROTÓTIPO: ATIVO', 'FEEDBACK → IMPROVEMENT':'FEEDBACK → MELHORIA',
    '[ status: alpha / custom_kernel ]':'[ status: alpha / kernel_personalizado ]', '[ status: active_build / data_infrastructure ]':'[ status: em_desenvolvimento / infraestrutura_de_dados ]',
    '02 — PRINCIPLES':'02 — PRINCÍPIOS', '03 — CAPABILITIES':'03 — COMPETÊNCIAS', 'Vanilla JavaScript (ES6+)':'JavaScript puro (ES6+)', '04 — CONTACT':'04 — CONTATO',
    'milenio-software — contact':'milenio-software — contato', 'milenio-software:~$ enter_email:':'milenio-software:~$ digite_email:',
    'milenio-software:~$ enter_name:':'milenio-software:~$ digite_nome:', 'milenio-software:~$ project_context:':'milenio-software:~$ detalhes_do_projeto:',
    '[form: validation_only]':'[formulário: validação]', 'Terminal output':'Saída do terminal',
    'MILENIO SOFTWARE © ':'MILENIO SOFTWARE © ',
    'Every Milenio Software project starts on a digital whiteboard. We shape the architecture in our minds before writing code, turning complex problems into simpler ones.':'Todo projeto da Milenio Software começa em um quadro digital. Planejamos a arquitetura antes de escrever código e simplificamos problemas complexos.',
    'We avoid ready-made templates and bloated libraries. Every experimental interface is built from scratch with pure CSS and JavaScript for speed.':'Evitamos modelos prontos e bibliotecas pesadas. Cada interface experimental é criada do zero com CSS e JavaScript puros para ganhar velocidade.',
    'Speed is a startup’s strongest tool. We turn ideas into working prototypes, learn from mistakes, and improve the code every day.':'A velocidade é a principal ferramenta de uma startup. Transformamos ideias em protótipos, aprendemos com os erros e melhoramos o código todos os dias.',
    'Every build should address a clear problem with thoughtful execution. As an independent software studio, we explore ideas and share our process openly.':'Cada projeto deve resolver um problema claro com execução cuidadosa. Como estúdio independente, exploramos ideias e compartilhamos nosso processo.',
    '01_CONCEPT / IDEA':'01_CONCEITO / IDEIA', '02_CRAFT / PURE CODE':'02_OFÍCIO / CÓDIGO PURO', '03_ITERATION / PROTOTYPE':'03_ITERAÇÃO / PROTÓTIPO',
    'CSS / VISUAL LAYER':'CSS / CAMADA VISUAL', 'LAYOUT':'LAYOUT', 'STYLE':'ESTILO', 'DEVELOPMENT':'DESENVOLVIMENTO', 'Vanilla JavaScript':'JavaScript puro', 'Modern CSS':'CSS moderno',
    'Observation → learning':'Observação → aprendizado', 'Code → improvement':'Código → melhoria', 'New approach':'Nova abordagem', 'IN PROGRESS':'EM ANDAMENTO',
    'Milenio Operating System':'Sistema Operacional Milenio', 'Vertex Pipeline':'Pipeline Vertex',
    '01 / CLARITY':'01 / CLAREZA', 'Understand the problem first.':'Entenda o problema primeiro.', '02 / CRAFT':'02 / OFÍCIO', 'Care about the details.':'Cuide dos detalhes.', '03 / HONESTY':'03 / HONESTIDADE', 'Share the truth as it is.':'Compartilhe os fatos como são.',
    '[ System: Stable // Studio: Milenio Software // Mode: Independent Solo Build ]':'[ Sistema: estável // Estúdio: Milenio Software // Modo: desenvolvimento independente ]',
    '[ Available commands: /status , /clear , /system ]':'[ Comandos disponíveis: /status , /clear , /system ]',
    '[ System: Stable // Runtime: Vanilla JavaScript // Dependencies: 0 ]':'[ Sistema: estável // Ambiente: JavaScript puro // Dependências: 0 ]',
  },
};
const mobileStudioTranslations = {
  de: {
    'ROADMAP':'ROADMAP','Stage 01:':'Phase 01:','Establishing the studio philosophy and minimalist web core':'Aufbau der Studiophilosophie und des minimalistischen Web-Kerns','[ COMPLETE ]':'[ ABGESCHLOSSEN ]','Stage 02:':'Phase 02:','Prototyping experimental mobile interfaces and battery-friendly architectures':'Prototyping experimenteller mobiler Oberflächen und akku-schonender Architekturen','[ IN PROGRESS ]':'[ IN ARBEIT ]','Stage 03:':'Phase 03:','Releasing the first independent mobile tools on the App Store and Google Play':'Veröffentlichung der ersten unabhängigen Mobil-Tools im App Store und bei Google Play','[ PLANNED ]':'[ GEPLANT ]',
    'Let’s talk about':'Sprechen wir über','ideas.':'Ideen.','Have a startup idea, want to discuss the philosophy of pure code, or just say hello? Reach out directly to the founder.':'Haben Sie eine Start-up-Idee, möchten Sie über die Philosophie von reinem Code sprechen oder einfach Hallo sagen? Schreiben Sie direkt dem Gründer.',
    Projects:'Projekte', 'Mobile Systems for the Future':'Mobile Systeme der Zukunft', '01_CONCEPT / PURE IDEA':'01_KONZEPT / REINE IDEE',
    'Every project begins with a question. With a startup mindset, we clarify the core problem and its place in the mobile world, then shape the architecture.':'Jedes Projekt beginnt mit einer Frage. Mit der Haltung eines Start-ups klären wir das Kernproblem und seine Bedeutung für die mobile Welt, dann entwerfen wir die Architektur.',
    '02_CRAFT / CLEAN CODE':'02_HANDWERK / SAUBERER CODE',
    'We add no ready-made tools that we do not need. Following a zero-dependency principle, we write every line for speed and battery efficiency.':'Wir ergänzen keine fertigen Werkzeuge, die wir nicht brauchen. Nach dem Zero-Dependency-Prinzip schreiben wir jede Zeile für Tempo und Akkueffizienz.',
    '[ infrastructure: pure_code ]':'[ infrastruktur: reiner_code ]', '03_ITERATION / PROTOTYPE':'03_ITERATION / PROTOTYP',
    'We quickly turn ideas into working mobile prototypes. We refine the interface and performance through experiments until both are as lean as possible.':'Wir machen aus Ideen schnell funktionierende mobile Prototypen. Durch Experimente verbessern wir Oberfläche und Leistung, bis beides möglichst schlank ist.',
    '[ status: in the lab ]':'[ status: im labor ]', 'Mobile concepts in the prototype stage are taking shape. Coming soon to the App Store and Google Play.':'Mobile Konzepte in der Prototypenphase nehmen Gestalt an. Bald im App Store und bei Google Play.',
    'Understand the problem first; simplify the mobile experience.':'Erst das Problem verstehen, dann das mobile Erlebnis vereinfachen.', 'Care about interface flows and lightweight code.':'Auf klare Abläufe und schlanken Code achten.', 'Keep development transparent and lean.':'Die Entwicklung transparent und schlank halten.',
    'Mobile Product Design':'Design mobiler Produkte','Performance-focused Solutions':'Leistungsorientierte Lösungen','Lean Interfaces':'Schlanke Oberflächen','Swift / Kotlin Architecture':'Swift- / Kotlin-Architektur','Reduce Unnecessary Dependencies':'Unnötige Abhängigkeiten reduzieren','Minimize Battery and Data Use':'Akku- und Datenverbrauch senken','Improve Code Quality':'Codequalität verbessern','Capabilities & technology':'Arbeitsbereiche','SEND MESSAGE':'NACHRICHT SENDEN','milenio-software:~$ project_idea:':'milenio-software:~$ projektidee:',
  },
  fr: {
    'ROADMAP':'FEUILLE DE ROUTE','Stage 01:':'Étape 01 :','Establishing the studio philosophy and minimalist web core':'Définir la philosophie du studio et poser les bases du cœur web minimaliste','[ COMPLETE ]':'[ TERMINÉ ]','Stage 02:':'Étape 02 :','Prototyping experimental mobile interfaces and battery-friendly architectures':'Prototyper des interfaces mobiles expérimentales et des architectures économes en batterie','[ IN PROGRESS ]':'[ EN COURS ]','Stage 03:':'Étape 03 :','Releasing the first independent mobile tools on the App Store and Google Play':'Publier les premiers outils mobiles indépendants sur l’App Store et Google Play','[ PLANNED ]':'[ PRÉVU ]',
    'Let’s talk about':'Parlons','ideas.':'idées.','Have a startup idea, want to discuss the philosophy of pure code, or just say hello? Reach out directly to the founder.':'Vous avez une idée de startup, souhaitez discuter de la philosophie du code pur ou simplement dire bonjour ? Contactez directement le fondateur.',
    Projects:'Projets','Mobile Systems for the Future':'Systèmes mobiles pour demain','01_CONCEPT / PURE IDEA':'01_CONCEPT / IDÉE PURE',
    'Every project begins with a question. With a startup mindset, we clarify the core problem and its place in the mobile world, then shape the architecture.':'Chaque projet commence par une question. Avec l’agilité d’une jeune entreprise, nous clarifions le problème et son contexte mobile avant de définir l’architecture.',
    '02_CRAFT / CLEAN CODE':'02_SAVOIR-FAIRE / CODE ÉPURÉ',
    'We add no ready-made tools that we do not need. Following a zero-dependency principle, we write every line for speed and battery efficiency.':'Nous n’ajoutons aucun outil prêt à l’emploi inutile. Selon le principe zéro dépendance, chaque ligne vise la rapidité et l’autonomie.',
    '[ infrastructure: pure_code ]':'[ infrastructure : code_pur ]','03_ITERATION / PROTOTYPE':'03_ITÉRATION / PROTOTYPE',
    'We quickly turn ideas into working mobile prototypes. We refine the interface and performance through experiments until both are as lean as possible.':'Nous transformons rapidement les idées en prototypes mobiles fonctionnels. Nous affinons l’interface et les performances par l’expérimentation.',
    '[ status: in the lab ]':'[ statut : au laboratoire ]','Mobile concepts in the prototype stage are taking shape. Coming soon to the App Store and Google Play.':'Nos concepts mobiles en phase de prototype prennent forme. Bientôt sur l’App Store et Google Play.',
    'Understand the problem first; simplify the mobile experience.':'Comprendre le problème, puis simplifier l’expérience mobile.','Care about interface flows and lightweight code.':'Soigner les parcours et la légèreté du code.','Keep development transparent and lean.':'Garder un développement clair et transparent.',
    'Mobile Product Design':'Conception de produits mobiles','Performance-focused Solutions':'Solutions performantes','Lean Interfaces':'Interfaces épurées','Swift / Kotlin Architecture':'Architecture Swift / Kotlin','Reduce Unnecessary Dependencies':'Réduire les dépendances inutiles','Minimize Battery and Data Use':'Réduire la batterie et les données','Improve Code Quality':'Améliorer la qualité du code','Capabilities & technology':'Nos domaines','SEND MESSAGE':'ENVOYER UN MESSAGE','milenio-software:~$ project_idea:':'milenio-software:~$ idée_projet :',
  },
  es: {
    'ROADMAP':'HOJA DE RUTA','Stage 01:':'Etapa 01:','Establishing the studio philosophy and minimalist web core':'Definir la filosofía del estudio y crear el núcleo web minimalista','[ COMPLETE ]':'[ COMPLETADO ]','Stage 02:':'Etapa 02:','Prototyping experimental mobile interfaces and battery-friendly architectures':'Prototipar interfaces móviles experimentales y arquitecturas eficientes con la batería','[ IN PROGRESS ]':'[ EN CURSO ]','Stage 03:':'Etapa 03:','Releasing the first independent mobile tools on the App Store and Google Play':'Publicar las primeras herramientas móviles independientes en App Store y Google Play','[ PLANNED ]':'[ PLANIFICADO ]',
    'Let’s talk about':'Hablemos de','ideas.':'ideas.','Have a startup idea, want to discuss the philosophy of pure code, or just say hello? Reach out directly to the founder.':'¿Tienes una idea de startup, quieres hablar de la filosofía del código puro o simplemente saludar? Contacta directamente con el fundador.',
    Projects:'Proyectos','Mobile Systems for the Future':'Sistemas móviles para el futuro','01_CONCEPT / PURE IDEA':'01_CONCEPTO / IDEA PURA',
    'Every project begins with a question. With a startup mindset, we clarify the core problem and its place in the mobile world, then shape the architecture.':'Cada proyecto empieza con una pregunta. Con mentalidad de startup, aclaramos el problema y su contexto móvil antes de definir la arquitectura.',
    '02_CRAFT / CLEAN CODE':'02_OFICIO / CÓDIGO LIMPIO',
    'We add no ready-made tools that we do not need. Following a zero-dependency principle, we write every line for speed and battery efficiency.':'No añadimos herramientas prefabricadas que no necesitamos. Con cero dependencias, escribimos cada línea pensando en la velocidad y el ahorro de batería.',
    '[ infrastructure: pure_code ]':'[ infraestructura: código_puro ]','03_ITERATION / PROTOTYPE':'03_ITERACIÓN / PROTOTIPO',
    'We quickly turn ideas into working mobile prototypes. We refine the interface and performance through experiments until both are as lean as possible.':'Convertimos ideas rápidamente en prototipos móviles funcionales. Experimentamos hasta simplificar la interfaz y mejorar el rendimiento.',
    '[ status: in the lab ]':'[ estado: en el laboratorio ]','Mobile concepts in the prototype stage are taking shape. Coming soon to the App Store and Google Play.':'Los conceptos móviles en fase de prototipo van tomando forma. Pronto en App Store y Google Play.',
    'Understand the problem first; simplify the mobile experience.':'Primero entiende el problema; simplifica la experiencia móvil.','Care about interface flows and lightweight code.':'Cuida los recorridos y la ligereza del código.','Keep development transparent and lean.':'Mantén el desarrollo claro y transparente.',
    'Mobile Product Design':'Diseño de productos móviles','Performance-focused Solutions':'Soluciones de alto rendimiento','Lean Interfaces':'Interfaces sencillas','Swift / Kotlin Architecture':'Arquitectura Swift / Kotlin','Reduce Unnecessary Dependencies':'Reducir dependencias innecesarias','Minimize Battery and Data Use':'Reducir batería y datos','Improve Code Quality':'Mejorar la calidad del código','Capabilities & technology':'Áreas de trabajo','SEND MESSAGE':'ENVIAR MENSAJE','milenio-software:~$ project_idea:':'milenio-software:~$ idea_proyecto:',
  },
  it: {
    'ROADMAP':'ROADMAP','Stage 01:':'Fase 01:','Establishing the studio philosophy and minimalist web core':'Definire la filosofia dello studio e creare il nucleo web minimalista','[ COMPLETE ]':'[ COMPLETATO ]','Stage 02:':'Fase 02:','Prototyping experimental mobile interfaces and battery-friendly architectures':'Prototipare interfacce mobile sperimentali e architetture attente alla batteria','[ IN PROGRESS ]':'[ IN CORSO ]','Stage 03:':'Fase 03:','Releasing the first independent mobile tools on the App Store and Google Play':'Pubblicare i primi strumenti mobile indipendenti su App Store e Google Play','[ PLANNED ]':'[ IN PROGRAMMA ]',
    'Let’s talk about':'Parliamo di','ideas.':'idee.','Have a startup idea, want to discuss the philosophy of pure code, or just say hello? Reach out directly to the founder.':'Hai un’idea per una startup, vuoi parlare della filosofia del codice puro o semplicemente salutare? Contatta direttamente il fondatore.',
    Projects:'Progetti','Mobile Systems for the Future':'Sistemi mobili per il futuro','01_CONCEPT / PURE IDEA':'01_CONCETTO / IDEA PURA',
    'Every project begins with a question. With a startup mindset, we clarify the core problem and its place in the mobile world, then shape the architecture.':'Ogni progetto parte da una domanda. Con l’approccio di una startup, definiamo il problema e il suo contesto mobile prima di progettare l’architettura.',
    '02_CRAFT / CLEAN CODE':'02_MESTIERE / CODICE PULITO',
    'We add no ready-made tools that we do not need. Following a zero-dependency principle, we write every line for speed and battery efficiency.':'Non aggiungiamo strumenti pronti che non servono. Seguiamo il principio zero dipendenze e scriviamo ogni riga per velocità e autonomia.',
    '[ infrastructure: pure_code ]':'[ infrastruttura: codice_puro ]','03_ITERATION / PROTOTYPE':'03_ITERAZIONE / PROTOTIPO',
    'We quickly turn ideas into working mobile prototypes. We refine the interface and performance through experiments until both are as lean as possible.':'Trasformiamo rapidamente le idee in prototipi mobile funzionanti. Sperimentiamo per rendere interfaccia e prestazioni il più essenziali possibile.',
    '[ status: in the lab ]':'[ stato: in laboratorio ]','Mobile concepts in the prototype stage are taking shape. Coming soon to the App Store and Google Play.':'I concept mobile in fase di prototipo stanno prendendo forma. Presto su App Store e Google Play.',
    'Understand the problem first; simplify the mobile experience.':'Prima capisci il problema, poi semplifica l’esperienza mobile.','Care about interface flows and lightweight code.':'Cura i flussi e la leggerezza del codice.','Keep development transparent and lean.':'Mantieni lo sviluppo chiaro e snello.',
    'Mobile Product Design':'Design di prodotti mobile','Performance-focused Solutions':'Soluzioni performanti','Lean Interfaces':'Interfacce essenziali','Swift / Kotlin Architecture':'Architettura Swift / Kotlin','Reduce Unnecessary Dependencies':'Ridurre le dipendenze inutili','Minimize Battery and Data Use':'Ridurre batteria e dati','Improve Code Quality':'Migliorare la qualità del codice','Capabilities & technology':'Ambiti di lavoro','SEND MESSAGE':'INVIA MESSAGGIO','milenio-software:~$ project_idea:':'milenio-software:~$ idea_progetto:',
  },
  ru: {
    'ROADMAP':'ПЛАН РАЗВИТИЯ','Stage 01:':'Этап 01:','Establishing the studio philosophy and minimalist web core':'Формирование философии студии и минималистичного веб-ядра','[ COMPLETE ]':'[ ЗАВЕРШЕНО ]','Stage 02:':'Этап 02:','Prototyping experimental mobile interfaces and battery-friendly architectures':'Создание прототипов мобильных интерфейсов и энергоэффективной архитектуры','[ IN PROGRESS ]':'[ В ПРОЦЕССЕ ]','Stage 03:':'Этап 03:','Releasing the first independent mobile tools on the App Store and Google Play':'Публикация первых независимых мобильных инструментов в App Store и Google Play','[ PLANNED ]':'[ ЗАПЛАНИРОВАНО ]',
    'Let’s talk about':'Поговорим об','ideas.':'идеях.','Have a startup idea, want to discuss the philosophy of pure code, or just say hello? Reach out directly to the founder.':'Есть идея для стартапа, хотите обсудить философию чистого кода или просто поздороваться? Свяжитесь напрямую с основателем.',
    Projects:'Проекты','Mobile Systems for the Future':'Мобильные системы будущего','01_CONCEPT / PURE IDEA':'01_КОНЦЕПЦИЯ / ЧИСТАЯ ИДЕЯ',
    'Every project begins with a question. With a startup mindset, we clarify the core problem and its place in the mobile world, then shape the architecture.':'Каждый проект начинается с вопроса. В духе стартапа мы уточняем суть задачи и её место в мобильном мире, затем проектируем архитектуру.',
    '02_CRAFT / CLEAN CODE':'02_МАСТЕРСТВО / ЧИСТЫЙ КОД',
    'We add no ready-made tools that we do not need. Following a zero-dependency principle, we write every line for speed and battery efficiency.':'Мы не добавляем ненужные готовые инструменты. Следуя принципу нулевых зависимостей, пишем код ради скорости и экономии заряда.',
    '[ infrastructure: pure_code ]':'[ инфраструктура: чистый_код ]','03_ITERATION / PROTOTYPE':'03_ИТЕРАЦИЯ / ПРОТОТИП',
    'We quickly turn ideas into working mobile prototypes. We refine the interface and performance through experiments until both are as lean as possible.':'Мы быстро превращаем идеи в работающие мобильные прототипы и упрощаем интерфейс, улучшая производительность.',
    '[ status: in the lab ]':'[ статус: в лаборатории ]','Mobile concepts in the prototype stage are taking shape. Coming soon to the App Store and Google Play.':'Мобильные концепции проходят этап прототипирования. Скоро в App Store и Google Play.',
    'Understand the problem first; simplify the mobile experience.':'Сначала пойми задачу, затем упрости мобильный опыт.','Care about interface flows and lightweight code.':'Продумывай интерфейс и лёгкость кода.','Keep development transparent and lean.':'Развивай открыто и без лишнего.',
    'Mobile Product Design':'Дизайн мобильных продуктов','Performance-focused Solutions':'Высокопроизводительные решения','Lean Interfaces':'Лаконичные интерфейсы','Swift / Kotlin Architecture':'Архитектура Swift / Kotlin','Reduce Unnecessary Dependencies':'Сокращать ненужные зависимости','Minimize Battery and Data Use':'Экономить заряд и трафик','Improve Code Quality':'Повышать качество кода','Capabilities & technology':'Направления работы','SEND MESSAGE':'ОТПРАВИТЬ СООБЩЕНИЕ','milenio-software:~$ project_idea:':'milenio-software:~$ идея_проекта:',
  },
  zh: {
    'ROADMAP':'路线图','Stage 01:':'阶段 01：','Establishing the studio philosophy and minimalist web core':'确立工作室理念并搭建极简网页核心','[ COMPLETE ]':'[ 已完成 ]','Stage 02:':'阶段 02：','Prototyping experimental mobile interfaces and battery-friendly architectures':'为实验性移动界面和省电架构制作原型','[ IN PROGRESS ]':'[ 进行中 ]','Stage 03:':'阶段 03：','Releasing the first independent mobile tools on the App Store and Google Play':'在 App Store 和 Google Play 发布首批独立移动工具','[ PLANNED ]':'[ 计划中 ]',
    'Let’s talk about':'聊聊','ideas.':'想法。','Have a startup idea, want to discuss the philosophy of pure code, or just say hello? Reach out directly to the founder.':'有创业想法、想聊聊纯代码理念，或只是想打个招呼？欢迎直接联系创始人。',
    Projects:'项目','Mobile Systems for the Future':'面向未来的移动系统','01_CONCEPT / PURE IDEA':'01_构思 / 纯粹创意',
    'Every project begins with a question. With a startup mindset, we clarify the core problem and its place in the mobile world, then shape the architecture.':'每个项目都从一个问题开始。我们以创业团队的敏捷方式明确问题核心及其移动场景，再规划架构。',
    '02_CRAFT / CLEAN CODE':'02_匠心 / 整洁代码',
    'We add no ready-made tools that we do not need. Following a zero-dependency principle, we write every line for speed and battery efficiency.':'不添加不需要的现成工具。遵循零依赖原则，让每一行代码都兼顾速度与省电。',
    '[ infrastructure: pure_code ]':'[ 基础设施：纯净代码 ]','03_ITERATION / PROTOTYPE':'03_迭代 / 原型',
    'We quickly turn ideas into working mobile prototypes. We refine the interface and performance through experiments until both are as lean as possible.':'我们快速将想法变成可用的移动原型，并通过实验持续精简界面、优化性能。',
    '[ status: in the lab ]':'[ 状态：实验室开发中 ]','Mobile concepts in the prototype stage are taking shape. Coming soon to the App Store and Google Play.':'移动概念正在原型阶段逐步成形，即将登陆 App Store 和 Google Play。',
    'Understand the problem first; simplify the mobile experience.':'先理解问题，再简化移动体验。','Care about interface flows and lightweight code.':'重视界面流程与轻量代码。','Keep development transparent and lean.':'保持开发透明、精简。',
    'Mobile Product Design':'移动产品设计','Performance-focused Solutions':'高性能方案','Lean Interfaces':'简洁界面','Swift / Kotlin Architecture':'Swift / Kotlin 架构','Reduce Unnecessary Dependencies':'减少不必要的依赖','Minimize Battery and Data Use':'降低电量与流量消耗','Improve Code Quality':'提升代码质量','Capabilities & technology':'工作领域','SEND MESSAGE':'发送消息','milenio-software:~$ project_idea:':'milenio-software:~$ 项目想法：',
  },
  ja: {
    'ROADMAP':'ロードマップ','Stage 01:':'フェーズ 01：','Establishing the studio philosophy and minimalist web core':'スタジオの理念を定め、ミニマルなウェブ基盤を構築','[ COMPLETE ]':'[ 完了 ]','Stage 02:':'フェーズ 02：','Prototyping experimental mobile interfaces and battery-friendly architectures':'実験的なモバイル画面と省電力アーキテクチャを試作','[ IN PROGRESS ]':'[ 進行中 ]','Stage 03:':'フェーズ 03：','Releasing the first independent mobile tools on the App Store and Google Play':'最初の独立系モバイルツールを App Store と Google Play で公開','[ PLANNED ]':'[ 予定 ]',
    'Let’s talk about':'アイデアを','ideas.':'話しましょう。','Have a startup idea, want to discuss the philosophy of pure code, or just say hello? Reach out directly to the founder.':'スタートアップのアイデアがある方、ピュアコードの考え方について話したい方、気軽に挨拶したい方も、創業者へ直接ご連絡ください。',
    Projects:'プロジェクト','Mobile Systems for the Future':'未来のモバイルシステム','01_CONCEPT / PURE IDEA':'01_構想 / 純粋なアイデア',
    'Every project begins with a question. With a startup mindset, we clarify the core problem and its place in the mobile world, then shape the architecture.':'すべてのプロジェクトは問いから始まります。スタートアップらしい機動力で課題の核心とモバイルでの価値を見極め、設計します。',
    '02_CRAFT / CLEAN CODE':'02_技術 / クリーンコード',
    'We add no ready-made tools that we do not need. Following a zero-dependency principle, we write every line for speed and battery efficiency.':'不要な既製ツールは加えません。依存を抑え、速度とバッテリー効率を考えて一行ずつ書きます。',
    '[ infrastructure: pure_code ]':'[ 基盤：ピュアコード ]','03_ITERATION / PROTOTYPE':'03_反復 / プロトタイプ',
    'We quickly turn ideas into working mobile prototypes. We refine the interface and performance through experiments until both are as lean as possible.':'アイデアを素早く動くモバイルプロトタイプにし、実験を重ねて画面と性能を磨きます。',
    '[ status: in the lab ]':'[ 状態：ラボで開発中 ]','Mobile concepts in the prototype stage are taking shape. Coming soon to the App Store and Google Play.':'モバイルのコンセプトをプロトタイプとして開発中です。App Store と Google Play で近日公開予定。',
    'Understand the problem first; simplify the mobile experience.':'まず課題を理解し、モバイル体験をシンプルに。','Care about interface flows and lightweight code.':'画面の流れと軽いコードを大切に。','Keep development transparent and lean.':'透明で無駄のない開発を続ける。',
    'Mobile Product Design':'モバイルプロダクト設計','Performance-focused Solutions':'高性能なソリューション','Lean Interfaces':'シンプルなインターフェース','Swift / Kotlin Architecture':'Swift / Kotlin アーキテクチャ','Reduce Unnecessary Dependencies':'不要な依存を減らす','Minimize Battery and Data Use':'電池とデータの消費を抑える','Improve Code Quality':'コード品質を高める','Capabilities & technology':'取り組む領域','SEND MESSAGE':'メッセージを送信','milenio-software:~$ project_idea:':'milenio-software:~$ プロジェクトの概要：',
  },
  pt: {
    'ROADMAP':'ROTEIRO','Stage 01:':'Etapa 01:','Establishing the studio philosophy and minimalist web core':'Definir a filosofia do estúdio e construir o núcleo web minimalista','[ COMPLETE ]':'[ CONCLUÍDO ]','Stage 02:':'Etapa 02:','Prototyping experimental mobile interfaces and battery-friendly architectures':'Prototipar interfaces móveis experimentais e arquiteturas econômicas em bateria','[ IN PROGRESS ]':'[ EM ANDAMENTO ]','Stage 03:':'Etapa 03:','Releasing the first independent mobile tools on the App Store and Google Play':'Lançar as primeiras ferramentas móveis independentes na App Store e no Google Play','[ PLANNED ]':'[ PLANEJADO ]',
    'Let’s talk about':'Vamos falar de','ideas.':'ideias.','Have a startup idea, want to discuss the philosophy of pure code, or just say hello? Reach out directly to the founder.':'Tem uma ideia de startup, quer conversar sobre a filosofia do código puro ou apenas dizer olá? Fale diretamente com o fundador.',
    Projects:'Projetos','Mobile Systems for the Future':'Sistemas móveis para o futuro','01_CONCEPT / PURE IDEA':'01_CONCEITO / IDEIA PURA',
    'Every project begins with a question. With a startup mindset, we clarify the core problem and its place in the mobile world, then shape the architecture.':'Todo projeto começa com uma pergunta. Com agilidade de startup, entendemos o problema e seu contexto móvel antes de definir a arquitetura.',
    '02_CRAFT / CLEAN CODE':'02_OFÍCIO / CÓDIGO LIMPO',
    'We add no ready-made tools that we do not need. Following a zero-dependency principle, we write every line for speed and battery efficiency.':'Não adicionamos ferramentas prontas sem necessidade. Seguimos o princípio de zero dependências e escrevemos cada linha pensando em velocidade e bateria.',
    '[ infrastructure: pure_code ]':'[ infraestrutura: código_puro ]','03_ITERATION / PROTOTYPE':'03_ITERAÇÃO / PROTÓTIPO',
    'We quickly turn ideas into working mobile prototypes. We refine the interface and performance through experiments until both are as lean as possible.':'Transformamos ideias rapidamente em protótipos móveis funcionais. Experimentamos até simplificar a interface e otimizar o desempenho.',
    '[ status: in the lab ]':'[ status: no laboratório ]','Mobile concepts in the prototype stage are taking shape. Coming soon to the App Store and Google Play.':'Conceitos móveis em fase de protótipo estão tomando forma. Em breve na App Store e no Google Play.',
    'Understand the problem first; simplify the mobile experience.':'Entenda o problema primeiro; simplifique a experiência móvel.','Care about interface flows and lightweight code.':'Cuide dos fluxos da interface e de um código leve.','Keep development transparent and lean.':'Mantenha o desenvolvimento transparente e enxuto.',
    'Mobile Product Design':'Design de produtos móveis','Performance-focused Solutions':'Soluções de alto desempenho','Lean Interfaces':'Interfaces enxutas','Swift / Kotlin Architecture':'Arquitetura Swift / Kotlin','Reduce Unnecessary Dependencies':'Reduzir dependências desnecessárias','Minimize Battery and Data Use':'Reduzir consumo de bateria e dados','Improve Code Quality':'Melhorar a qualidade do código','Capabilities & technology':'Áreas de atuação','SEND MESSAGE':'ENVIAR MENSAGEM','milenio-software:~$ project_idea:':'milenio-software:~$ ideia_do_projeto:',
  },
};

const textNodeRecords = [];
const textWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
while (textWalker.nextNode()) {
  const node = textWalker.currentNode;
  if (!node.nodeValue.trim() || revealParagraphs.some((paragraph) => paragraph.contains(node))) continue;
  textNodeRecords.push({ node, original: node.nodeValue });
}

const languageDescriptions = {
  tr: {
    title: 'Milenio Software | Bağımsız Yazılım Stüdyosu',
    description: 'Karmaşık süreçleri sadeleştiren bağımsız mobil uygulamalar ve dijital araçlar geliştiriyoruz.',
    themeLight: 'AÇIK MOD', themeDark: 'KOYU MOD',
    themeLightAria: 'Açık moda geç', themeDarkAria: 'Koyu moda geç',
    languageAria: 'Dil seçimi',
  },
  en: {
    title: 'Milenio Software — Systems for the future',
    description: 'We build independent mobile apps and digital tools that simplify complex processes.',
    themeLight: 'LIGHT MODE', themeDark: 'DARK MODE',
    themeLightAria: 'Switch to light mode', themeDarkAria: 'Switch to dark mode',
    languageAria: 'Select language',
  },
  de: { title:'Milenio Software — Systeme für die Zukunft', description:'Wir entwickeln unabhängige mobile Apps und digitale Werkzeuge, die komplexe Abläufe vereinfachen.', themeLight:'HELLER MODUS', themeDark:'DUNKLER MODUS', themeLightAria:'Hellen Modus aktivieren', themeDarkAria:'Dunklen Modus aktivieren', languageAria:'Sprache auswählen' },
  fr: { title:'Milenio Software — Les systèmes de demain', description:'Nous créons des applications mobiles indépendantes et des outils numériques qui simplifient les processus complexes.', themeLight:'MODE CLAIR', themeDark:'MODE SOMBRE', themeLightAria:'Activer le mode clair', themeDarkAria:'Activer le mode sombre', languageAria:'Choisir la langue' },
  es: { title:'Milenio Software — Sistemas para el futuro', description:'Creamos aplicaciones móviles independientes y herramientas digitales que simplifican procesos complejos.', themeLight:'MODO CLARO', themeDark:'MODO OSCURO', themeLightAria:'Activar modo claro', themeDarkAria:'Activar modo oscuro', languageAria:'Elegir idioma' },
  it: { title:'Milenio Software — Sistemi per il futuro', description:'Sviluppiamo app mobili indipendenti e strumenti digitali che semplificano processi complessi.', themeLight:'MODALITÀ CHIARA', themeDark:'MODALITÀ SCURA', themeLightAria:'Attiva modalità chiara', themeDarkAria:'Attiva modalità scura', languageAria:'Seleziona lingua' },
  ru: { title:'Milenio Software — Системы будущего', description:'Мы создаём независимые мобильные приложения и цифровые инструменты, упрощающие сложные процессы.', themeLight:'СВЕТЛАЯ ТЕМА', themeDark:'ТЁМНАЯ ТЕМА', themeLightAria:'Включить светлую тему', themeDarkAria:'Включить тёмную тему', languageAria:'Выбрать язык' },
  zh: { title:'Milenio Software — 面向未来的系统', description:'我们开发独立移动应用和数字工具，简化复杂流程。', themeLight:'浅色模式', themeDark:'深色模式', themeLightAria:'切换到浅色模式', themeDarkAria:'切换到深色模式', languageAria:'选择语言' },
  ja: { title:'Milenio Software — 未来のためのシステム', description:'複雑な業務をシンプルにする、独立系モバイルアプリとデジタルツールを開発します。', themeLight:'ライトモード', themeDark:'ダークモード', themeLightAria:'ライトモードに切り替え', themeDarkAria:'ダークモードに切り替え', languageAria:'言語を選択' },
  pt: { title:'Milenio Software — Sistemas para o futuro', description:'Desenvolvemos aplicativos móveis independentes e ferramentas digitais que simplificam processos complexos.', themeLight:'MODO CLARO', themeDark:'MODO ESCURO', themeLightAria:'Ativar modo claro', themeDarkAria:'Ativar modo escuro', languageAria:'Selecionar idioma' },
};
const languageNames = { tr:'Türkçe', en:'English', de:'Deutsch', fr:'Français', es:'Español', it:'Italiano', ru:'Русский', zh:'中文', ja:'日本語', pt:'Português' };
const languageOptionLabels = {
  tr:{ tr:'Türkçe', en:'İngilizce', de:'Almanca', fr:'Fransızca', es:'İspanyolca', it:'İtalyanca', ru:'Rusça', zh:'Çince', ja:'Japonca', pt:'Portekizce' },
  en:{ tr:'Turkish', en:'English', de:'German', fr:'French', es:'Spanish', it:'Italian', ru:'Russian', zh:'Chinese', ja:'Japanese', pt:'Portuguese' },
  de:{ tr:'Türkisch', en:'Englisch', de:'Deutsch', fr:'Französisch', es:'Spanisch', it:'Italienisch', ru:'Russisch', zh:'Chinesisch', ja:'Japanisch', pt:'Portugiesisch' },
  fr:{ tr:'Turc', en:'Anglais', de:'Allemand', fr:'Français', es:'Espagnol', it:'Italien', ru:'Russe', zh:'Chinois', ja:'Japonais', pt:'Portugais' },
  es:{ tr:'Turco', en:'Inglés', de:'Alemán', fr:'Francés', es:'Español', it:'Italiano', ru:'Ruso', zh:'Chino', ja:'Japonés', pt:'Portugués' },
  it:{ tr:'Turco', en:'Inglese', de:'Tedesco', fr:'Francese', es:'Spagnolo', it:'Italiano', ru:'Russo', zh:'Cinese', ja:'Giapponese', pt:'Portoghese' },
  ru:{ tr:'Турецкий', en:'Английский', de:'Немецкий', fr:'Французский', es:'Испанский', it:'Итальянский', ru:'Русский', zh:'Китайский', ja:'Японский', pt:'Португальский' },
  zh:{ tr:'土耳其语', en:'英语', de:'德语', fr:'法语', es:'西班牙语', it:'意大利语', ru:'俄语', zh:'中文', ja:'日语', pt:'葡萄牙语' },
  ja:{ tr:'トルコ語', en:'英語', de:'ドイツ語', fr:'フランス語', es:'スペイン語', it:'イタリア語', ru:'ロシア語', zh:'中国語', ja:'日本語', pt:'ポルトガル語' },
  pt:{ tr:'Turco', en:'Inglês', de:'Alemão', fr:'Francês', es:'Espanhol', it:'Italiano', ru:'Russo', zh:'Chinês', ja:'Japonês', pt:'Português' },
};

let refreshRevealText = () => {};
let languageChangePending = false;

function positionMobileLanguageMenu() {
  if (languageMenu.hidden) return;
  if (!window.matchMedia('(max-width: 600px)').matches) {
    languageMenu.style.left = '';
    return;
  }
  const toggleRect = languageToggle.getBoundingClientRect();
  const pickerRect = languageToggle.parentElement.getBoundingClientRect();
  const menuWidth = languageMenu.getBoundingClientRect().width;
  const gutter = 8;
  const viewportLeft = Math.max(gutter, Math.min(toggleRect.right - menuWidth, window.innerWidth - menuWidth - gutter));
  languageMenu.style.left = `${viewportLeft - pickerRect.left}px`;
}

function setLanguageMenuOpen(open) {
  window.clearTimeout(languageMenuTimer);
  languageToggle.setAttribute('aria-expanded', String(open));
  if (open) {
    languageMenu.hidden = false;
    positionMobileLanguageMenu();
    requestAnimationFrame(() => {
      positionMobileLanguageMenu();
      languageMenu.classList.add('is-open');
    });
  } else {
    languageMenu.classList.remove('is-open');
    languageMenuTimer = window.setTimeout(() => { languageMenu.hidden = true; }, 180);
  }
}

window.addEventListener('resize', positionMobileLanguageMenu, { passive:true });

function updateLocalizedAttributes() {
  const copy = languageDescriptions[currentLanguage];
  const accessLabels = {
    tr:['Milenio Software ana sayfa','Ana menü','Terminal çıktısı','Laboratuvar: geliştirme süreçleri','Geliştirme süreçleri','Projeleri keşfet'],
    en:['Milenio Software home','Main navigation','Terminal output','Lab: development process','Development process','Explore projects'],
    de:['Milenio Software Startseite','Hauptnavigation','Terminalausgabe','Labor: Entwicklungsprozess','Entwicklungsprozess','Projekte entdecken'],
    fr:['Accueil Milenio Software','Navigation principale','Sortie du terminal','Laboratoire : processus de développement','Processus de développement','Découvrir les projets'],
    es:['Inicio de Milenio Software','Navegación principal','Salida del terminal','Laboratorio: proceso de desarrollo','Proceso de desarrollo','Explorar proyectos'],
    it:['Home Milenio Software','Navigazione principale','Output del terminal','Laboratorio: processo di sviluppo','Processo di sviluppo','Esplora i progetti'],
    ru:['Главная Milenio Software','Главная навигация','Вывод терминала','Лаборатория: процесс разработки','Процесс разработки','Открыть проекты'],
    zh:['Milenio Software 首页','主导航','终端输出','实验室：开发流程','开发流程','探索项目'],
    ja:['Milenio Software ホーム','メインナビゲーション','ターミナル出力','ラボ：開発プロセス','開発プロセス','プロジェクトを見る'],
    pt:['Página inicial Milenio Software','Navegação principal','Saída do terminal','Laboratório: processo de desenvolvimento','Processo de desenvolvimento','Explorar projetos'],
  }[currentLanguage];
  document.documentElement.lang = currentLanguage;
  document.title = copy.title;
  document.querySelector('meta[name="description"]').content = copy.description;
  document.querySelector('meta[property="og:title"]').content = copy.title;
  document.querySelector('meta[property="og:description"]').content = copy.description;
  languageToggle.innerHTML = `${currentLanguage.toUpperCase()} <span aria-hidden="true">▾</span>`;
  languageToggle.setAttribute('aria-label', `${copy.languageAria}: ${languageNames[currentLanguage]}`);
  document.querySelectorAll('#language-menu [data-language]').forEach((option) => {
    const selected = option.dataset.language === currentLanguage;
    option.setAttribute('aria-checked', String(selected));
    option.querySelector('span').textContent = languageOptionLabels[currentLanguage][option.dataset.language];
  });
  const languageMenuLabels = { tr:'Dil seçimi', en:'Language selection', de:'Sprachauswahl', fr:'Choix de la langue', es:'Selección de idioma', it:'Selezione della lingua', ru:'Выбор языка', zh:'语言选择', ja:'言語選択', pt:'Seleção de idioma' };
  languageMenu.setAttribute('aria-label', languageMenuLabels[currentLanguage]);
  const trackerCopy = {
    tr:{label:'Süreç ilerlemesi',steps:['[01/03 KONSEPT]','[02/03 ZANAAT]','[03/03 YİNELEME]']},
    en:{label:'Process progress',steps:['[01/03 CONCEPT]','[02/03 CRAFT]','[03/03 ITERATION]']},
    de:{label:'Prozessfortschritt',steps:['[01/03 KONZEPT]','[02/03 HANDWERK]','[03/03 ITERATION]']},
    fr:{label:'Avancement du processus',steps:['[01/03 CONCEPT]','[02/03 SAVOIR-FAIRE]','[03/03 ITÉRATION]']},
    es:{label:'Progreso del proceso',steps:['[01/03 CONCEPTO]','[02/03 OFICIO]','[03/03 ITERACIÓN]']},
    it:{label:'Avanzamento del processo',steps:['[01/03 CONCETTO]','[02/03 MESTIERE]','[03/03 ITERAZIONE]']},
    ru:{label:'Ход процесса',steps:['[01/03 КОНЦЕПЦИЯ]','[02/03 МАСТЕРСТВО]','[03/03 ИТЕРАЦИЯ]']},
    zh:{label:'流程进度',steps:['[01/03 构思]','[02/03 打磨]','[03/03 迭代]']},
    ja:{label:'工程の進行状況',steps:['[01/03 構想]','[02/03 技術]','[03/03 反復]']},
    pt:{label:'Progresso do processo',steps:['[01/03 CONCEITO]','[02/03 OFÍCIO]','[03/03 ITERAÇÃO]']},
  }[currentLanguage];
  const processTracker = document.querySelector('.process-tracker');
  processTracker.setAttribute('aria-label', trackerCopy.label);
  trackerSteps.forEach((step, index) => { step.querySelector('span').textContent = trackerCopy.steps[index]; });
  themeToggle.querySelector('.theme-toggle-label').textContent = document.documentElement.dataset.theme === 'light'
    ? copy.themeDark
    : copy.themeLight;
  themeToggle.setAttribute('aria-label', document.documentElement.dataset.theme === 'light'
    ? copy.themeDarkAria
    : copy.themeLightAria);
  document.querySelector('.wordmark').setAttribute('aria-label', accessLabels[0]);
  document.querySelector('nav').setAttribute('aria-label', accessLabels[1]);
  const statusLabels = { tr:'Geliştirme sürüyor', en:'Development in progress', de:'Entwicklung läuft', fr:'Développement en cours', es:'Desarrollo en curso', it:'Sviluppo in corso', ru:'Разработка продолжается', zh:'正在开发', ja:'開発中', pt:'Desenvolvimento em andamento' };
  document.querySelector('.header-status').setAttribute('aria-label', statusLabels[currentLanguage]);
  const placeholders = {
    tr:['ad@firma.com','Adınız soyadınız','Mesajınızı buraya bırakın...'],
    en:['name@company.com','Your name','Leave your message here...'],
    de:['name@firma.de','Ihr Name','Hinterlassen Sie Ihre Nachricht hier...'],
    fr:['nom@entreprise.fr','Votre nom','Laissez votre message ici...'],
    es:['nombre@empresa.es','Tu nombre','Deja tu mensaje aquí...'],
    it:['nome@azienda.it','Il tuo nome','Lascia qui il tuo messaggio...'],
    ru:['name@company.ru','Ваше имя','Оставьте сообщение здесь...'],
    zh:['name@company.com','您的姓名','请在此留言……'],
    ja:['name@company.com','お名前','メッセージはこちらに入力してください……'],
    pt:['nome@empresa.com','Seu nome','Deixe sua mensagem aqui...'],
  }[currentLanguage];
  document.querySelector('#email').placeholder = placeholders[0];
  document.querySelector('#name').placeholder = placeholders[1];
  document.querySelector('#message').placeholder = placeholders[2];
  document.querySelector('#terminal-output').setAttribute('aria-label', accessLabels[2]);
  document.querySelector('.project-section').setAttribute('aria-label', accessLabels[3]);
  document.querySelector('.project-list').setAttribute('aria-label', accessLabels[4]);
  document.querySelector('.round-link').setAttribute('aria-label', accessLabels[5]);
}

function renderLanguage(nextLanguage) {
  currentLanguage = nextLanguage;
  textNodeRecords.forEach(({ node, original }) => {
    if (!node.isConnected) return;
    const key = original.trim();
    const english = textTranslations[key] || key;
    const translated = currentLanguage === 'tr'
      ? key
      : translateEnglishPhrase(english);
    node.nodeValue = original.replace(key, translated);
  });
  revealParagraphs.forEach((paragraph, index) => {
    paragraph.textContent = revealParagraphsByLanguage[currentLanguage][index];
  });
  if (form.dataset.status) formMessage.textContent = form.dataset.status === 'success'
    ? ''
    : formStatusMessages[currentLanguage][form.dataset.status];
  const previousTerminalLines = [...terminalOutput.children];
  previousTerminalLines.forEach((line) => {
    if (line.dataset.command) line.textContent = terminalMessage(line.dataset.command);
  });
  updateLocalizedAttributes();
  try { window.localStorage.setItem('milenio-language', currentLanguage); } catch { /* Language still works for this visit. */ }
  activeStep = -1;
  updateProject();
  refreshRevealText();
}

function changeLanguage(nextLanguage) {
  if (!supportedLanguages.includes(nextLanguage) || languageChangePending) return;
  setLanguageMenuOpen(false);
  if (nextLanguage === currentLanguage) {
    languageToggle.focus({ preventScroll:true });
    return;
  }
  languageChangePending = true;
  languageToggle.disabled = true;
  languageMenu.querySelectorAll('button').forEach((option) => { option.disabled = true; });
  document.body.classList.add('is-language-changing');
  window.setTimeout(() => {
    renderLanguage(nextLanguage);
    requestAnimationFrame(() => {
      document.body.classList.remove('is-language-changing');
      window.setTimeout(() => {
        languageToggle.disabled = false;
        languageMenu.querySelectorAll('button').forEach((option) => { option.disabled = false; });
        languageChangePending = false;
        languageToggle.focus({ preventScroll:true });
      }, 300);
    });
  }, 300);
}

renderLanguage(currentLanguage);
languageToggle.addEventListener('click', () => setLanguageMenuOpen(languageToggle.getAttribute('aria-expanded') !== 'true'));
languageToggle.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    setLanguageMenuOpen(true);
    languageMenu.querySelector('[data-language]').focus();
  } else if (event.key === 'Escape') {
    setLanguageMenuOpen(false);
  }
});
languageMenu.addEventListener('click', (event) => {
  const option = event.target.closest('[data-language]');
  if (option) changeLanguage(option.dataset.language);
});
languageMenu.addEventListener('keydown', (event) => {
  const options = [...languageMenu.querySelectorAll('[data-language]')];
  const index = options.indexOf(document.activeElement);
  if (event.key === 'Escape') {
    setLanguageMenuOpen(false);
    languageToggle.focus();
  } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault();
    options[(index + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length].focus();
  }
});
document.addEventListener('pointerdown', (event) => {
  if (!event.target.closest('.language-picker') && !languageMenu.hidden) setLanguageMenuOpen(false);
});

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (window.gsap && window.ScrollTrigger && !reducedMotion.matches) {
  gsap.registerPlugin(ScrollTrigger);

  function configureTextReveal() {
    revealParagraphs.forEach((paragraph) => {
      const isFinalParagraph = paragraph.matches('.contact-intro > p');
      const fragment = document.createDocumentFragment();
      const words = [];

      paragraph.textContent.match(/\s+|\S+/g)?.forEach((part) => {
        if (/^\s+$/.test(part)) {
          fragment.append(document.createTextNode(part));
          return;
        }

        const word = document.createElement('span');
        word.className = 'text-reveal-word';
        word.textContent = part;
        words.push(word);
        fragment.append(word);
      });

      paragraph.replaceChildren(fragment);
      if (!words.length) return;

      gsap.to(words, {
        '--word-progress': '100%',
        duration: 0.15,
        stagger: { amount: 0.85 },
        ease: 'none',
        scrollTrigger: {
          trigger: paragraph,
          start: 'top 85%',
          endTrigger: isFinalParagraph ? document.documentElement : paragraph,
          end: isFinalParagraph ? 'bottom bottom' : 'bottom 35%',
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    });
  }

  configureTextReveal();
  refreshRevealText = () => {
    ScrollTrigger.getAll().filter((trigger) => revealParagraphs.includes(trigger.trigger))
      .forEach((trigger) => trigger.kill());
    gsap.killTweensOf(document.querySelectorAll('.text-reveal-word'));
    configureTextReveal();
    ScrollTrigger.refresh();
  };

  // Dekoratif arka planlar, sayfa içeriğinin kayma hızının %30'unda ilerler.
  // Pozitif y dönüşümü, bölüm yukarı kayarken dekorun hareketini yavaşlatır.
  document.querySelectorAll('.hero-gridline').forEach((element) => {
    const section = element.closest('section');
    if (!section) return;

    gsap.to(element, {
      y: () => (section.offsetHeight + window.innerHeight) * 0.7,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        invalidateOnRefresh: true,
      },
    });
  });

  const lineSequences = [
    { host: '.project-heading', reveal: '.project-layout' },
    { host: '.project-section', reveal: '.active-builds-heading', start: 'bottom 82%' },
    { host: '.active-builds-heading', reveal: '.active-build-list' },
    { host: '.active-builds', reveal: '.about-meta', start: 'bottom 82%' },
    { host: '.about-meta', reveal: '.about-content' },
    { host: '.about', reveal: '.capabilities-heading', start: 'bottom 82%' },
    { host: '.capabilities-heading', reveal: '.capabilities-grid' },
    { host: '.capabilities', reveal: '.contact-top', start: 'bottom 82%' },
    { host: '.contact-top', reveal: '.contact-layout' },
    { host: '.hero-bottom', reveal: '.hero-bottom > *', edge: 'top' },
    { host: '.principle-line', reveal: '.principle-line > *', edge: 'top' },
    { host: '.contact-bottom', reveal: '.contact-bottom > *', edge: 'top' },
  ];
  const animatedLines = [];

  lineSequences.forEach(({ host: selector, reveal: revealSelector, edge = 'bottom', start = 'top 82%' }) => {
    const host = document.querySelector(selector);
    if (!host) return;

    host.classList.add('scroll-rule-host', `scroll-rule-host--${edge}`);
    const rule = document.createElement('span');
    rule.className = 'scroll-rule';
    rule.setAttribute('aria-hidden', 'true');
    host.append(rule);

    const details = [...host.parentElement.querySelectorAll(revealSelector)]
      .filter((element) => element !== rule);
    // Selectors for section content may live outside the line's parent.
    const revealedDetails = details.length
      ? details
      : [...document.querySelectorAll(revealSelector)].filter((element) => {
          const section = host.closest('section');
          return element !== rule && section?.contains(element);
        });

    animatedLines.push({ host, rule, details: revealedDetails, start });
  });

  if (animatedLines.length) {
    gsap.set(animatedLines.map(({ rule }) => rule), {
      scaleX: 0,
      transformOrigin: 'left center',
    });
    document.body.classList.add('has-scroll-lines');

    animatedLines.forEach(({ host, rule, details, start }) => {
      if (details.length) gsap.set(details, { autoAlpha: 0, y: 7 });

      const sequence = gsap.timeline({
        scrollTrigger: {
          trigger: host,
          start,
          once: true,
        },
      });

      sequence.to(rule, {
        scaleX: 1,
        duration: 0.72,
        ease: 'power2.out',
      });

      if (details.length) {
        sequence.to(details, {
          autoAlpha: 1,
          y: 0,
          duration: 0.38,
          stagger: 0.035,
          ease: 'power2.out',
        });
      }
    });

    window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
  }
}

// Görünür geliştirme alanlarında düşük kontrastlı sayı akışını çalıştır.
if (!reducedMotion.matches && 'IntersectionObserver' in window) {
  const rainHosts = document.querySelectorAll('.project-sticky, .active-builds');

  rainHosts.forEach((host) => {
    const canvas = document.createElement('canvas');
    canvas.className = 'digital-rain-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    host.classList.add('has-digital-rain');
    host.prepend(canvas);

    const context = canvas.getContext('2d');
    if (!context) return;

    let width = 0;
    let height = 0;
    let streams = [];
    let frameId = 0;
    let lastFrame = 0;
    const characters = '0123456789';

    const resize = () => {
      const bounds = host.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.ceil(width * pixelRatio);
      canvas.height = Math.ceil(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.font = '11px DM Mono, monospace';
      streams = Array.from({ length: Math.ceil(width / 24) }, (_, index) => ({
        x: index * 24 + Math.random() * 8,
        y: Math.random() * height,
        speed: 0.25 + Math.random() * 0.55,
        length: 3 + Math.floor(Math.random() * 5),
      }));
    };

    const draw = (time) => {
      if (time - lastFrame < 45) {
        frameId = window.requestAnimationFrame(draw);
        return;
      }
      lastFrame = time;
      context.clearRect(0, 0, width, height);
      const isLight = document.documentElement.dataset.theme === 'light';
      const color = isLight ? '17,17,16' : '245,245,240';

      streams.forEach((stream) => {
        for (let index = 0; index < stream.length; index += 1) {
          const y = stream.y - index * 15;
          if (y < 0 || y > height) continue;
          const opacity = 0.38 * (1 - index / stream.length);
          context.fillStyle = `rgba(${color},${opacity})`;
          context.fillText(characters[Math.floor(Math.random() * characters.length)], stream.x, y);
        }

        stream.y += stream.speed;
        if (stream.y - stream.length * 15 > height) {
          stream.y = -Math.random() * height * 0.35;
          stream.speed = 0.25 + Math.random() * 0.55;
        }
      });

      frameId = window.requestAnimationFrame(draw);
    };

    const start = () => {
      if (frameId) return;
      resize();
      frameId = window.requestAnimationFrame(draw);
    };

    const stop = () => {
      window.cancelAnimationFrame(frameId);
      frameId = 0;
      context.clearRect(0, 0, width, height);
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) start();
      else stop();
    }, { threshold: 0.01 });

    observer.observe(host);
    window.addEventListener('resize', () => {
      if (frameId) resize();
    }, { passive: true });
  });
}
