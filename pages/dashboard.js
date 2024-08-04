import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import PantryList from '../components/PantryList';
import AddItemForm from '../components/AddItemForm';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';

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
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Pantry</h1>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <AddItemForm />
          </div>
          <div>
            <div className="mb-4 flex justify-between">
   
            </div>
            <PantryList items={filteredItems} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
