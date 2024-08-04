export const generateRecipe = async (ingredients) => {
  console.log('generateRecipe called with ingredients:', ingredients);
  try {
    const response = await fetch('/api/generateRecipe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ingredients }),
    });
    console.log('Response status:', response.status);

    const text = await response.text();
    console.log('Response text:', text);

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = JSON.parse(text);
        errorMessage = errorData.error || errorMessage;
        if (errorData.details) {
          errorMessage += ` Details: ${errorData.details}`;
        }
      } catch (e) {
        console.error('Failed to parse error response:', e);
      }
      throw new Error(errorMessage);
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error('Failed to parse response as JSON:', e);
      throw new Error('Invalid response format from server');
    }

    console.log('Parsed response data:', data);

    if (!data.recipe) {
      throw new Error('No recipe found in response');
    }

    return data.recipe;
  } catch (error) {
    console.error('Error in generateRecipe:', error);
    throw error;
  }
};
