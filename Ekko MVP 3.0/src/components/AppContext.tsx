import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'entrepreneur';
  avatar?: string;
  businessName?: string;
  businessDescription?: string;
  location: { lat: number; lng: number };
}

interface Product {
  id: string;
  entrepreneurId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  quantity: number;
  deliveryType: 'direct' | 'no-delivery';
}

interface Business {
  id: string;
  name: string;
  logo?: string;
  rating: number;
  location: { lat: number; lng: number };
  products: Product[];
  entrepreneurId: string;
}

interface Order {
  id: string;
  productId: string;
  businessId: string;
  clientId: string;
  quantity: number;
  totalPrice: number;
  paymentMethod: 'digital' | 'cash';
  status: 'pending' | 'completed';
  date: Date;
}

interface AppContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: 'client' | 'entrepreneur') => void;
  register: (email: string, password: string, name: string, role: 'client' | 'entrepreneur') => void;
  logout: () => void;
  switchRole: (role: 'client' | 'entrepreneur') => void;
  businesses: Business[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  createOrder: (order: Omit<Order, 'id' | 'date' | 'status'>) => void;
  orders: Order[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock data
const mockBusinesses: Business[] = [
  {
    id: 'b1',
    name: 'Sofi Brownies',
    logo: '🍫',
    rating: 4.8,
    location: { lat: 40.7128, lng: -74.0060 },
    entrepreneurId: 'e1',
    products: [
      {
        id: 'p1',
        entrepreneurId: 'e1',
        name: 'Brownies Clásicos',
        description: 'Deliciosos brownies de chocolate caseros',
        price: 12000,
        image: 'https://images.unsplash.com/photo-1628655386653-acd9ac2c4e98?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm93bmllcyUyMGRlc3NlcnR8ZW58MXx8fHwxNzYxMjcwNDUxfDA&ixlib=rb-4.1.0&q=80&w=1080',
        quantity: 15,
        deliveryType: 'direct',
      },
      {
        id: 'p2',
        entrepreneurId: 'e1',
        name: 'Brownies Premium',
        description: 'Brownies con nueces y chips de chocolate',
        price: 15000,
        image: 'https://images.unsplash.com/photo-1628655386653-acd9ac2c4e98?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm93bmllcyUyMGRlc3NlcnR8ZW58MXx8fHwxNzYxMjcwNDUxfDA&ixlib=rb-4.1.0&q=80&w=1080',
        quantity: 10,
        deliveryType: 'direct',
      },
    ],
  },
  {
    id: 'b2',
    name: 'Artesanías María',
    logo: '✨',
    rating: 4.5,
    location: { lat: 40.7200, lng: -74.0100 },
    entrepreneurId: 'e2',
    products: [
      {
        id: 'p3',
        entrepreneurId: 'e2',
        name: 'Collar Artesanal',
        description: 'Collar hecho a mano con piedras naturales',
        price: 25000,
        image: 'https://images.unsplash.com/photo-1573227890085-12ab5d68a170?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kbWFkZSUyMGpld2Vscnl8ZW58MXx8fHwxNzYxMTc3MDA3fDA&ixlib=rb-4.1.0&q=80&w=1080',
        quantity: 5,
        deliveryType: 'no-delivery',
      },
    ],
  },
  {
    id: 'b3',
    name: 'Café del Valle',
    logo: '☕',
    rating: 4.9,
    location: { lat: 40.7100, lng: -74.0000 },
    entrepreneurId: 'e3',
    products: [
      {
        id: 'p4',
        entrepreneurId: 'e3',
        name: 'Café Orgánico 500g',
        description: 'Café de especialidad, tostado artesanal',
        price: 18000,
        image: 'https://images.unsplash.com/photo-1675306408031-a9aad9f23308?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBiZWFuc3xlbnwxfHx8fDE3NjEyNjU1Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
        quantity: 20,
        deliveryType: 'direct',
      },
    ],
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>(mockBusinesses);
  const [orders, setOrders] = useState<Order[]>([]);

  const login = (email: string, password: string, role: 'client' | 'entrepreneur') => {
    // Mock login
    const user: User = {
      id: 'u1',
      name: 'Usuario Demo',
      email,
      role,
      location: { lat: 40.7128, lng: -74.0060 },
    };
    setCurrentUser(user);
  };

  const register = (email: string, password: string, name: string, role: 'client' | 'entrepreneur') => {
    // Mock register
    const user: User = {
      id: 'u' + Date.now(),
      name,
      email,
      role,
      location: { lat: 40.7128, lng: -74.0060 },
    };
    setCurrentUser(user);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchRole = (role: 'client' | 'entrepreneur') => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, role });
    }
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: 'p' + Date.now() };
    
    setBusinesses(prev => {
      const existingBusiness = prev.find(b => b.entrepreneurId === currentUser?.id);
      
      if (existingBusiness) {
        return prev.map(b =>
          b.id === existingBusiness.id
            ? { ...b, products: [...b.products, newProduct] }
            : b
        );
      } else {
        const newBusiness: Business = {
          id: 'b' + Date.now(),
          name: currentUser?.businessName || currentUser?.name || 'Mi Emprendimiento',
          logo: '🏪',
          rating: 5.0,
          location: currentUser?.location || { lat: 40.7128, lng: -74.0060 },
          entrepreneurId: currentUser?.id || '',
          products: [newProduct],
        };
        return [...prev, newBusiness];
      }
    });
  };

  const updateProduct = (id: string, updatedProduct: Partial<Product>) => {
    setBusinesses(prev =>
      prev.map(b => ({
        ...b,
        products: b.products.map(p =>
          p.id === id ? { ...p, ...updatedProduct } : p
        ),
      }))
    );
  };

  const deleteProduct = (id: string) => {
    setBusinesses(prev =>
      prev.map(b => ({
        ...b,
        products: b.products.filter(p => p.id !== id),
      }))
    );
  };

  const createOrder = (order: Omit<Order, 'id' | 'date' | 'status'>) => {
    const newOrder: Order = {
      ...order,
      id: 'o' + Date.now(),
      date: new Date(),
      status: 'completed',
    };
    setOrders(prev => [...prev, newOrder]);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        register,
        logout,
        switchRole,
        businesses,
        addProduct,
        updateProduct,
        deleteProduct,
        createOrder,
        orders,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
