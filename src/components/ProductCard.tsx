import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { 
  Percent, 
  ShoppingBag, 
  MessageCircle, 
  Mail, 
  Eye, 
  Check, 
  Sparkles,
  BookmarkCheck,
  Share2
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
  featuredBanner?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, featuredBanner = false }) => {
  const { 
    language, 
    t, 
    openBookingModal, 
    openLightbox, 
    getWhatsAppProductUrl, 
    getEmailProductUrl, 
    storeProfile 
  } = useStore();

  const [copied, setCopied] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Discount calculation
  const hasDiscount = product.hasDiscount && product.discountPrice && product.discountPrice < product.originalPrice;
  const discountPercent = hasDiscount 
    ? Math.round(((product.originalPrice - (product.discountPrice || 0)) / product.originalPrice) * 100)
    : 0;
  const savings = hasDiscount ? product.originalPrice - (product.discountPrice || 0) : 0;
  const activePrice = hasDiscount ? product.discountPrice : product.originalPrice;

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} at ${storeProfile.currencySymbol}${activePrice} on ${storeProfile.name}!`,
          url: window.location.href,
        });
      } catch {
        // Ignored
      }
    } else {
      await navigator.clipboard.writeText(`${product.name} - ${storeProfile.currencySymbol}${activePrice}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className={`group relative bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between ${
        featuredBanner ? 'ring-2 ring-rose-500/50' : ''
      }`}
    >
      {/* Top Media / Photo Section with Animations */}
      <div className="relative aspect-square overflow-hidden bg-slate-100 cursor-pointer select-none">
        {/* Skeleton placeholder while loading */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center">
            <ShoppingBag className="w-8 h-8 text-slate-400" />
          </div>
        )}

        {/* High quality product image with smooth hover scale animation */}
        <img
          src={product.imageUrl}
          alt={product.name}
          onLoad={() => setImageLoaded(true)}
          onClick={() => openLightbox(product)}
          className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
        />

        {/* Floating Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 z-10">
            <div className="shimmer-badge text-white px-2.5 py-1 rounded-full text-xs font-black shadow-lg flex items-center gap-1 uppercase tracking-wide">
              <Percent className="w-3.5 h-3.5 stroke-[3]" />
              <span>{discountPercent}% {t('OFF', 'છૂટ')}</span>
            </div>
          </div>
        )}

        {/* Featured Tag */}
        {product.featured && (
          <div className="absolute top-3 right-3 z-10">
            <span className="bg-amber-500/95 backdrop-blur-xs text-slate-950 font-extrabold text-[11px] px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-white fill-white" />
              <span>{t('DEAL', 'સુપર ડીલ')}</span>
            </span>
          </div>
        )}

        {/* Hover quick-view overlay */}
        <div 
          onClick={() => openLightbox(product)}
          className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]"
        >
          <button 
            type="button"
            className="bg-white/95 text-slate-900 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300 hover:bg-white"
          >
            <Eye className="w-4 h-4 text-rose-600" />
            <span>{t('View Photo & Details', 'મોટો ફોટો જુઓ')}</span>
          </button>
        </div>

        {/* Floating Quick Share */}
        <button
          onClick={handleShare}
          className="absolute bottom-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs text-slate-700 hover:text-rose-600 hover:bg-white flex items-center justify-center shadow-md transition"
          title="Share Product"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3 
            onClick={() => openLightbox(product)}
            className="font-bold text-slate-900 group-hover:text-rose-600 transition-colors text-base line-clamp-1 cursor-pointer"
            title={language === 'gu' && product.nameGu ? product.nameGu : product.name}
          >
            {language === 'gu' && product.nameGu ? product.nameGu : product.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {language === 'gu' && product.descriptionGu ? product.descriptionGu : product.description}
          </p>

          {/* Price & Discount Highlights */}
          <div className="mt-3 flex items-baseline gap-2 flex-wrap">
            <span className="text-xl font-extrabold text-slate-950 tracking-tight">
              {storeProfile.currencySymbol}{activePrice?.toLocaleString()}
            </span>

            {hasDiscount && (
              <>
                <span className="text-xs text-slate-400 line-through font-medium">
                  {storeProfile.currencySymbol}{product.originalPrice.toLocaleString()}
                </span>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                  {t(`Save ${storeProfile.currencySymbol}${savings}`, `બચત ${storeProfile.currencySymbol}${savings}`)}
                </span>
              </>
            )}

            {product.unit && (
              <span className="text-[11px] text-slate-400 font-medium">
                / {product.unit}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons Section */}
        {/* Prominent "Book Now" Button right below the photo and specs as requested by user! */}
        <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
          {/* MAIN BOOK BUTTON ("Jyare koi loko product no photo jue tyare ene niche book nu button dekhay") */}
          <button
            onClick={() => openBookingModal(product)}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white rounded-xl text-sm font-bold shadow-md shadow-rose-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group/btn cursor-pointer"
          >
            <BookmarkCheck className="w-4 h-4 transition-transform group-hover/btn:scale-125" />
            <span>{t('Book Now / Order', 'ઓર્ડર / બુક કરો')}</span>
          </button>

          {/* Connected Action Buttons: Direct WhatsApp & Email */}
          <div className="grid grid-cols-2 gap-2">
            {/* WhatsApp Direct Product Inquiry Button */}
            <a
              href={getWhatsAppProductUrl(product)}
              target="_blank"
              rel="noopener noreferrer"
              className="py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-95"
              title="Order this product directly on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
              <span>WhatsApp</span>
            </a>

            {/* Email Inquiry Button */}
            <a
              href={getEmailProductUrl(product)}
              className="py-1.5 px-2 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-95"
              title="Send Inquiry Email"
            >
              <Mail className="w-3.5 h-3.5 text-blue-600" />
              <span>Email</span>
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
