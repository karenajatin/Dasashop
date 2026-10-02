import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Lock, KeyRound, ShieldCheck, X, ArrowRight, CheckCircle2 } from 'lucide-react';

export const SecretAdminAuthModal: React.FC = () => {
  const { 
    isSecretAuthModalOpen, 
    closeSecretAuthModal, 
    authStep, 
    verifyStep1Password, 
    verifyStep2Password,
    resetAuthStep,
    t,
    storeProfile
  } = useStore();

  const [passwordInput, setPasswordInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isSecretAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (authStep === 1) {
      const ok = verifyStep1Password(passwordInput);
      if (ok) {
        setPasswordInput('');
        setErrorMessage('');
      } else {
        setErrorMessage(t('Incorrect first password. Please try again.', 'પહેલો પાસવર્ડ ખોટો છે. ફરી પ્રયત્ન કરો.'));
      }
    } else {
      const ok = verifyStep2Password(passwordInput);
      if (ok) {
        setPasswordInput('');
        setErrorMessage('');
      } else {
        setErrorMessage(t('Incorrect second password. Please try again.', 'બીજો પાસવર્ડ ખોટો છે. ફરી પ્રયત્ન કરો.'));
      }
    }
  };

  const handleClose = () => {
    setPasswordInput('');
    setErrorMessage('');
    resetAuthStep();
    closeSecretAuthModal();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-600/30 border border-rose-500/50 flex items-center justify-center text-rose-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">
                {authStep === 1 
                  ? t('Security Step 1: First Password', 'સિક્યુરિટી સ્ટેપ ૧: પહેલો પાસવર્ડ')
                  : t('Security Step 2: Second Password', 'સિક્યુરિટી સ્ટેપ ૨: બીજો પાસવર્ડ')}
              </h3>
              <p className="text-[11px] text-slate-400">
                {t('Authorized Shopkeeper Access Only', 'ફક્ત દુકાનદાર માટે અધિકૃત પ્રવેશ')}
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Dots */}
        <div className="bg-slate-100 px-6 py-2.5 flex items-center justify-between border-b border-slate-200 text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              authStep >= 1 ? 'bg-rose-600 text-white' : 'bg-slate-300 text-slate-700'
            }`}>
              1
            </span>
            <span className={authStep === 1 ? 'text-rose-600 font-bold' : 'text-slate-500'}>
              {t('Password 1', 'પાસવર્ડ ૧')}
            </span>
          </div>

          <div className="h-0.5 w-12 bg-slate-300" />

          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              authStep === 2 ? 'bg-rose-600 text-white' : 'bg-slate-300 text-slate-700'
            }`}>
              2
            </span>
            <span className={authStep === 2 ? 'text-rose-600 font-bold' : 'text-slate-500'}>
              {t('Password 2', 'પાસવર્ડ ૨')}
            </span>
          </div>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="text-center space-y-1">
            <p className="text-xs text-slate-600">
              {authStep === 1
                ? t('Enter the first secret password to proceed.', 'કૃપા કરીને પહેલો સિક્રેટ પાસવર્ડ દાખલ કરો.')
                : t('First password verified! Now enter the second password to access the panel.', 'પહેલો પાસવર્ડ સાચો છે! હવે કંટ્રોલ પેનલ ખોલવા બીજો પાસવર્ડ નાખો.')}
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 text-left">
              {authStep === 1 ? t('Enter First Password', 'પહેલો પાસવર્ડ નાખો') : t('Enter Second Password', 'બીજો પાસવર્ડ નાખો')}
            </label>
            <div className="relative">
              <input
                type="password"
                required
                autoFocus
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-center text-lg font-bold tracking-widest focus:bg-white focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-hidden font-mono"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {errorMessage && (
            <div className="p-2.5 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200 text-center">
              {errorMessage}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white rounded-xl font-bold text-sm shadow-md shadow-rose-200 transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{authStep === 1 ? t('Next (બીજો પાસવર્ડ)', 'આગળ વધો') : t('Unlock Control Panel', 'કંટ્રોલ પેનલ ખોલો')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
