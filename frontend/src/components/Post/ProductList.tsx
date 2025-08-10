import React, { useState, useEffect } from "react";
import { FiSearch, FiShoppingCart } from "react-icons/fi";
import { motion } from "framer-motion";

type Product = {
  id: string;
  name: string;
  quantity: number;
  description: string;
  price: number;
  imageUrl: string;
};

const mockProducts: Product[] = [
  {
    id: "2",
    name: "Fresh Carrots",
    quantity: 80,
    description: "Sweet, crunchy carrots packed with beta-carotene. Harvested at peak freshness.",
    price: 2000,
    imageUrl:
      "https://images.unsplash.com/photo-1447175008436-054170c2e979?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "3",
    name: "Baby Spinach",
    quantity: 50,
    description:
      "Tender young spinach leaves, excellent for salads and smoothies. Rich in iron.",
    price: 3025,
    imageUrl:
      "https://images.unsplash.com/photo-1576045057995-568f588f82fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "4",
    name: "Ripe Tomatoes",
    quantity: 120,
    description: "Vine-ripened tomatoes with perfect balance of sweetness and acidity.",
    price: 2075,
    imageUrl:
      "https://images.unsplash.com/photo-1592841200221-a6898f307baa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
];

const ProductsList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 1500);
  }, []);

  const filteredProducts = products.filter((product) => {
    const lowerTerm = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(lowerTerm) ||
      product.description.toLowerCase().includes(lowerTerm)
    );
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse"
            >
              <div className="bg-gray-200 h-56"></div>
              <div className="p-6 space-y-3">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-10 bg-gray-200 rounded-lg mt-4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-green-800 mb-3">Fresh Farm Products</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Directly sourced from local farmers. Quality you can taste!
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md mx-auto mb-8">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search products..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20">
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">No products found</h3>
          <p className="text-gray-500">Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-green-100"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {product.quantity} in stock
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                  <span className="text-lg font-bold text-green-700"> {product.price.toFixed(2)}</span>
                </div>

                <p className="text-gray-600 mb-4">{product.description}</p>

                <button
                  className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300 font-medium"
                  onClick={() => alert(`Added ${product.name} to cart`)}
                >
                  <FiShoppingCart /> Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsList;
