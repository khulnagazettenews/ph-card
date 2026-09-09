import './globals.css';
import Providers from './providers';

export const metadata = {
  title: 'Khulna Gazette News Photo Card Generator',
  description: 'খুলনা গেজেট এর জন্য প্রফেশনাল নিউজ ফটো কার্ড তৈরি করার অনলাইন টুল। ডেট কনভার্টার, ইমেজ ক্রপ, ও ইনস্ট্যান্ট ডাউনলোড সহ।',
  icons: {
    icon: '/assets/logo.svg'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Anek+Bangla:wght@100..800&family=Atma:wght@300..700&family=Baloo+Da+2:wght@400..800&family=Galada&family=Hind+Siliguri:wght@300..700&family=Mina:wght@400;700&family=Noto+Sans+Bengali:wght@100..900&family=Noto+Serif+Bengali:wght@100..900&family=Outfit:wght@300..700&family=Tiro+Bangla:ital@0;1&display=swap"
          rel="stylesheet"
        />
        <link href="https://fonts.maateen.me/solaiman-lipi/font.css" rel="stylesheet" />
        <link href="https://fonts.maateen.me/siyam-rupali/font.css" rel="stylesheet" />
        <link href="https://fonts.maateen.me/adorsho-lipi/font.css" rel="stylesheet" />
      </head>
      <body>
        <Providers>{children}</Providers>

        {/* Hidden font preloader to ensure browser downloads all web fonts */}
        <div style={{ position: 'absolute', opacity: 0.01, pointerEvents: 'none', zIndex: -9999, fontSize: '1px' }}>
          <span style={{ fontFamily: 'Noto Serif Bengali', fontWeight: 700 }}>খুলনা গেজেট যুক্তবর্ণ</span>
          <span style={{ fontFamily: 'Hind Siliguri', fontWeight: 600 }}>খুলনা গেজেট যুক্তবর্ণ</span>
          <span style={{ fontFamily: 'Hind Siliguri', fontWeight: 700 }}>খুলনা গেজেট যুক্তবর্ণ</span>
          <span style={{ fontFamily: 'Siyam Rupali', fontWeight: 600 }}>খুলনা গেজেট যুক্তবর্ণ</span>
          <span style={{ fontFamily: 'Siyam Rupali', fontWeight: 700 }}>খুলনা গেজেট যুক্তবর্ণ</span>
          <span style={{ fontFamily: 'SolaimanLipi', fontWeight: 400 }}>খুলনা গেজেট যুক্তবর্ণ</span>
          <span style={{ fontFamily: 'SolaimanLipi', fontWeight: 700 }}>খুলনা গেজেট যুক্তবর্ণ</span>
          <span style={{ fontFamily: 'AdorshoLipi', fontWeight: 600 }}>খুলনা গেজেট যুক্তবর্ণ</span>
          <span style={{ fontFamily: 'AdorshoLipi', fontWeight: 700 }}>খুলনা গেজেট যুক্তবর্ণ</span>
          <span style={{ fontFamily: 'Noto Sans Bengali', fontWeight: 700 }}>খুলনা গেজেট যুক্তবর্ণ</span>
          <span style={{ fontFamily: 'Anek Bangla', fontWeight: 700 }}>খুলনা গেজেট যুক্তবর্ণ</span>
          <span style={{ fontFamily: 'Tiro Bangla', fontWeight: 700 }}>খুলনা গেজেট যুক্তবর্ণ</span>
          <span style={{ fontFamily: 'Baloo Da 2', fontWeight: 700 }}>খুলনা গেজেট যুক্তবর্ণ</span>
          <span style={{ fontFamily: 'Mina', fontWeight: 700 }}>খুলনা গেজেট যুক্তবর্ণ</span>
          <span style={{ fontFamily: 'Galada', fontWeight: 400 }}>খুলনা গেজেট যুক্তবর্ণ</span>
          <span style={{ fontFamily: 'Atma', fontWeight: 700 }}>খুলনা গেজেট যুক্তবর্ণ</span>
          <span style={{ fontFamily: 'SutonnyMJ', fontWeight: 700 }}>preload</span>
          <span style={{ fontFamily: 'SutonnyOMJ', fontWeight: 700 }}>preload</span>
          <span style={{ fontFamily: 'Kalpurush', fontWeight: 700 }}>preload</span>
        </div>
      </body>

    </html>
  );
}
