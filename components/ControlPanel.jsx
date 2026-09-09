'use client';

import { useState } from 'react';

const BENGALI_DIGITS = {
  '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
  '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
};

function translateToBengaliDigits(str) {
  return str.toString().split('').map(char => BENGALI_DIGITS[char] || char).join('');
}

export default function ControlPanel({ state, updateState, onDownload, onImageUpload, onAdPresetChange, onCustomAdUpload }) {
  const [downloading, setDownloading] = useState(false);

  const handleDownloadClick = () => {
    setDownloading(true);
    setTimeout(() => {
      onDownload();
      setDownloading(false);
    }, 600);
  };

  const handleResetAdjustments = () => {
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
  };

  const handleFitImage = () => {
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
  };

  return (
    <section className="control-panel scrollable">
      {/* 1. Date & Time */}
      <div className="panel-section">
        <h2 className="section-title"><span className="section-num">১</span> তারিখ ও সময়</h2>

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
            placeholder="যেমন: ২৪ জুন ২০২৬"
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
            <option value="Noto Serif Bengali">Noto Serif Bengali (নিউজ হেডলাইন - ডিফল্ট)</option>
            <option value="Hind Siliguri">Hind Siliguri (সোশ্যাল মিডিয়া নিউজ)</option>
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
      </div>

      {/* 2. News Image */}
      <div className="panel-section">
        <h2 className="section-title"><span className="section-num">২</span> সংবাদের ছবি</h2>

        <div className="form-group">
          <label>ছবি আপলোড করুন</label>
          <div className="upload-dropzone" id="imageDropzone">
            <input
              type="file"
              accept="image/*"
              className="file-input"
              onChange={(e) => e.target.files?.[0] && onImageUpload(e.target.files[0])}
            />
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="upload-icon">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <p className="upload-text">ক্লিক করুন অথবা ছবি এখানে ড্রপ করুন</p>
            <span className="upload-hint">PNG, JPG, WEBP (সর্বোচ্চ ১০ এমবি)</span>
          </div>
        </div>

        {/* Position Adjustments */}
        <div className={`image-adjustments ${!state.newsImg ? 'disabled' : ''}`}>
          <label className="adjustments-label">ছবি এডজাস্টমেন্ট</label>

          <div className="form-group range-group">
            <div className="range-header">
              <span>জুম (Zoom)</span>
              <span>{Math.round(state.newsImgSettings.scale * 100)}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="300"
              value={Math.round(state.newsImgSettings.scale * 100)}
              onChange={(e) => updateState({
                newsImgSettings: { ...state.newsImgSettings, scale: parseFloat(e.target.value) / 100 }
              })}
            />
          </div>

          <div className="adjustment-grids">
            <div className="form-group range-group">
              <div className="range-header">
                <span>Horizontal (X)</span>
                <span>{Math.round(state.newsImgSettings.offsetX)}px</span>
              </div>
              <input
                type="range"
                min="-500"
                max="500"
                value={Math.round(state.newsImgSettings.offsetX)}
                onChange={(e) => updateState({
                  newsImgSettings: { ...state.newsImgSettings, offsetX: parseInt(e.target.value) }
                })}
              />
            </div>

            <div className="form-group range-group">
              <div className="range-header">
                <span>Vertical (Y)</span>
                <span>{Math.round(state.newsImgSettings.offsetY)}px</span>
              </div>
              <input
                type="range"
                min="-500"
                max="500"
                value={Math.round(state.newsImgSettings.offsetY)}
                onChange={(e) => updateState({
                  newsImgSettings: { ...state.newsImgSettings, offsetY: parseInt(e.target.value) }
                })}
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
      </div>

      {/* 3. Headlines */}
      <div className="panel-section">
        <h2 className="section-title"><span className="section-num">৩</span> শিরোনাম ও বিবরণ</h2>

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

      {/* 4. Website & Ads */}
      <div className="panel-section">
        <h2 className="section-title"><span className="section-num">৪</span> ওয়েবসাইট ও বিজ্ঞাপন</h2>

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
