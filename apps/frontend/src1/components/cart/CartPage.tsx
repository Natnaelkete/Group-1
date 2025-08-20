import React from 'react';
import { useCart } from './CartContext';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const CartPage: React.FC = () => {
  const { t } = useTranslation();
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    updateQuantity(id, newQuantity);
  };

  const handleRemoveFromCart = (id: string) => {
    removeFromCart(id);
  };

  const handleChapaPayment = () => {
    alert(t("cart.chapaPaymentMessage"));
    console.log("Simulating Chapa payment for total:", subtotal.toFixed(2));
    clearCart();
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">{t('cart.empty')}</h2>
        <p className="text-gray-600 mb-6">{t('cart.emptyMessage')}</p>
        <Link to="/products">
          <Button className="bg-green-600 text-white hover:bg-green-700 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> {t('cart.startShopping')}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-green-800 mb-8">{t('cart.title')}</h1>
      
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <Card key={item.id} className="flex items-center p-4 rounded-xl shadow-sm border border-gray-200">
              <img
                src={item.imageUrl || 'https://placehold.co/100x100'}
                alt={item.name}
                className="w-24 h-24 rounded-lg object-cover mr-4"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="text-gray-500">${item.price.toFixed(2)} {t('cart.itemPerItem')}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}>
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value))}
                  className="w-16 text-center"
                  min="1"
                />
                <Button variant="outline" size="icon" onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="ml-8 text-right">
                <p className="font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-100" onClick={() => handleRemoveFromCart(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Cart Summary & Payment */}
        <div className="lg:col-span-1">
          <Card className="rounded-xl shadow-lg border border-green-200">
            <CardHeader>
              <CardTitle>{t('cart.orderSummary')}</CardTitle>
              <CardDescription>{t('cart.finalizeOrder')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-2">
                <span>{t('cart.items', { count: totalItems })}</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t">
                <span>{t('cart.total')}</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <Button
                className="w-full mt-6 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                onClick={handleChapaPayment}
              >
                {t('cart.payWithChapa')}
              </Button>
              <Link to="/products">
                <Button variant="outline" className="w-full mt-2 text-green-600 border-green-600 hover:bg-green-50 transition-colors">
                  <ArrowLeft className="mr-2 h-4 w-4" /> {t('cart.continueShopping')}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartPage;