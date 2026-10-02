import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { DiscountSection } from './components/DiscountSection';
import { CategoryNavButtons } from './components/CategoryNavButtons';
import { CategoryPage } from './components/CategoryPage';
import { ContactSection } from './components/ContactSection';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { PhotoLightboxModal } from './components/PhotoLightboxModal';
import { FloatingContactDock } from './components/FloatingContactDock';
import { SecretAdminAuthModal } from './components/SecretAdminAuthModal';

const MainLayout: React.FC = () => {
  const { currentView } = useStore();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-rose-500 selection:text-white">
      <div className="w-full overflow-x-hidden">
        <Navbar />

        <main className="w-full">
          {currentView === 'admin' && <AdminPanel />}

          {currentView === 'category' && <CategoryPage />}

          {currentView === 'home' && (
            <div className="space-y-4 sm:space-y-6">
              {/* Animated Top Hero Banner showing discounts and deals */}
              <HeroBanner />

              {/* FIRST PAGE: Items with discounts with photo animations */}
              <DiscountSection />

              {/* AT DOWN: Things type buttons (Categories) taking to new dedicated pages */}
              <CategoryNavButtons />

              {/* Separate contact buttons (WhatsApp, Email, Phone, Map) */}
              <ContactSection />
            </div>
          )}
        </main>
      </div>

      <Footer />

      {/* Interactive Global Modals & Docks */}
      <BookingModal />
      <PhotoLightboxModal />
      <SecretAdminAuthModal />
      <FloatingContactDock />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainLayout />
    </StoreProvider>
  );
}
