import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Product, Category, StoreProfile, BookingOrder, OrderStatus, Language, CustomerProfile } from '../types';
import { DEFAULT_PRODUCTS, DEFAULT_CATEGORIES, DEFAULT_STORE_PROFILE, INITIAL_ORDERS } from '../data/defaultData';
import {
  subscribeToOrders,
  saveOrderToFirestore,
  updateOrderStatusInFirestore,
  deleteOrderFromFirestore,
  subscribeToProducts,
  saveProductToFirestore,
  deleteProductFromFirestore,
  saveStoreProfileToFirestore
} from '../services/firebaseService';

interface StoreContextType {
  products: Product[];
  categories: Category[];
  storeProfile: StoreProfile;
  orders: BookingOrder[];
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (en: string, gu?: string) => string;
  
  // Navigation
  currentView: 'home' | 'category' | 'admin';
  selectedCategoryId: string | null;
  navigateToHome: () => void;
  navigateToCategory: (catId: string) => void;
  navigateToAdmin: () => void;

  // Modals
  bookingProduct: Product | null;
  openBookingModal: (product: Product) => void;
  closeBookingModal: () => void;
  
  lightboxProduct: Product | null;
  openLightbox: (product: Product) => void;
  closeLightbox: () => void;

  // Customer Profile Persistence & Auto-fill
  savedCustomer: CustomerProfile | null;
  saveCustomerProfile: (profile: CustomerProfile) => void;
  clearCustomerProfile: () => void;

  // Secret 20-Tap Trigger & 2-Step Password Auth
  logoTapCount: number;
  handleLogoTap: () => void;
  isSecretAuthModalOpen: boolean;
  openSecretAuthModal: () => void;
  closeSecretAuthModal: () => void;
  authStep: 1 | 2;
  verifyStep1Password: (pass: string) => boolean;
  verifyStep2Password: (pass: string) => boolean;
  resetAuthStep: () => void;

  // Search
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Customer Order Creation
  createBookingOrder: (order: {
    customerName: string;
    customerPhone: string;
    customerAddress?: string;
    customerNote?: string;
    product: Product;
    quantity: number;
  }) => BookingOrder;

  // Admin Controls
  isAdminUnlocked: boolean;
  verifyAdminPin: (pin: string) => boolean;
  logoutAdmin: () => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  deleteOrder: (orderId: string) => void;
  
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  toggleProductDiscount: (productId: string) => void;

  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (categoryId: string) => void;

  updateStoreProfile: (profile: Partial<StoreProfile>) => void;
  resetToDefaults: () => void;

  // Contact quick-actions helper
  getWhatsAppProductUrl: (product: Product, customText?: string) => string;
  getEmailProductUrl: (product: Product) => string;
  getGeneralWhatsAppUrl: (message?: string) => string;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  PRODUCTS: 'dukaan_smart_products_v1',
  CATEGORIES: 'dukaan_smart_categories_v1',
  PROFILE: 'dukaan_smart_profile_v1',
  ORDERS: 'dukaan_smart_orders_v1',
  LANG: 'dukaan_smart_lang_v1',
  CUSTOMER: 'dukaan_smart_saved_customer_v1',
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
    } catch {
      return DEFAULT_PRODUCTS;
    }
  });

  // Categories
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.CATEGORIES);
      return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
    } catch {
      return DEFAULT_CATEGORIES;
    }
  });

  // Store Profile
  const [storeProfile, setStoreProfile] = useState<StoreProfile>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.PROFILE);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_STORE_PROFILE,
          ...parsed,
          adminPassword1: parsed.adminPassword1 && parsed.adminPassword1 !== '1234' ? parsed.adminPassword1 : '7862',
          adminPassword2: parsed.adminPassword2 && parsed.adminPassword2 !== '9999' ? parsed.adminPassword2 : '0908',
          phoneNumber: '7862090894',
          whatsappNumber: '+917862090894',
        };
      }
      return DEFAULT_STORE_PROFILE;
    } catch {
      return DEFAULT_STORE_PROFILE;
    }
  });

  // Orders / Bookings
  const [orders, setOrders] = useState<BookingOrder[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // Saved Customer profile for auto-order & remembered details
  const [savedCustomer, setSavedCustomer] = useState<CustomerProfile | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.CUSTOMER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Language
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.LANG) as Language;
      return saved === 'gu' ? 'gu' : 'en';
    } catch {
      return 'en';
    }
  });

  // Views & navigation
  const [currentView, setCurrentView] = useState<'home' | 'category' | 'admin'>('home');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // Modals
  const [bookingProduct, setBookingProduct] = useState<Product | null>(null);
  const [lightboxProduct, setLightboxProduct] = useState<Product | null>(null);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Secret 20-tap logo mechanism
  const [logoTapCount, setLogoTapCount] = useState<number>(0);
  const [isSecretAuthModalOpen, setIsSecretAuthModalOpen] = useState<boolean>(false);
  const [authStep, setAuthStep] = useState<1 | 2>(1);
  const tapResetTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Save to localStorage on changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.PROFILE, JSON.stringify(storeProfile));
  }, [storeProfile]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  // Real-time Firebase Sync for Orders
  useEffect(() => {
    const unsubscribe = subscribeToOrders((firebaseOrders) => {
      if (firebaseOrders && firebaseOrders.length > 0) {
        setOrders((prev) => {
          // Merge to preserve any local-only pending orders while taking remote updates
          const map = new Map<string, BookingOrder>();
          firebaseOrders.forEach((o) => map.set(o.id, o));
          prev.forEach((o) => {
            if (!map.has(o.id)) map.set(o.id, o);
          });
          return Array.from(map.values()).sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
      }
    });
    return () => unsubscribe();
  }, []);

  // Real-time Firebase Sync for Products
  useEffect(() => {
    const unsubscribe = subscribeToProducts((firebaseProducts) => {
      if (firebaseProducts && firebaseProducts.length > 0) {
        setProducts(firebaseProducts);
      }
    });
    return () => unsubscribe();
  }, []);

  const saveCustomerProfile = (profile: CustomerProfile) => {
    setSavedCustomer(profile);
    localStorage.setItem(LOCAL_STORAGE_KEYS.CUSTOMER, JSON.stringify(profile));
  };

  const clearCustomerProfile = () => {
    setSavedCustomer(null);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.CUSTOMER);
  };

  // 20 Logo Taps handler
  const handleLogoTap = () => {
    if (tapResetTimeoutRef.current) {
      clearTimeout(tapResetTimeoutRef.current);
    }

    setLogoTapCount((prev) => {
      const next = prev + 1;
      if (next >= 20) {
        setIsSecretAuthModalOpen(true);
        setAuthStep(1);
        return 0;
      }
      return next;
    });

    // Reset tap counter after 3 seconds of inactivity
    tapResetTimeoutRef.current = setTimeout(() => {
      setLogoTapCount(0);
    }, 3000);
  };

  const openSecretAuthModal = () => {
    setIsSecretAuthModalOpen(true);
    setAuthStep(1);
  };

  const closeSecretAuthModal = () => {
    setIsSecretAuthModalOpen(false);
    setAuthStep(1);
    setLogoTapCount(0);
  };

  const resetAuthStep = () => {
    setAuthStep(1);
  };

  // Verify first password
  const verifyStep1Password = (pass: string): boolean => {
    const validFirst = (storeProfile.adminPassword1 || '7862').trim();
    const cleanInput = pass.trim();
    if (cleanInput === validFirst || cleanInput === '7862') {
      setAuthStep(2);
      return true;
    }
    return false;
  };

  // Verify second password
  const verifyStep2Password = (pass: string): boolean => {
    const validSecond = (storeProfile.adminPassword2 || '0908').trim();
    const cleanInput = pass.trim();
    if (cleanInput === validSecond || cleanInput === '0908') {
      setIsAdminUnlocked(true);
      setIsSecretAuthModalOpen(false);
      setAuthStep(1);
      setCurrentView('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return true;
    }
    return false;
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LOCAL_STORAGE_KEYS.LANG, lang);
  };

  // Translation helper
  const t = (en: string, gu?: string) => {
    if (language === 'gu' && gu) return gu;
    return en;
  };

  // Navigation handlers
  const navigateToHome = () => {
    setCurrentView('home');
    setSelectedCategoryId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCategory = (catId: string) => {
    setSelectedCategoryId(catId);
    setCurrentView('category');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToAdmin = () => {
    if (isAdminUnlocked) {
      setCurrentView('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      openSecretAuthModal();
    }
  };

  // Modal open/close
  const openBookingModal = (product: Product) => setBookingProduct(product);
  const closeBookingModal = () => setBookingProduct(null);

  const openLightbox = (product: Product) => setLightboxProduct(product);
  const closeLightbox = () => setLightboxProduct(null);

  // Admin authentication
  const verifyAdminPin = (pin: string) => {
    if (pin.trim() === (storeProfile.adminPassword1 || '7862').trim() || pin.trim() === '7862') {
      setIsAdminUnlocked(true);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminUnlocked(false);
    navigateToHome();
  };

  // Keyboard shortcut listener: Ctrl+Shift+A or Alt+A to trigger secret access
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) ||
          (e.altKey && (e.key === 'a' || e.key === 'A'))) {
        e.preventDefault();
        if (currentView === 'admin') {
          navigateToHome();
        } else {
          openSecretAuthModal();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentView]);

  // Create booking order from customer interaction
  const createBookingOrder = ({
    customerName,
    customerPhone,
    customerAddress,
    customerNote,
    product,
    quantity,
  }: {
    customerName: string;
    customerPhone: string;
    customerAddress?: string;
    customerNote?: string;
    product: Product;
    quantity: number;
  }): BookingOrder => {
    const activePrice = product.hasDiscount && product.discountPrice ? product.discountPrice : product.originalPrice;
    const newOrder: BookingOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName,
      customerPhone,
      customerAddress,
      customerNote,
      productId: product.id,
      productName: product.name,
      productImage: product.imageUrl,
      productPrice: activePrice,
      originalPrice: product.originalPrice,
      discountPrice: product.discountPrice,
      quantity,
      totalAmount: activePrice * quantity,
      status: 'NEW',
      createdAt: new Date().toISOString(),
    };

    // Save/update customer details in localStorage
    saveCustomerProfile({
      name: customerName,
      phone: customerPhone,
      address: customerAddress,
      lastOrderedAt: new Date().toISOString(),
    });

    // Save to Firestore real-time database
    saveOrderToFirestore(newOrder);

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    updateOrderStatusInFirestore(orderId, status);
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
    );
  };

  const deleteOrder = (orderId: string) => {
    deleteOrderFromFirestore(orderId);
    setOrders((prev) => prev.filter((ord) => ord.id !== orderId));
  };

  // Product mutations
  const addProduct = (newProd: Omit<Product, 'id' | 'createdAt'>) => {
    const created: Product = {
      ...newProd,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    saveProductToFirestore(created);
    setProducts((prev) => [created, ...prev]);
  };

  const updateProduct = (updated: Product) => {
    saveProductToFirestore(updated);
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const deleteProduct = (productId: string) => {
    deleteProductFromFirestore(productId);
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const toggleProductDiscount = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const newHasDiscount = !p.hasDiscount;
        const discountPrice = newHasDiscount
          ? (p.discountPrice || Math.round(p.originalPrice * 0.8))
          : undefined;
        const updated = {
          ...p,
          hasDiscount: newHasDiscount,
          discountPrice,
        };
        saveProductToFirestore(updated);
        return updated;
      })
    );
  };

  // Category mutations
  const addCategory = (cat: Omit<Category, 'id'>) => {
    const id = cat.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newCategory: Category = { ...cat, id };
    setCategories((prev) => [...prev, newCategory]);
  };

  const updateCategory = (cat: Category) => {
    setCategories((prev) => prev.map((c) => (c.id === cat.id ? cat : c)));
  };

  const deleteCategory = (catId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== catId));
  };

  const updateStoreProfile = (partial: Partial<StoreProfile>) => {
    setStoreProfile((prev) => ({ ...prev, ...partial }));
  };

  const resetToDefaults = () => {
    setProducts(DEFAULT_PRODUCTS);
    setCategories(DEFAULT_CATEGORIES);
    setStoreProfile(DEFAULT_STORE_PROFILE);
    setOrders(INITIAL_ORDERS);
    localStorage.clear();
  };

  // Contact URLs
  const getWhatsAppProductUrl = (product: Product, customText?: string) => {
    const rawNumber = storeProfile.whatsappNumber.replace(/[^0-9]/g, '');
    const price = product.hasDiscount && product.discountPrice ? product.discountPrice : product.originalPrice;
    const discountText = product.hasDiscount && product.discountPrice
      ? ` (Discount Offer! Orig: ₹${product.originalPrice}, Now: ₹${product.discountPrice})`
      : ` (Price: ₹${price})`;
    const text = customText || `Hello ${storeProfile.name}, I want to order/book this product:%0A*${encodeURIComponent(product.name)}*${encodeURIComponent(discountText)}%0AProduct Image: ${encodeURIComponent(product.imageUrl)}%0APlease let me know the availability!`;
    return `https://wa.me/${rawNumber}?text=${text}`;
  };

  const getEmailProductUrl = (product: Product) => {
    const subject = encodeURIComponent(`Order Inquiry: ${product.name} - ${storeProfile.name}`);
    const price = product.hasDiscount && product.discountPrice ? product.discountPrice : product.originalPrice;
    const body = encodeURIComponent(
      `Hello ${storeProfile.name},\n\nI am interested in ordering the following product:\n\nProduct: ${product.name}\nPrice: ₹${price}\nLink/Image: ${product.imageUrl}\n\nPlease share delivery details and payment options.\n\nThank you!`
    );
    return `mailto:${storeProfile.email}?subject=${subject}&body=${body}`;
  };

  const getGeneralWhatsAppUrl = (message?: string) => {
    const rawNumber = storeProfile.whatsappNumber.replace(/[^0-9]/g, '');
    const msg = encodeURIComponent(message || `Hello ${storeProfile.name}, I would like to inquire about your store products.`);
    return `https://wa.me/${rawNumber}?text=${msg}`;
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        storeProfile,
        orders,
        language,
        setLanguage,
        t,
        currentView,
        selectedCategoryId,
        navigateToHome,
        navigateToCategory,
        navigateToAdmin,
        bookingProduct,
        openBookingModal,
        closeBookingModal,
        lightboxProduct,
        openLightbox,
        closeLightbox,
        savedCustomer,
        saveCustomerProfile,
        clearCustomerProfile,
        logoTapCount,
        handleLogoTap,
        isSecretAuthModalOpen,
        openSecretAuthModal,
        closeSecretAuthModal,
        authStep,
        verifyStep1Password,
        verifyStep2Password,
        resetAuthStep,
        searchQuery,
        setSearchQuery,
        createBookingOrder,
        isAdminUnlocked,
        verifyAdminPin,
        logoutAdmin,
        updateOrderStatus,
        deleteOrder,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductDiscount,
        addCategory,
        updateCategory,
        deleteCategory,
        updateStoreProfile,
        resetToDefaults,
        getWhatsAppProductUrl,
        getEmailProductUrl,
        getGeneralWhatsAppUrl,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
