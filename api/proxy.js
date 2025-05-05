export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  try {
    const response = await fetch('https://nbatopshot.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0',
        'Origin': 'https://nbatopshot.com',
        'Referer': 'https://nbatopshot.com/',
        // Add your Authorization or Cookie header here if needed
        // 'Authorization': 'Bearer YOUR_TOKEN',
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Failed to fetch from NBA Top Shot' });
  }
}
