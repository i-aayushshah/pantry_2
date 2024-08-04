import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import PantryList from '../components/PantryList';
import AddItemForm from '../components/AddItemForm';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { FiFilter, FiSortDescending } from 'react-icons/fi';

const MotionSelect = motion.div; // Change from motion.select to motion.div

export default function Dashboard() {
  const [pantryItems, setPantryItems] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('name');
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      const q = query(
        collection(db, 'pantryItems'),
        where('userId', '==', user.uid),
        orderBy(sort)
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const items = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() });
        });
        setPantryItems(items);
      });

      return () => unsubscribe();
    }
  }, [user, sort]);

  const filteredItems = pantryItems.filter((item) => {
    if (filter === 'all') return true;
    return item.category === filter;
  });

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.h1
            className="text-4xl font-extrabold text-indigo-900 mb-8 text-center"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Your Pantry
          </motion.h1>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <motion.div
              className="bg-white rounded-lg shadow-xl p-6"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-indigo-800 mb-4">Add New Item</h2>
              <AddItemForm />
            </motion.div>
            <motion.div
              className="bg-white rounded-lg shadow-xl p-6"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-indigo-800 mb-4">Pantry Items</h2>
              <div className="mb-4 flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="relative flex-1">
                  <FiFilter className="absolute top-3 left-3 text-gray-400" />
                  <MotionSelect
                    as="select"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <option value="all">All Categories</option>
                    <option value="fruits">Fruits</option>
                    <option value="vegetables">Vegetables</option>
                    <option value="dairy">Dairy</option>
                    <option value="grains">Grains</option>
                    <option value="meat">Meat</option>
                    <option value="other">Other</option>
                  </MotionSelect>
                </div>
                <div className="relative flex-1">
                  <FiSortDescending className="absolute top-3 left-3 text-gray-400" />
                  <MotionSelect
                    as="select"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <option value="name">Sort by Name</option>
                    <option value="expirationDate">Sort by Expiration Date</option>
                  </MotionSelect>
                </div>
              </div>
              <PantryList items={filteredItems} />
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
