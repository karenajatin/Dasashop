import React from 'react';
import { motion } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { 
  Shirt, 
  Smartphone, 
  ShoppingBag, 
  Coffee, 
  Footprints, 
  ArrowRight, 
  Tag, 
  Sparkles,
  Layers
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  Shirt,
  Smartphone,
  ShoppingBag,
  Coffee,
  Footprints,
};

export const CategoryNavButtons: React.FC = () => {
  const { categories, products, language, t, navigateToCategory } = useStore();

  return (
    <section id="category-nav-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-200">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
          <Layers className="w-4 h-4 text-amber-600" />
          <span>{t('Browse By Types / Categories', 'વસ્તુઓ ના પ્રકાર / કેટેગરી મુજબ જુઓ')}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {t('Explore Items by Category', 'વસ્તુના પ્રકાર પ્રમાણે નવી પેજ પર જાઓ')}
        </h2>
        <p className="text-sm text-slate-600 mt-2">
          {t(
            'Click any category button below to open its dedicated page. Each category page shows discount items on top and normal items below.',
            'નીચે આપેલા કોઈપણ કેટેગરી બટન પર ક્લિક કરો. દરેક પેજ પર ઉપર ડિસ્કાઉન્ટ વાળી વસ્તુઓ અને નીચે સામાન્ય વસ્તુઓ જોવા મળશે.'
          )}
        </p>
      </div>

      {/* Grid of Category Buttons / Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5">
        {categories.map((cat, index) => {
          const IconComponent = ICON_MAP[cat.iconName] || ShoppingBag;
          const catProducts = products.filter((p) => p.categoryId === cat.id);
          const catDiscountProducts = catProducts.filter((p) => p.hasDiscount && p.discountPrice && p.discountPrice < p.originalPrice);

          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.08 }}
              whileHover={{ y: -6 }}
              onClick={() => navigateToCategory(cat.id)}
              className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white border border-slate-200 hover:border-rose-400 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between"
            >
              {/* Image banner with overlay */}
              <div className="relative h-28 sm:h-36 overflow-hidden bg-slate-900">
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />

                {/* Floating Discount Tag if has discounts */}
                {catDiscountProducts.length > 0 && (
                  <div className="absolute top-2 right-2 bg-rose-600 text-white text-[9px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>{catDiscountProducts.length} {t('Deals', 'ઓફર્સ')}</span>
                  </div>
                )}

                {/* Category Icon Badge */}
                <div className="absolute bottom-2 left-2 sm:bottom-2.5 sm:left-3 w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/90 backdrop-blur-xs text-rose-600 flex items-center justify-center shadow-md group-hover:bg-rose-600 group-hover:text-white transition-colors">
                  <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </div>

              {/* Text content */}
              <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-xs sm:text-base group-hover:text-rose-600 transition-colors line-clamp-1">
                    {language === 'gu' ? cat.nameGu : cat.name}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-500 line-clamp-1 sm:line-clamp-2 mt-0.5 sm:mt-1">
                    {language === 'gu' && cat.descriptionGu ? cat.descriptionGu : cat.description}
                  </p>
                </div>

                {/* Bottom stats and button */}
                <div className="mt-2 sm:mt-4 pt-2 sm:pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] sm:text-xs">
                  <span className="text-slate-500 font-medium">
                    {catProducts.length} {t('Items', 'વસ્તુઓ')}
                  </span>
                  <span className="font-bold text-rose-600 group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                    <span className="hidden sm:inline">{t('View Page', 'પેજ જુઓ')}</span>
                    <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
