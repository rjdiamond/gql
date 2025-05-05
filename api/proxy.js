export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  try {
    const upstreamResponse = await fetch('https://nbatopshot.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0',
        'Origin': 'https://nbatopshot.com',
        'Referer': 'https://nbatopshot.com/',
      },
      body: JSON.stringify(req.body),
    });

    const text = await upstreamResponse.text();

    try {
      const json = JSON.parse(text);
      res.status(200).json(json);
    } catch (parseError) {
      console.error('Failed to parse JSON from upstream:', text);
      res.status(502).json({ error: 'Invalid JSON from NBA Top Shot', raw: text });
    }
  } catch (fetchError) {
    console.error('Fetch to NBA Top Shot failed:', fetchError);
    res.status(500).json({ error: 'Internal server error', details: fetchError.message });
  }
}
