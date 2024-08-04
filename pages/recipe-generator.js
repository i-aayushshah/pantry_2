import React, { useState } from 'react';
import Layout from '../components/Layout';
import RecipeCard from '../components/RecipeCard';
import { generateRecipe } from '../lib/openai';

export default function RecipeGenerator() {
  const [ingredients, setIngredients] = useState('');
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateRecipe = async () => {
    setLoading(true);
    setError('');
    try {
      const ingredientsList = ingredients.split(',').map(item => item.trim());
      console.log('Sending ingredients:', ingredientsList);
      const generatedRecipe = await generateRecipe(ingredientsList);
      console.log('Received recipe:', generatedRecipe);
      setRecipe(generatedRecipe);
    } catch (err) {
      console.error('Error in recipe generation:', err);
      setError(`Failed to generate recipe: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Recipe Generator</h1>
        <div className="mb-4">
          <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700">
            Enter ingredients (comma-separated)
          </label>
          <input
            type="text"
            id="ingredients"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <button
          onClick={handleGenerateRecipe}
          disabled={loading || !ingredients}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate Recipe'}
        </button>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        {recipe && <RecipeCard recipe={recipe} />}
      </div>
    </Layout>
  );
}
