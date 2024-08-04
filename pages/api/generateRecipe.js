import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: 'sk-99CtXqPIBaa4BJwCFN-XE8HtkhDnvcQU6_NBmycod9T3BlbkFJU7gSCS1hDUf2OHhXCq8TVOYvkvhnmUM9KI4W8Xnp8A'
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { ingredients } = req.body;
      const response = await openai.Completion.create({
        model: 'text-davinci-003',
        prompt: `Generate a recipe using these ingredients: ${ingredients.join(', ')}`,
        max_tokens: 150,
      });
      res.status(200).json({ recipe: response.data.choices[0].text });
    } catch (error) {
      console.error('OpenAI API error:', error);
      res.status(500).json({ error: 'Failed to generate recipe' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
