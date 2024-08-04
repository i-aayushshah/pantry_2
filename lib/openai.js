export const generateRecipe = async (ingredients) => {
  const response = await fetch('/api/generateRecipe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ingredients }),
  });
  if (!response.ok) {
    throw new Error('Failed to generate recipe');
  }
  const data = await response.json();
  return data.recipe; // Ensure you're accessing the correct property
};
