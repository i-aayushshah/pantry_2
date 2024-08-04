import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiPackage, FiBook, FiShoppingCart } from 'react-icons/fi';

const FeatureCard = ({ title, description, icon: Icon }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg p-8 rounded-2xl shadow-xl"
  >
    <Icon className="text-5xl text-white mb-6" />
    <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
    <p className="text-gray-100">{description}</p>
  </motion.div>
);

const BackgroundCircle = ({ size, delay, duration }) => (
  <motion.div
    className={`absolute rounded-full bg-white opacity-10 ${size}`}
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ duration, delay, repeat: Infinity, repeatType: "reverse" }}
  />
);

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 flex flex-col justify-center items-center p-4 overflow-hidden relative">
      <BackgroundCircle size="w-96 h-96 top-10 left-10" delay={0} duration={8} />
      <BackgroundCircle size="w-64 h-64 bottom-10 right-10" delay={1} duration={6} />
      <BackgroundCircle size="w-48 h-48 top-1/4 right-1/4" delay={2} duration={7} />

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10"
      >
        <motion.h1
          className="text-6xl font-extrabold text-white mb-6"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Welcome to Pantry Manager
        </motion.h1>
        <motion.p
          className="text-2xl text-gray-200 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Organize your kitchen, reduce waste, and cook smarter
        </motion.p>
        <div className="space-x-6">
          <Link href="/login" passHref>
            <motion.a
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255,255,255,0.5)" }}
              whileTap={{ scale: 0.95 }}
              className="inline-block bg-white text-indigo-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-indigo-100 transition duration-300"
            >
              Log In
            </motion.a>
          </Link>
          <Link href="/signup" passHref>
            <motion.a
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255,255,255,0.5)" }}
              whileTap={{ scale: 0.95 }}
              className="inline-block bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-indigo-700 transition duration-300"
            >
              Sign Up
            </motion.a>
          </Link>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl w-full z-10"
      >
        <FeatureCard
          title="Track Your Pantry"
          description="Keep an up-to-date inventory of your kitchen items with ease"
          icon={FiPackage}
        />
        <FeatureCard
          title="Smart Recipes"
          description="Discover delicious recipes based on your available ingredients"
          icon={FiBook}
        />
        <FeatureCard
          title="Shopping List"
          description="Generate smart shopping lists to keep your pantry well-stocked"
          icon={FiShoppingCart}
        />
      </motion.div>
    </div>
  );
}
