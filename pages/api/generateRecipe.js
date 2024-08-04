import OpenAI from 'openai';

export default async function handler(req, res) {
  console.log('API route called with method:', req.method);

  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY is not set');
    return res.status(500).json({ error: 'OpenAI API key is not configured' });
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  try {
    console.log('Received request body:', req.body);
    const { ingredients } = req.body;

    if (!ingredients || !Array.isArray(ingredients)) {
      console.error('Invalid ingredients format:', ingredients);
      return res.status(400).json({ error: 'Invalid ingredients format' });
    }

    console.log('Generating recipe for ingredients:', ingredients);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates recipes based on given ingredients."
        },
        {
          role: "user",
          content: `Generate a recipe using these ingredients: ${ingredients.join(', ')}`
        }
      ],
      max_tokens: 150,
    });

    const recipe = completion.choices[0].message.content;
    console.log('Generated recipe:', recipe);
    res.status(200).json({ recipe });
  } catch (error) {
    console.error('Error in recipe generation:', error);
    res.status(500).json({
      error: 'Failed to generate recipe',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
