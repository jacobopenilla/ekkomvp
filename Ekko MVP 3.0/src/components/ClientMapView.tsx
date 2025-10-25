import React, { useState } from 'react';
import { Star, User, Store, MapPin } from 'lucide-react';
import { useApp } from './AppContext';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import MapComponent from './MapComponent';

interface ClientMapViewProps {
  onNavigateToProfile: () => void;
  onNavigateToCheckout: (businessId: string, productId: string) => void;
}

export function ClientMapView({ onNavigateToProfile, onNavigateToCheckout }: ClientMapViewProps) {
  const { businesses, orders, currentUser } = useApp();
  const [selectedBusiness, setSelectedBusiness] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);

  const selectedBusinessData = businesses.find(b => b.id === selectedBusiness);

  // Get the most recent order for the current user
  const recentOrder = orders
    .filter(order => order.clientId === currentUser?.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  // Get business data for the recent order
  const recentOrderBusiness = recentOrder 
    ? businesses.find(b => b.id === recentOrder.businessId)
    : null;

  // Show map if user has made a purchase
  if (recentOrder && recentOrderBusiness && showMap) {
    return (
      <div className="relative w-full h-screen bg-white flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-[#E5E5E5] px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2>Ubicación del negocio</h2>
              <p className="text-sm text-[#666] mt-1">{recentOrderBusiness.name}</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowMap(false)}
                className="px-4 py-2 bg-[#F5F5F5] rounded-lg hover:bg-[#E5E5E5] transition-colors"
              >
                Ver negocios
              </button>
              <button
                onClick={onNavigateToProfile}
                className="w-10 h-10 bg-[#F5F5F5] rounded-full flex items-center justify-center hover:bg-[#E5E5E5] transition-colors"
              >
                <User className="w-5 h-5 text-[#007AFF]" />
              </button>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          <MapComponent
            markers={[{
              id: recentOrderBusiness.id,
              lat: recentOrderBusiness.location.lat,
              lng: recentOrderBusiness.location.lng,
              name: recentOrderBusiness.name,
              type: 'business',
              description: 'Ubicación del negocio'
            }]}
            center={recentOrderBusiness.location}
            zoom={15}
            showUserLocation={true}
            mapType="client"
          />
        </div>

        {/* Info Card */}
        <div className="absolute bottom-8 left-6 right-6 bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-start space-x-4 mb-4">
            <div className="text-4xl">{recentOrderBusiness.logo}</div>
            <div className="flex-1">
              <h3 className="mb-1">{recentOrderBusiness.name}</h3>
              <p className="text-sm text-[#666]">
                Tu pedido ha sido confirmado. Puedes ver la ubicación exacta del negocio.
              </p>
            </div>
          </div>

          <div className="bg-[#F5F5F5] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#666]">Pedido #</span>
              <span className="text-sm">{recentOrder.id}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#666]">Total pagado</span>
              <span className="text-[#007AFF]">${recentOrder.totalPrice.toLocaleString('es-CO')}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#666]">Estado</span>
              <span className="text-sm text-[#34C759]">Confirmado</span>
            </div>
          </div>

          <Button 
            onClick={() => setShowMap(false)} 
            className="w-full mt-4 bg-[#007AFF] hover:bg-[#0051D5] h-12"
          >
            Ver más negocios
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E5E5] px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2>Emprendimientos cercanos</h2>
            <p className="text-sm text-[#666] mt-1">{businesses.length} negocios disponibles</p>
          </div>
          <div className="flex items-center space-x-3">
            {recentOrder && recentOrderBusiness && (
              <button
                onClick={() => setShowMap(true)}
                className="px-4 py-2 bg-[#007AFF] text-white rounded-lg hover:bg-[#0051D5] transition-colors flex items-center space-x-2"
              >
                <MapPin className="w-4 h-4" />
                <span>Ver ubicación</span>
              </button>
            )}
            <button
              onClick={onNavigateToProfile}
              className="w-10 h-10 bg-[#F5F5F5] rounded-full flex items-center justify-center hover:bg-[#E5E5E5] transition-colors"
            >
              <User className="w-5 h-5 text-[#007AFF]" />
            </button>
          </div>
        </div>
      </div>

      {/* Business Grid */}
      <ScrollArea className="flex-1">
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {businesses.map((business) => (
            <button
              key={business.id}
              onClick={() => setSelectedBusiness(business.id)}
              className="bg-white border-2 border-[#E5E5E5] rounded-2xl overflow-hidden hover:border-[#007AFF] transition-all hover:shadow-lg text-left"
            >
              {/* Business Header */}
              <div className="p-4 bg-gradient-to-br from-[#007AFF]/5 to-[#007AFF]/10 border-b border-[#E5E5E5]">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-sm">
                    {business.logo}
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-1">{business.name}</h3>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-[#666]">{business.rating}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products Preview */}
              <div className="p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Store className="w-4 h-4 text-[#666]" />
                  <span className="text-sm text-[#666]">{business.products.length} productos disponibles</span>
                </div>
                
                {/* First product preview */}
                {business.products[0] && (
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <ImageWithFallback
                        src={business.products[0].image}
                        alt={business.products[0].name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{business.products[0].name}</p>
                      <p className="text-[#007AFF]">
                        ${business.products[0].price.toLocaleString('es-CO')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>

      {/* Business Detail Dialog */}
      <Dialog open={!!selectedBusiness} onOpenChange={() => setSelectedBusiness(null)}>
        <DialogContent className="max-w-md max-h-[80vh] p-0">
          {selectedBusinessData && (
            <>
              <DialogHeader className="p-6 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{selectedBusinessData.logo}</div>
                  <div className="flex-1">
                    <DialogTitle>{selectedBusinessData.name}</DialogTitle>
                    <div className="flex items-center space-x-1 mt-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-[#666]">{selectedBusinessData.rating}</span>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <ScrollArea className="max-h-[calc(80vh-120px)] px-6 pb-6">
                <div className="space-y-4">
                  <h3>Productos disponibles</h3>
                  
                  {selectedBusinessData.products.map(product => (
                    <div key={product.id} className="border border-[#E5E5E5] rounded-xl overflow-hidden">
                      <div className="aspect-video relative">
                        <ImageWithFallback
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4>{product.name}</h4>
                          <Badge variant={product.quantity > 0 ? 'default' : 'secondary'}>
                            {product.quantity > 0 ? `${product.quantity} disponibles` : 'Agotado'}
                          </Badge>
                        </div>
                        <p className="text-[#666] text-sm mb-3">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-[#007AFF]">
                            ${product.price.toLocaleString('es-CO')}
                          </span>
                          <Button
                            onClick={() => {
                              setSelectedBusiness(null);
                              onNavigateToCheckout(selectedBusinessData.id, product.id);
                            }}
                            disabled={product.quantity === 0}
                            className="bg-[#007AFF] hover:bg-[#0051D5]"
                          >
                            Comprar
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
