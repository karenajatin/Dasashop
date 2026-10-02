import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, OrderStatus, Category } from '../types';
import { 
  Lock, 
  Unlock, 
  ShoppingBag, 
  Package, 
  UserCheck, 
  Phone, 
  MessageCircle, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Percent, 
  Search, 
  Download, 
  Settings, 
  ArrowLeft,
  Sparkles,
  Store,
  Layers,
  Calendar,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Image as ImageIcon
} from 'lucide-react';

const PRESET_IMAGES = [
  { label: 'Silk Kurta / Dress', url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80' },
  { label: 'Cotton Shirt', url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80' },
  { label: 'Saree Bandhani', url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80' },
  { label: 'Wireless Earbuds', url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80' },
  { label: 'Smart Watch', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80' },
  { label: 'Power Bank', url: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=800&q=80' },
  { label: 'Almonds Dry Fruit', url: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=800&q=80' },
  { label: 'Basmati Rice', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80' },
  { label: 'Pure Cooking Oil', url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80' },
  { label: 'Mixer Grinder', url: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=800&q=80' },
  { label: 'Non-stick Cookware', url: 'https://images.unsplash.com/photo-1584990347449-a681816e3c04?auto=format&fit=crop&w=800&q=80' },
  { label: 'Sports Shoes', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80' },
  { label: 'Travel Backpack', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80' },
];

export const AdminPanel: React.FC = () => {
  const { 
    products, 
    categories, 
    orders, 
    storeProfile, 
    isAdminUnlocked, 
    verifyAdminPin, 
    verifyStep1Password,
    verifyStep2Password,
    logoutAdmin, 
    updateOrderStatus, 
    deleteOrder, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    toggleProductDiscount, 
    updateStoreProfile, 
    resetToDefaults, 
    navigateToHome, 
    language, 
    t 
  } = useStore();

  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'store' | 'categories'>('orders');

  // Orders filters
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('ALL');
  const [orderSearch, setOrderSearch] = useState('');

  // Product modal (Add or Edit)
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Product Form state
  const [prodForm, setProdForm] = useState({
    name: '',
    nameGu: '',
    categoryId: 'fashion',
    originalPrice: 999,
    discountPrice: 699,
    hasDiscount: true,
    imageUrl: PRESET_IMAGES[0].url,
    description: '',
    descriptionGu: '',
    inStock: true,
    unit: 'Piece',
    featured: false,
  });

  // Store Profile Form State
  const [profileForm, setProfileForm] = useState(storeProfile);
  const [profileSavedNotice, setProfileSavedNotice] = useState(false);

  const [lockedStep, setLockedStep] = useState<1 | 2>(1);
  const [lockedPassInput, setLockedPassInput] = useState('');
  const [lockedError, setLockedError] = useState('');

  // Handle 2-step password submit in locked view
  const handleLockedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLockedError('');

    if (lockedStep === 1) {
      const valid = verifyStep1Password(lockedPassInput);
      if (valid) {
        setLockedPassInput('');
        setLockedStep(2);
      } else {
        setLockedError(t('Incorrect first password. Please try again.', 'પહેલો પાસવર્ડ ખોટો છે. ફરી પ્રયત્ન કરો.'));
      }
    } else {
      const valid = verifyStep2Password(lockedPassInput);
      if (valid) {
        setLockedPassInput('');
        setLockedStep(1);
      } else {
        setLockedError(t('Incorrect second password. Please try again.', 'બીજો પાસવર્ડ ખોટો છે. ફરી પ્રયત્ન કરો.'));
      }
    }
  };

  // Open Product Modal
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProdForm({
      name: '',
      nameGu: '',
      categoryId: categories[0]?.id || 'fashion',
      originalPrice: 999,
      discountPrice: 699,
      hasDiscount: true,
      imageUrl: PRESET_IMAGES[0].url,
      description: 'High quality premium product with discount guarantee.',
      descriptionGu: 'શ્રેષ્ઠ ગુણવત્તાવાળી ટકાઉ પ્રોડક્ટ.',
      inStock: true,
      unit: 'Piece',
      featured: false,
    });
    setProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProdForm({
      name: prod.name,
      nameGu: prod.nameGu || '',
      categoryId: prod.categoryId,
      originalPrice: prod.originalPrice,
      discountPrice: prod.discountPrice || Math.round(prod.originalPrice * 0.8),
      hasDiscount: prod.hasDiscount,
      imageUrl: prod.imageUrl,
      description: prod.description,
      descriptionGu: prod.descriptionGu || '',
      inStock: prod.inStock,
      unit: prod.unit || 'Piece',
      featured: !!prod.featured,
    });
    setProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodForm.name.trim()) return;

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        name: prodForm.name,
        nameGu: prodForm.nameGu,
        categoryId: prodForm.categoryId,
        originalPrice: Number(prodForm.originalPrice),
        discountPrice: prodForm.hasDiscount ? Number(prodForm.discountPrice) : undefined,
        hasDiscount: prodForm.hasDiscount,
        imageUrl: prodForm.imageUrl,
        description: prodForm.description,
        descriptionGu: prodForm.descriptionGu,
        inStock: prodForm.inStock,
        unit: prodForm.unit,
        featured: prodForm.featured,
      });
    } else {
      addProduct({
        name: prodForm.name,
        nameGu: prodForm.nameGu,
        categoryId: prodForm.categoryId,
        originalPrice: Number(prodForm.originalPrice),
        discountPrice: prodForm.hasDiscount ? Number(prodForm.discountPrice) : undefined,
        hasDiscount: prodForm.hasDiscount,
        imageUrl: prodForm.imageUrl,
        description: prodForm.description,
        descriptionGu: prodForm.descriptionGu,
        inStock: prodForm.inStock,
        unit: prodForm.unit,
        featured: prodForm.featured,
      });
    }
    setProductModalOpen(false);
  };

  const handleSaveStoreProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreProfile(profileForm);
    setProfileSavedNotice(true);
    setTimeout(() => setProfileSavedNotice(false), 3000);
  };

  // Export orders to CSV
  const handleExportCSV = () => {
    const headers = ['Order ID', 'Date', 'Customer Name', 'Phone', 'Product', 'Quantity', 'Total Amount', 'Status', 'Address', 'Note'];
    const rows = orders.map((o) => [
      o.id,
      new Date(o.createdAt).toLocaleString(),
      `"${o.customerName}"`,
      `"${o.customerPhone}"`,
      `"${o.productName}"`,
      o.quantity,
      o.totalAmount,
      o.status,
      `"${o.customerAddress || ''}"`,
      `"${o.customerNote || ''}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `store_orders_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered orders
  const filteredOrders = orders.filter((ord) => {
    if (orderStatusFilter !== 'ALL' && ord.status !== orderStatusFilter) return false;
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      const matchName = ord.customerName.toLowerCase().includes(q);
      const matchPhone = ord.customerPhone.includes(q);
      const matchProduct = ord.productName.toLowerCase().includes(q);
      const matchId = ord.id.toLowerCase().includes(q);
      return matchName || matchPhone || matchProduct || matchId;
    }
    return true;
  });

  const newOrdersCount = orders.filter((o) => o.status === 'NEW').length;

  // IF LOCKED: Show 2-step password entry screen
  if (!isAdminUnlocked) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 mx-auto flex items-center justify-center shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {t('Shopkeeper Control Panel', 'દુકાનદાર કંટ્રોલ પેનલ')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {lockedStep === 1
                ? t('Step 1 of 2: Enter First Secret Password', 'સ્ટેપ ૧/૨: પહેલો સિક્રેટ પાસવર્ડ નાખો')
                : t('Step 2 of 2: Enter Second Secret Password', 'સ્ટેપ ૨/૨: બીજો સિક્રેટ પાસવર્ડ નાખો')}
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-3 text-xs font-bold">
            <span className={`px-2.5 py-1 rounded-full ${lockedStep === 1 ? 'bg-rose-600 text-white' : 'bg-emerald-100 text-emerald-800'}`}>
              ✓ {t('Password 1', 'પાસવર્ડ ૧')}
            </span>
            <span className="text-slate-300">→</span>
            <span className={`px-2.5 py-1 rounded-full ${lockedStep === 2 ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
              {t('Password 2', 'પાસવર્ડ ૨')}
            </span>
          </div>

          <form onSubmit={handleLockedSubmit} className="space-y-4">
            <div className="space-y-1 text-left">
              <label className="block text-xs font-bold text-slate-700">
                {lockedStep === 1 
                  ? t('Enter First Password', 'પહેલો પાસવર્ડ નાખો') 
                  : t('Enter Second Password', 'બીજો પાસવર્ડ નાખો')}
              </label>
              <input
                type="password"
                required
                value={lockedPassInput}
                onChange={(e) => setLockedPassInput(e.target.value)}
                placeholder="••••"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-center text-xl font-bold tracking-widest focus:bg-white focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-hidden font-mono"
                autoFocus
              />
            </div>

            {lockedError && (
              <p className="text-xs text-red-600 font-bold bg-red-50 p-2 rounded-lg border border-red-200">
                {lockedError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white rounded-xl font-bold text-sm shadow-md shadow-rose-200 transition active:scale-95 cursor-pointer"
            >
              {lockedStep === 1 ? t('Next (બીજો પાસવર્ડ)', 'આગળ વધો') : t('Unlock Control Panel', 'કંટ્રોલ પેનલ ખોલો')}
            </button>
          </form>

          {/* Back Button */}
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={navigateToHome}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium py-1 cursor-pointer"
            >
              {t('← Back to Customer Website', '← ગ્રાહક વેબસાઇટ પર પાછા')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // UNLOCKED ADMIN PANEL INTERFACE
  return (
    <div className="min-h-screen bg-slate-100 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Top Admin Header Bar */}
        <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={navigateToHome}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition shrink-0"
              title="Return to Customer Storefront"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight">
                  {t('Shopkeeper Control Panel', 'દુકાનદાર કંટ્રોલ પેનલ')}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {t('Live / સક્રિય', 'સક્રિય')}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {storeProfile.name} • {t('Keyboard Shortcut: Ctrl+Shift+A', 'શોર્ટકી: Ctrl+Shift+A')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto">
            <button
              onClick={navigateToHome}
              className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition"
            >
              {t('View Storefront', 'વેબસાઇટ જુઓ')}
            </button>

            <button
              onClick={logoutAdmin}
              className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{t('Lock Panel', 'લોક કરો')}</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Orders Stat */}
          <div 
            onClick={() => setActiveTab('orders')}
            className={`p-4 rounded-2xl border cursor-pointer transition ${
              activeTab === 'orders' ? 'bg-rose-600 text-white border-rose-600 shadow-md' : 'bg-white text-slate-900 border-slate-200 hover:border-rose-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase">{t('Bookings / Orders', 'ગ્રાહક ઓર્ડર્સ')}</span>
              {newOrdersCount > 0 && (
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${activeTab === 'orders' ? 'bg-white text-rose-600' : 'bg-rose-600 text-white'}`}>
                  {newOrdersCount} {t('NEW', 'નવા')}
                </span>
              )}
            </div>
            <p className="text-2xl sm:text-3xl font-black mt-2">{orders.length}</p>
          </div>

          {/* Products Stat */}
          <div 
            onClick={() => setActiveTab('products')}
            className={`p-4 rounded-2xl border cursor-pointer transition ${
              activeTab === 'products' ? 'bg-rose-600 text-white border-rose-600 shadow-md' : 'bg-white text-slate-900 border-slate-200 hover:border-rose-300'
            }`}
          >
            <span className="text-xs font-bold uppercase">{t('Total Products', 'કુલ પ્રોડક્ટ્સ')}</span>
            <p className="text-2xl sm:text-3xl font-black mt-2">{products.length}</p>
          </div>

          {/* Discount Active Stat */}
          <div 
            onClick={() => setActiveTab('products')}
            className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-900 hover:border-rose-300 transition cursor-pointer"
          >
            <span className="text-xs font-bold uppercase text-emerald-700 flex items-center gap-1">
              <Percent className="w-3.5 h-3.5" />
              {t('On Discount', 'ડિસ્કાઉન્ટમાં')}
            </span>
            <p className="text-2xl sm:text-3xl font-black mt-2 text-emerald-600">
              {products.filter((p) => p.hasDiscount && p.discountPrice).length}
            </p>
          </div>

          {/* Categories Stat */}
          <div 
            onClick={() => setActiveTab('categories')}
            className={`p-4 rounded-2xl border cursor-pointer transition ${
              activeTab === 'categories' ? 'bg-rose-600 text-white border-rose-600 shadow-md' : 'bg-white text-slate-900 border-slate-200 hover:border-rose-300'
            }`}
          >
            <span className="text-xs font-bold uppercase">{t('Categories', 'કેટેગરી')}</span>
            <p className="text-2xl sm:text-3xl font-black mt-2">{categories.length}</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto bg-white p-2 rounded-2xl border border-slate-200 scrollbar-none">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{t('Customer Bookings & Orders', 'ગ્રાહકોના બુકિંગ્સ અને ઓર્ડર')}</span>
            {newOrdersCount > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${activeTab === 'orders' ? 'bg-white text-rose-600' : 'bg-rose-600 text-white'}`}>
                {newOrdersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === 'products'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>{t('Products & Discounts', 'પ્રોડક્ટ્સ અને ડિસ્કાઉન્ટ')}</span>
          </button>

          <button
            onClick={() => setActiveTab('store')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === 'store'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>{t('Store Profile & Contacts', 'દુકાનની માહિતી અને સંપર્ક')}</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === 'categories'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{t('Category Types', 'વસ્તુના પ્રકાર')}</span>
          </button>
        </div>

        {/* TAB 1: CUSTOMER ORDERS / BOOKINGS */}
        {/* SPEC REQUIREMENT: "Jyare koi loko product no photo jue tyare ene niche book nu button dekhay e click karta ene name ane mo. No. Puche ane submit karta shopkeeper eni admin pannel mathi badha order joi sake chhe." */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <span>{t('Customer Bookings List', 'ગ્રાહકોના ઓર્ડર અને બુકિંગનું લિસ્ટ')}</span>
                  <span className="text-xs font-bold bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full">
                    {orders.length} {t('Total', 'કુલ')}
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {t(
                    'When customers click "Book Now" and provide their Name and Mobile, their order arrives here instantly.',
                    'જ્યારે ગ્રાહક "બુક કરો" પર ક્લિક કરી નામ અને મોબાઈલ નંબર નાખશે, ત્યારે તેમનો ઓર્ડર અહીં તરત જ દેખાશે.'
                  )}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportCSV}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Download className="w-4 h-4" />
                  <span>{t('Export to CSV', 'CSV ડાઉનલોડ')}</span>
                </button>
              </div>
            </div>

            {/* Filter controls */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder={t('Search by customer name, phone, order ID, or product...', 'ગ્રાહકનું નામ, ફોન કે પ્રોડક્ટ શોધો...')}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-500/20"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
                {['ALL', 'NEW', 'CONTACTED', 'CONFIRMED', 'DELIVERED', 'CANCELLED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                      orderStatusFilter === st
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st === 'ALL' ? t('All', 'બધા') : st}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table / Cards */}
            {filteredOrders.length > 0 ? (
              <div className="space-y-3">
                {filteredOrders.map((ord) => {
                  const rawPhone = ord.customerPhone.replace(/[^0-9]/g, '');
                  const waUrl = `https://wa.me/91${rawPhone}?text=${encodeURIComponent(
                    `Hello ${ord.customerName}, regarding your booking ${ord.id} for "${ord.productName}" (Qty: ${ord.quantity}, Total: ₹${ord.totalAmount}) at ${storeProfile.name}: We are processing your request. Thank you!`
                  )}`;

                  return (
                    <div
                      key={ord.id}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                        ord.status === 'NEW'
                          ? 'bg-rose-50/50 border-rose-300 ring-1 ring-rose-400/50'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        {/* Left: Customer & Product Info */}
                        <div className="flex items-start gap-4">
                          <img
                            src={ord.productImage}
                            alt={ord.productName}
                            className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                          />

                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                {ord.id}
                              </span>
                              <span
                                className={`text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                                  ord.status === 'NEW'
                                    ? 'bg-rose-600 text-white'
                                    : ord.status === 'CONFIRMED'
                                    ? 'bg-emerald-600 text-white'
                                    : ord.status === 'DELIVERED'
                                    ? 'bg-blue-600 text-white'
                                    : ord.status === 'CANCELLED'
                                    ? 'bg-slate-300 text-slate-700'
                                    : 'bg-amber-500 text-white'
                                }`}
                              >
                                {ord.status}
                              </span>
                              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(ord.createdAt).toLocaleString()}
                              </span>
                            </div>

                            <h4 className="font-extrabold text-base text-slate-900">
                              {ord.productName}
                            </h4>

                            {/* Customer Name & Phone */}
                            <div className="flex items-center gap-3 text-xs text-slate-700 flex-wrap">
                              <span className="font-bold text-slate-900 flex items-center gap-1">
                                <UserCheck className="w-3.5 h-3.5 text-rose-600" />
                                {ord.customerName}
                              </span>
                              <span className="font-mono font-semibold text-slate-800 flex items-center gap-1">
                                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                                {ord.customerPhone}
                              </span>
                              <span>
                                {t('Qty:', 'જથ્થો:')} <strong>{ord.quantity}</strong>
                              </span>
                              <span className="text-rose-600 font-extrabold">
                                {storeProfile.currencySymbol}{ord.totalAmount}
                              </span>
                            </div>

                            {/* Address / Note if provided */}
                            {(ord.customerAddress || ord.customerNote) && (
                              <div className="text-xs text-slate-500 pt-1 space-y-0.5">
                                {ord.customerAddress && (
                                  <p>📍 <strong>{t('Address:', 'સરનામું:')}</strong> {ord.customerAddress}</p>
                                )}
                                {ord.customerNote && (
                                  <p>📝 <strong>{t('Note:', 'સૂચના:')}</strong> {ord.customerNote}</p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Right: Direct Action Buttons (Call Customer, WhatsApp Customer, Status Dropdown) */}
                        <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                          {/* Call Customer Direct */}
                          <a
                            href={`tel:${ord.customerPhone}`}
                            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
                            title="Call customer directly"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>{t('Call', 'કોલ કરો')}</span>
                          </a>

                          {/* WhatsApp Customer Direct */}
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
                            title="Open WhatsApp chat with customer"
                          >
                            <MessageCircle className="w-3.5 h-3.5 fill-white" />
                            <span>WhatsApp</span>
                          </a>

                          {/* Change Order Status */}
                          <select
                            value={ord.status}
                            onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                            className="bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold rounded-xl px-2.5 py-1.5 focus:outline-hidden cursor-pointer"
                          >
                            <option value="NEW">NEW (નવો)</option>
                            <option value="CONTACTED">CONTACTED (વાત થઈ)</option>
                            <option value="CONFIRMED">CONFIRMED (કન્ફર્મ)</option>
                            <option value="DELIVERED">DELIVERED (ડિલિવરી થઈ)</option>
                            <option value="CANCELLED">CANCELLED (રદ)</option>
                          </select>

                          {/* Delete order */}
                          <button
                            onClick={() => {
                              if (confirm(t('Are you sure you want to delete this order?', 'શું તમે આ ઓર્ડર ડિલીટ કરવા માંગો છો?'))) {
                                deleteOrder(ord.id);
                              }
                            }}
                            className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                            title="Delete Order"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-8">
                <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <h4 className="font-bold text-slate-700">
                  {t('No Bookings Found', 'કોઈ ઓર્ડર મળ્યો નથી')}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  {t('Customer bookings submitted from product photos will appear here.', 'જ્યારે ગ્રાહક બુક કરશે ત્યારે ઓર્ડર અહીં દેખાશે.')}
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PRODUCTS & DISCOUNTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  {t('Manage Products & Discounts', 'પ્રોડક્ટ્સ અને ડિસ્કાઉન્ટ મેનેજમેન્ટ')}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {t(
                    'Add new products, set discount percentages, change photos, and toggle deals.',
                    'નવી પ્રોડક્ટ ઉમેરો, ડિસ્કાઉન્ટ ઓફર બદલો, ફોટા અપડેટ કરો.'
                  )}
                </p>
              </div>

              <button
                onClick={handleOpenAddProduct}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-rose-200 transition"
              >
                <Plus className="w-4 h-4" />
                <span>{t('+ Add New Product', '+ નવી પ્રોડક્ટ ઉમેરો')}</span>
              </button>
            </div>

            {/* Products List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-white flex flex-col justify-between hover:shadow-md transition"
                >
                  <div className="flex gap-3">
                    <img
                      src={prod.imageUrl}
                      alt={prod.name}
                      className="w-20 h-20 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          {prod.categoryId}
                        </span>
                        {prod.hasDiscount && (
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-red-100 text-red-700">
                            {t('DISCOUNT', 'ડિસ્કાઉન્ટ')}
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-sm text-slate-900 truncate">
                        {prod.name}
                      </h4>

                      <div className="flex items-baseline gap-2 text-xs">
                        <span className="font-extrabold text-slate-900 text-sm">
                          {storeProfile.currencySymbol}
                          {(prod.hasDiscount && prod.discountPrice ? prod.discountPrice : prod.originalPrice).toLocaleString()}
                        </span>
                        {prod.hasDiscount && prod.discountPrice && (
                          <span className="line-through text-slate-400">
                            {storeProfile.currencySymbol}{prod.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    {/* Toggle Discount */}
                    <button
                      onClick={() => toggleProductDiscount(prod.id)}
                      className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition ${
                        prod.hasDiscount
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <Percent className="w-3 h-3" />
                      <span>{prod.hasDiscount ? t('Discount Active', 'ડિસ્કાઉન્ટ ચાલુ') : t('No Discount', 'ડિસ્કાઉન્ટ બંધ')}</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditProduct(prod)}
                        className="p-1.5 text-slate-600 hover:text-blue-600 rounded-lg hover:bg-slate-100"
                        title="Edit Product"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(t(`Delete product "${prod.name}"?`, `શું તમે "${prod.name}" પ્રોડક્ટ ડિલીટ કરવા માંગો છો?`))) {
                            deleteProduct(prod.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: STORE PROFILE & CONTACTS SETTINGS */}
        {activeTab === 'store' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="pb-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  {t('Store Profile & Contact Settings', 'દુકાનની વિગતો અને સંપર્ક સેટિંગ્સ')}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {t(
                    'Update WhatsApp number, store name, phone, address, and admin PIN.',
                    'વોટ્સએપ નંબર, દુકાનનું નામ, ફોન અને પિન બદલો.'
                  )}
                </p>
              </div>

              {profileSavedNotice && (
                <div className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-300 animate-pulse">
                  ✓ {t('Changes saved successfully!', 'ફેરફાર સફળતાપૂર્વક સાચવવામાં આવ્યા!')}
                </div>
              )}
            </div>

            <form onSubmit={handleSaveStoreProfile} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Store Name (English) */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  {t('Store Name (English)', 'દુકાનનું નામ (અંગ્રેજી)')}
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              {/* Store Name (Gujarati) */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  {t('Store Name (ગુજરાતી)', 'દુકાનનું નામ (ગુજરાતી)')}
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.nameGu}
                  onChange={(e) => setProfileForm({ ...profileForm, nameGu: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              {/* WhatsApp Number */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t('WhatsApp Number (with Country Code)', 'વોટ્સએપ નંબર (દેશ કોડ સાથે)')}</span>
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.whatsappNumber}
                  onChange={(e) => setProfileForm({ ...profileForm, whatsappNumber: e.target.value })}
                  placeholder="+919876543210"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl font-mono"
                />
              </div>

              {/* Calling Phone */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-amber-600" />
                  <span>{t('Calling Phone Number', 'કોલિંગ ફોન નંબર')}</span>
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.phoneNumber}
                  onChange={(e) => setProfileForm({ ...profileForm, phoneNumber: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl font-mono"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  {t('Email Address', 'ઇમેઇલ એડ્રેસ')}
                </label>
                <input
                  type="email"
                  required
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              {/* Admin Passwords for 2-step verification */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  {t('First Secret Password (પહેલો પાસવર્ડ)', 'પહેલો સિક્રેટ પાસવર્ડ')}
                </label>
                <input
                  type="password"
                  required
                  value={profileForm.adminPassword1 || '7862'}
                  onChange={(e) => setProfileForm({ ...profileForm, adminPassword1: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl font-mono tracking-wider"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  {t('Second Secret Password (બીજો પાસવર્ડ)', 'બીજો સિક્રેટ પાસવર્ડ')}
                </label>
                <input
                  type="password"
                  required
                  value={profileForm.adminPassword2 || '0908'}
                  onChange={(e) => setProfileForm({ ...profileForm, adminPassword2: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl font-mono tracking-wider"
                />
              </div>

              {/* Address (English) */}
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-slate-700">
                  {t('Store Address (English)', 'દુકાનનું સરનામું (અંગ્રેજી)')}
                </label>
                <input
                  type="text"
                  value={profileForm.address}
                  onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              {/* Address (Gujarati) */}
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-slate-700">
                  {t('Store Address (ગુજરાતી)', 'દુકાનનું સરનામું (ગુજરાતી)')}
                </label>
                <input
                  type="text"
                  value={profileForm.addressGu}
                  onChange={(e) => setProfileForm({ ...profileForm, addressGu: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              {/* Announcement Banner Text */}
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-slate-700">
                  {t('Top Banner Discount Announcement', 'ઉપર પટ્ટી માં ડિસ્કાઉન્ટ જાહેરાત લખાણ')}
                </label>
                <input
                  type="text"
                  value={profileForm.announcementText}
                  onChange={(e) => setProfileForm({ ...profileForm, announcementText: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="md:col-span-2 pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(t('Reset store data to sample presets?', 'સેમ્પલ ડેટા ફરીથી લાવવો છે?'))) {
                      resetToDefaults();
                    }
                  }}
                  className="px-4 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition"
                >
                  {t('Reset Store to Defaults', 'ડિફોલ્ટ સેમ્પલ ડેટા રીસેટ')}
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black shadow-md transition"
                >
                  {t('Save Changes', 'ફેરફાર સાચવો')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 4: CATEGORIES MANAGEMENT */}
        {activeTab === 'categories' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div>
              <h3 className="text-xl font-black text-slate-900">
                {t('Store Categories & Types', 'વસ્તુના પ્રકાર અને કેટેગરી')}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {t(
                  'These categories appear as buttons at the bottom of the home page.',
                  'આ કેટેગરીઝ મુખપૃષ્ઠ પર નીચે બટન તરીકે દેખાય છે.'
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center gap-3"
                >
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-slate-900 truncate">{cat.name}</h4>
                    <p className="text-xs text-rose-600 font-semibold">{cat.nameGu}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {products.filter((p) => p.categoryId === cat.id).length} {t('Items', 'વસ્તુઓ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* PRODUCT ADD / EDIT MODAL */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <h3 className="font-black text-lg">
                {editingProduct ? t('Edit Product & Discount', 'પ્રોડક્ટ અને ડિસ્કાઉન્ટ એડિટ') : t('Add New Product', 'નવી પ્રોડક્ટ ઉમેરો')}
              </h3>
              <button
                onClick={() => setProductModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Product Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">{t('Product Title (English) *', 'પ્રોડક્ટનું નામ (અંગ્રેજી) *')}</label>
                  <input
                    type="text"
                    required
                    value={prodForm.name}
                    onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                {/* Product Name Gujarati */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">{t('Product Title (ગુજરાતી)', 'પ્રોડક્ટનું નામ (ગુજરાતી)')}</label>
                  <input
                    type="text"
                    value={prodForm.nameGu}
                    onChange={(e) => setProdForm({ ...prodForm, nameGu: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">{t('Category / પ્રકાર', 'કેટેગરી / પ્રકાર')}</label>
                  <select
                    value={prodForm.categoryId}
                    onChange={(e) => setProdForm({ ...prodForm, categoryId: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name} ({c.nameGu})</option>
                    ))}
                  </select>
                </div>

                {/* Unit */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">{t('Unit (e.g. Piece, Kg, Set)', 'એકમ (પીસ, કિલો, સેટ)')}</label>
                  <input
                    type="text"
                    value={prodForm.unit}
                    onChange={(e) => setProdForm({ ...prodForm, unit: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                {/* Original Price */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">{t('Original Price (₹) *', 'મૂળ કિંમત (₹) *')}</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={prodForm.originalPrice}
                    onChange={(e) => setProdForm({ ...prodForm, originalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold"
                  />
                </div>

                {/* Discount Toggle & Discount Price */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">{t('Discount Price (₹)', 'ડિસ્કાઉન્ટ ભાવ (₹)')}</label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={prodForm.hasDiscount}
                        onChange={(e) => setProdForm({ ...prodForm, hasDiscount: e.target.checked })}
                        className="rounded text-rose-600"
                      />
                      <span className="text-[11px] font-bold text-rose-600">{t('Enable Discount', 'ડિસ્કાઉન્ટ આપો')}</span>
                    </label>
                  </div>
                  <input
                    type="number"
                    disabled={!prodForm.hasDiscount}
                    value={prodForm.discountPrice}
                    onChange={(e) => setProdForm({ ...prodForm, discountPrice: Number(e.target.value) })}
                    className={`w-full px-3 py-2 text-sm border rounded-xl font-mono font-bold ${
                      prodForm.hasDiscount ? 'bg-red-50 border-red-300 text-red-600' : 'bg-slate-100 border-slate-200 text-slate-400'
                    }`}
                  />
                </div>
              </div>

              {/* Image Selection: URL or Click-to-pick Presets */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>{t('Product Image URL *', 'પ્રોડક્ટ ફોટો લિંક *')}</span>
                  <span className="text-[11px] text-slate-400">{t('Or choose preset below', 'અથવા નીચેથી પસંદ કરો')}</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    required
                    value={prodForm.imageUrl}
                    onChange={(e) => setProdForm({ ...prodForm, imageUrl: e.target.value })}
                    className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono"
                  />
                  <img
                    src={prodForm.imageUrl}
                    alt="Preview"
                    className="w-10 h-10 rounded-lg object-cover border border-slate-300 shrink-0"
                  />
                </div>

                {/* Preset image thumbnails picker */}
                <div className="space-y-1">
                  <p className="text-[11px] text-slate-500 font-semibold">{t('Quick Presets:', 'ઝડપી ફોટા:')}</p>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {PRESET_IMAGES.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setProdForm({ ...prodForm, imageUrl: img.url })}
                        className={`relative w-12 h-12 rounded-lg overflow-hidden border shrink-0 transition ${
                          prodForm.imageUrl === img.url ? 'ring-2 ring-rose-600 border-transparent scale-105' : 'border-slate-200 opacity-70 hover:opacity-100'
                        }`}
                        title={img.label}
                      >
                        <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">{t('Description (English)', 'વિગત (અંગ્રેજી)')}</label>
                <textarea
                  rows={2}
                  value={prodForm.description}
                  onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">{t('Description (ગુજરાતી)', 'વિગત (ગુજરાતી)')}</label>
                <textarea
                  rows={2}
                  value={prodForm.descriptionGu}
                  onChange={(e) => setProdForm({ ...prodForm, descriptionGu: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              {/* Flags */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodForm.inStock}
                    onChange={(e) => setProdForm({ ...prodForm, inStock: e.target.checked })}
                    className="rounded text-rose-600"
                  />
                  <span className="text-xs font-bold text-slate-700">{t('In Stock', 'સ્ટોકમાં ઉપલબ્ધ')}</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodForm.featured}
                    onChange={(e) => setProdForm({ ...prodForm, featured: e.target.checked })}
                    className="rounded text-rose-600"
                  />
                  <span className="text-xs font-bold text-slate-700">{t('Highlight in Deal Banner', 'સુપર ડીલમાં બતાવો')}</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl"
                >
                  {t('Cancel', 'રદ કરો')}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black shadow-md"
                >
                  {t('Save Product', 'પ્રોડક્ટ સાચવો')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
