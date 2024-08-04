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
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="all">All Categories</option>
                <option value="fruits">Fruits</option>
                <option value="vegetables">Vegetables</option>
                <option value="dairy">Dairy</option>
                <option value="grains">Grains</option>
                <option value="meat">Meat</option>
                <option value="other">Other</option>
              </select>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="name">Sort by Name</option>
                <option value="expirationDate">Sort by Expiration Date</option>
                </select>
            </div>
            <PantryList items={filteredItems} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
