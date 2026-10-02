import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { 
  Percent, 
  Sparkles, 
  ArrowRight, 
  BookmarkCheck, 
  MessageCircle, 
  ChevronLeft, 
  ChevronRight,
  TrendingDown,
  ShieldCheck,
  Truck
} from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const { products, storeProfile, language, t, openBookingModal, openLightbox, getWhatsAppProductUrl } = useStore();

  // Find discounted items for the hero carousel
  const discountItems = products.filter((p) => p.hasDiscount && p.discountPrice && p.discountPrice < p.originalPrice);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (discountItems.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % discountItems.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [discountItems.length]);

  const activeItem = discountItems[currentIndex] || products[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + discountItems.length) % discountItems.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % discountItems.length);
  };

  if (!activeItem) return null;

  const discountPercent = activeItem.hasDiscount && activeItem.discountPrice
    ? Math.round(((activeItem.originalPrice - activeItem.discountPrice) / activeItem.originalPrice) * 100)
    : 0;

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-rose-950 to-slate-900 text-white rounded-2xl sm:rounded-3xl mx-3 sm:mx-6 lg:mx-8 my-3 sm:my-6 shadow-2xl border border-rose-900/40">
      {/* Background glow effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          {/* Left Column: Heading, Discount Notice, Call to actions */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500/30 to-amber-500/30 border border-rose-400/40 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold text-rose-200 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{t('BIG DISCOUNT BONANZA', 'મહા બચત ધમાકા ઓફર')}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              {language === 'gu' ? (
                <>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-300 to-white">
                    સૌથી સસ્તા ભાવે
                  </span>{' '}
                  શ્રેષ્ઠ ક્વોલિટી ની ખરીદી કરો!
                </>
              ) : (
                <>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-300 to-white">
                    Huge Discounts
                  </span>{' '}
                  On All Best-Selling Store Items!
                </>
              )}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl font-normal leading-relaxed">
              {language === 'gu'
                ? 'દરેક પ્રોડક્ટ પર મેળવો ૩૦% થી ૫૦% સુધીની જંગી છૂટ. નીચે આપેલા બટનથી ઘરે બેઠા બુક કરો અથવા સીધો વોટ્સએપ પર ઓર્ડર મોકલો.'
                : 'Save big with up to 50% discount on clothing, electronics, daily groceries, kitchenware and more. Tap "Book Now" or connect on WhatsApp for instant home delivery!'}
            </p>

            {/* Quick feature perks */}
            <div className="grid grid-cols-3 gap-3 pt-2 text-xs text-slate-200">
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="truncate">{t('Fast Delivery', 'ઝડપી ડિલિવરી')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Percent className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="truncate">{t('Best Price Guaranteed', 'સૌથી સસ્તો ભાવ')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="truncate">{t('100% Genuine', '૧૦૦% અસલી માલ')}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  const elem = document.getElementById('discount-deals-section');
                  elem?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-rose-900/50 flex items-center gap-2 transition active:scale-95"
              >
                <span>{t('View All Discount Deals', 'બધા ડિસ્કાઉન્ટ પ્રોડક્ટ્સ જુઓ')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  const elem = document.getElementById('category-nav-section');
                  elem?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl font-semibold text-sm backdrop-blur-xs transition"
              >
                {t('Explore Categories', 'કેટેગરી મુજબ જુઓ')}
              </button>
            </div>
          </div>

          {/* Right Column: Animated Highlight Product Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeItem.id}
                  initial={{ opacity: 0, scale: 0.9, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white/10 backdrop-blur-xl border border-white/25 rounded-3xl p-4 shadow-2xl"
                >
                  {/* Image container with animated badge and photo zoom */}
                  <div 
                    onClick={() => openLightbox(activeItem)}
                    className="relative aspect-4/3 rounded-2xl overflow-hidden cursor-pointer group bg-slate-800"
                  >
                    <img
                      src={activeItem.imageUrl}
                      alt={activeItem.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Animated Pulsing Discount Badge */}
                    {discountPercent > 0 && (
                      <div className="absolute top-3 left-3">
                        <div className="animate-pulse-glow bg-red-600 text-white font-black text-xs px-3 py-1.5 rounded-full flex items-center gap-1 shadow-xl">
                          <TrendingDown className="w-4 h-4" />
                          <span>{discountPercent}% {t('MEGA OFF', 'મહા છૂટ')}</span>
                        </div>
                      </div>
                    )}

                    <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg">
                      {currentIndex + 1} / {discountItems.length}
                    </div>
                  </div>

                  {/* Product Details & Booking button */}
                  <div className="mt-4 space-y-2">
                    <h3 className="font-extrabold text-lg text-white line-clamp-1">
                      {language === 'gu' && activeItem.nameGu ? activeItem.nameGu : activeItem.name}
                    </h3>

                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-amber-400">
                        {storeProfile.currencySymbol}
                        {(activeItem.discountPrice || activeItem.originalPrice).toLocaleString()}
                      </span>
                      {activeItem.hasDiscount && activeItem.discountPrice && (
                        <span className="text-sm text-slate-400 line-through">
                          {storeProfile.currencySymbol}{activeItem.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Prominent Booking & WhatsApp Button */}
                    <div className="pt-2 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => openBookingModal(activeItem)}
                        className="py-2.5 px-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-1.5 transition active:scale-95"
                      >
                        <BookmarkCheck className="w-4 h-4" />
                        <span>{t('Book Now', 'હમણાં બુક કરો')}</span>
                      </button>

                      <a
                        href={getWhatsAppProductUrl(activeItem)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-1.5 transition active:scale-95"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Slider arrow navigations */}
              {discountItems.length > 1 && (
                <div className="flex items-center justify-between mt-3 px-2">
                  <div className="flex gap-1.5">
                    {discountItems.slice(0, 5).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-2 rounded-full transition-all ${
                          currentIndex === idx ? 'w-6 bg-rose-500' : 'w-2 bg-white/30'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handlePrev}
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
                      title="Previous Deal"
                    >
                      <ChevronLeft className="w-4 h-4 text-white" />
                    </button>
                    <button
                      onClick={handleNext}
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
                      title="Next Deal"
                    >
                      <ChevronRight className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
