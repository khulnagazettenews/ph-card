// Bengali translation maps
const BENGALI_DIGITS = {
  '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
  '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
};

const BENGALI_MONTHS = {
  1: 'জানুয়ারি', 2: 'ফেব্রুয়ারি', 3: 'মার্চ', 4: 'এপ্রিল',
  5: 'মে', 6: 'জুন', 7: 'জুলাই', 8: 'আগস্ট',
  9: 'সেপ্টেম্বর', 10: 'অক্টোবর', 11: 'নভেম্বর', 12: 'ডিসেম্বর'
};

function translateToBengaliDigits(str) {
  return str.toString().split('').map(char => BENGALI_DIGITS[char] || char).join('');
}

function formatDateToBengali(dateObj) {
  if (!dateObj || isNaN(dateObj.getTime())) return '';
  const day = translateToBengaliDigits(dateObj.getDate());
  const month = BENGALI_MONTHS[dateObj.getMonth() + 1];
  const year = translateToBengaliDigits(dateObj.getFullYear());
  return `${day} ${month} ${year}`;
}

// Application State
const state = {
  logoImg: null,
  newsImg: null,
  adImg: null,
  bgImg: null,
  newsImgSettings: {
    scale: 1.0,
    offsetX: 0,
    offsetY: 0
  },
  dateText: '',
  subHeadline: '',
  subFontSize: 24,
  subHeadlineColor: '#f8fafc',
  headlineColor: '#ffffff',
  headline: 'জুলাই গণহত্যার বিচার করতে সরকার প্রতিশ্রুতিবদ্ধ: রিজভী',
  fontSize: 38,
  urlFontSize: 22,
  webUrl: 'www.khulnagazette.com/www.khulnagazette.net',
  dateFont: 'Noto Serif Bengali',
  subHeadlineFont: 'Hind Siliguri',
  headlineFont: 'Hind Siliguri',
  urlFont: 'Hind Siliguri',
  isDragging: false,
  dragStart: { x: 0, y: 0 }
};

// DOM Elements
const canvas = document.getElementById('cardCanvas');
const ctx = canvas.getContext('2d');

const newsDateInput = document.getElementById('newsDateInput');
const autoBengaliDate = document.getElementById('autoBengaliDate');
const customDateText = document.getElementById('customDateText');

const newsImageFile = document.getElementById('newsImageFile');
const imageDropzone = document.getElementById('imageDropzone');
const imageAdjustmentsArea = document.getElementById('imageAdjustmentsArea');
const imageZoom = document.getElementById('imageZoom');
const imagePanX = document.getElementById('imagePanX');
const imagePanY = document.getElementById('imagePanY');
const zoomValDisplay = document.getElementById('zoomValDisplay');
const panXDisplay = document.getElementById('panXDisplay');
const panYDisplay = document.getElementById('panYDisplay');
const resetImageAdjustBtn = document.getElementById('resetImageAdjustBtn');
const fitImageBtn = document.getElementById('fitImageBtn');

const headlineInput = document.getElementById('headlineInput');
const headlineFontSize = document.getElementById('headlineFontSize');
const fontSizeDisplay = document.getElementById('fontSizeDisplay');
const charCountDisplay = document.getElementById('charCount');
const subHeadlineInput = document.getElementById('subHeadlineInput');
const subHeadlineFontSize = document.getElementById('subHeadlineFontSize');
const subFontSizeDisplay = document.getElementById('subFontSizeDisplay');
const subHeadlineColor = document.getElementById('subHeadlineColor');
const headlineColor = document.getElementById('headlineColor');
const webUrlInput = document.getElementById('webUrlInput');
const urlFontSize = document.getElementById('urlFontSize');
const urlFontSizeDisplay = document.getElementById('urlFontSizeDisplay');

const dateFontFamily = document.getElementById('dateFontFamily');
const subHeadlineFontFamily = document.getElementById('subHeadlineFontFamily');
const headlineFontFamily = document.getElementById('headlineFontFamily');
const urlFontFamily = document.getElementById('urlFontFamily');

const downloadPngBtn = document.getElementById('downloadPngBtn');
const themeToggleBtn = document.getElementById('themeToggleBtn');

// Initialize State with current local time
const currentDate = new Date();
newsDateInput.value = currentDate.toISOString().split('T')[0];
state.dateText = formatDateToBengali(currentDate);
customDateText.value = state.dateText;
headlineInput.value = state.headline;
charCountDisplay.textContent = translateToBengaliDigits(state.headline.length);

// Load Assets
const assets = {
  logo: 'assets/logo.png',
  ad1: 'assets/ad_road_home.png',
  ad2: 'assets/ad_aci_water_pump.png',
  ad3: 'assets/ad_aci_smart_tools.png'
};

// Helper: Image loader
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (src.startsWith('http') && !src.startsWith(window.location.origin)) {
      img.crossOrigin = 'anonymous';
    }
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

// Load initial images
Promise.all([
  loadImage(assets.logo),
  loadImage(assets.ad1),
  loadImage('assets/card_bg.jpg')
]).then(([logo, ad, bg]) => {
  state.logoImg = logo;
  state.adImg = ad;
  state.bgImg = bg;
  drawCard();
}).catch(err => {
  console.error("Error loading assets:", err);
});

function wrapText(text, maxWidth, font, context) {
  context.font = font;
  const words = text.split(' ');
  let line = '';
  const lines = [];
  for (let n = 0; n < words.length; n++) {
    let testLine = line + words[n] + ' ';
    let metrics = context.measureText(testLine);
    let testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      lines.push(line.trim());
      line = words[n] + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line.trim());
  return lines;
}

// Render Loop
function drawCard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 1. Draw Card Background (from assets/card_bg.jpg)
  if (state.bgImg) {
    ctx.drawImage(state.bgImg, 0, 0, canvas.width, 1080);
  } else {
    // Fallback
    ctx.fillStyle = '#d8f0ea';
    ctx.fillRect(0, 0, canvas.width, 290);
    ctx.fillStyle = '#d92323';
    ctx.fillRect(0, 290, canvas.width, 790);
  }

  // 2. Draw Logo (Left side)
  if (state.logoImg) {
    // Canvas dimensions: width=1000, height=1200
    // Draw logo SVG scaled
    ctx.drawImage(state.logoImg, 25, 35, 300, 85);
  }

  // 3. Draw Date (Right side)
  ctx.fillStyle = '#111111';
  ctx.font = `700 34px "${state.dateFont}", "Vrinda", "SolaimanLipi", "Kalpurush", serif`;
  ctx.textAlign = 'right';
  ctx.fillText(state.dateText, 950, 90);

  // 6. Draw News Image (With rounded corners clipping mask)
  const px = 30, py = 140, pw = 940, ph = 550, r = 28;
  ctx.save();
  
  // Draw rounded rect mask
  ctx.beginPath();
  ctx.moveTo(px + r, py);
  ctx.arcTo(px + pw, py, px + pw, py + ph, r);
  ctx.arcTo(px + pw, py + ph, px, py + ph, r);
  ctx.arcTo(px, py + ph, px, py, r);
  ctx.arcTo(px, py, px + pw, py, r);
  ctx.closePath();
  ctx.clip();

  // Draw news photo if uploaded, otherwise grey placeholder
  if (state.newsImg) {
    ctx.save();
    // Translate to center of image box, apply scaling & panning, then draw centered
    ctx.translate(px + pw / 2 + state.newsImgSettings.offsetX, py + ph / 2 + state.newsImgSettings.offsetY);
    ctx.scale(state.newsImgSettings.scale, state.newsImgSettings.scale);
    ctx.drawImage(state.newsImg, -state.newsImg.width / 2, -state.newsImg.height / 2);
    ctx.restore();
  } else {
    // Nice placeholder gradient
    const placeGrad = ctx.createLinearGradient(px, py, px, py + ph);
    placeGrad.addColorStop(0, '#334155');
    placeGrad.addColorStop(1, '#1e293b');
    ctx.fillStyle = placeGrad;
    ctx.fillRect(px, py, pw, ph);

    // Text details
    ctx.fillStyle = '#94a3b8';
    ctx.font = `600 24px "${state.subHeadlineFont}", "SolaimanLipi", "Kalpurush", "Vrinda", "Siyam Rupali", "Nikosh", sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('সংবাদের মূল ছবি এখানে দেখতে পাবেন', px + pw / 2, py + ph / 2);
  }

  // Draw border around the news photo
  ctx.restore(); // restores clipping mask
  
  ctx.beginPath();
  ctx.moveTo(px + r, py);
  ctx.arcTo(px + pw, py, px + pw, py + ph, r);
  ctx.arcTo(px + pw, py + ph, px, py + ph, r);
  ctx.arcTo(px, py + ph, px, py, r);
  ctx.arcTo(px, py, px + pw, py, r);
  ctx.closePath();
  ctx.lineWidth = 2; // Thin white border matching the original design
  ctx.strokeStyle = '#ffffff';
  ctx.stroke();

  // 7. Draw Sub-Headline and Headline (Centered text wrapping)
  const textX = canvas.width / 2;
  const maxWidth = 900;
  
  // Wrap Sub-Headline if present
  let subLines = [];
  const subLineHeight = state.subFontSize * 1.45;
  const subFontString = `600 ${state.subFontSize}px "${state.subHeadlineFont}", "SolaimanLipi", "Kalpurush", "Vrinda", "Siyam Rupali", "Nikosh", sans-serif`;
  if (state.subHeadline && state.subHeadline.trim() !== '') {
    subLines = wrapText(state.subHeadline, maxWidth, subFontString, ctx);
  }
  
  // Wrap Headline
  const lineHeight = state.fontSize * 1.45;
  const headlineFontString = `700 ${state.fontSize}px "${state.headlineFont}", "SolaimanLipi", "Kalpurush", "Vrinda", "Siyam Rupali", "Nikosh", sans-serif`;
  const lines = wrapText(state.headline, maxWidth, headlineFontString, ctx);
  
  // Calculate total height of the text block
  const gap = 35;
  const totalHeight = (subLines.length > 0 ? (subLines.length * subLineHeight) + gap : 0) + (lines.length * lineHeight);
  
  const centerY = 835; // Center of the space between image and divider
  let currentY = centerY - (totalHeight / 2) + (subLines.length > 0 ? subLineHeight * 0.85 : lineHeight * 0.85);
  
  // Draw Sub-Headline
  if (subLines.length > 0) {
    ctx.fillStyle = state.subHeadlineColor;
    ctx.textAlign = 'center';
    ctx.font = subFontString;
    for (let i = 0; i < subLines.length; i++) {
      ctx.fillText(subLines[i], textX, currentY);
      currentY += subLineHeight;
    }
    currentY += gap;
  }
  
  // Draw Headline
  ctx.fillStyle = state.headlineColor;
  ctx.textAlign = 'center';
  ctx.font = headlineFontString;
  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], textX, currentY);
    currentY += lineHeight;
  }

  // 8. Draw decorative divider line (Glowing horizontal gradient line fading out at both ends)
  ctx.beginPath();
  ctx.moveTo(100, 970);
  ctx.lineTo(900, 970);
  const lineGrad = ctx.createLinearGradient(100, 970, 900, 970);
  lineGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
  lineGrad.addColorStop(0.2, 'rgba(255, 255, 255, 0.2)');
  lineGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.95)');
  lineGrad.addColorStop(0.8, 'rgba(255, 255, 255, 0.2)');
  lineGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.strokeStyle = lineGrad;
  ctx.lineWidth = 5;
  ctx.stroke();

  // 9. Draw Web URL
  ctx.fillStyle = '#ffffff';
  ctx.font = `700 ${state.urlFontSize}px "${state.urlFont}", "SolaimanLipi", "Kalpurush", "Vrinda", "Siyam Rupali", "Nikosh", sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText(state.webUrl, canvas.width / 2, 1025);

  // 10. Draw Footer Ad Banner
  if (state.adImg) {
    ctx.drawImage(state.adImg, 0, 1080, canvas.width, 120);
  } else {
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(0, 1080, canvas.width, 120);
  }
}

// Event Bindings: Dates
newsDateInput.addEventListener('change', (e) => {
  if (autoBengaliDate.checked && e.target.value) {
    const selectedDate = new Date(e.target.value);
    state.dateText = formatDateToBengali(selectedDate);
    customDateText.value = state.dateText;
  }
  drawCard();
});

autoBengaliDate.addEventListener('change', (e) => {
  if (e.target.checked && newsDateInput.value) {
    const selectedDate = new Date(newsDateInput.value);
    state.dateText = formatDateToBengali(selectedDate);
    customDateText.value = state.dateText;
  }
  drawCard();
});

customDateText.addEventListener('input', (e) => {
  state.dateText = e.target.value;
  drawCard();
});

// Event Bindings: Image Upload
function handleNewsImageUpload(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    loadImage(event.target.result).then(img => {
      state.newsImg = img;
      imageAdjustmentsArea.classList.remove('disabled');
      resetToDefaultFit();
      drawCard();
    });
  };
  reader.readAsDataURL(file);
}

newsImageFile.addEventListener('change', (e) => {
  handleNewsImageUpload(e.target.files[0]);
});

// Drag & Drop
imageDropzone.addEventListener('dragover', (e) => {
  e.preventDefault();
  imageDropzone.classList.add('dragover');
});

imageDropzone.addEventListener('dragleave', () => {
  imageDropzone.classList.remove('dragover');
});

imageDropzone.addEventListener('drop', (e) => {
  e.preventDefault();
  imageDropzone.classList.remove('dragover');
  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
    handleNewsImageUpload(e.dataTransfer.files[0]);
  }
});

// Reset and Fit Controls
function resetToDefaultFit() {
  if (!state.newsImg) return;
  
  // Calculate default fit cover scale
  const boxW = 940;
  const boxH = 550;
  const scaleW = boxW / state.newsImg.width;
  const scaleH = boxH / state.newsImg.height;
  const coverScale = Math.max(scaleW, scaleH);
  
  state.newsImgSettings.scale = coverScale;
  state.newsImgSettings.offsetX = 0;
  state.newsImgSettings.offsetY = 0;
  
  // Update UI inputs
  imageZoom.value = Math.round(coverScale * 100);
  imagePanX.value = 0;
  imagePanY.value = 0;
  
  updateAdjustmentLabels();
}

function updateAdjustmentLabels() {
  zoomValDisplay.textContent = `${Math.round(state.newsImgSettings.scale * 100)}%`;
  panXDisplay.textContent = `${Math.round(state.newsImgSettings.offsetX)}px`;
  panYDisplay.textContent = `${Math.round(state.newsImgSettings.offsetY)}px`;
}

// Adjustments sliders
imageZoom.addEventListener('input', (e) => {
  state.newsImgSettings.scale = parseFloat(e.target.value) / 100;
  zoomValDisplay.textContent = `${e.target.value}%`;
  drawCard();
});

imagePanX.addEventListener('input', (e) => {
  state.newsImgSettings.offsetX = parseInt(e.target.value);
  panXDisplay.textContent = `${e.target.value}px`;
  drawCard();
});

imagePanY.addEventListener('input', (e) => {
  state.newsImgSettings.offsetY = parseInt(e.target.value);
  panYDisplay.textContent = `${e.target.value}px`;
  drawCard();
});

resetImageAdjustBtn.addEventListener('click', () => {
  resetToDefaultFit();
  drawCard();
});

fitImageBtn.addEventListener('click', () => {
  if (!state.newsImg) return;
  // Fit contain scale
  const boxW = 940;
  const boxH = 550;
  const scaleW = boxW / state.newsImg.width;
  const scaleH = boxH / state.newsImg.height;
  const containScale = Math.min(scaleW, scaleH);
  
  state.newsImgSettings.scale = containScale;
  state.newsImgSettings.offsetX = 0;
  state.newsImgSettings.offsetY = 0;
  
  imageZoom.value = Math.round(containScale * 100);
  imagePanX.value = 0;
  imagePanY.value = 0;
  
  updateAdjustmentLabels();
  drawCard();
});

// Event Bindings: Headline & Details
headlineInput.addEventListener('input', (e) => {
  state.headline = e.target.value;
  charCountDisplay.textContent = translateToBengaliDigits(state.headline.length);
  drawCard();
});

subHeadlineInput.addEventListener('input', (e) => {
  state.subHeadline = e.target.value;
  drawCard();
});

subHeadlineFontSize.addEventListener('input', (e) => {
  state.subFontSize = parseInt(e.target.value);
  subFontSizeDisplay.textContent = `${state.subFontSize}px`;
  drawCard();
});

// Color Presets Handlers
function setupColorPresets(presetsContainerId, colorInput, stateKey) {
  const container = document.getElementById(presetsContainerId);
  if (!container) return;
  const dots = container.querySelectorAll('.color-dot');
  
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      dots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
      const selectedColor = dot.getAttribute('data-color');
      state[stateKey] = selectedColor;
      colorInput.value = selectedColor;
      drawCard();
    });
  });

  colorInput.addEventListener('input', (e) => {
    // Remove active class from preset dots when custom color is chosen
    dots.forEach(d => d.classList.remove('active'));
    state[stateKey] = e.target.value;
    drawCard();
  });
}

setupColorPresets('subColorPresets', subHeadlineColor, 'subHeadlineColor');
setupColorPresets('headColorPresets', headlineColor, 'headlineColor');

headlineFontSize.addEventListener('input', (e) => {
  state.fontSize = parseInt(e.target.value);
  fontSizeDisplay.textContent = `${state.fontSize}px`;
  drawCard();
});

webUrlInput.addEventListener('input', (e) => {
  state.webUrl = e.target.value;
  drawCard();
});

urlFontSize.addEventListener('input', (e) => {
  state.urlFontSize = parseInt(e.target.value);
  urlFontSizeDisplay.textContent = `${state.urlFontSize}px`;
  drawCard();
});

// Function to dynamically load and redraw
function loadFontAndRedraw(fontFamily, weight = '400') {
  if (document.fonts) {
    // Attempt to load the font family before drawing
    document.fonts.load(`${weight} 16px "${fontFamily}"`).then(() => {
      drawCard();
    }).catch(() => {
      drawCard(); // Fallback if loading fails
    });
  } else {
    drawCard();
  }
}

dateFontFamily.addEventListener('change', (e) => {
  state.dateFont = e.target.value;
  loadFontAndRedraw(state.dateFont, '700');
});

subHeadlineFontFamily.addEventListener('change', (e) => {
  state.subHeadlineFont = e.target.value;
  loadFontAndRedraw(state.subHeadlineFont, '600');
});

headlineFontFamily.addEventListener('change', (e) => {
  state.headlineFont = e.target.value;
  loadFontAndRedraw(state.headlineFont, '700');
});

urlFontFamily.addEventListener('change', (e) => {
  state.urlFont = e.target.value;
  loadFontAndRedraw(state.urlFont, '700');
});

// Event Bindings: Preset & Custom Ads
const adPresetOptions = document.querySelectorAll('.ad-preset-option');
const customAdOption = document.getElementById('customAdOption');
const customAdFile = document.getElementById('customAdFile');

adPresetOptions.forEach(option => {
  option.addEventListener('click', (e) => {
    // Ignore click if it's the custom input wrapper itself triggering
    if (option.id === 'customAdOption' && e.target.tagName !== 'DIV' && e.target.tagName !== 'SPAN') {
      return;
    }
    
    adPresetOptions.forEach(opt => opt.classList.remove('active'));
    
    if (option.id === 'customAdOption') {
      customAdFile.click();
    } else {
      option.classList.add('active');
      const adPath = option.getAttribute('data-ad-path');
      loadImage(adPath).then(img => {
        state.adImg = img;
        drawCard();
      });
    }
  });
});

customAdFile.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (event) => {
    loadImage(event.target.result).then(img => {
      state.adImg = img;
      adPresetOptions.forEach(opt => opt.classList.remove('active'));
      customAdOption.classList.add('active');
      drawCard();
    });
  };
  reader.readAsDataURL(file);
});

// Theme Management
themeToggleBtn.addEventListener('click', () => {
  const currentTheme = document.body.getAttribute('data-theme') || 'dark';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.body.setAttribute('data-theme', newTheme);
  
  // Redraw card with slight adjustments if logo invert depends on it
  setTimeout(drawCard, 50);
});

// Image Download Utility
downloadPngBtn.addEventListener('click', () => {
  // Simple micro-animation state
  downloadPngBtn.classList.add('loading');
  const span = downloadPngBtn.querySelector('span');
  const oldText = span.textContent;
  span.textContent = 'ডাউনলোড হচ্ছে...';
  
  setTimeout(() => {
    try {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Khulna_Gazette_News_${new Date().toISOString().slice(0,10)}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      alert("ডাউনলোড করতে ব্যর্থ হয়েছে: " + e.message);
    } finally {
      downloadPngBtn.classList.remove('loading');
      span.textContent = oldText;
    }
  }, 600);
});

// Login & Session Management
const loginOverlay = document.getElementById('loginOverlay');
const appContainer = document.querySelector('.app-container');
const loginForm = document.getElementById('loginForm');
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const loginErrorMsg = document.getElementById('loginErrorMsg');
const logoutBtn = document.getElementById('logoutBtn');

// Define correct credentials
const VALID_EMAIL = 'admin@khulnagazette.com';
const VALID_PASSWORD = 'admin123';

function checkLoginState() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  if (isLoggedIn) {
    loginOverlay.classList.add('hidden');
    appContainer.classList.remove('hidden');
    // Draw the card to ensure it renders on login
    setTimeout(drawCard, 100);
  } else {
    loginOverlay.classList.remove('hidden');
    appContainer.classList.add('hidden');
  }
}

// Handle Login Form Submit
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = loginEmail.value.trim();
    const password = loginPassword.value;

    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      // Clear error
      loginErrorMsg.style.display = 'none';
      // Set session
      localStorage.setItem('isLoggedIn', 'true');
      // Show app
      checkLoginState();
    } else {
      // Show error message
      loginErrorMsg.style.display = 'block';
      // Clear password field
      loginPassword.value = '';
    }
  });
}

// Handle Logout Click
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('isLoggedIn');
    checkLoginState();
  });
}

// Initialize Login State check
checkLoginState();

// Redraw canvas when fonts are fully loaded to avoid broken/fallback text layout
if (document.fonts) {
  document.fonts.ready.then(() => {
    drawCard();
  });
}
