import React from 'react';
import { useCart } from './CartContext';
import { useAuth } from '../../context/AuthContext';

const CartPage: React.FC = () => {
    const { cartItems, removeFromCart, loading: cartLoading, error: cartError } = useCart();
    const { token, loading: authLoading } = useAuth();

    const totalPrice = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const handlePayment = async () => {
        if (!token) {
            alert('You must be logged in to make a payment');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    amount: totalPrice,
                    currency: 'USD',
                    items: cartItems,
                }),
            });

            if (!response.ok) {
                const err = await response.json();
                alert(err.error || 'Payment initialization failed');
                return;
            }

            const data = await response.json();

            if (data?.data?.checkout_url) {
                window.location.href = data.data.checkout_url; 
            } else {
                alert('Payment URL not found');
            }
        } catch (error) {
            console.error(error);
            alert('Failed to initiate payment');
        }
    };

    if (authLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <p className="text-xl text-gray-600">Loading user data...</p>
            </div>
        );
    }
    
    if (!token) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <p className="text-xl text-gray-600">Please log in to view your cart.</p>
            </div>
        );
    }

    if (cartLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <p className="text-xl text-gray-600">Loading cart items...</p>
            </div>
        );
    }

    if (cartError) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <p className="text-xl text-red-500">Error: {cartError}</p>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <p className="text-xl text-gray-600">Your cart is empty.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Shopping Cart</h1>
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="space-y-6">
                    {cartItems.map((item) => (
                        <div key={item.product.id} className="flex items-center p-4 bg-gray-50 rounded-lg shadow-sm">
                            <img
                                src={item.product.imageUrl}
                                alt={item.product.name}
                                className="w-24 h-24 object-cover rounded-lg mr-6"
                                onError={(e) => { e.currentTarget.src = "https://placehold.co/96x96/e5e7eb/4b5563?text=No+Image" }}
                            />
                            <div className="flex-1">
                                <h2 className="text-xl font-semibold text-gray-800">{item.product.name}</h2>
                                <p className="text-gray-600">Quantity: {item.quantity}</p>
                                <p className="text-gray-900 font-bold mt-1">${(item.product.price * item.quantity).toFixed(2)}</p>
                            </div>
                            <button
                                onClick={() => removeFromCart(item.product.id)}
                                className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg shadow-md hover:bg-red-600 transition duration-300"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
                <div className="mt-8 pt-4 border-t-2 border-gray-200 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
                        Total: <span className="text-green-600">${totalPrice.toFixed(2)}</span>
                    </p>
                    <button
                        onClick={handlePayment}
                        className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-300"
                    >
                        Pay with Chapa
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
