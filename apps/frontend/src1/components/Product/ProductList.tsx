import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ShoppingCart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "../cart/CartContext";

type Product = {
  id: string;
  name: string;
  quantity: number;
  description?: string;
  price?: number;
  imageUrl?: string;
};

const ProductsList: React.FC = () => {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const lowerTerm = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(lowerTerm) ||
      (product.description && product.description.toLowerCase().includes(lowerTerm))
    );
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="rounded-2xl shadow-md overflow-hidden animate-pulse">
              <div className="bg-gray-200 h-56"></div>
              <div className="p-6 space-y-3">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-10 bg-gray-200 rounded-lg mt-4"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-red-500">
        <h3 className="text-2xl font-semibold mb-2">Error loading products</h3>
        <p>Please try again later. Error message: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-green-800 mb-3">{t('product.list.title')}</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {t('product.list.subtitle')}
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md mx-auto mb-8">
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
        </span>
        <input
          type="text"
          placeholder={t('product.list.searchPlaceholder')}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20">
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">{t('product.list.noProductsFound')}</h3>
          <p className="text-gray-500">{t('product.list.adjustSearch')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-green-100"
            >
              <Link to={`/products/${product.id}`}>
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={product.imageUrl || 'https://placehold.co/600x400/E5E7EB/4B5563?text=No+Image'}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {product.quantity} {t('product.list.inStock')}
                  </div>
                </div>
              </Link>

              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-xl font-bold text-gray-900">{product.name}</CardTitle>
                  <span className="text-lg font-bold text-green-700">
                    {product.price ? `$${product.price.toFixed(2)}` : 'N/A'}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{product.description || 'No description provided.'}</p>
                
                <div className="flex gap-2">
                    <Button
                        className="flex-1 items-center gap-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-300 font-medium"
                        onClick={(event) => {
                            event.stopPropagation();
                            if (product.price !== undefined) {
                                addToCart({
                                    id: product.id,
                                    name: product.name,
                                    price: product.price,
                                    imageUrl: product.imageUrl,
                                }, 1);
                                navigate('/cart');
                            }
                        }}
                    >
                        <ShoppingCart size={20} /> {t('addToCart')}
                    </Button>
                    <Link to={`/products/${product.id}`} className="flex-1">
                        <Button
                            variant="outline"
                            className="w-full text-green-600 border-green-600 hover:bg-green-50 transition-colors duration-300"
                        >
                            {t('product.list.viewDetails')}
                        </Button>
                    </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsList;