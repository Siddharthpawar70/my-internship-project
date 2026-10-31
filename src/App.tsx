import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { WishlistProvider } from './context/WishlistContext';
import { SearchProvider } from './context/SearchContext';
import { BookingProvider } from './context/BookingContext';
import { AdminProvider } from './context/AdminContext';

// Common Components
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { AuthModal } from './components/common/AuthModal';

// Customer Pages
import { HomePage } from './pages/customer/HomePage';
import { HotelSearchResultsPage } from './pages/customer/HotelSearchResultsPage';
import { HotelDetailsPage } from './pages/customer/HotelDetailsPage';
import { BookingCheckoutPage } from './pages/customer/BookingCheckoutPage';
import { PaymentPage } from './pages/customer/PaymentPage';
import { BookingConfirmationPage } from './pages/customer/BookingConfirmationPage';
import { MyTripsPage } from './pages/customer/MyTripsPage';
import { WishlistPage } from './pages/customer/WishlistPage';
import { UserProfilePage } from './pages/customer/UserProfilePage';
import { DestinationsPage } from './pages/customer/DestinationsPage';
import { CorporateStaysPage } from './pages/customer/CorporateStaysPage';
import { GroupBookingPage } from './pages/customer/GroupBookingPage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';

// Auth hooks
import { useAuth } from './context/AuthContext';
import { useAdmin } from './context/AdminContext';

// Auto scroll-to-top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

// Protected route - redirects to auth if not logged in
function ProtectedRoute({ children, redirectTo }: { children: React.ReactNode; redirectTo?: string }) {
  const { isAuthenticated, isLoading, openAuthModal } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      openAuthModal();
    }
  }, [isLoading, isAuthenticated, openAuthModal]);

  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to={redirectTo || "/"} replace state={{ from: location }} />;
  return <>{children}</>;
}

// Protected admin route - requires administrator role and session
function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAdminAuthenticated, isAdminLoading } = useAdmin();
  const location = useLocation();

  if (isAdminLoading) {
    return (
      <div className="min-h-screen bg-[#11161B] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#C5A880] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold">Authenticating Admin Session...</p>
        </div>
      </div>
    );
  }

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}

// Layout wrapper to toggle footer on Admin vs Customer
function AppLayout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const { user } = useAuth();

  return (
    <WishlistProvider userId={user?.id}>
      <div className="flex flex-col min-h-screen">
        {!isAdmin && <Navbar />}
        <AuthModal />
        <main className="flex-1">
          <Routes>
            {/* Public browsing routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/hotels" element={<HotelSearchResultsPage />} />
            <Route path="/hotel/:id" element={<HotelDetailsPage />} />
            <Route path="/destinations" element={<DestinationsPage />} />
            <Route path="/corporate" element={<CorporateStaysPage />} />
            <Route path="/group-booking" element={<GroupBookingPage />} />

            {/* Booking checkout handles required Login/Register inline */}
            <Route path="/checkout" element={<BookingCheckoutPage />} />

            {/* Protected routes - require login */}
            <Route path="/payment" element={<ProtectedRoute redirectTo="/checkout"><PaymentPage /></ProtectedRoute>} />
            <Route path="/confirmation/:bookingId" element={<ProtectedRoute><BookingConfirmationPage /></ProtectedRoute>} />
            <Route path="/trips" element={<ProtectedRoute><MyTripsPage /></ProtectedRoute>} />
            <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
            <Route path="/settings" element={<Navigate to="/profile" replace />} />

            {/* Admin Portal */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminProtectedRoute><AdminDashboardPage /></AdminProtectedRoute>} />

            {/* Fallback to home */}
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>
        {!isAdmin && <Footer />}
      </div>
    </WishlistProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <SearchProvider>
            <BookingProvider>
              <AdminProvider>
                <ScrollToTop />
                <AppLayout />
              </AdminProvider>
            </BookingProvider>
          </SearchProvider>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
