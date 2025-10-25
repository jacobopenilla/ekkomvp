import React, { useState } from 'react';
import { AppProvider, useApp } from './components/AppContext';
import { WelcomeScreen } from './components/WelcomeScreen';
import { AuthScreen } from './components/AuthScreen';
import { ClientMapView } from './components/ClientMapView';
import { EntrepreneurMapView } from './components/EntrepreneurMapView';
import { ProductForm } from './components/ProductForm';
import { CheckoutScreen } from './components/CheckoutScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { Toaster } from './components/ui/sonner';

type Screen = 
  | 'welcome'
  | 'login'
  | 'register'
  | 'clientMap'
  | 'entrepreneurMap'
  | 'productForm'
  | 'checkout'
  | 'profile';

function AppContent() {
  const { isAuthenticated, currentUser } = useApp();
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [checkoutData, setCheckoutData] = useState<{ businessId: string; productId: string } | null>(null);

  // Determine the screen to show
  const getScreen = () => {
    if (!isAuthenticated) {
      return currentScreen;
    }
    
    // If authenticated, show appropriate map based on role
    if (currentScreen === 'welcome' || currentScreen === 'login' || currentScreen === 'register') {
      return currentUser?.role === 'client' ? 'clientMap' : 'entrepreneurMap';
    }
    
    return currentScreen;
  };

  const screen = getScreen();

  const handleNavigateToCheckout = (businessId: string, productId: string) => {
    setCheckoutData({ businessId, productId });
    setCurrentScreen('checkout');
  };

  const handleBackToMap = () => {
    setCurrentScreen(currentUser?.role === 'client' ? 'clientMap' : 'entrepreneurMap');
  };

  // Render the appropriate screen
  switch (screen) {
    case 'welcome':
      return <WelcomeScreen onNavigate={(screen) => setCurrentScreen(screen)} />;

    case 'login':
      return <AuthScreen mode="login" onBack={() => setCurrentScreen('welcome')} />;

    case 'register':
      return <AuthScreen mode="register" onBack={() => setCurrentScreen('welcome')} />;

    case 'clientMap':
      return (
        <ClientMapView
          onNavigateToProfile={() => setCurrentScreen('profile')}
          onNavigateToCheckout={handleNavigateToCheckout}
        />
      );

    case 'entrepreneurMap':
      return (
        <EntrepreneurMapView
          onNavigateToProfile={() => setCurrentScreen('profile')}
          onNavigateToProductForm={() => setCurrentScreen('productForm')}
        />
      );

    case 'productForm':
      return <ProductForm onBack={handleBackToMap} />;

    case 'checkout':
      return checkoutData ? (
        <CheckoutScreen
          businessId={checkoutData.businessId}
          productId={checkoutData.productId}
          onBack={handleBackToMap}
          onComplete={handleBackToMap}
        />
      ) : null;

    case 'profile':
      return <ProfileScreen onBack={handleBackToMap} onLogout={() => setCurrentScreen('welcome')} />;

    default:
      return <WelcomeScreen onNavigate={(screen) => setCurrentScreen(screen)} />;
  }
}

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen">
        <AppContent />
        <Toaster position="top-center" />
      </div>
    </AppProvider>
  );
}
