import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  MessageCircle, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  ExternalLink,
  Store,
  Sparkles
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { storeProfile, language, t, getGeneralWhatsAppUrl } = useStore();

  return (
    <section id="contact-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-800 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Info Column */}
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <Store className="w-3.5 h-3.5" />
              <span>{t('Direct Shop Contact', 'સીધો દુકાનદાર સંપર્ક')}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {t('Have Questions or Bulk Order?', 'કોઈ સવાલ છે કે મોટો ઓર્ડર કરવો છે?')}
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed max-w-lg">
              {language === 'gu'
                ? 'અમારા દુકાનદાર સાથે સીધો સંપર્ક કરો. વોટ્સએપ પર મેસેજ કરો, સીધો ફોન કરો અથવા ઇમેઇલ મોકલો. અમે તમને શ્રેષ્ઠ ભાવ અને સર્વિસ આપીશું.'
                : 'Connect directly with our store owner. Send a WhatsApp message, make a quick call, or write an email. We guarantee the best rates and quick home delivery.'}
            </p>

            <div className="space-y-2.5 pt-2 text-xs sm:text-sm text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>
                  {language === 'gu' && storeProfile.addressGu ? storeProfile.addressGu : storeProfile.address}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{t('Open: Mon - Sun: 8:00 AM to 10:00 PM', 'સમય: સોમ થી રવિ: સવારે ૮:૦૦ થી રાત્રે ૧૦:૦૦')}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{t('Managed by:', 'સંચાલક:')} <strong>{storeProfile.ownerName}</strong></span>
              </div>
            </div>
          </div>

          {/* Right Separate Contact Buttons Column */}
          {/* Requirement: "Make contect buttons of what's and email and other separate buttons." */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 1. WHATSAPP BUTTON */}
            <a
              href={getGeneralWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-emerald-600 hover:bg-emerald-500 text-white p-5 rounded-2xl shadow-lg transition-all duration-300 flex flex-col justify-between active:scale-95 border border-emerald-500"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-6 h-6 fill-white text-white" />
                </div>
                <ExternalLink className="w-4 h-4 text-emerald-200" />
              </div>
              <div className="mt-4">
                <span className="text-xs uppercase tracking-wider text-emerald-100 font-bold">
                  {t('Instant Chat', 'ઝડપી ચેટ')}
                </span>
                <h4 className="text-lg font-black">{t('WhatsApp', 'વોટ્સએપ')}</h4>
                <p className="text-xs text-emerald-100 mt-0.5 truncate">
                  {storeProfile.whatsappNumber}
                </p>
              </div>
            </a>

            {/* 2. EMAIL BUTTON */}
            <a
              href={`mailto:${storeProfile.email}`}
              className="group bg-blue-600 hover:bg-blue-500 text-white p-5 rounded-2xl shadow-lg transition-all duration-300 flex flex-col justify-between active:scale-95 border border-blue-500"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <ExternalLink className="w-4 h-4 text-blue-200" />
              </div>
              <div className="mt-4">
                <span className="text-xs uppercase tracking-wider text-blue-100 font-bold">
                  {t('Inquiries & Orders', 'ઈમેઈલ સંપર્ક')}
                </span>
                <h4 className="text-lg font-black">{t('Email Us', 'ઇમેઇલ')}</h4>
                <p className="text-xs text-blue-100 mt-0.5 truncate">
                  {storeProfile.email}
                </p>
              </div>
            </a>

            {/* 3. CALL BUTTON */}
            <a
              href={`tel:${storeProfile.phoneNumber}`}
              className="group bg-amber-600 hover:bg-amber-500 text-white p-5 rounded-2xl shadow-lg transition-all duration-300 flex flex-col justify-between active:scale-95 border border-amber-500"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <ExternalLink className="w-4 h-4 text-amber-200" />
              </div>
              <div className="mt-4">
                <span className="text-xs uppercase tracking-wider text-amber-100 font-bold">
                  {t('Speak to Owner', 'દુકાનદાર સાથે વાત')}
                </span>
                <h4 className="text-lg font-black">{t('Phone Call', 'ફોન કોલ')}</h4>
                <p className="text-xs text-amber-100 mt-0.5 truncate">
                  {storeProfile.phoneNumber}
                </p>
              </div>
            </a>

            {/* 4. MAP / STORE DIRECTIONS BUTTON */}
            <a
              href={storeProfile.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-slate-800 hover:bg-slate-700 text-white p-5 rounded-2xl shadow-lg transition-all duration-300 flex flex-col justify-between active:scale-95 border border-slate-700"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MapPin className="w-6 h-6 text-rose-400" />
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </div>
              <div className="mt-4">
                <span className="text-xs uppercase tracking-wider text-slate-300 font-bold">
                  {t('Visit Store', 'રૂબરૂ મુલાકાત')}
                </span>
                <h4 className="text-lg font-black">{t('Store Location', 'દુકાનનું સરનામું')}</h4>
                <p className="text-xs text-slate-400 mt-0.5 truncate">
                  {t('Google Maps Directions', 'ગૂગલ મેપ્સ પર જુઓ')}
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
