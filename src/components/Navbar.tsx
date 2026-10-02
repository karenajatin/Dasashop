import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  ShoppingBag, 
  Phone, 
  Mail, 
  MessageCircle, 
  Search, 
  Sparkles, 
  Percent, 
  ChevronRight,
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    storeProfile, 
    categories, 
    language, 
    setLanguage, 
    t, 
    currentView, 
    navigateToHome, 
    navigateToCategory, 
    searchQuery,
    setSearchQuery,
    getGeneralWhatsAppUrl,
    handleLogoTap
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-amber-600 via-rose-600 to-red-600 text-white text-xs py-1.5 sm:py-2 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
            <span className="bg-white/20 text-white font-black px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-[11px] uppercase tracking-wider flex items-center gap-1 shrink-0">
              <Sparkles className="w-3 h-3 text-yellow-300" />
              {t('OFFER', 'ઓફર')}
            </span>
            <p className="truncate font-medium text-[11px] sm:text-xs md:text-sm">
              {language === 'gu' ? storeProfile.announcementTextGu : storeProfile.announcementText}
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0 text-xs">
            {/* Direct Phone */}
            <a 
              href={`tel:${storeProfile.phoneNumber}`}
              className="hidden md:flex items-center gap-1 hover:text-amber-200 transition-colors"
              title="Call Store"
            >
              <Phone className="w-3.5 h-3.5" />
              <span className="font-mono text-xs">{storeProfile.phoneNumber}</span>
            </a>

            {/* Language Switcher */}
            <div className="flex items-center bg-black/20 rounded-md p-0.5">
              <button
                onClick={() => setLanguage('en')}
                className={`px-1.5 sm:px-2 py-0.5 text-[11px] sm:text-xs rounded transition font-medium ${
                  language === 'en' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-white/80 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('gu')}
                className={`px-1.5 sm:px-2 py-0.5 text-[11px] sm:text-xs rounded transition font-medium ${
                  language === 'gu' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-white/80 hover:text-white'
                }`}
              >
                ગુજરાતી
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3">
        {/* Brand / Logo - Touching the logo 20 times opens secret control panel access! */}
        <div className="flex items-center gap-2.5 sm:gap-3 select-none shrink-0">
          {/* Secret 20-tap interactive logo */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleLogoTap();
            }}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-rose-200 cursor-pointer active:scale-95 transition-transform select-none"
            title={language === 'gu' ? storeProfile.nameGu : storeProfile.name}
          >
            <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 pointer-events-none" />
          </div>

          <div 
            onClick={navigateToHome}
            className="cursor-pointer group"
          >
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-lg md:text-xl text-slate-900 tracking-tight group-hover:text-rose-600 transition-colors">
                {language === 'gu' ? storeProfile.nameGu : storeProfile.name}
              </span>
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                <ShieldCheck className="w-3 h-3 mr-0.5" /> {t('Verified', 'વેરીફાઈડ')}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium hidden sm:block truncate max-w-xs">
              {language === 'gu' ? storeProfile.taglineGu : storeProfile.tagline}
            </p>
          </div>
        </div>

        {/* Search Bar on Desktop */}
        <div className="hidden lg:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('Search discount items, grocery, clothing...', 'ડિસ્કાઉન્ટ વાળી વસ્તુઓ, કપડાં, કરિયાણું શોધો...')}
              className="w-full pl-10 pr-4 py-2 bg-slate-100/90 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 focus:bg-white transition"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Contact Buttons (Control Panel button is removed per user request) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Direct WhatsApp Contact Button */}
          <a
            href={getGeneralWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs sm:text-sm font-bold transition shadow-2xs active:scale-95"
            title="Chat on WhatsApp"
          >
            <MessageCircle className="w-4 h-4 fill-emerald-600 text-emerald-600" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>

          {/* Email Button */}
          <a
            href={`mailto:${storeProfile.email}`}
            className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs sm:text-sm font-semibold transition shadow-2xs"
            title="Send Email"
          >
            <Mail className="w-4 h-4 text-blue-600" />
            <span>Email</span>
          </a>

          {/* Call Button */}
          <a
            href={`tel:${storeProfile.phoneNumber}`}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200 text-xs sm:text-sm font-semibold transition active:scale-95"
            title="Call Storekeeper"
          >
            <Phone className="w-4 h-4 text-slate-700" />
            <span className="hidden sm:inline">{t('Call', 'કોલ')}</span>
          </a>

          {/* Mobile menu hamburger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 sm:p-2 rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Category Pills Subbar */}
      <div className="bg-slate-50 border-t border-slate-100 px-3 sm:px-4 py-1.5 sm:py-2 overflow-x-auto scrollbar-none hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-0.5">
            <button
              onClick={navigateToHome}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                currentView === 'home'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {t('🏠 All / Home', '🏠 મુખપૃષ્ઠ')}
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => navigateToCategory(cat.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition flex items-center gap-1 cursor-pointer ${
                  currentView === 'category' && cat.id === (useStore().selectedCategoryId)
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <span>{language === 'gu' ? cat.nameGu : cat.name}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0 text-xs text-slate-500 font-medium">
            <span className="inline-flex items-center gap-1 text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
              <Percent className="w-3 h-3" />
              {t('Mega Deals Active', 'ડિસ્કાઉન્ટ ઓફર્સ ચાલુ')}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-3">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('Search products...', 'પ્રોડક્ટ શોધો...')}
              className="w-full pl-9 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs sm:text-sm"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <div className="space-y-1 pt-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
              {t('Categories', 'કેટેગરી')}
            </p>
            <button
              onClick={() => { navigateToHome(); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-slate-100 flex items-center justify-between"
            >
              <span>{t('🏠 All Products & Deals', '🏠 બધા ઉત્પાદનો અને ડીલ્સ')}</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { navigateToCategory(cat.id); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-slate-100 flex items-center justify-between"
              >
                <span>{language === 'gu' ? cat.nameGu : cat.name}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">{t('Language', 'ભાષા')}:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded text-xs font-bold ${language === 'en' ? 'bg-slate-900 text-white' : 'bg-slate-100'}`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('gu')}
                className={`px-3 py-1 rounded text-xs font-bold ${language === 'gu' ? 'bg-slate-900 text-white' : 'bg-slate-100'}`}
              >
                ગુજરાતી
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
