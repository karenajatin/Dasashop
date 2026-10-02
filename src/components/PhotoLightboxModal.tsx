import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  Percent, 
  BookmarkCheck, 
  MessageCircle, 
  Mail, 
  ZoomIn, 
  ZoomOut, 
  RotateCw,
  Sparkles,
  Share2,
  Check
} from 'lucide-react';

export const PhotoLightboxModal: React.FC = () => {
  const { 
    lightboxProduct, 
    closeLightbox, 
    openBookingModal, 
    language, 
    t, 
    storeProfile, 
    getWhatsAppProductUrl, 
    getEmailProductUrl 
  } = useStore();

  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!lightboxProduct) return null;

  const hasDiscount = lightboxProduct.hasDiscount && lightboxProduct.discountPrice && lightboxProduct.discountPrice < lightboxProduct.originalPrice;
  const activePrice = hasDiscount ? lightboxProduct.discountPrice! : lightboxProduct.originalPrice;
  const discountPercent = hasDiscount
    ? Math.round(((lightboxProduct.originalPrice - lightboxProduct.discountPrice!) / lightboxProduct.originalPrice) * 100)
    : 0;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: lightboxProduct.name,
          text: `Check out ${lightboxProduct.name} at ₹${activePrice} on ${storeProfile.name}`,
          url: window.location.href,
        });
      } catch {}
    } else {
      await navigator.clipboard.writeText(`${lightboxProduct.name} - ₹${activePrice}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleBookNow = () => {
    const prod = lightboxProduct;
    closeLightbox();
    setTimeout(() => {
      openBookingModal(prod);
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden text-white flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeLightbox}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition border border-white/20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Animated High-Resolution Image Viewer */}
        <div className="md:w-3/5 bg-black/60 relative min-h-[320px] sm:min-h-[420px] flex items-center justify-center overflow-hidden p-4">
          <motion.img
            src={lightboxProduct.imageUrl}
            alt={lightboxProduct.name}
            style={{
              transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
            }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl select-none"
          />

          {/* Floating discount badge */}
          {hasDiscount && (
            <div className="absolute top-4 left-4 z-10">
              <div className="shimmer-badge text-white px-3 py-1 rounded-full text-xs font-black shadow-lg flex items-center gap-1 uppercase tracking-wide">
                <Percent className="w-4 h-4 stroke-[3]" />
                <span>{discountPercent}% {t('DISCOUNT', 'છૂટ')}</span>
              </div>
            </div>
          )}

          {/* Image Toolbar: Zoom & Rotate */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/10 text-xs">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.25))}
              className="p-1 hover:text-rose-400 transition"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="font-mono text-[11px] px-1">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
              className="p-1 hover:text-rose-400 transition"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <div className="w-px h-3 bg-white/20" />
            <button
              onClick={() => setRotation((r) => (r + 90) % 360)}
              className="p-1 hover:text-rose-400 transition"
              title="Rotate"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Side: Product Details & Connected Action Buttons */}
        <div className="md:w-2/5 p-6 flex flex-col justify-between bg-slate-900 border-t md:border-t-0 md:border-l border-slate-800">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-white/10 text-slate-300 uppercase tracking-wider">
                {lightboxProduct.categoryId}
              </span>

              <button
                onClick={handleShare}
                className="text-xs flex items-center gap-1 text-slate-400 hover:text-white transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copied ? t('Copied', 'કોપી થયું') : t('Share', 'શેર')}</span>
              </button>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {language === 'gu' && lightboxProduct.nameGu ? lightboxProduct.nameGu : lightboxProduct.name}
            </h2>

            {/* Price Box */}
            <div className="bg-slate-800/80 rounded-2xl p-3 border border-slate-700/60">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-black text-amber-400">
                  {storeProfile.currencySymbol}{activePrice.toLocaleString()}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-slate-400 line-through">
                    {storeProfile.currencySymbol}{lightboxProduct.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              {hasDiscount && (
                <p className="text-xs text-emerald-400 font-bold mt-1">
                  🎉 {t('Special discount applied!', 'ખાસ ડિસ્કાઉન્ટ ઓફર લાગુ!')}
                </p>
              )}
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-h-40 overflow-y-auto">
              {language === 'gu' && lightboxProduct.descriptionGu
                ? lightboxProduct.descriptionGu
                : lightboxProduct.description}
            </p>
          </div>

          {/* Connected Action Buttons ("Aa new button badhi vastuna phota sathe connect hoy") */}
          <div className="pt-6 space-y-2.5">
            {/* BOOK NOW PROMINENT BUTTON */}
            <button
              onClick={handleBookNow}
              className="w-full py-3 px-4 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white rounded-xl font-black text-sm shadow-lg shadow-rose-900/50 flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
            >
              <BookmarkCheck className="w-4 h-4" />
              <span>{t('Book Now (Name & Mobile)', 'ઓર્ડર બુક કરો (નામ અને મોબાઈલ)')}</span>
            </button>

            {/* DIRECT WHATSAPP BUTTON */}
            <a
              href={getWhatsAppProductUrl(lightboxProduct)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2 transition"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>{t('Order Directly on WhatsApp', 'વોટ્સએપ પર સીધો ઓર્ડર કરો')}</span>
            </a>

            {/* EMAIL BUTTON */}
            <a
              href={getEmailProductUrl(lightboxProduct)}
              className="w-full py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition"
            >
              <Mail className="w-4 h-4 text-blue-400" />
              <span>{t('Inquire via Email', 'ઇમેઇલ દ્વારા પૂછપરછ')}</span>
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
