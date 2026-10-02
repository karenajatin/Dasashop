import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  BookmarkCheck, 
  Phone, 
  User, 
  MapPin, 
  FileText, 
  MessageCircle, 
  Sparkles, 
  CheckCircle2, 
  ShoppingBag,
  Plus,
  Minus,
  Edit2,
  Zap
} from 'lucide-react';

export const BookingModal: React.FC = () => {
  const { 
    bookingProduct, 
    closeBookingModal, 
    createBookingOrder, 
    savedCustomer,
    language, 
    t, 
    storeProfile, 
    getWhatsAppProductUrl 
  } = useStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
  const [submittedOrder, setSubmittedOrder] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isEditingSavedInfo, setIsEditingSavedInfo] = useState(false);

  // Auto-fill from localStorage if customer previously ordered
  useEffect(() => {
    if (savedCustomer) {
      setName(savedCustomer.name || '');
      setPhone(savedCustomer.phone || '');
      if (savedCustomer.address) setAddress(savedCustomer.address);
      setIsEditingSavedInfo(false);
    } else {
      setIsEditingSavedInfo(true);
    }
  }, [savedCustomer, bookingProduct]);

  if (!bookingProduct) return null;

  const activePrice = bookingProduct.hasDiscount && bookingProduct.discountPrice 
    ? bookingProduct.discountPrice 
    : bookingProduct.originalPrice;

  const totalAmount = activePrice * quantity;
  const originalTotal = bookingProduct.originalPrice * quantity;
  const savings = originalTotal - totalAmount;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    const finalName = name.trim();
    if (!finalName) {
      setErrorMsg(t('Please enter your full name', 'કૃપા કરીને તમારું નામ દાખલ કરો'));
      setIsEditingSavedInfo(true);
      return;
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg(t('Please enter a valid 10-digit mobile number', 'કૃપા કરીને ૧૦ આંકડાનો સાચો મોબાઈલ નંબર દાખલ કરો'));
      setIsEditingSavedInfo(true);
      return;
    }

    // Create order and persist customer details into localStorage!
    const newOrder = createBookingOrder({
      customerName: finalName,
      customerPhone: cleanPhone,
      customerAddress: orderType === 'delivery' ? (address.trim() || 'Home Delivery') : 'Store Pick-up (દુકાન પરથી મેળવશે)',
      customerNote: note.trim(),
      product: bookingProduct,
      quantity,
    });

    // Fire celebratory confetti!
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#e11d48', '#f59e0b', '#10b981', '#3b82f6'],
      });
    } catch {
      // ignore
    }

    setSubmittedOrder(newOrder);
  };

  const handleClose = () => {
    setSubmittedOrder(null);
    setErrorMsg('');
    setNote('');
    setQuantity(1);
    closeBookingModal();
  };

  const hasSavedCustomer = !!savedCustomer && !!savedCustomer.name && !!savedCustomer.phone;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[94vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-600 to-red-600 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <BookmarkCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg leading-tight">
                {submittedOrder 
                  ? t('Booking Confirmed!', 'ઓર્ડર સફળતાપૂર્વક નોંધાયો!')
                  : t('Book / Order This Product', 'પ્રોડક્ટ બુકિંગ / ઓર્ડર ફોર્મ')}
              </h3>
              <p className="text-[11px] sm:text-xs text-rose-100">
                {t('Directly notifies storekeeper', 'દુકાનદારને સીધી માહિતી મળશે')}
              </p>
            </div>
          </div>

          <button 
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content area with internal scrolling if needed on smaller screens */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {!submittedOrder ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Product preview card */}
              <div className="flex items-center gap-3 bg-slate-50 p-2.5 sm:p-3 rounded-2xl border border-slate-200">
                <img
                  src={bookingProduct.imageUrl}
                  alt={bookingProduct.name}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                    {language === 'gu' && bookingProduct.nameGu ? bookingProduct.nameGu : bookingProduct.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-black text-rose-600 text-sm sm:text-base">
                      {storeProfile.currencySymbol}{activePrice.toLocaleString()}
                    </span>
                    {bookingProduct.hasDiscount && bookingProduct.discountPrice && (
                      <span className="text-[11px] sm:text-xs text-slate-400 line-through">
                        {storeProfile.currencySymbol}{bookingProduct.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity picker */}
                <div className="flex items-center bg-white border border-slate-200 rounded-xl p-0.5 sm:p-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-600 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 sm:w-8 text-center font-bold text-xs sm:text-sm text-slate-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-600 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Price Calculation details */}
              <div className="flex items-center justify-between text-xs px-3 py-2 bg-amber-50/70 rounded-xl border border-amber-200/70 text-slate-700">
                <span>{t('Total Payable:', 'કુલ ચુકવણી:')}</span>
                <div className="flex items-center gap-2 font-bold">
                  {savings > 0 && (
                    <span className="text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.5 rounded text-[10px] sm:text-[11px]">
                      {t(`Save ${storeProfile.currencySymbol}${savings}`, `બચત ${storeProfile.currencySymbol}${savings}`)}
                    </span>
                  )}
                  <span className="text-sm sm:text-base font-black text-slate-900">
                    {storeProfile.currencySymbol}{totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* SAVED CUSTOMER 1-CLICK INSTANT ORDER AFFORDANCE */}
              {hasSavedCustomer && !isEditingSavedInfo && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                      <Zap className="w-4 h-4 fill-emerald-600 text-emerald-600" />
                      <span>{t('Remembered Customer Info', 'સાચવેલ ગ્રાહક વિગતો')}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsEditingSavedInfo(true)}
                      className="text-[11px] text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 underline cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>{t('Edit', 'બદલો')}</span>
                    </button>
                  </div>

                  <div className="bg-white/80 rounded-xl p-2.5 text-xs text-slate-800 space-y-1 border border-emerald-100">
                    <p className="font-extrabold text-slate-900 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{name}</span>
                    </p>
                    <p className="font-mono text-slate-700 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{phone}</span>
                    </p>
                    {address && (
                      <p className="text-[11px] text-slate-500 truncate flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>{address}</span>
                      </p>
                    )}
                  </div>

                  <p className="text-[11px] text-emerald-700">
                    {t(
                      'Your Name & Mobile are remembered from your last order. Click below to submit immediately!',
                      'તમારું નામ અને મોબાઈલ નંબર અગાઉના ઓર્ડરથી યાદ રાખેલ છે. નીચેના બટનથી તરત જ ઓર્ડર થઈ જશે!'
                    )}
                  </p>

                  <button
                    type="button"
                    onClick={() => handleSubmit()}
                    className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-sm shadow-md shadow-emerald-200 transition active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Zap className="w-4 h-4 fill-white" />
                    <span>{t('⚡ 1-Click Order with Saved Details', '⚡ સાચવેલ વિગત સાથે તરત બુક કરો')}</span>
                  </button>
                </div>
              )}

              {/* Form Input fields (Shown for new customer or if editing) */}
              {(isEditingSavedInfo || !hasSavedCustomer) && (
                <div className="space-y-3 pt-1">
                  {hasSavedCustomer && (
                    <div className="flex items-center justify-between pb-1">
                      <span className="text-xs font-bold text-slate-700">
                        {t('Edit Your Information:', 'તમારી વિગતો બદલો:')}
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsEditingSavedInfo(false)}
                        className="text-[11px] text-rose-600 font-bold hover:underline"
                      >
                        {t('Use Saved Profile', 'સાચવેલ વિગત વાપરો')}
                      </button>
                    </div>
                  )}

                  {errorMsg && (
                    <div className="p-2.5 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
                      {errorMsg}
                    </div>
                  )}

                  {/* Form Input: Customer Name */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">
                      {t('Your Name / નામ *', 'તમારું પૂરું નામ *')}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t('e.g. Ramesh Patel', 'દા.ત. રમેશભાઈ પટેલ')}
                        className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-hidden"
                      />
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  {/* Form Input: Mobile Number */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">
                      {t('Mobile Number / મોબાઇલ નંબર *', 'મોબાઇલ નંબર (વોટ્સએપ/કોલ) *')}
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        maxLength={14}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder={t('e.g. 9825012345', 'દા.ત. 9825012345')}
                        className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-hidden font-mono"
                      />
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                    <p className="text-[10px] text-slate-400">
                      {t('Saved locally so you do not have to type next time!', 'આ માહિતી લોકલ સ્ટોરેજમાં સેવ થશે જેથી બીજી વાર ટાઇપ ન કરવું પડે.')}
                    </p>
                  </div>

                  {/* Delivery or Pick up preference */}
                  <div className="space-y-1 pt-1">
                    <label className="block text-xs font-bold text-slate-700">
                      {t('Preference / કેવી રીતે મેળવવું?', 'કેવી રીતે મેળવવું?')}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setOrderType('delivery')}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition cursor-pointer ${
                          orderType === 'delivery'
                            ? 'bg-rose-50 text-rose-700 border-rose-300 ring-2 ring-rose-500/20'
                            : 'bg-slate-50 text-slate-600 border-slate-200'
                        }`}
                      >
                        🚚 {t('Home Delivery', 'ઘરે ડિલિવરી')}
                      </button>
                      <button
                        type="button"
                        onClick={() => setOrderType('pickup')}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition cursor-pointer ${
                          orderType === 'pickup'
                            ? 'bg-rose-50 text-rose-700 border-rose-300 ring-2 ring-rose-500/20'
                            : 'bg-slate-50 text-slate-600 border-slate-200'
                        }`}
                      >
                        🏪 {t('Store Pick-up', 'દુકાનેથી મેળવવું')}
                      </button>
                    </div>
                  </div>

                  {orderType === 'delivery' && (
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">
                        {t('Delivery Address / સરનામું', 'ડિલિવરી સરનામું')}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder={t('House / Shop No, Area, City', 'ઘર / દુકાન નં, સોસાયટી, ગામ/શહેર')}
                          className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-hidden"
                        />
                        <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>
                  )}

                  {/* Special Note */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">
                      {t('Special Note (Optional)', 'કોઈ ખાસ સૂચના (વૈકલ્પિક)')}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder={t('e.g. Evening delivery, size/color', 'દા.ત. સાંજે મોકલવું અથવા સાઈઝ')}
                        className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-hidden"
                      />
                      <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 px-4 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white rounded-xl font-black text-xs sm:text-sm shadow-lg shadow-rose-200 transition active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <BookmarkCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>{t('Confirm Booking & Save Info', 'ઓર્ડર કન્ફર્મ કરો અને વિગત સાચવો')}</span>
                    </button>
                  </div>
                </div>
              )}
            </form>
          ) : (
            /* Booking Confirmed State */
            <div className="text-center py-3 sm:py-4 space-y-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>

              <div>
                <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-mono">
                  {t('Order ID:', 'ઓર્ડર નં:')} {submittedOrder.id}
                </span>
                <h4 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-2">
                  {t('Thank You, Booking Received!', 'ધન્યવાદ, તમારો ઓર્ડર નોંધાઈ ગયો છે!')}
                </h4>
                <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                  {language === 'gu'
                    ? `તમારી વિગત (${submittedOrder.customerName}, ${submittedOrder.customerPhone}) લોકલ સ્ટોરેજમાં સાચવી લેવાઈ છે. દુકાનદારને પણ આ ઓર્ડર મળી ગયો છે!`
                    : `Your info (${submittedOrder.customerName}, ${submittedOrder.customerPhone}) is saved locally for seamless future bookings. Shopkeeper will contact you shortly!`}
                </p>
              </div>

              {/* Order Summary box */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 sm:p-3.5 text-left text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('Product:', 'પ્રોડક્ટ:')}</span>
                  <span className="font-bold text-slate-900 truncate max-w-[180px] sm:max-w-[220px]">{submittedOrder.productName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('Customer Name:', 'ગ્રાહકનું નામ:')}</span>
                  <span className="font-bold text-slate-900">{submittedOrder.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('Mobile No:', 'મોબાઈલ નં:')}</span>
                  <span className="font-mono font-bold text-slate-900">{submittedOrder.customerPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('Quantity:', 'જથ્થો:')}</span>
                  <span className="font-bold text-slate-900">{submittedOrder.quantity}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200">
                  <span className="text-slate-700 font-bold">{t('Total Amount:', 'કુલ રકમ:')}</span>
                  <span className="font-black text-rose-600 text-sm">{storeProfile.currencySymbol}{submittedOrder.totalAmount}</span>
                </div>
              </div>

              {/* Connect via WhatsApp directly */}
              <div className="space-y-2 pt-1">
                <a
                  href={getWhatsAppProductUrl(
                    bookingProduct,
                    `Hello ${storeProfile.name}, I booked order ${submittedOrder.id} for *${submittedOrder.productName}* (Qty: ${submittedOrder.quantity}, Total: ₹${submittedOrder.totalAmount}). My Name: ${submittedOrder.customerName}, Phone: ${submittedOrder.customerPhone}. Please confirm!`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2 transition"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>{t('Send Details to Shopkeeper on WhatsApp Now', 'વોટ્સએપ પર પણ વિગત મોકલો')}</span>
                </a>

                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  {t('Back to Shopping', 'શોપિંગ ચાલુ રાખો')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
