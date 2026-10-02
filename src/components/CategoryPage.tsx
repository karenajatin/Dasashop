import React, { useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { 
  ArrowLeft, 
  Flame, 
  Package, 
  Sparkles, 
  Percent, 
  Search, 
  CheckCircle,
  Tag
} from 'lucide-react';

export const CategoryPage: React.FC = () => {
  const { 
    categories, 
    products, 
    selectedCategoryId, 
    navigateToHome, 
    navigateToCategory, 
    language, 
    t, 
    searchQuery, 
    setSearchQuery,
    storeProfile 
  } = useStore();

  const currentCategory = categories.find((c) => c.id === selectedCategoryId) || categories[0];

  // Filter items belonging to this category
  const categoryProducts = useMemo(() => {
    return products.filter((p) => {
      if (p.categoryId !== currentCategory.id) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q) || (p.nameGu && p.nameGu.toLowerCase().includes(q));
        const matchDesc = p.description.toLowerCase().includes(q) || (p.descriptionGu && p.descriptionGu.toLowerCase().includes(q));
        return matchName || matchDesc;
      }
      return true;
    });
  }, [products, currentCategory.id, searchQuery]);

  // SPEC REQUIREMENT: "In this new pages, see this things discount at top and down, see normal things."
  // 1. Top: Discount Items
  const discountItems = useMemo(() => {
    return categoryProducts.filter((p) => p.hasDiscount && p.discountPrice && p.discountPrice < p.originalPrice);
  }, [categoryProducts]);

  // 2. Down: Normal Items (no discount / regular price)
  const normalItems = useMemo(() => {
    return categoryProducts.filter((p) => !p.hasDiscount || !p.discountPrice || p.discountPrice >= p.originalPrice);
  }, [categoryProducts]);

  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Navigation Breadcrumb & Back */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={navigateToHome}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 rounded-xl font-bold text-sm shadow-xs border border-slate-200 transition active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-rose-600" />
            <span>{t('← Back to Home Page', '← મુખ્ય પેજ પર પાછા જાઓ')}</span>
          </button>

          {/* Quick switcher to other categories */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
            <span className="text-xs text-slate-500 font-semibold uppercase">{t('Categories:', 'કેટેગરી:')}</span>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => navigateToCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  cat.id === currentCategory.id
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {language === 'gu' ? cat.nameGu : cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Category Header Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-6 sm:p-10 shadow-lg">
          <div className="absolute inset-0 z-0">
            <img 
              src={currentCategory.imageUrl} 
              alt={currentCategory.name} 
              className="w-full h-full object-cover opacity-30 blur-xs scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent" />
          </div>

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 bg-rose-500/20 border border-rose-400/30 text-rose-300 px-3 py-1 rounded-full text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('Category Showcase', 'કેટેગરી કલેક્શન')}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              {language === 'gu' ? currentCategory.nameGu : currentCategory.name}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
              {language === 'gu' && currentCategory.descriptionGu 
                ? currentCategory.descriptionGu 
                : currentCategory.description}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-semibold">
              <span className="bg-white/20 backdrop-blur-xs px-3 py-1 rounded-lg">
                🔥 {discountItems.length} {t('Discount Deals at Top', 'ડિસ્કાઉન્ટ વાળી વસ્તુઓ')}
              </span>
              <span className="bg-white/20 backdrop-blur-xs px-3 py-1 rounded-lg">
                📦 {normalItems.length} {t('Regular Items Below', 'સામાન્ય વસ્તુઓ')}
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 1: TOP SECTION - DISCOUNT ITEMS */}
        {/* SPEC REQUIREMENT: "In this new pages, see this things discount at top" */}
        <div className="bg-gradient-to-b from-rose-50/60 to-white rounded-3xl p-6 sm:p-8 border border-rose-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-rose-200">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-black uppercase tracking-wider mb-1.5 shadow-xs">
                <Flame className="w-3.5 h-3.5 fill-white text-white" />
                <span>{t('TOP SECTION: SPECIAL DISCOUNTS', 'ટોપ સેક્શન: ખાસ ડિસ્કાઉન્ટ વાળી વસ્તુઓ')}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {t('Discount Deals in', 'ખાસ ડિસ્કાઉન્ટ ઑફર્સ -')}{' '}
                <span className="text-rose-600">
                  {language === 'gu' ? currentCategory.nameGu : currentCategory.name}
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                {t(
                  'Exclusive reduced prices on items in this category. Click Book Now to order.',
                  'આ કેટેગરીમાં ઉપલબ્ધ ડિસ્કાઉન્ટ વાળી વસ્તુઓ. બુક કરવા માટે નીચેના બટન પર ક્લિક કરો.'
                )}
              </p>
            </div>

            <span className="text-xs font-bold bg-rose-100 text-rose-800 px-3 py-1.5 rounded-xl border border-rose-200 shrink-0 self-start sm:self-auto">
              {discountItems.length} {t('Items on Sale', 'ઓફર વસ્તુઓ')}
            </span>
          </div>

          {discountItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {discountItems.map((product) => (
                <ProductCard key={product.id} product={product} featuredBanner={true} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white/70 rounded-2xl border border-rose-100 p-6">
              <Tag className="w-10 h-10 text-rose-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">
                {t('No discounted items in this category currently', 'આ કેટેગરીમાં હાલ કોઈ ડિસ્કાઉન્ટ પ્રોડક્ટ નથી')}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {t('Check regular items below or check back soon for deals!', 'નીચેની સામાન્ય વસ્તુઓ જુઓ અથવા નવી ઑફર્સ માટે રાહ જુઓ.')}
              </p>
            </div>
          )}
        </div>

        {/* SECTION 2: DOWN SECTION - NORMAL ITEMS */}
        {/* SPEC REQUIREMENT: "and down, see normal things." */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-white text-xs font-bold uppercase tracking-wider mb-1.5">
                <Package className="w-3.5 h-3.5" />
                <span>{t('DOWN SECTION: REGULAR ITEMS', 'નીચેનું સેક્શન: સામાન્ય વસ્તુઓ')}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {t('Standard & Regular Items in', 'સામાન્ય કિંમત વાળી વસ્તુઓ -')}{' '}
                <span className="text-slate-800">
                  {language === 'gu' ? currentCategory.nameGu : currentCategory.name}
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {t(
                  'Regular high-quality everyday items in this category at everyday fair prices.',
                  'આ કેટેગરી ની રોજિંદી શ્રેષ્ઠ ક્વોલિટી ની સામાન્ય વસ્તુઓ.'
                )}
              </p>
            </div>

            <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200 shrink-0 self-start sm:self-auto">
              {normalItems.length} {t('Regular Items', 'સામાન્ય પ્રોડક્ટ્સ')}
            </span>
          </div>

          {normalItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {normalItems.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-100 p-6">
              <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">
                {t('All items in this category currently have discount deals above!', 'આ કેટેગરીની બધી વસ્તુઓ હાલ ઉપર ડિસ્કાઉન્ટ માં ઉપલબ્ધ છે!')}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
