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
    const upstreamResponse = await fetch('https://api.nbatopshot.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0',
        'Origin': 'https://nbatopshot.com',
        'Referer': 'https://nbatopshot.com/',
        'Cookie': 'sid=YOUR_SESSION_COOKIE', // Replace with your real session cookie
      },
      body: JSON.stringify(req.body),
    });

    const text = await upstreamResponse.text();
    const statusCode = upstreamResponse.status;
    const statusText = upstreamResponse.statusText;
    const headers = upstreamResponse.headers;

    // Log the full response for debugging purposes
    console.log('Response Status:', statusCode, statusText);
    console.log('Response Headers:', Array.from(headers.entries()));
    console.log('Response Body:', text.slice(0, 500));  // Preview the first 500 chars

    // Try to parse the JSON response
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
