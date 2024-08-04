import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

export default function ShoppingList() {
  const [shoppingItems, setShoppingItems] = useState([]);
  const [pantryItems, setPantryItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState(1);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Fetch shopping list items
    const shoppingQuery = query(collection(db, 'shoppingList'), where('userId', '==', user.uid));
    const unsubscribeShopping = onSnapshot(shoppingQuery, (querySnapshot) => {
      const fetchedItems = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setShoppingItems(fetchedItems);
    });

    // Fetch pantry items
    const pantryQuery = query(collection(db, 'pantryItems'), where('userId', '==', user.uid));
    const unsubscribePantry = onSnapshot(pantryQuery, (querySnapshot) => {
      const fetchedItems = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPantryItems(fetchedItems);
    });

    return () => {
      unsubscribeShopping();
      unsubscribePantry();
    };
  }, [user]);

  const addItem = async (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;

    try {
      await addDoc(collection(db, 'shoppingList'), {
        name: newItem.trim(),
        quantity: newItemQuantity,
        userId: user.uid,
        createdAt: new Date(),
      });
      setNewItem('');
      setNewItemQuantity(1);
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const updateItemQuantity = async (id, newQuantity) => {
    try {
      await updateDoc(doc(db, 'shoppingList', id), { quantity: newQuantity });
    } catch (error) {
      console.error('Error updating item quantity:', error);
    }
  };

  const removeItem = async (id) => {
    try {
      await deleteDoc(doc(db, 'shoppingList', id));
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const addToPantry = async (item) => {
    try {
      const existingItem = pantryItems.find(pantryItem => pantryItem.name.toLowerCase() === item.name.toLowerCase());
      if (existingItem) {
        await updateDoc(doc(db, 'pantryItems', existingItem.id), {
          quantity: existingItem.quantity + item.quantity
        });
      } else {
        await addDoc(collection(db, 'pantryItems'), {
          name: item.name,
          quantity: item.quantity,
          userId: user.uid,
          category: 'other', // You might want to let the user choose a category
          expirationDate: null // You might want to let the user set an expiration date
        });
      }
      await removeItem(item.id);
    } catch (error) {
      console.error('Error adding item to pantry:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Shopping List</h2>
      <form onSubmit={addItem} className="mb-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Add a new item"
            className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="number"
            value={newItemQuantity}
            onChange={(e) => setNewItemQuantity(parseInt(e.target.value))}
            min="1"
            className="w-20 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Add
          </button>
        </div>
      </form>
      <ul className="space-y-2">
        {shoppingItems.map((item) => (
          <li key={item.id} className="flex items-center justify-between bg-white p-3 rounded-md shadow">
            <span>{item.name}</span>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => updateItemQuantity(item.id, parseInt(e.target.value))}
                min="1"
                className="w-16 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={() => addToPantry(item)}
                className="px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Add to Pantry
              </button>
              <button
                onClick={() => removeItem(item.id)}
                className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
      {shoppingItems.length === 0 && (
        <p className="text-gray-500 text-center mt-4">Your shopping list is empty.</p>
      )}
    </div>
  );
}
