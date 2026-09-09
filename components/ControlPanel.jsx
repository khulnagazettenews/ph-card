'use client';

import { useState } from 'react';

const BENGALI_DIGITS = {
  '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
  '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
};

function translateToBengaliDigits(str) {
  return str ? str.toString().split('').map(char => BENGALI_DIGITS[char] || char).join('') : '০';
}

export default function ControlPanel({ state, updateState, onDownload, onImageUpload, onPersonImageUpload, onAdPresetChange, onCustomAdUpload }) {
  const [downloading, setDownloading] = useState(false);

  const handleDownloadClick = () => {
    setDownloading(true);
    setTimeout(() => {
      onDownload();
      setDownloading(false);
    }, 600);
  };

  const handleResetAdjustments = () => {
    if (state.cardType === 'quote') {
      if (!state.personImg) return;
      const targetW = 600;
      const scaleW = targetW / state.personImg.width;
      updateState({
        personImgSettings: {
          scale: scaleW || 1.0,
          offsetX: 0,
          offsetY: 0
        }
      });
    } else {
      if (!state.newsImg) return;
      const boxW = 940;
      const boxH = 550;
      const scaleW = boxW / state.newsImg.width;
      const scaleH = boxH / state.newsImg.height;
      const coverScale = Math.max(scaleW, scaleH);

      updateState({
        newsImgSettings: {
          scale: coverScale,
          offsetX: 0,
          offsetY: 0
        }
      });
    }
  };

  const handleFitImage = () => {
    if (state.cardType === 'quote') {
      if (!state.personImg) return;
      const targetW = 500;
      const scaleW = targetW / state.personImg.width;
      updateState({
        personImgSettings: {
          scale: scaleW || 0.8,
          offsetX: 0,
          offsetY: 0
        }
      });
    } else {
      if (!state.newsImg) return;
      const boxW = 940;
      const boxH = 550;
      const scaleW = boxW / state.newsImg.width;
      const scaleH = boxH / state.newsImg.height;
      const containScale = Math.min(scaleW, scaleH);

      updateState({
        newsImgSettings: {
          scale: containScale,
          offsetX: 0,
          offsetY: 0
        }
      });
    }
  };

  return (
    <section className="control-panel scrollable">
      {/* Card Type Switcher */}
      <div className="card-type-selector">
        <button
          type="button"
          className={`type-tab-btn ${state.cardType !== 'quote' ? 'active' : ''}`}
          onClick={() => updateState({ cardType: 'news' })}
        >
          📰 নিউজ ফটো কার্ড
        </button>
        <button
          type="button"
          className={`type-tab-btn ${state.cardType === 'quote' ? 'active' : ''}`}
          onClick={() => updateState({ cardType: 'quote' })}
        >
          💬 উক্তি / বক্তব্য কার্ড
        </button>
      </div>

      {/* 1. Photo Upload */}
      <div className="panel-section">
        <h2 className="section-title">
          <span className="section-num">১</span> {state.cardType === 'quote' ? 'ব্যক্তির ছবি' : 'সংবাদের ছবি'}
        </h2>

        <div className="form-group">
          <label>{state.cardType === 'quote' ? 'ব্যক্তির ছবি আপলোড করুন' : 'ছবি আপলোড করুন'}</label>
          <div className={`upload-dropzone ${state.isRemovingBg ? 'loading-bg' : ''}`} id="imageDropzone">
            <input
              type="file"
              accept="image/*"
              className="file-input"
              disabled={state.isRemovingBg}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (state.cardType === 'quote') {
                    onPersonImageUpload(file);
                  } else {
                    onImageUpload(file);
                  }
                }
              }}
            />
            {state.isRemovingBg ? (
              <div className="bg-removing-status" style={{ padding: '10px 0', color: 'var(--accent-color)', fontWeight: '600' }}>
                <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ margin: '0 auto 8px display: block' }}>
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
                <p style={{ fontSize: '14px' }}>✨ ছবির ব্যাকগ্রাউন্ড অটো রিমুভ (Background Removal) হচ্ছে...</p>
              </div>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="upload-icon">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
                <p className="upload-text">ক্লিক করুন অথবা ছবি এখানে ড্রপ করুন</p>
                <span className="upload-hint">
                  {state.cardType === 'quote'
                    ? '✨ ছবি আপলোড করলেই অটোমেটিক ব্যাকগ্রাউন্ড রিমুভ (Background Remove) হয়ে যাবে!'
                    : 'PNG, JPG, WEBP (সর্বোচ্চ ১০ এমবি)'}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Position Adjustments */}
        {(() => {
          const currentImg = state.cardType === 'quote' ? state.personImg : state.newsImg;
          const currentSettings = state.cardType === 'quote' ? state.personImgSettings : state.newsImgSettings;

          return (
            <div className={`image-adjustments ${!currentImg ? 'disabled' : ''}`}>
              <label className="adjustments-label">ছবি এডজাস্টমেন্ট (Zoom & Drag)</label>

              <div className="form-group range-group">
                <div className="range-header">
                  <span>জুম (Zoom)</span>
                  <span>{Math.round((currentSettings?.scale || 1) * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="300"
                  value={Math.round((currentSettings?.scale || 1) * 100)}
                  onChange={(e) => {
                    const newScale = parseFloat(e.target.value) / 100;
                    if (state.cardType === 'quote') {
                      updateState({ personImgSettings: { ...state.personImgSettings, scale: newScale } });
                    } else {
                      updateState({ newsImgSettings: { ...state.newsImgSettings, scale: newScale } });
                    }
                  }}
                />
              </div>

              <div className="adjustment-grids">
                <div className="form-group range-group">
                  <div className="range-header">
                    <span>Horizontal (X)</span>
                    <span>{Math.round(currentSettings?.offsetX || 0)}px</span>
                  </div>
                  <input
                    type="range"
                    min="-500"
                    max="500"
                    value={Math.round(currentSettings?.offsetX || 0)}
                    onChange={(e) => {
                      const newX = parseInt(e.target.value);
                      if (state.cardType === 'quote') {
                        updateState({ personImgSettings: { ...state.personImgSettings, offsetX: newX } });
                      } else {
                        updateState({ newsImgSettings: { ...state.newsImgSettings, offsetX: newX } });
                      }
                    }}
                  />
                </div>

                <div className="form-group range-group">
                  <div className="range-header">
                    <span>Vertical (Y)</span>
                    <span>{Math.round(currentSettings?.offsetY || 0)}px</span>
                  </div>
                  <input
                    type="range"
                    min="-500"
                    max="500"
                    value={Math.round(currentSettings?.offsetY || 0)}
                    onChange={(e) => {
                      const newY = parseInt(e.target.value);
                      if (state.cardType === 'quote') {
                        updateState({ personImgSettings: { ...state.personImgSettings, offsetY: newY } });
                      } else {
                        updateState({ newsImgSettings: { ...state.newsImgSettings, offsetY: newY } });
                      }
                    }}
                  />
                </div>
              </div>

              <div className="adjustments-actions">
                <button type="button" onClick={handleResetAdjustments} className="secondary-btn btn-sm">
                  রিসেট পজিশন
                </button>
                <button type="button" onClick={handleFitImage} className="secondary-btn btn-sm">
                  ফিট করুন
                </button>
              </div>
            </div>
          );
        })()}
      </div>

      {/* 2. Text Fields */}
      {state.cardType === 'quote' ? (
        <div className="panel-section">
          <h2 className="section-title"><span className="section-num">২</span> উক্তি, নাম ও পদবি</h2>

          {/* Quote Text */}
          <div className="form-group">
            <label htmlFor="quoteTextInput">বক্তব্য / উক্তি (Quote Text)</label>
            <textarea
              id="quoteTextInput"
              rows="5"
              placeholder="এখানে উক্তি বা বক্তব্য লিখুন..."
              value={state.quoteText}
              onChange={(e) => updateState({ quoteText: e.target.value })}
              style={{ fontFamily: `"${state.headlineFont}", var(--font-bangla)` }}
            />
            <div className="char-counter">
              <span>{translateToBengaliDigits(state.quoteText.length)}</span> অক্ষর
            </div>
          </div>

          <div className="form-group range-group">
            <div className="range-header">
              <span>উক্তি ফন্ট সাইজ (Quote Font Size)</span>
              <span>{state.quoteFontSize || 36}px</span>
            </div>
            <input
              type="range"
              min="20"
              max="60"
              value={state.quoteFontSize || 36}
              onChange={(e) => updateState({ quoteFontSize: parseInt(e.target.value) })}
            />
          </div>

          {/* Person Name */}
          <div className="form-group">
            <label htmlFor="personNameInput">ব্যক্তির নাম (Person Name)</label>
            <input
              type="text"
              id="personNameInput"
              placeholder="যেমন: রুহুল কবীর রিজভী"
              value={state.personName}
              onChange={(e) => updateState({ personName: e.target.value })}
              style={{ fontFamily: `"${state.subHeadlineFont}", var(--font-bangla)` }}
            />
          </div>

          <div className="form-group range-group">
            <div className="range-header">
              <span>নামের ফন্ট সাইজ (Name Font Size)</span>
              <span>{state.personNameFontSize || 32}px</span>
            </div>
            <input
              type="range"
              min="18"
              max="60"
              value={state.personNameFontSize || 32}
              onChange={(e) => updateState({ personNameFontSize: parseInt(e.target.value) })}
            />
          </div>

          {/* Person Designation */}
          <div className="form-group">
            <label htmlFor="personDesignationInput">পদবি ও দল/প্রতিষ্ঠান (Designation)</label>
            <textarea
              id="personDesignationInput"
              rows="3"
              placeholder="যেমন: প্রধানমন্ত্রীর উপদেষ্টা ও ভারপ্রাপ্ত মহাসচিব&#10;বিএনপি"
              value={state.personDesignation}
              onChange={(e) => updateState({ personDesignation: e.target.value })}
              style={{ fontFamily: `"${state.subHeadlineFont}", var(--font-bangla)` }}
            />
          </div>

          <div className="form-group range-group">
            <div className="range-header">
              <span>পদবির ফন্ট সাইজ (Designation Font Size)</span>
              <span>{state.personDesignationFontSize || 24}px</span>
            </div>
            <input
              type="range"
              min="14"
              max="45"
              value={state.personDesignationFontSize || 24}
              onChange={(e) => updateState({ personDesignationFontSize: parseInt(e.target.value) })}
            />
          </div>

          {/* Color pickers */}
          <div className="color-pickers-group">
            <div className="form-group color-input-wrap">
              <label>উক্তির টেক্সটের রং</label>
              <div className="color-presets">
                {['#111111', '#000000', '#d92323', '#1e293b'].map(color => (
                  <span
                    key={color}
                    className={`color-dot ${state.quoteTextColor === color ? 'active' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => updateState({ quoteTextColor: color })}
                  />
                ))}
                <div className="custom-color-picker">
                  <input
                    type="color"
                    value={state.quoteTextColor || '#111111'}
                    onChange={(e) => updateState({ quoteTextColor: e.target.value })}
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M7.5 10.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/><path d="M11.5 7.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/><path d="M16.5 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/><path d="M6 14c0-2 2-3 4-3 1 0 3 1.5 3 3.5s-2 3.5-3.5 3.5S6 16 6 14z"/></svg>
                </div>
              </div>
            </div>

            <div className="form-group color-input-wrap">
              <label>নাম ও পদবির রং</label>
              <div className="color-presets">
                {['#111111', '#000000', '#d92323', '#334155'].map(color => (
                  <span
                    key={color}
                    className={`color-dot ${state.personNameColor === color ? 'active' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => updateState({ personNameColor: color, personDesignationColor: color })}
                  />
                ))}
                <div className="custom-color-picker">
                  <input
                    type="color"
                    value={state.personNameColor || '#111111'}
                    onChange={(e) => updateState({ personNameColor: e.target.value, personDesignationColor: e.target.value })}
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M7.5 10.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/><path d="M11.5 7.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/><path d="M16.5 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/><path d="M6 14c0-2 2-3 4-3 1 0 3 1.5 3 3.5s-2 3.5-3.5 3.5S6 16 6 14z"/></svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="panel-section">
          <h2 className="section-title"><span className="section-num">২</span> শিরোনাম ও বিবরণ</h2>

          {/* Main Headline */}
          <div className="form-group">
            <label htmlFor="headlineInput">মূল শিরোনাম (Headline)</label>
            <textarea
              id="headlineInput"
              rows="3"
              placeholder="এখানে সংবাদের মূল শিরোনাম লিখুন..."
              value={state.headline}
              onChange={(e) => updateState({ headline: e.target.value })}
              style={{ fontFamily: `"${state.headlineFont}", var(--font-bangla)` }}
            />
            <div className="char-counter">
              <span>{translateToBengaliDigits(state.headline.length)}</span> অক্ষর
            </div>
          </div>

          <div className="form-group range-group">
            <div className="range-header">
              <span>মূল শিরোনাম ফন্ট সাইজ (Headline Font Size)</span>
              <span>{state.fontSize}px</span>
            </div>
            <input
              type="range"
              min="24"
              max="80"
              value={state.fontSize}
              onChange={(e) => updateState({ fontSize: parseInt(e.target.value) })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="headlineFontFamily">মূল শিরোনাম ফন্ট (Headline Font)</label>
            <select
              id="headlineFontFamily"
              className="font-select"
              value={state.headlineFont}
              onChange={(e) => updateState({ headlineFont: e.target.value })}
            >
              <option value="Hind Siliguri">Hind Siliguri (সোশ্যাল মিডিয়া - ডিফল্ট)</option>
              <option value="Noto Serif Bengali">Noto Serif Bengali (নিউজ হেডলাইন)</option>
              <option value="Siyam Rupali">Siyam Rupali (মোটা/বোল্ড)</option>
              <option value="SolaimanLipi">SolaimanLipi (প্রচলিত নিউজ)</option>
              <option value="AdorshoLipi">AdorshoLipi (বড় হেডলাইন)</option>
              <option value="Noto Sans Bengali">Noto Sans Bengali</option>
              <option value="Anek Bangla">Anek Bangla</option>
              <option value="Tiro Bangla">Tiro Bangla</option>
              <option value="Baloo Da 2">Baloo Da 2</option>
              <option value="Mina">Mina</option>
              <option value="Galada">Galada</option>
              <option value="Atma">Atma</option>
              <option value="SutonnyMJ">SutonnyMJ (ANSI)</option>
              <option value="SutonnyOMJ">SutonnyOMJ (সিস্টেম - ANSI)</option>
              <option value="Kalpurush">Kalpurush (Avro Unicode)</option>
            </select>
          </div>

          {/* Sub Headline */}
          <div className="form-group">
            <label htmlFor="subHeadlineInput">উপ-শিরোনাম (Sub Headline)</label>
            <input
              type="text"
              id="subHeadlineInput"
              placeholder="এখানে উপ-শিরোনাম লিখুন (ঐচ্ছিক)"
              value={state.subHeadline}
              onChange={(e) => updateState({ subHeadline: e.target.value })}
              style={{ fontFamily: `"${state.subHeadlineFont}", var(--font-bangla)` }}
            />
          </div>

          <div className="form-group range-group">
            <div className="range-header">
              <span>উপ-শিরোনাম ফন্ট সাইজ (Sub Font Size)</span>
              <span>{state.subFontSize}px</span>
            </div>
            <input
              type="range"
              min="16"
              max="75"
              value={state.subFontSize}
              onChange={(e) => updateState({ subFontSize: parseInt(e.target.value) })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="subHeadlineFontFamily">উপ-শিরোনাম ফন্ট (Sub Font)</label>
            <select
              id="subHeadlineFontFamily"
              className="font-select"
              value={state.subHeadlineFont}
              onChange={(e) => updateState({ subHeadlineFont: e.target.value })}
            >
              <option value="Hind Siliguri">Hind Siliguri (সোশ্যাল মিডিয়া - ডিফল্ট)</option>
              <option value="Noto Serif Bengali">Noto Serif Bengali (নিউজ হেডলাইন)</option>
              <option value="Siyam Rupali">Siyam Rupali (মোটা/বোল্ড)</option>
              <option value="SolaimanLipi">SolaimanLipi (প্রচলিত নিউজ)</option>
              <option value="AdorshoLipi">AdorshoLipi (বড় হেডলাইন)</option>
              <option value="Noto Sans Bengali">Noto Sans Bengali</option>
              <option value="Anek Bangla">Anek Bangla</option>
              <option value="Tiro Bangla">Tiro Bangla</option>
              <option value="Baloo Da 2">Baloo Da 2</option>
              <option value="Mina">Mina</option>
              <option value="Galada">Galada</option>
              <option value="Atma">Atma</option>
              <option value="SutonnyMJ">SutonnyMJ (ANSI)</option>
              <option value="SutonnyOMJ">SutonnyOMJ (সিস্টেম - ANSI)</option>
              <option value="Kalpurush">Kalpurush (Avro Unicode)</option>
            </select>
          </div>

          {/* Colors */}
          <div className="color-pickers-group">
            <div className="form-group color-input-wrap">
              <label>মূল শিরোনামের রং</label>
              <div className="color-presets">
                {['#ffffff', '#facc15', '#fb923c', '#f87171'].map(color => (
                  <span
                    key={color}
                    className={`color-dot ${state.headlineColor === color ? 'active' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => updateState({ headlineColor: color })}
                  />
                ))}
                <div className="custom-color-picker">
                  <input
                    type="color"
                    value={state.headlineColor}
                    onChange={(e) => updateState({ headlineColor: e.target.value })}
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M7.5 10.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/><path d="M11.5 7.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/><path d="M16.5 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/><path d="M6 14c0-2 2-3 4-3 1 0 3 1.5 3 3.5s-2 3.5-3.5 3.5S6 16 6 14z"/></svg>
                </div>
              </div>
            </div>

            <div className="form-group color-input-wrap">
              <label>উপ-শিরোনামের রং</label>
              <div className="color-presets">
                {['#f8fafc', '#facc15', '#38bdf8', '#f87171'].map(color => (
                  <span
                    key={color}
                    className={`color-dot ${state.subHeadlineColor === color ? 'active' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => updateState({ subHeadlineColor: color })}
                  />
                ))}
                <div className="custom-color-picker">
                  <input
                    type="color"
                    value={state.subHeadlineColor}
                    onChange={(e) => updateState({ subHeadlineColor: e.target.value })}
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M7.5 10.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/><path d="M11.5 7.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/><path d="M16.5 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/><path d="M6 14c0-2 2-3 4-3 1 0 3 1.5 3 3.5s-2 3.5-3.5 3.5S6 16 6 14z"/></svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Website & Ads */}
      <div className="panel-section">
        <h2 className="section-title"><span className="section-num">৩</span> ওয়েবসাইট ও বিজ্ঞাপন</h2>

        <div className="form-group text-group">
          <label htmlFor="webUrlInput">ওয়েবসাইট এড্রেস</label>
          <input
            type="text"
            id="webUrlInput"
            value={state.webUrl}
            onChange={(e) => updateState({ webUrl: e.target.value })}
            style={{ fontFamily: `"${state.urlFont}", var(--font-bangla)` }}
          />
        </div>

        <div className="form-group range-group">
          <div className="range-header">
            <span>ইউআরএল ফন্ট সাইজ (URL Font Size)</span>
            <span>{state.urlFontSize}px</span>
          </div>
          <input
            type="range"
            min="14"
            max="36"
            value={state.urlFontSize}
            onChange={(e) => updateState({ urlFontSize: parseInt(e.target.value) })}
          />
        </div>

        <div className="form-group">
          <label htmlFor="urlFontFamily">ইউআরএল ফন্ট (URL Font)</label>
          <select
            id="urlFontFamily"
            className="font-select"
            value={state.urlFont}
            onChange={(e) => updateState({ urlFont: e.target.value })}
          >
            <option value="Hind Siliguri">Hind Siliguri (ডিফল্ট)</option>
            <option value="Noto Serif Bengali">Noto Serif Bengali</option>
            <option value="Siyam Rupali">Siyam Rupali</option>
            <option value="SolaimanLipi">SolaimanLipi</option>
            <option value="AdorshoLipi">AdorshoLipi</option>
            <option value="Noto Sans Bengali">Noto Sans Bengali</option>
            <option value="Anek Bangla">Anek Bangla</option>
            <option value="Tiro Bangla">Tiro Bangla</option>
            <option value="Baloo Da 2">Baloo Da 2</option>
            <option value="Kalpurush">Kalpurush (Avro Unicode)</option>
          </select>
        </div>

        <div className="form-group">
          <label>বিজ্ঞাপন নির্বাচন করুন</label>
          <div className="ad-selector-grid">
            <div
              className={`ad-preset-option ${state.activeAdKey === 'ad1' ? 'active' : ''}`}
              onClick={() => onAdPresetChange('/assets/ad_road_home.png', 'ad1')}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/ad_road_home.png" alt="Road Home Ad" />
              <span className="preset-label">Road Home</span>
            </div>

            <div
              className={`ad-preset-option ${state.activeAdKey === 'ad2' ? 'active' : ''}`}
              onClick={() => onAdPresetChange('/assets/ad_aci_water_pump.png', 'ad2')}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/ad_aci_water_pump.png" alt="ACI Water Pump Ad" />
              <span className="preset-label">ACI Water Pump</span>
            </div>

            <div
              className={`ad-preset-option ${state.activeAdKey === 'ad3' ? 'active' : ''}`}
              onClick={() => onAdPresetChange('/assets/ad_aci_smart_tools.png', 'ad3')}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/ad_aci_smart_tools.png" alt="ACI Smart Tools Ad" />
              <span className="preset-label">ACI Smart Tools</span>
            </div>

            <div className={`ad-preset-option ${state.activeAdKey === 'custom' ? 'active' : ''}`}>
              <label htmlFor="customAdFile" style={{ cursor: 'pointer', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="custom-ad-placeholder">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  <span>কাস্টম ব্যানার</span>
                </div>
              </label>
              <input
                type="file"
                id="customAdFile"
                accept="image/*"
                className="file-input-hidden"
                onChange={(e) => e.target.files?.[0] && onCustomAdUpload(e.target.files[0])}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Date & Time (Bottom) */}
      <div className="panel-section">
        <h2 className="section-title"><span className="section-num">৪</span> তারিখ ও সময়</h2>

        <div className="form-group inline-group">
          <div className="input-wrap">
            <label htmlFor="newsDateInput">তারিখ সিলেক্ট করুন</label>
            <input
              type="date"
              id="newsDateInput"
              value={state.selectedDate}
              onChange={(e) => updateState({ selectedDate: e.target.value })}
            />
          </div>
          <div className="checkbox-wrap">
            <input
              type="checkbox"
              id="autoBengaliDate"
              checked={state.autoBengaliDate}
              onChange={(e) => updateState({ autoBengaliDate: e.target.checked })}
            />
            <label htmlFor="autoBengaliDate">অটো বাংলা কনভার্ট</label>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="customDateText">তারিখের কাস্টম টেক্সট (ঐচ্ছিক)</label>
          <input
            type="text"
            id="customDateText"
            placeholder="যেমন: ৯ সেপ্টেম্বর ২০২৬"
            value={state.dateText}
            onChange={(e) => updateState({ dateText: e.target.value })}
            style={{ fontFamily: `"${state.dateFont}", var(--font-bangla)` }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="dateFontFamily">তারিখের ফন্ট (Date Font)</label>
          <select
            id="dateFontFamily"
            className="font-select"
            value={state.dateFont}
            onChange={(e) => updateState({ dateFont: e.target.value })}
          >
            <option value="Noto Serif Bengali">Noto Serif Bengali (ডিফল্ট)</option>
            <option value="Hind Siliguri">Hind Siliguri (সোশ্যাল মিডিয়া)</option>
            <option value="Siyam Rupali">Siyam Rupali (বোল্ড)</option>
            <option value="SolaimanLipi">SolaimanLipi</option>
            <option value="AdorshoLipi">AdorshoLipi</option>
            <option value="Noto Sans Bengali">Noto Sans Bengali</option>
            <option value="Anek Bangla">Anek Bangla</option>
            <option value="Tiro Bangla">Tiro Bangla</option>
            <option value="Baloo Da 2">Baloo Da 2</option>
            <option value="Kalpurush">Kalpurush (Avro Unicode)</option>
          </select>
        </div>
      </div>

      <div className="action-section">
        <button
          type="button"
          onClick={handleDownloadClick}
          className={`primary-btn ${downloading ? 'loading' : ''}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="btn-icon"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          <span>{downloading ? 'ডাউনলোড হচ্ছে...' : 'কার্ড ডাউনলোড করুন (PNG)'}</span>
        </button>
      </div>
    </section>
  );
}
