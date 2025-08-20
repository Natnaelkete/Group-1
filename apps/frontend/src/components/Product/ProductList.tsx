import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../cart/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Plus, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

interface Product {
    id: string;
    name: string;
    price?: number;
    imageUrl: string;
    isSold: boolean; // Added the isSold property
}

const ProductList: React.FC = () => {
    const { cartItems, addToCart } = useCart();
    const { token, loading: authLoading } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            if (authLoading || !token) {
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const response = await fetch('http://localhost:5000/api/products', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to fetch products.');
                }
                const data = await response.json();
                setProducts(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, [token, authLoading]);

    const handleAddToCart = (productId: string) => {
        addToCart(productId);
    };

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { y: 50, opacity: 0, scale: 0.9 },
        visible: {
            y: 0,
            opacity: 1,
            scale: 1,
            transition: {
                type: 'spring',
                stiffness: 100,
            },
        },
    };

    if (isLoading || authLoading) {
        return (
            <div className="container mx-auto px-4 py-12 text-center text-gray-500">
                <p>Loading products...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-12 text-center text-red-500">
                <p>Error: {error}</p>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="container mx-auto px-4 py-12 text-center text-gray-500">
                <p>No products available at the moment.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold text-green-800 mb-2">Product List</h1>
            <p className="text-xl text-gray-600 mb-8">Browse our available products below.</p>

            <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {products.map((product) => {
                    const isProductInCart = cartItems.some(item => item.product.id === product.id);

                    return (
                        <motion.div
                            key={product.id}
                            variants={itemVariants}
                            whileHover={{
                                scale: 1.05,
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                            }}
                            transition={{ duration: 0.2 }}
                        >
                            <Card className="rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col h-full">
                                <Link to={`/products/${product.id}`} className="relative pb-[75%] block">
                                    <img
                                        src={product.imageUrl || 'https://placehold.co/400x300'}
                                        alt={product.name}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                </Link>
                                <CardHeader className="flex-grow p-4">
                                    <CardTitle className="text-xl font-bold">{product.name}</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                    <p className="text-2xl font-bold text-green-700">
                                        {product.price ? `ETB ${product.price.toFixed(2)}` : 'Price not available'}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">per unit</p>
                                </CardContent>
                                <CardFooter className="p-4 pt-0">
                                    {isProductInCart ? (
                                        <Button
                                            className="w-full bg-gray-400 text-white rounded-xl cursor-not-allowed"
                                            disabled
                                        >
                                            <Check className="mr-2 h-4 w-4" />
                                            Added to Cart
                                        </Button>
                                    ) : (
                                        <Button
                                            className="w-full bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                                            onClick={() => handleAddToCart(product.id)}
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add to Cart
                                        </Button>
                                    )}
                                </CardFooter>
                            </Card>
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    );
};

export default ProductList;
