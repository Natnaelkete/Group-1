import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const PaymentSuccessPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <motion.div
      className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-8rem)]"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="max-w-md w-full rounded-2xl shadow-xl border-green-400 border-2 text-center">
        <CardContent className="p-8 flex flex-col items-center">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
          >
            <CheckCircle className="text-green-500 mb-4" size={96} />
          </motion.div>
          
          <motion.h1
            className="text-4xl font-bold text-green-700 mb-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {t("paymentSuccess.title")}
          </motion.h1>

          <motion.p
            className="text-lg text-gray-600 mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {t("paymentSuccess.message")}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Link to="/">
              <Button className="bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-300">
                {t("paymentSuccess.backToDashboard")}
              </Button>
            </Link>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PaymentSuccessPage;
