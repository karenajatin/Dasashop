import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  ShoppingBag, 
  Phone, 
  Mail, 
  MessageCircle, 
  MapPin, 
  Lock, 
  Heart,
  ShieldCheck,
  Percent,
  Clock
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { 
    storeProfile, 
    categories, 
    language, 
    t, 
    navigateToHome, 
    navigateToCategory, 
    navigateToAdmin,
    getGeneralWhatsAppUrl 
  } = useStore();

  return (
    <footer className="bg-slate-950 text-slate-300 pt-12 pb-8 border-t border-slate-900 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Col 1: Store Branding */}
          <div className="space-y-4">
            <div 
              onClick={navigateToHome}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white shadow-md">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-lg text-white tracking-tight">
                  {language === 'gu' ? storeProfile.nameGu : storeProfile.name}
                </span>
                <span className="block text-[11px] text-emerald-400 font-semibold">
                  ✓ {t('Verified Local Store', 'વેરીફાઈડ લોકલ સ્ટોર')}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'gu' ? storeProfile.taglineGu : storeProfile.tagline}
            </p>

            <div className="flex items-center gap-2 pt-1">
              <a
                href={getGeneralWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition"
                title="WhatsApp"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
              </a>
              <a
                href={`mailto:${storeProfile.email}`}
                className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white flex items-center justify-center transition"
                title="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href={`tel:${storeProfile.phoneNumber}`}
                className="w-8 h-8 rounded-lg bg-amber-600/20 text-amber-400 hover:bg-amber-600 hover:text-white flex items-center justify-center transition"
                title="Call"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Categories / Things Types */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">
              {t('Category Types', 'વસ્તુઓ ના પ્રકાર')}
            </h4>
            <ul className="space-y-2 text-xs">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => navigateToCategory(cat.id)}
                    className="hover:text-rose-400 transition flex items-center gap-1.5"
                  >
                    <span>•</span>
                    <span>{language === 'gu' ? cat.nameGu : cat.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Direct Contact Information */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">
              {t('Direct Contacts', 'સીધો સંપર્ક')}
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>{language === 'gu' && storeProfile.addressGu ? storeProfile.addressGu : storeProfile.address}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`tel:${storeProfile.phoneNumber}`} className="hover:text-white font-mono">
                  {storeProfile.phoneNumber}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={getGeneralWhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="hover:text-white font-mono">
                  {storeProfile.whatsappNumber}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <a href={`mailto:${storeProfile.email}`} className="hover:text-white truncate">
                  {storeProfile.email}
                </a>
              </p>
            </div>
          </div>

          {/* Col 4: Shopkeeper Trust & Discrete Admin */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">
              {t('Shop Guarantee', 'દુકાનની ખાતરી')}
            </h4>
            <p className="text-xs text-slate-400">
              {t(
                'Guaranteed wholesale & retail rates with high customer satisfaction.',
                'સૌથી વ્યાજબી ભાવ અને સંપૂર્ણ સંતોષની ખાતરી.'
              )}
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-slate-400">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>{t('Mon - Sun: 8 AM to 10 PM', 'સોમ - રવિ: ૮:૦૦ થી ૧૦:૦૦')}</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {storeProfile.name}. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Built with care for smart local businesses</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};
