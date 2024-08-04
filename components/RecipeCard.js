import React from 'react';

export default function RecipeCard({ recipe }) {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-4">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Generated Recipe</h3>
      </div>
      <div className="border-t border-gray-200">
        <div className="px-4 py-5 sm:p-6">
          <pre className="whitespace-pre-wrap text-sm text-gray-700">{recipe}</pre>
        </div>
      </div>
    </div>
  );
}
