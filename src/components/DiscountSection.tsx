import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { 
  Percent, 
  Flame, 
  ArrowUpDown, 
  Sparkles,
  Tag
} from 'lucide-react';

export const DiscountSection: React.FC = () => {
  const { products, categories, language, t, searchQuery } = useStore();
  const [selectedCatFilter, setSelectedCatFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'discount' | 'price-low' | 'price-high'>('discount');

  // Filter products that have discounts
  const discountProducts = useMemo(() => {
    return products.filter((p) => {
      const hasDiscount = p.hasDiscount && p.discountPrice && p.discountPrice < p.originalPrice;
      if (!hasDiscount) return false;

      // Category filter
      if (selectedCatFilter !== 'all' && p.categoryId !== selectedCatFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q) || (p.nameGu && p.nameGu.toLowerCase().includes(q));
        const matchDesc = p.description.toLowerCase().includes(q) || (p.descriptionGu && p.descriptionGu.toLowerCase().includes(q));
        return matchName || matchDesc;
      }

      return true;
    });
  }, [products, selectedCatFilter, searchQuery]);

  // Sort
  const sortedDiscountProducts = useMemo(() => {
    return [...discountProducts].sort((a, b) => {
      const discountA = a.discountPrice ? ((a.originalPrice - a.discountPrice) / a.originalPrice) : 0;
      const discountB = b.discountPrice ? ((b.originalPrice - b.discountPrice) / b.originalPrice) : 0;
      const priceA = a.discountPrice || a.originalPrice;
      const priceB = b.discountPrice || b.originalPrice;

      if (sortBy === 'discount') return discountB - discountA;
      if (sortBy === 'price-low') return priceA - priceB;
      if (sortBy === 'price-high') return priceB - priceA;
      return 0;
    });
  }, [discountProducts, sortBy]);

  return (
    <section id="discount-deals-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header section with badge */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-black uppercase tracking-wider mb-2">
            <Flame className="w-4 h-4 fill-red-600 text-red-600" />
            <span>{t('Special Offer Items', 'ખાસ ડિસ્કાઉન્ટ વાળી વસ્તુઓ')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>{t('Items With Huge Discounts', 'ભારે ડિસ્કાઉન્ટ વાળી તમામ વસ્તુઓ')}</span>
            <span className="text-sm font-semibold bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-0.5 rounded-full">
              {discountProducts.length} {t('Deals', 'ઓફર્સ')}
            </span>
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {t(
              'Explore handpicked items currently on discount. Click any photo or book instantly below.',
              'હાલમાં ડિસ્કાઉન્ટ પર ઉપલબ્ધ વસ્તુઓ જુઓ. ફોટા પર ક્લિક કરી મોટો ફોટો જુઓ અથવા નીચેના બટનથી બુક કરો.'
            )}
          </p>
        </div>

        {/* Filters and Sorting controls */}
        <div className="flex items-center gap-2 self-start md:self-end">
          <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-medium text-slate-500">{t('Sort:', 'ક્રમ:')}</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent font-bold text-slate-800 focus:outline-hidden cursor-pointer"
            >
              <option value="discount">{t('Highest Discount %', 'સૌથી વધુ ડિસ્કાઉન્ટ %')}</option>
              <option value="price-low">{t('Price: Low to High', 'કિંમત: ઓછી થી વધુ')}</option>
              <option value="price-high">{t('Price: High to Low', 'કિંમત: વધુ થી ઓછી')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills for quick filtering within discounts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        <button
          onClick={() => setSelectedCatFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            selectedCatFilter === 'all'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          {t('All Discounts', 'બધા ડિસ્કાઉન્ટ')}
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCatFilter(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              selectedCatFilter === cat.id
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {language === 'gu' ? cat.nameGu : cat.name}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {sortedDiscountProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedDiscountProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
          <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
            <Tag className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">
            {t('No Discount Items Found', 'કોઈ ડિસ્કાઉન્ટ વાળી વસ્તુ મળી નથી')}
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-1">
            {t(
              'No items currently match this category filter. Shopkeeper can add discounts from the control panel.',
              'પસંદ કરેલ કેટેગરીમાં હાલ કોઈ છૂટ નથી. દુકાનદાર કંટ્રોલ પેનલમાંથી નવી છૂટ ઉમેરી શકે છે.'
            )}
          </p>
          <button
            onClick={() => setSelectedCatFilter('all')}
            className="mt-4 px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl"
          >
            {t('View All Discounts', 'બધા ડિસ્કાઉન્ટ જુઓ')}
          </button>
        </div>
      )}
    </section>
  );
};
