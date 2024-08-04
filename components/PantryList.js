import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import EditItemForm from './EditItemForm';

export default function PantryList() {
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
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
    });

    return () => unsubscribe();
  }, [user]);

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
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Your Pantry Items</h2>
      {items.length === 0 ? (
        <p>No items in your pantry yet.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {items.map((item) => (
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
