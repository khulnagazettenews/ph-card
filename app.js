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

const UNICODE_DEFAULT_HEADLINE = 'জুলাই গণহত্যার বিচার করতে সরকার প্রতিশ্রুতিবদ্ধ: রিজভী';
const ANSI_DEFAULT_HEADLINE = 'RjvB MYnZ¨vi wePvi Ki‡Z miKvi cÖwZkÖæZŸ×: wiRfx';

const BANGLA_FONT_FALLBACKS = ', "Noto Serif Bengali", "Hind Siliguri", "SolaimanLipi", "Siyam Rupali", "Kalpurush", "AdorshoLipi", "Anek Bangla", "Tiro Bangla", "Baloo Da 2", "Mina", "Galada", "Atma", "Nirmala UI", "Vrinda", "Shonar Bangla", "Bangla Sangam MN", "Kohinoor Bangla", "Bangla MN", sans-serif';

function isAnsiFont(fontName) {
  return fontName === 'SutonnyMJ' || fontName === 'SutonnyOMJ';
}

function updateHeadlineForFont(newFont) {
  const currentVal = headlineInput.value.trim();
  
  if (isAnsiFont(newFont)) {
    if (currentVal === UNICODE_DEFAULT_HEADLINE) {
      state.headline = ANSI_DEFAULT_HEADLINE;
      headlineInput.value = ANSI_DEFAULT_HEADLINE;
      charCountDisplay.textContent = translateToBengaliDigits(ANSI_DEFAULT_HEADLINE.length);
    }
  } else {
    if (currentVal === ANSI_DEFAULT_HEADLINE) {
      state.headline = UNICODE_DEFAULT_HEADLINE;
      headlineInput.value = UNICODE_DEFAULT_HEADLINE;
      charCountDisplay.textContent = translateToBengaliDigits(UNICODE_DEFAULT_HEADLINE.length);
    }
  }
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
  subFontSize: 30,
  subHeadlineColor: '#f8fafc',
  headlineColor: '#ffffff',
  headline: 'RjvB MYnZ¨vi wePvi Ki‡Z miKvi cÖwZkÖæZŸ×: wiRfx',
  fontSize: 50,
  urlFontSize: 22,
  webUrl: 'www.khulnagazette.com/www.khulnagazette.net',
  dateFont: 'Noto Serif Bengali',
  subHeadlineFont: 'SutonnyMJ',
  headlineFont: 'SutonnyMJ',
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

// Sync input element font families with state defaults
headlineInput.style.fontFamily = `"${state.headlineFont}", var(--font-bangla)`;
subHeadlineInput.style.fontFamily = `"${state.subHeadlineFont}", var(--font-bangla)`;
customDateText.style.fontFamily = `"${state.dateFont}", var(--font-bangla)`;

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
  const paragraphs = text.split('\n');
  const lines = [];
  
  for (let p = 0; p < paragraphs.length; p++) {
    const words = paragraphs[p].split(' ');
    let line = '';
    
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
  }
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
  ctx.font = `700 34px "${state.dateFont}"${BANGLA_FONT_FALLBACKS}`;
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

  // 7. Draw Sub-Headline and Headline (Smart Adaptive Centering & Spacing)
  const textX = canvas.width / 2;
  const maxWidth = 900;
  const maxAvailableHeight = 260; // Available height between image (690px) and divider (970px)
  
  let effectiveSubFontSize = state.subFontSize;
  let effectiveFontSize = state.fontSize;
  
  let subLines = [];
  let lines = [];
  let subLineHeight = 0;
  let headlineLineHeight = 0;
  let gap = 0;
  let subBlockHeight = 0;
  let headBlockHeight = 0;
  let totalHeight = 0;
  
  // Calculate text wrapping and total height with optional auto-fit scaling
  for (let attempt = 0; attempt < 2; attempt++) {
    subLineHeight = Math.round(effectiveSubFontSize * 1.35);
    headlineLineHeight = Math.round(effectiveFontSize * 1.38);
    
    const subFontString = `700 ${effectiveSubFontSize}px "${state.subHeadlineFont}"${BANGLA_FONT_FALLBACKS}`;
    const headlineFontString = `700 ${effectiveFontSize}px "${state.headlineFont}"${BANGLA_FONT_FALLBACKS}`;
    
    if (state.subHeadline && state.subHeadline.trim() !== '') {
      subLines = wrapText(state.subHeadline, maxWidth, subFontString, ctx);
    } else {
      subLines = [];
    }
    
    lines = wrapText(state.headline, maxWidth, headlineFontString, ctx);
    
    gap = subLines.length > 0 ? Math.round(Math.min(26, Math.max(14, effectiveSubFontSize * 0.45))) : 0;
    subBlockHeight = subLines.length > 0 ? (subLines.length - 1) * subLineHeight + (effectiveSubFontSize * 1.0) : 0;
    headBlockHeight = lines.length > 0 ? (lines.length - 1) * headlineLineHeight + (effectiveFontSize * 1.0) : 0;
    totalHeight = subBlockHeight + gap + headBlockHeight;
    
    // Auto-fit scale down only if total height exceeds available vertical area (260px)
    if (attempt === 0 && totalHeight > maxAvailableHeight) {
      const scaleFactor = Math.max(0.80, maxAvailableHeight / totalHeight);
      effectiveSubFontSize = Math.max(16, Math.round(state.subFontSize * scaleFactor));
      effectiveFontSize = Math.max(22, Math.round(state.fontSize * scaleFactor));
    } else {
      break;
    }
  }
  
  // Vertical bounds and centering (3 suta = 36px gap below 690px news image border)
  const minTopY = subLines.length > 0 ? 726 : 708; // 3 suta (36px) below image when subheadline is present
  const maxBottomY = 960; // Clear gap above divider line
  const centerSpaceY = 834; // Midpoint of Y=726 to Y=960
  
  let topY = centerSpaceY - (totalHeight / 2);
  topY = Math.max(minTopY, Math.min(topY, maxBottomY - totalHeight));
  
  // Apply text shadow for enhanced legibility
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
  ctx.shadowBlur = 3;
  ctx.shadowOffsetY = 2;
  
  // Draw Sub-Headline
  if (subLines.length > 0) {
    const subFontString = `700 ${effectiveSubFontSize}px "${state.subHeadlineFont}"${BANGLA_FONT_FALLBACKS}`;
    ctx.fillStyle = state.subHeadlineColor;
    ctx.textAlign = 'center';
    ctx.font = subFontString;
    
    let currentY = topY + (effectiveSubFontSize * 0.82);
    for (let i = 0; i < subLines.length; i++) {
      ctx.fillText(subLines[i], textX, currentY);
      if (i < subLines.length - 1) {
        currentY += subLineHeight;
      }
    }
  }
  
  // Draw Headline
  if (lines.length > 0) {
    const headlineFontString = `700 ${effectiveFontSize}px "${state.headlineFont}"${BANGLA_FONT_FALLBACKS}`;
    ctx.fillStyle = state.headlineColor;
    ctx.textAlign = 'center';
    ctx.font = headlineFontString;
    
    let currentY = subLines.length > 0 
      ? topY + subBlockHeight + gap + (effectiveFontSize * 0.82)
      : topY + (effectiveFontSize * 0.82);
      
    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], textX, currentY);
      if (i < lines.length - 1) {
        currentY += headlineLineHeight;
      }
    }
  }
  ctx.restore();

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
  ctx.font = `700 ${state.urlFontSize}px "${state.urlFont}"${BANGLA_FONT_FALLBACKS}`;
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
  // 1. Draw immediately using standard/system fallback fonts
  drawCard();

  if (document.fonts) {
    // 2. Try loading the font using Web Fonts API
    const fontSpec = `${weight} 16px "${fontFamily}"`;
    document.fonts.load(fontSpec, 'খুলনা গেজেট যুক্তবর্ণ')
      .then(() => {
        drawCard();
      })
      .catch((err) => {
        console.warn("Font loading error for specs:", fontSpec, err);
        drawCard();
      });

    // 3. Robust redraw intervals as font files stream from CDNs
    setTimeout(drawCard, 50);
    setTimeout(drawCard, 150);
    setTimeout(drawCard, 350);
    setTimeout(drawCard, 700);
    setTimeout(drawCard, 1500);
  } else {
    setTimeout(drawCard, 100);
    setTimeout(drawCard, 400);
  }
}

dateFontFamily.addEventListener('change', (e) => {
  state.dateFont = e.target.value;
  customDateText.style.fontFamily = `"${state.dateFont}", var(--font-bangla)`;
  loadFontAndRedraw(state.dateFont, '700');
});

subHeadlineFontFamily.addEventListener('change', (e) => {
  state.subHeadlineFont = e.target.value;
  subHeadlineInput.style.fontFamily = `"${state.subHeadlineFont}", var(--font-bangla)`;
  loadFontAndRedraw(state.subHeadlineFont, '600');
});

headlineFontFamily.addEventListener('change', (e) => {
  state.headlineFont = e.target.value;
  headlineInput.style.fontFamily = `"${state.headlineFont}", var(--font-bangla)`;
  updateHeadlineForFont(state.headlineFont);
  loadFontAndRedraw(state.headlineFont, '700');
});

urlFontFamily.addEventListener('change', (e) => {
  state.urlFont = e.target.value;
  webUrlInput.style.fontFamily = `"${state.urlFont}", var(--font-bangla)`;
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
