import React, { useState } from 'react';
import { ArrowLeft, MapPin, CreditCard, Banknote, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { useApp } from './AppContext';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ImageWithFallback } from './figma/ImageWithFallback';
import MapComponent from './MapComponent';

interface CheckoutScreenProps {
  businessId: string;
  productId: string;
  onBack: () => void;
  onComplete: () => void;
}

export function CheckoutScreen({ businessId, productId, onBack, onComplete }: CheckoutScreenProps) {
  const { businesses, createOrder, currentUser } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'digital' | 'cash' | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const business = businesses.find(b => b.id === businessId);
  const product = business?.products.find(p => p.id === productId);

  if (!business || !product) {
    return null;
  }

  const totalPrice = product.price * quantity;

  const handleDigitalPayment = (url: string) => {
    if (url) {
        window.location.href = url;
    }
  };

  const handlePurchase = () => {
    if (!paymentMethod) return;

    // If payment is digital, we don't create the order here.
    // The redirection will handle the payment, and a webhook or manual confirmation would create the order.
    if (paymentMethod === 'digital') {
      alert('Por favor, selecciona un método de pago digital para continuar.');
      return;
    }

    createOrder({
      productId: product.id,
      businessId: business.id,
      clientId: currentUser?.id || '',
      quantity,
      totalPrice,
      paymentMethod,
    });

    setShowSuccess(true);
    setTimeout(() => {
      setShowMap(true);
    }, 2000);
  };

  if (showMap) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-[#E5E5E5] px-6 py-4 flex items-center space-x-4">
          <button onClick={onComplete}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2>Ubicación del negocio</h2>
        </div>

        {/* Map - Now using live Google Map */}
        <div className="flex-1 relative">
          <MapComponent
            markers={[{
              id: business.id,
              lat: 40.7589, // Business coordinates (simulated)
              lng: -73.9851,
              name: business.name,
              type: 'business',
              description: 'Ubicación del negocio'
            }]}
            center={{ lat: 40.7589, lng: -73.9851 }}
            zoom={15}
            showUserLocation={true}
            mapType="checkout"
          />

          {/* Info Card */}
          <div className="absolute bottom-8 left-6 right-6 bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-start space-x-4 mb-4">
              <div className="text-4xl">{business.logo}</div>
              <div className="flex-1">
                <h3 className="mb-1">{business.name}</h3>
                <p className="text-sm text-[#666]">
                  {product.deliveryType === 'direct' 
                    ? 'El vendedor te contactará para coordinar la entrega'
                    : 'Puedes recoger tu pedido en esta ubicación'}
                </p>
              </div>
            </div>

            <div className="bg-[#F5F5F5] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#666]">Producto</span>
                <span className="text-sm">{product.name}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#666]">Cantidad</span>
                <span className="text-sm">{quantity}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#666]">Total pagado</span>
                <span className="text-[#007AFF]">${totalPrice.toLocaleString('es-CO')}</span>
              </div>
            </div>

            <Button onClick={onComplete} className="w-full mt-4 bg-[#007AFF] hover:bg-[#0051D5] h-12">
              Volver al inicio
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-[#34C759] rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <h2 className="mb-4">¡Compra exitosa!</h2>
          <p className="text-[#666] mb-8">
            Tu pedido ha sido confirmado. Ahora puedes ver la ubicación exacta del negocio.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-[#E5E5E5] px-6 py-4 flex items-center space-x-4 z-10">
        <button onClick={onBack}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2>Confirmar compra</h2>
      </div>

      <div className="p-6 max-w-2xl mx-auto">
        {/* Product Info */}
        <div className="border border-[#E5E5E5] rounded-2xl overflow-hidden mb-6">
          <div className="aspect-video relative">
            <ImageWithFallback
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="mb-1">{product.name}</h3>
                <p className="text-sm text-[#666] mb-2">{product.description}</p>
                <div className="flex items-center space-x-2 text-sm text-[#666]">
                  <span>{business.logo}</span>
                  <span>{business.name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quantity Selector */}
        <div className="mb-6">
          <Label htmlFor="quantity" className="mb-3 block">Cantidad</Label>
          <div className="flex items-center space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-12 h-12"
            >
              -
            </Button>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Math.min(product.quantity, Number(e.target.value))))}
              className="w-24 h-12 text-center"
              min={1}
              max={product.quantity}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
              className="w-12 h-12"
            >
              +
            </Button>
            <span className="text-sm text-[#666]">
              (máx. {product.quantity})
            </span>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mb-6">
          <Label className="mb-3 block">Método de pago</Label>
          <div className="space-y-3">
            <button
              onClick={() => setPaymentMethod('digital')}
              className={`w-full p-4 border-2 rounded-xl flex items-center space-x-4 transition-colors ${
                paymentMethod === 'digital'
                  ? 'border-[#007AFF] bg-[#007AFF]/5'
                  : 'border-[#E5E5E5] hover:border-[#007AFF]/50'
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                paymentMethod === 'digital' ? 'bg-[#007AFF]' : 'bg-[#F5F5F5]'
              }`}>
                <CreditCard className={`w-6 h-6 ${
                  paymentMethod === 'digital' ? 'text-white' : 'text-[#666]'
                }`} />
              </div>
              <div className="flex-1 text-left">
                <div>Pago digital</div>
                <div className="text-sm text-[#666]">Nequi, Bancolombia o transferencia</div>
              </div>
            </button>

            {/* Digital Payment Options - Show when digital is selected */}
            {paymentMethod === 'digital' && (
                <div className="ml-4 space-y-2 border-l-2 border-[#007AFF] pl-4">
                    {business.nequiLink && (
                        <Button
                            onClick={() => handleDigitalPayment(business.nequiLink)}
                            className="w-full justify-center bg-[#FF006B] hover:bg-[#E0005E] text-white"
                        >
                            Pagar con Nequi
                        </Button>
                    )}
                    {business.bancoLink && (
                        <Button
                            onClick={() => handleDigitalPayment(business.bancoLink)}
                            className="w-full justify-center bg-[#FDDA24] hover:bg-[#E4C320] text-[#333]"
                        >
                            Pagar con Bancolombia
                        </Button>
                    )}
                    {!business.nequiLink && !business.bancoLink && (
                        <p className="text-sm text-center text-gray-500 p-2">El emprendedor no tiene enlaces de pago digital configurados.</p>
                    )}
                </div>
            )}

            <button
              onClick={() => setPaymentMethod('cash')}
              className={`w-full p-4 border-2 rounded-xl flex items-center space-x-4 transition-colors ${
                paymentMethod === 'cash'
                  ? 'border-[#007AFF] bg-[#007AFF]/5'
                  : 'border-[#E5E5E5] hover:border-[#007AFF]/50'
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                paymentMethod === 'cash' ? 'bg-[#007AFF]' : 'bg-[#F5F5F5]'
              }`}>
                <Banknote className={`w-6 h-6 ${
                  paymentMethod === 'cash' ? 'text-white' : 'text-[#666]'
                }`} />
              </div>
              <div className="flex-1 text-left">
                <div>Efectivo</div>
                <div className="text-sm text-[#666]">Pagar al recibir</div>
              </div>
            </button>
          </div>
        </div>

        {/* Total */}
        <div className="bg-[#F5F5F5] rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#666]">Subtotal</span>
            <span>${(product.price * quantity).toLocaleString('es-CO')}</span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-[#666]">Envío</span>
            <span className="text-[#34C759]">Gratis</span>
          </div>
          <div className="border-t border-[#E5E5E5] pt-4">
            <div className="flex items-center justify-between">
              <span>Total</span>
              <span className="text-[#007AFF]">${totalPrice.toLocaleString('es-CO')}</span>
            </div>
          </div>
        </div>

        {/* Confirm Button - Only for Cash payments */}
        {paymentMethod !== 'digital' && (
          <Button
            onClick={handlePurchase}
            disabled={!paymentMethod}
            className="w-full bg-[#007AFF] hover:bg-[#0051D5] h-12 disabled:opacity-50"
          >
            Confirmar compra
          </Button>
        )}

        <p className="text-center text-sm text-[#666] mt-4">
          Al confirmar, podrás ver la ubicación exacta del negocio en el mapa
        </p>
      </div>
    </div>
  );
}
