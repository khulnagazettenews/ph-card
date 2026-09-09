'use client';

import { useEffect, useRef, useCallback } from 'react';

const BANGLA_FONT_FALLBACKS = ', "Noto Serif Bengali", "Hind Siliguri", "SolaimanLipi", "Siyam Rupali", "Kalpurush", "AdorshoLipi", "Anek Bangla", "Tiro Bangla", "Baloo Da 2", "Mina", "Galada", "Atma", "Nirmala UI", "Vrinda", "Shonar Bangla", "Bangla Sangam MN", "Kohinoor Bangla", "Bangla MN", sans-serif';

function wrapText(text, maxWidth, fontSpec, ctx) {
  if (!text) return [];
  ctx.save();
  ctx.font = fontSpec;
  const words = text.split(' ');
  let lines = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && i > 0) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  ctx.restore();
  return lines;
}

export default function CardCanvas({ state, updateState, canvasRef }) {
  const isDraggingCanvasRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const initialOffsetRef = useRef({ x: 0, y: 0 });

  const drawCard = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Clear Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // If Card Type is 'quote'
    if (state.cardType === 'quote') {
      // 1. Clear Canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 2. Draw Card Background image
      if (state.quoteBgImg) {
        ctx.drawImage(state.quoteBgImg, 0, 0, canvas.width, 1080);
      } else if (state.bgImg) {
        ctx.drawImage(state.bgImg, 0, 0, canvas.width, 1080);
      } else {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, 1080);
      }

      // 3. Date (Top Right)
      if (state.dateText) {
        ctx.save();
        ctx.fillStyle = '#111111';
        ctx.font = `700 28px "${state.dateFont}"${BANGLA_FONT_FALLBACKS}`;
        ctx.textAlign = 'right';
        ctx.fillText(state.dateText, 960, 68);

        // Thin red line under date
        ctx.beginPath();
        ctx.moveTo(760, 92);
        ctx.lineTo(960, 92);
        ctx.strokeStyle = '#d92323';
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.restore();
      }

      // 4. Exact Solid Red Double Quote Symbol (matching the reference image 66 shape)
      ctx.save();
      ctx.fillStyle = '#d92323';

      // First quote comma circle & tail
      ctx.beginPath();
      ctx.arc(118, 105, 20, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(102, 114);
      ctx.quadraticCurveTo(90, 142, 114, 148);
      ctx.quadraticCurveTo(106, 134, 118, 124);
      ctx.closePath();
      ctx.fill();

      // Second quote comma circle & tail
      ctx.beginPath();
      ctx.arc(160, 105, 20, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(144, 114);
      ctx.quadraticCurveTo(132, 142, 156, 148);
      ctx.quadraticCurveTo(148, 134, 160, 124);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // 5. Quote Text (Left Side Main Body)
      const quoteX = 95;
      const maxQuoteWidth = 670; // Leaves space for person image on right
      const quoteFontSize = state.quoteFontSize || 38;
      const quoteFontString = `700 ${quoteFontSize}px "${state.headlineFont}"${BANGLA_FONT_FALLBACKS}`;

      const quoteLines = wrapText(state.quoteText, maxQuoteWidth, quoteFontString, ctx);
      const quoteLineHeight = Math.round(quoteFontSize * 1.42);

      ctx.save();
      ctx.fillStyle = state.quoteTextColor || '#111111';
      ctx.font = quoteFontString;
      ctx.textAlign = 'left';

      let currentY = 225;
      for (let i = 0; i < quoteLines.length; i++) {
        ctx.fillText(quoteLines[i], quoteX, currentY);
        currentY += quoteLineHeight;
      }
      ctx.restore();

      // Red separator line under Quote Text
      const lineY = Math.max(currentY + 20, 580);
      ctx.beginPath();
      ctx.moveTo(quoteX, lineY);
      ctx.lineTo(quoteX + 310, lineY);
      ctx.strokeStyle = '#d92323';
      ctx.lineWidth = 3.5;
      ctx.stroke();

      // 6. Person Name & Designation (Under Red Line)
      let nameY = lineY + 45;

      // Person Name (Bold)
      if (state.personName) {
        ctx.save();
        ctx.fillStyle = state.personNameColor || '#111111';
        ctx.font = `700 ${state.personNameFontSize || 34}px "${state.subHeadlineFont}"${BANGLA_FONT_FALLBACKS}`;
        ctx.textAlign = 'left';
        ctx.fillText(state.personName, quoteX, nameY);
        ctx.restore();
      }

      // Person Designation (Multiple lines support)
      if (state.personDesignation) {
        ctx.save();
        ctx.fillStyle = state.personDesignationColor || '#111111';
        ctx.font = `600 ${state.personDesignationFontSize || 25}px "${state.subHeadlineFont}"${BANGLA_FONT_FALLBACKS}`;
        ctx.textAlign = 'left';

        const desigLines = state.personDesignation.split('\n');
        const desigLineHeight = Math.round((state.personDesignationFontSize || 25) * 1.35);
        let desigY = nameY + (state.personNameFontSize || 34) + 8;

        for (let i = 0; i < desigLines.length; i++) {
          ctx.fillText(desigLines[i], quoteX, desigY);
          desigY += desigLineHeight;
        }
        ctx.restore();
      }

      // 7. Person Photo (Right Bottom cutout overlay)
      if (state.personImg) {
        ctx.save();
        const pX = 680 + (state.personImgSettings?.offsetX || 0);
        const pY = 710 + (state.personImgSettings?.offsetY || 0);
        const pScale = state.personImgSettings?.scale || 1.0;

        ctx.translate(pX, pY);
        ctx.scale(pScale, pScale);
        ctx.drawImage(state.personImg, -state.personImg.width / 2, -state.personImg.height / 2);
        ctx.restore();
      } else {
        // Placeholder for Person Image
        ctx.save();
        ctx.fillStyle = 'rgba(200, 200, 200, 0.35)';
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(720, 680, 175, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#64748b';
        ctx.font = `600 20px "${state.subHeadlineFont}"${BANGLA_FONT_FALLBACKS}`;
        ctx.textAlign = 'center';
        ctx.fillText('ব্যক্তির ছবি আপলোড করুন', 720, 685);
        ctx.restore();
      }

      // 8. Logo at Bottom Left (Khulna Gazette Brand logo + Tagline)
      if (state.logoImg) {
        ctx.drawImage(state.logoImg, 65, 825, 300, 85);

        // Tagline text with decorative lines
        ctx.save();
        ctx.fillStyle = '#475569';
        ctx.font = `600 16px "${state.subHeadlineFont}"${BANGLA_FONT_FALLBACKS}`;
        ctx.textAlign = 'center';
        ctx.fillText('সত্যের পথে, মানুষের পাশে', 215, 925);

        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(95, 920);
        ctx.lineTo(135, 920);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(295, 920);
        ctx.lineTo(335, 920);
        ctx.stroke();
        ctx.restore();
      }

      // 9. Footer Ad Banner (Bottom 120px)
      if (state.adImg) {
        ctx.drawImage(state.adImg, 0, 1080, canvas.width, 120);
      } else {
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(0, 1080, canvas.width, 120);
      }

      return;
    }

    // --- DEFAULT NEWS CARD RENDERING ---
    // 1. Clear Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 2. Draw Card Background image (assets/card_bg.jpg)
    if (state.bgImg) {
      ctx.drawImage(state.bgImg, 0, 0, canvas.width, 1080);
    } else {
      // Fallback background
      ctx.fillStyle = '#d8f0ea';
      ctx.fillRect(0, 0, canvas.width, 290);
      ctx.fillStyle = '#d92323';
      ctx.fillRect(0, 290, canvas.width, 790);
    }

    // 3. Draw Logo (Left side)
    if (state.logoImg) {
      ctx.drawImage(state.logoImg, 25, 35, 300, 85);
    }

    // 4. Draw Date (Right side)
    if (state.dateText) {
      ctx.save();
      ctx.fillStyle = '#111111';
      ctx.font = `700 34px "${state.dateFont}"${BANGLA_FONT_FALLBACKS}`;
      ctx.textAlign = 'right';
      ctx.fillText(state.dateText, 950, 90);
      ctx.restore();
    }

    // 5. Draw News Photo Area (With rounded corners clipping mask r=28)
    const px = 30, py = 140, pw = 940, ph = 550, r = 28;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(px + r, py);
    ctx.arcTo(px + pw, py, px + pw, py + ph, r);
    ctx.arcTo(px + pw, py + ph, px, py + ph, r);
    ctx.arcTo(px, py + ph, px, py, r);
    ctx.arcTo(px, py, px + pw, py, r);
    ctx.closePath();
    ctx.clip();

    if (state.newsImg) {
      ctx.save();
      ctx.translate(px + pw / 2 + state.newsImgSettings.offsetX, py + ph / 2 + state.newsImgSettings.offsetY);
      ctx.scale(state.newsImgSettings.scale, state.newsImgSettings.scale);
      ctx.drawImage(state.newsImg, -state.newsImg.width / 2, -state.newsImg.height / 2);
      ctx.restore();
    } else {
      const placeGrad = ctx.createLinearGradient(px, py, px, py + ph);
      placeGrad.addColorStop(0, '#334155');
      placeGrad.addColorStop(1, '#1e293b');
      ctx.fillStyle = placeGrad;
      ctx.fillRect(px, py, pw, ph);

      ctx.fillStyle = '#94a3b8';
      ctx.font = `600 24px "${state.subHeadlineFont}"${BANGLA_FONT_FALLBACKS}`;
      ctx.textAlign = 'center';
      ctx.fillText('সংবাদের মূল ছবি এখানে দেখতে পাবেন', px + pw / 2, py + ph / 2);
    }
    ctx.restore();

    // Draw border around photo frame
    ctx.beginPath();
    ctx.moveTo(px + r, py);
    ctx.arcTo(px + pw, py, px + pw, py + ph, r);
    ctx.arcTo(px + pw, py + ph, px, py + ph, r);
    ctx.arcTo(px, py + ph, px, py, r);
    ctx.arcTo(px, py, px + pw, py, r);
    ctx.closePath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();


    // 4. Headline & Sub-Headline Area (Headline on TOP, Sub-Headline UNDERNEATH)
    const textX = canvas.width / 2;
    const maxWidth = 900;
    const maxAvailableHeight = 260;

    let effectiveFontSize = state.fontSize;
    let effectiveSubFontSize = state.subFontSize;

    let subLines = [];
    let lines = [];
    let subLineHeight = 0;
    let headlineLineHeight = 0;
    let gap = 0;
    let subBlockHeight = 0;
    let headBlockHeight = 0;
    let totalHeight = 0;

    for (let attempt = 0; attempt < 2; attempt++) {
      headlineLineHeight = Math.round(effectiveFontSize * 1.38);
      subLineHeight = Math.round(effectiveSubFontSize * 1.35);

      const headlineFontString = `700 ${effectiveFontSize}px "${state.headlineFont}"${BANGLA_FONT_FALLBACKS}`;
      const subFontString = `700 ${effectiveSubFontSize}px "${state.subHeadlineFont}"${BANGLA_FONT_FALLBACKS}`;

      lines = wrapText(state.headline, maxWidth, headlineFontString, ctx);

      if (state.subHeadline && state.subHeadline.trim() !== '') {
        subLines = wrapText(state.subHeadline, maxWidth, subFontString, ctx);
      } else {
        subLines = [];
      }

      gap = subLines.length > 0 ? Math.round(Math.min(26, Math.max(14, effectiveSubFontSize * 0.45))) : 0;
      headBlockHeight = lines.length > 0 ? (lines.length - 1) * headlineLineHeight + (effectiveFontSize * 1.0) : 0;
      subBlockHeight = subLines.length > 0 ? (subLines.length - 1) * subLineHeight + (effectiveSubFontSize * 1.0) : 0;
      totalHeight = headBlockHeight + gap + subBlockHeight;

      if (attempt === 0 && totalHeight > maxAvailableHeight) {
        const scaleFactor = Math.max(0.80, maxAvailableHeight / totalHeight);
        effectiveFontSize = Math.max(22, Math.round(state.fontSize * scaleFactor));
        effectiveSubFontSize = Math.max(16, Math.round(state.subFontSize * scaleFactor));
      } else {
        break;
      }
    }

    const minTopY = 715;
    const maxBottomY = 960;
    const centerSpaceY = 834;

    let topY = centerSpaceY - (totalHeight / 2);
    topY = Math.max(minTopY, Math.min(topY, maxBottomY - totalHeight));

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
    ctx.shadowBlur = 3;
    ctx.shadowOffsetY = 2;

    // 1. Draw Main Headline (Top)
    if (lines.length > 0) {
      const headlineFontString = `700 ${effectiveFontSize}px "${state.headlineFont}"${BANGLA_FONT_FALLBACKS}`;
      ctx.fillStyle = state.headlineColor;
      ctx.textAlign = 'center';
      ctx.font = headlineFontString;

      let currentY = topY + (effectiveFontSize * 0.82);
      for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], textX, currentY);
        if (i < lines.length - 1) {
          currentY += headlineLineHeight;
        }
      }
    }

    // 2. Draw Sub-Headline (Bottom)
    if (subLines.length > 0) {
      const subFontString = `700 ${effectiveSubFontSize}px "${state.subHeadlineFont}"${BANGLA_FONT_FALLBACKS}`;
      ctx.fillStyle = state.subHeadlineColor;
      ctx.textAlign = 'center';
      ctx.font = subFontString;

      let currentY = lines.length > 0
        ? topY + headBlockHeight + gap + (effectiveSubFontSize * 0.82)
        : topY + (effectiveSubFontSize * 0.82);

      for (let i = 0; i < subLines.length; i++) {
        ctx.fillText(subLines[i], textX, currentY);
        if (i < subLines.length - 1) {
          currentY += subLineHeight;
        }
      }
    }
    ctx.restore();

    // 5. Decorative Divider Line
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

    // 6. Web URL
    ctx.fillStyle = '#ffffff';
    ctx.font = `700 ${state.urlFontSize}px "${state.urlFont}"${BANGLA_FONT_FALLBACKS}`;
    ctx.textAlign = 'center';
    ctx.fillText(state.webUrl, canvas.width / 2, 1025);

    // 7. Footer Ad Banner
    if (state.adImg) {
      ctx.drawImage(state.adImg, 0, 1080, canvas.width, 120);
    } else {
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(0, 1080, canvas.width, 120);
    }
  }, [state, canvasRef]);

  useEffect(() => {
    drawCard();

    if (typeof document !== 'undefined' && document.fonts) {
      document.fonts.ready.then(() => {
        drawCard();
      });

      const fontsToLoad = [
        `700 50px "${state.headlineFont}"`,
        `700 30px "${state.subHeadlineFont}"`,
        `700 34px "${state.dateFont}"`,
        `700 22px "${state.urlFont}"`
      ];

      fontsToLoad.forEach(fontSpec => {
        document.fonts.load(fontSpec, 'খুলনা গেজেট যুক্তবর্ণ')
          .then(() => drawCard())
          .catch(() => drawCard());
      });

      const t1 = setTimeout(drawCard, 100);
      const t2 = setTimeout(drawCard, 350);
      const t3 = setTimeout(drawCard, 800);
      const t4 = setTimeout(drawCard, 1500);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
      };
    }
  }, [drawCard, state.headlineFont, state.subHeadlineFont, state.dateFont, state.urlFont]);


  // Touch & Mouse direct canvas dragging
  const getCanvasCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = (e.touches && e.touches.length > 0) ? e.touches[0].clientX : e.clientX;
    const clientY = (e.touches && e.touches.length > 0) ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height)
    };
  };

  const handleStartDrag = (e) => {
    const coords = getCanvasCoordinates(e);
    if (state.cardType === 'quote') {
      if (!state.personImg) return;
      isDraggingCanvasRef.current = true;
      dragStartRef.current = coords;
      initialOffsetRef.current = {
        x: state.personImgSettings?.offsetX || 0,
        y: state.personImgSettings?.offsetY || 0
      };
    } else {
      if (!state.newsImg) return;
      isDraggingCanvasRef.current = true;
      dragStartRef.current = coords;
      initialOffsetRef.current = {
        x: state.newsImgSettings.offsetX,
        y: state.newsImgSettings.offsetY
      };
    }
  };

  const handleMoveDrag = useCallback((e) => {
    if (!isDraggingCanvasRef.current) return;
    if (e.touches && e.cancelable) e.preventDefault();
    const coords = getCanvasCoordinates(e);
    const deltaX = coords.x - dragStartRef.current.x;
    const deltaY = coords.y - dragStartRef.current.y;

    let newX = Math.round(initialOffsetRef.current.x + deltaX);
    let newY = Math.round(initialOffsetRef.current.y + deltaY);

    newX = Math.max(-600, Math.min(600, newX));
    newY = Math.max(-600, Math.min(600, newY));

    if (state.cardType === 'quote') {
      if (!state.personImg) return;
      updateState({
        personImgSettings: {
          ...state.personImgSettings,
          offsetX: newX,
          offsetY: newY
        }
      });
    } else {
      if (!state.newsImg) return;
      updateState({
        newsImgSettings: {
          ...state.newsImgSettings,
          offsetX: newX,
          offsetY: newY
        }
      });
    }
  }, [state.cardType, state.personImg, state.personImgSettings, state.newsImg, state.newsImgSettings, updateState]);

  const handleEndDrag = () => {
    isDraggingCanvasRef.current = false;
  };

  useEffect(() => {
    const handleWindowMouseMove = (e) => handleMoveDrag(e);
    const handleWindowMouseUp = () => handleEndDrag();
    const handleWindowTouchMove = (e) => handleMoveDrag(e);
    const handleWindowTouchEnd = () => handleEndDrag();

    window.addEventListener('mousemove', handleWindowMouseMove);
    window.addEventListener('mouseup', handleWindowMouseUp);
    window.addEventListener('touchmove', handleWindowTouchMove, { passive: false });
    window.addEventListener('touchend', handleWindowTouchEnd);

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
      window.removeEventListener('touchmove', handleWindowTouchMove);
      window.removeEventListener('touchend', handleWindowTouchEnd);
    };
  }, [handleMoveDrag]);

  return (
    <section className="preview-panel">
      <div className="preview-container">
        <div className="preview-header">
          <h3>লাইভ প্রিভিউ (Live Preview)</h3>
          <span className="badge-status">Pixel-Perfect Canvas</span>
        </div>

        <div className="canvas-wrapper">
          <canvas
            id="cardCanvas"
            ref={canvasRef}
            width={1000}
            height={1200}
            onMouseDown={handleStartDrag}
            onTouchStart={handleStartDrag}
          />
        </div>

        <div className="preview-helper-text">
          * কার্ডটি সামাজিক যোগাযোগ মাধ্যমে ডাউনলোডের জন্য উচ্চ রেজোলিউশনে রেন্ডার হচ্ছে।
        </div>
      </div>
    </section>
  );
}
