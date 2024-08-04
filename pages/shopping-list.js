import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import ShoppingList from '../components/ShoppingList';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function ShoppingListPage() {
  const [lowStockItems, setLowStockItems] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchLowStockItems = async () => {
      if (user) {
        const q = query(
          collection(db, 'pantryItems'),
          where('userId', '==', user.uid),
          where('quantity', '<', 3) // Adjust this threshold as needed
        );
        const querySnapshot = await getDocs(q);
        const items = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() });
        });
        setLowStockItems(items);
      }
    };

    fetchLowStockItems();
  }, [user]);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Shopping List</h1>
        <ShoppingList items={lowStockItems} />
      </div>
    </Layout>
  );
}
