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

    res.status(upstreamResponse.status).json({
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers: Object.fromEntries(upstreamResponse.headers.entries()),
      bodyPreview: text.slice(0, 500) // limit size for easier viewing
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
