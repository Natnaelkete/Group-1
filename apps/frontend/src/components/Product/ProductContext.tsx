import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
interface AuthContextType {
    token: string | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ token: null, loading: false });

const useAuth = () => {
    const [token, setToken] = useState<string | null>('mock-auth-token');
    const [loading, setLoading] = useState<boolean>(false);
    return { token, loading };
};

interface Product {
    id: string;
    name: string;
    price?: number;
    imageUrl: string;
    isSold: boolean;
}

interface ProductContextType {
    products: Product[];
    isLoading: boolean;
    error: string | null;
    refreshProducts: () => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);
export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { token, loading: authLoading } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = async () => {
        if (authLoading || !token) {
            setIsLoading(false);
            return;
        }
        
        console.log("Fetching products...");
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

    useEffect(() => {
        fetchProducts();
    }, [token, authLoading]);

    const refreshProducts = () => {
        fetchProducts();
    };

    const value = { products, isLoading, error, refreshProducts };

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
};
export const useProducts = () => {
    const context = useContext(ProductContext);
    if (context === undefined) {
        throw new Error('useProducts must be used within a ProductProvider');
    }
    return context;
};

