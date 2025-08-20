import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from '../../context/AuthContext';

interface Product {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
}

interface CartItem {
    product: Product;
    quantity: number;
}

interface CartContextType {
    cartItems: CartItem[];
    cartCount: number;
    totalPrice: number;
    addToCart: (productId: string) => Promise<void>;
    removeFromCart: (productId: string) => Promise<void>;
    updateQuantity: (productId: string, quantity: number) => Promise<void>;
    loading: boolean;
    error: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { token, loading: authLoading } = useAuth();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        const fetchCart = async () => {
            if (authLoading || !token) {
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const response = await fetch('http://localhost:5000/api/cart', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to fetch cart items.');
                }

                const data: CartItem[] = await response.json();
                setCartItems(Array.isArray(data) ? data : []);
                setError(null);
            } catch (err: any) {
                console.error('Failed to fetch cart:', err);
                setError(err.message);
                setCartItems([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, [token, authLoading]);

    const addToCart = async (productId: string) => {
        if (!token) {
            setError('Authentication token is missing. Please log in.');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ productId }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to add item to cart.');
            }

            const updatedCart: CartItem[] = await response.json();
            setCartItems(updatedCart);
            setError(null);
        } catch (err: any) {
            console.error('Failed to add to cart:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const removeFromCart = async (productId: string) => {
    if (!token) {
        setError('Authentication token is missing. Please log in.');
        return;
    }

    setLoading(true);
    try {
        const response = await fetch(`http://localhost:5000/api/cart/${productId}`, { 
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to remove item from cart.');
        }

        const updatedCart: CartItem[] = await response.json();
        setCartItems(updatedCart);
        setError(null);
    } catch (err: any) {
        console.error('Failed to remove from cart:', err);
        setError(err.message);
    } finally {
        setLoading(false);
    }
};


    const updateQuantity = async (productId: string, quantity: number) => {
        if (!token) {
            setError('Authentication token is missing. Please log in.');
            return;
        }
        if (quantity <= 0) {
            await removeFromCart(productId);
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/cart', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ productId, quantity }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update item quantity.');
            }

            const updatedCart: CartItem[] = await response.json();
            setCartItems(updatedCart);
            setError(null);
        } catch (err: any) {
            console.error('Failed to update quantity:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const totalPrice = cartItems.reduce((sum, item) => sum + ((item.product?.price || 0) * (item.quantity || 0)), 0);

    const value: CartContextType = {
        cartItems,
        cartCount,
        totalPrice,
        addToCart,
        removeFromCart,
        updateQuantity,
        loading,
        error,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
