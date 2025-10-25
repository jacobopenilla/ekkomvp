import React, { useState } from 'react';
import { ArrowLeft, Upload } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useApp } from './AppContext';
import { toast } from 'sonner@2.0.3';

interface ProductFormProps {
  onBack: () => void;
}

export function ProductForm({ onBack }: ProductFormProps) {
  const { addProduct, currentUser } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    deliveryType: 'direct' as 'direct' | 'no-delivery',
    image: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addProduct({
      entrepreneurId: currentUser?.id || '',
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      quantity: Number(formData.quantity),
      deliveryType: formData.deliveryType,
      image: formData.image || 'https://images.unsplash.com/photo-1628655386653-acd9ac2c4e98?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm93bmllcyUyMGRlc3NlcnR8ZW58MXx8fHwxNzYxMjcwNDUxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    });

    toast.success('¡Producto publicado!', {
      description: 'Tu producto ya está visible en el mapa',
    });

    onBack();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-[#E5E5E5] px-6 py-4 flex items-center space-x-4">
        <button onClick={onBack}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2>Ofrecer producto</h2>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 max-w-2xl mx-auto space-y-6">
        {/* Image Upload */}
        <div className="space-y-2">
          <Label>Foto del producto</Label>
          <div className="border-2 border-dashed border-[#E5E5E5] rounded-xl p-8 text-center hover:border-[#007AFF] transition-colors cursor-pointer">
            <Upload className="w-12 h-12 mx-auto text-[#666] mb-2" />
            <p className="text-sm text-[#666]">
              Haz clic para subir una imagen
            </p>
            <p className="text-xs text-[#999] mt-1">
              o arrastra y suelta aquí
            </p>
            <Input
              type="url"
              placeholder="O pega URL de la imagen"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="mt-4"
            />
          </div>
        </div>

        {/* Product Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Nombre del producto *</Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ej: Brownies clásicos"
            required
            className="h-12"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Descripción *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe tu producto..."
            required
            rows={4}
          />
        </div>

        {/* Price and Quantity */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Precio (COP) *</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="15000"
              required
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Cantidad disponible *</Label>
            <Input
              id="quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              placeholder="10"
              required
              className="h-12"
            />
          </div>
        </div>

        {/* Delivery Type */}
        <div className="space-y-2">
          <Label htmlFor="deliveryType">Tipo de entrega *</Label>
          <Select
            value={formData.deliveryType}
            onValueChange={(value: 'direct' | 'no-delivery') =>
              setFormData({ ...formData, deliveryType: value })
            }
          >
            <SelectTrigger className="h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="direct">Entrega directa</SelectItem>
              <SelectItem value="no-delivery">Sin domicilio</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-[#666]">
            {formData.deliveryType === 'direct'
              ? 'Entregarás el producto en la ubicación del cliente'
              : 'El cliente debe recoger el producto en tu ubicación'}
          </p>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button type="submit" className="w-full bg-[#007AFF] hover:bg-[#0051D5] h-12">
            Publicar producto
          </Button>
        </div>
      </form>
    </div>
  );
}
