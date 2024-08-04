import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, deleteDoc, doc, updateDoc, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import EditItemForm from './EditItemForm';

const LOW_STOCK_THRESHOLD = 3;

export default function PantryList() {
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'pantryItems'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedItems = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItems(fetchedItems);

      // Check for low stock items and add to shopping list
      fetchedItems.forEach(item => {
        if (item.quantity < LOW_STOCK_THRESHOLD) {
          addToShoppingList(item);
        }
      });
    });

    return () => unsubscribe();
  }, [user]);

  const addToShoppingList = async (item) => {
    try {
      // Check if the item is already in the shopping list
      const shoppingListQuery = query(
        collection(db, 'shoppingList'),
        where('userId', '==', user.uid),
        where('name', '==', item.name)
      );
      const shoppingListSnapshot = await getDocs(shoppingListQuery);

      if (shoppingListSnapshot.empty) {
        // If the item is not in the shopping list, add it
        await addDoc(collection(db, 'shoppingList'), {
          name: item.name,
          quantity: LOW_STOCK_THRESHOLD - item.quantity,
          userId: user.uid,
          createdAt: new Date(),
        });
      } else {
        // If the item is already in the shopping list, update its quantity
        const shoppingListItem = shoppingListSnapshot.docs[0];
        await updateDoc(doc(db, 'shoppingList', shoppingListItem.id), {
          quantity: shoppingListItem.data().quantity + (LOW_STOCK_THRESHOLD - item.quantity)
        });
      }
    } catch (error) {
      console.error('Error adding item to shopping list:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'pantryItems', id));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      await updateDoc(doc(db, 'pantryItems', id), updatedData);
      setEditingItem(null);

      // Check if the updated quantity is below threshold and add to shopping list if necessary
      if (updatedData.quantity < LOW_STOCK_THRESHOLD) {
        addToShoppingList({ ...updatedData, id });
      }
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
  };

  const filteredAndSortedItems = items
    .filter(item => categoryFilter === 'all' || item.category === categoryFilter)
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'expirationDate') {
        return new Date(a.expirationDate) - new Date(b.expirationDate);
      }
      return 0;
    });
    
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Your Pantry Items</h2>
      <div className="mb-4 flex justify-between">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
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
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="name">Sort by Name</option>
          <option value="expirationDate">Sort by Expiration Date</option>
        </select>
      </div>
      {filteredAndSortedItems.length === 0 ? (
        <p>No items in your pantry yet.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {filteredAndSortedItems.map((item) => (
            <li key={item.id} className="py-4 flex flex-col">
              {editingItem && editingItem.id === item.id ? (
                <EditItemForm
                  item={editingItem}
                  onUpdate={handleUpdate}
                  onCancel={handleCancelEdit}
                />
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    <p className="text-sm text-gray-500">Category: {item.category}</p>
                    <p className="text-sm text-gray-500">Expiration: {item.expirationDate}</p>
                  </div>
                  <div>
                    <button
                      onClick={() => handleEdit(item)}
                      className="mr-2 px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-2 py-1 text-xs font-medium text-red-600 bg-red-100 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
