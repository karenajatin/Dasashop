import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  MessageCircle, 
  Phone, 
  ArrowUp, 
  Lock, 
  Mail
} from 'lucide-react';

export const FloatingContactDock: React.FC = () => {
  const { storeProfile, getGeneralWhatsAppUrl, navigateToAdmin, currentView, orders } = useStore();
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const newOrdersCount = orders.filter((o) => o.status === 'NEW').length;

  return (
    <aside aria-label="Quick Actions" className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2.5 pointer-events-none">
      <div className="flex flex-col gap-2 pointer-events-auto">
        {/* Back to Top */}
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            className="w-11 h-11 rounded-full bg-slate-900/90 hover:bg-slate-900 text-white shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 border border-white/20 backdrop-blur-xs"
            title="Scroll to Top"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}

        {/* Email Quick Action */}
        <a
          href={`mailto:${storeProfile.email}`}
          className="w-11 h-11 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          title="Send Email to Store"
        >
          <Mail className="w-5 h-5" />
        </a>

        {/* Direct Call Quick Action */}
        <a
          href={`tel:${storeProfile.phoneNumber}`}
          className="w-11 h-11 rounded-full bg-amber-600 hover:bg-amber-700 text-white shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          title="Call Shopkeeper Directly"
        >
          <Phone className="w-5 h-5" />
        </a>

        {/* WhatsApp Fast Button */}
        <a
          href={getGeneralWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          title="Chat on WhatsApp"
        >
          <MessageCircle className="w-6 h-6 fill-white" />
          <span className="absolute right-14 bg-slate-900 text-white text-xs font-bold px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition whitespace-nowrap shadow-md pointer-events-none">
            Chat on WhatsApp
          </span>
        </a>
      </div>
    </aside>
  );
};
