'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef, useCallback } from 'react';
import Header from '@/components/Header';
import CardCanvas from '@/components/CardCanvas';
import ControlPanel from '@/components/ControlPanel';

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

function isAnsiFont(fontName) {
  return fontName === 'SutonnyMJ' || fontName === 'SutonnyOMJ';
}

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

export default function GeneratorPage() {
  const { status } = useSession();
  const router = useRouter();

  const canvasRef = useRef(null);

  const [cardState, setCardState] = useState({
    logoImg: null,
    bgImg: null,
    newsImg: null,
    adImg: null,
    activeAdKey: 'ad1',
    newsImgSettings: {
      scale: 1.0,
      offsetX: 0,
      offsetY: 0
    },
    selectedDate: '',
    autoBengaliDate: true,
    dateText: '',
    cardType: 'news', // 'news' or 'quote'
    // Quote Card state fields
    quoteText: 'আজকে অনেক সংকটের মধ্যেও আমাদের প্রধানমন্ত্রী তারেক রহমান দেশের নেতৃত্ব দিচ্ছেন। তিনি যে কর্মসূচি ও রাষ্ট্রীয় দায়িত্ব সুচারুভাবে পালন করছেন, তার মাধ্যমে প্রমাণিত হয়েছে— একজন দেশপ্রেমিক ব্যক্তিত্ব ক্ষমতায় থাকলে জনগণের স্বার্থকেই সবচেয়ে বড় করে দেখেন।',
    personName: 'রুহুল কবীর রিজভী',
    personDesignation: 'প্রধানমন্ত্রীর উপদেষ্টা ও ভারপ্রাপ্ত মহাসচিব\nবিএনপি',
    personImg: null,
    personImgSettings: {
      scale: 1.0,
      offsetX: 0,
      offsetY: 0
    },
    quoteFontSize: 36,
    personNameFontSize: 32,
    personDesignationFontSize: 24,
    quoteTextColor: '#111111',
    personNameColor: '#111111',
    personDesignationColor: '#111111',

    // News Card state fields
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
    urlFont: 'Hind Siliguri'
  });

  // Redirect to /login if unauthenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const updateState = useCallback((updates) => {
    setCardState(prev => {
      let newState = { ...prev, ...updates };

      // Auto date conversion update
      if (updates.selectedDate !== undefined || updates.autoBengaliDate !== undefined) {
        if (newState.autoBengaliDate && newState.selectedDate) {
          newState.dateText = formatDateToBengali(new Date(newState.selectedDate));
        }
      }

      // Font headline preset conversion
      if (updates.headlineFont !== undefined) {
        const currentVal = newState.headline.trim();
        if (isAnsiFont(updates.headlineFont)) {
          if (currentVal === UNICODE_DEFAULT_HEADLINE) {
            newState.headline = ANSI_DEFAULT_HEADLINE;
          }
        } else {
          if (currentVal === ANSI_DEFAULT_HEADLINE) {
            newState.headline = UNICODE_DEFAULT_HEADLINE;
          }
        }
      }

      return newState;
    });
  }, []);

  // Initial assets & date loading
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    const bengaliDate = formatDateToBengali(today);

    Promise.all([
      loadImage('/assets/logo.png').catch(() => null),
      loadImage('/assets/ad_road_home.png').catch(() => null),
      loadImage('/assets/card_bg.jpg').catch(() => null),
      loadImage('/assets/bg-image.png').catch(() => null)
    ]).then(([logo, ad1, bg, quoteBg]) => {
      setCardState(prev => ({
        ...prev,
        logoImg: logo,
        adImg: ad1,
        bgImg: bg,
        quoteBgImg: quoteBg,
        selectedDate: formattedDate,
        dateText: bengaliDate
      }));
    }).catch(err => console.error('Asset load error:', err));
  }, []);


  const handleNewsImageUpload = useCallback((file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      loadImage(e.target?.result).then(img => {
        const boxW = 940;
        const boxH = 550;
        const scaleW = boxW / img.width;
        const scaleH = boxH / img.height;
        const coverScale = Math.max(scaleW, scaleH);

        setCardState(prev => ({
          ...prev,
          newsImg: img,
          newsImgSettings: {
            scale: coverScale,
            offsetX: 0,
            offsetY: 0
          }
        }));
      });
    };
    reader.readAsDataURL(file);
  }, []);

  useEffect(() => {
    // Preload background removal assets for instant processing
    import('@imgly/background-removal').then(({ preload }) => {
      preload({ model: 'isnet_quint8', debug: false }).catch(() => {});
    }).catch(() => {});
  }, []);

  const handlePersonImageUpload = useCallback(async (file, autoRemoveBg = true) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const origDataUrl = e.target?.result;
      const originalImg = await loadImage(origDataUrl);
      const targetW = 600;
      const scaleW = targetW / originalImg.width;

      setCardState(prev => ({
        ...prev,
        isRemovingBg: autoRemoveBg,
        personImg: originalImg,
        personImgSettings: {
          scale: scaleW || 1.0,
          offsetX: 0,
          offsetY: 0
        }
      }));

      if (autoRemoveBg) {
        try {
          // Downscale high-resolution input images (max 800px) before feeding to model
          // This reduces ONNX tensor matrix sizes dramatically and makes background removal up to 20x faster!
          const MAX_DIM = 800;
          let width = originalImg.width;
          let height = originalImg.height;

          if (width > MAX_DIM || height > MAX_DIM) {
            if (width > height) {
              height = Math.round((height * MAX_DIM) / width);
              width = MAX_DIM;
            } else {
              width = Math.round((width * MAX_DIM) / height);
              height = MAX_DIM;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(originalImg, 0, 0, width, height);

          const cleanPngBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
          if (!cleanPngBlob) throw new Error('Failed to convert image to PNG');

          const { removeBackground } = await import('@imgly/background-removal');
          const blob = await removeBackground(cleanPngBlob, {
            model: 'isnet_quint8',
            debug: false,
            output: {
              format: 'image/png',
              quality: 0.8
            }
          });

          const blobReader = new FileReader();
          blobReader.onload = async (evt) => {
            const processedDataUrl = evt.target?.result;
            if (processedDataUrl) {
              const bgRemovedImg = await loadImage(processedDataUrl);
              const newScale = targetW / bgRemovedImg.width;

              setCardState(prev => ({
                ...prev,
                isRemovingBg: false,
                personImg: bgRemovedImg,
                personImgSettings: {
                  ...prev.personImgSettings,
                  scale: newScale
                }
              }));
            }
          };
          blobReader.readAsDataURL(blob);
        } catch (err) {
          console.error('Auto BG removal error:', err);
          setCardState(prev => ({ ...prev, isRemovingBg: false }));
        }
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const handleAdPresetChange = useCallback((adPath, key) => {
    loadImage(adPath).then(img => {
      setCardState(prev => ({
        ...prev,
        adImg: img,
        activeAdKey: key
      }));
    });
  }, []);

  const handleCustomAdUpload = useCallback((file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      loadImage(e.target?.result).then(img => {
        setCardState(prev => ({
          ...prev,
          adImg: img,
          activeAdKey: 'custom'
        }));
      });
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDownload = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Khulna_Gazette_News_${new Date().toISOString().slice(0, 10)}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      alert('ডাউনলোড করতে ব্যর্থ হয়েছে: ' + e.message);
    }
  }, []);

  if (status === 'loading') {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a', color: '#f8fafc', fontFamily: 'sans-serif' }}>
        <h2>লোড হচ্ছে...</h2>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="app-container">
      <Header />
      <main className="app-content">
        <ControlPanel
          state={cardState}
          updateState={updateState}
          onDownload={handleDownload}
          onImageUpload={handleNewsImageUpload}
          onPersonImageUpload={handlePersonImageUpload}
          onAdPresetChange={handleAdPresetChange}
          onCustomAdUpload={handleCustomAdUpload}
        />
        <CardCanvas
          state={cardState}
          updateState={updateState}
          canvasRef={canvasRef}
        />
      </main>
    </div>
  );
}
