import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ShoppingCart, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "../cart/CartContext";
import { useAuth } from '../../context/AuthContext'; // Import useAuth

type Product = {
    id: string;
    name: string;
    quantity: number;
    description?: string;
    price: number;
    imageUrl: string;
};

const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { t } = useTranslation();
    const { cartItems, addToCart } = useCart();
    const { token, loading: authLoading } = useAuth(); // Use token and loading from useAuth
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            // Wait until authentication is done and a token is available
            if (authLoading || !token) {
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const response = await fetch(`http://localhost:5000/api/products/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to fetch product details.');
                }
                const data = await response.json();
                setProduct(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id, token, authLoading]); // Re-run effect when id, token, or authLoading state changes

    const handleAddToCart = () => {
        if (product) {
            addToCart(product.id);
            console.log(`${product.name} added to cart!`);
        }
    };

    // Show loading state while auth is loading or products are being fetched
    if (loading || authLoading) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <p>{t('product.detail.loading')}</p>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="container mx-auto px-4 py-12 text-center text-red-500">
                <h3 className="text-2xl font-semibold mb-2">{t('product.detail.notFound')}</h3>
                <p>{t('product.detail.errorMessage', { error })}</p>
                <Link to="/products" className="mt-4 inline-flex items-center gap-2 text-green-600 hover:text-green-800">
                    <ArrowLeft size={16} /> {t('product.detail.backToProducts')}
                </Link>
            </div>
        );
    }

    const isProductInCart = cartItems.some(item => item.product.id === product.id);

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="md:flex">
                    <div className="md:flex-shrink-0">
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-96 w-full object-cover md:w-96"
                        />
                    </div>
                    <div className="p-8 flex-1 flex flex-col">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
                        <p className="text-2xl font-bold text-green-700 mb-4">
                            ETB {product.price.toFixed(2)}
                        </p>
                        <p className="text-gray-600 mb-6 flex-1">{product.description || t('product.detail.noDescription')}</p>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-semibold text-gray-700">{t('product.detail.inStock')}:</span>
                                <span className="text-lg font-bold text-green-600">{product.quantity}</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
                            {isProductInCart ? (
                                <Button
                                    className="flex items-center gap-2 w-full bg-gray-400 text-white rounded-xl cursor-not-allowed"
                                    disabled
                                >
                                    <Check size={20} /> {t('cart.addedToCart')}
                                </Button>
                            ) : (
                                <Button
                                    className="flex items-center gap-2 w-full bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-300 font-medium"
                                    onClick={handleAddToCart}
                                >
                                    <ShoppingCart size={20} /> {t('product.detail.addToCart')}
                                </Button>
                            )}
                            <Link to="/products">
                                <Button
                                    variant="outline"
                                    className="w-full text-green-600 border-green-600 hover:bg-green-50 transition-colors duration-300"
                                >
                                    <ArrowLeft size={16} className="mr-2"/> {t('product.detail.backToProducts')}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
