import React from 'react';
import { ArrowLeft, User, ShoppingBag, Package, LogOut, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { useApp } from './AppContext';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProfileScreenProps {
  onBack: () => void;
  onLogout: () => void;
}

export function ProfileScreen({ onBack, onLogout }: ProfileScreenProps) {
  const { currentUser, logout, switchRole, businesses, orders } = useApp();

  if (!currentUser) return null;

  const userBusiness = businesses.find(b => b.entrepreneurId === currentUser.id);

  const userOrders = orders.filter(o => 
    currentUser.role === 'client' 
      ? o.clientId === currentUser.id 
      : o.businessId === userBusiness?.id
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-[#E5E5E5] px-6 py-4 flex items-center space-x-4 z-10">
        <button onClick={onBack}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2>Perfil</h2>
      </div>

      <ScrollArea className="h-[calc(100vh-73px)]">
        <div className="p-6 max-w-2xl mx-auto">
          {/* User Info */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-[#007AFF] to-[#0051D5] rounded-full flex items-center justify-center mb-4">
              <User className="w-12 h-12 text-white" />
            </div>
            <h3 className="mb-2">{currentUser.name}</h3>
            <p className="text-[#666] mb-3">{currentUser.email}</p>
            <Badge variant="secondary" className="capitalize">
              {currentUser.role === 'client' ? '🛍️ Cliente' : '🏪 Emprendedor'}
            </Badge>
          </div>

          {/* Switch Role */}
          <div className="mb-6">
            <button
              onClick={() => switchRole(currentUser.role === 'client' ? 'entrepreneur' : 'client')}
              className="w-full p-4 border-2 border-[#E5E5E5] rounded-xl hover:border-[#007AFF] transition-colors flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-[#F5F5F5] rounded-full flex items-center justify-center">
                  <RefreshCw className="w-6 h-6 text-[#007AFF]" />
                </div>
                <div className="text-left">
                  <div>Cambiar a modo {currentUser.role === 'client' ? 'Emprendedor' : 'Cliente'}</div>
                  <div className="text-sm text-[#666]">
                    {currentUser.role === 'client' 
                      ? 'Comienza a vender tus productos'
                      : 'Descubre productos cerca de ti'}
                  </div>
                </div>
              </div>
            </button>
          </div>

          <Separator className="my-6" />

          {/* Orders / Products Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    {currentUser.role === 'client' ? (
                        <>
                        <ShoppingBag className="w-5 h-5 text-[#007AFF]" />
                        <h3>Mis compras</h3>
                        </>
                    ) : (
                        <>
                        <Package className="w-5 h-5 text-[#007AFF]" />
                        <h3>Mis productos</h3>
                        </>
                    )}
                </div>
            </div>

            {currentUser.role === 'entrepreneur' && userBusiness && (
              <div>
                {userBusiness.products.length > 0 ? (
                  userBusiness.products.map(product => (
                    <div key={product.id} className="border border-[#E5E5E5] rounded-xl p-4 flex items-start space-x-4 mb-3">
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <ImageWithFallback
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="mb-1">{product.name}</h4>
                        <p className="text-sm text-[#666] mb-2">{product.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-[#007AFF]">${product.price.toLocaleString('es-CO')}</span>
                          <Badge variant={product.quantity > 0 ? 'default' : 'secondary'}>
                            {product.quantity} disponibles
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-[#666]">
                    <Package className="w-12 h-12 mx-auto mb-3 text-[#CCC]" />
                    <p>No tienes productos publicados</p>
                    <p className="text-sm mt-1">Haz clic en "Ofrecer producto" para empezar</p>
                  </div>
                )}
              </div>
            )}

            {currentUser.role === 'client' && (
              <div className="space-y-3">
                {userOrders.length > 0 ? (
                  userOrders.map(order => {
                    const business = businesses.find(b => b.id === order.businessId);
                    const product = business?.products.find(p => p.id === order.productId);
                    
                    return (
                      <div key={order.id} className="border border-[#E5E5E5] rounded-xl p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="mb-1">{product?.name}</h4>
                            <p className="text-sm text-[#666]">{business?.name}</p>
                          </div>
                          <Badge variant="outline" className="bg-[#34C759]/10 text-[#34C759] border-[#34C759]">
                            Completado
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-sm text-[#666]">
                            {order.quantity} {order.quantity > 1 ? 'unidades' : 'unidad'}
                          </span>
                          <span className="text-[#007AFF]">
                            ${order.totalPrice.toLocaleString('es-CO')}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12 text-[#666]">
                    <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-[#CCC]" />
                    <p>No tienes compras aún</p>
                    <p className="text-sm mt-1">Explora el mapa para descubrir productos</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <Separator className="my-6" />

          {/* Stats */}
          {currentUser.role === 'entrepreneur' && (
            <>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-[#F5F5F5] rounded-xl p-4 text-center">
                  <div className="text-2xl text-[#007AFF] mb-1">{userBusiness?.products.length || 0}</div>
                  <div className="text-sm text-[#666]">Productos</div>
                </div>
                <div className="bg-[#F5F5F5] rounded-xl p-4 text-center">
                  <div className="text-2xl text-[#34C759] mb-1">{userOrders.length}</div>
                  <div className="text-sm text-[#666]">Ventas</div>
                </div>
              </div>
              <Separator className="my-6" />
            </>
          )}

          {/* Logout Button */}
          <Button
            onClick={() => {
              logout();
              onLogout();
            }}
            variant="outline"
            className="w-full border-2 border-[#FF3B30] text-[#FF3B30] hover:bg-[#FF3B30] hover:text-white h-12"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Cerrar sesión
          </Button>
        </div>
      </ScrollArea>
    </div>
  );
}
