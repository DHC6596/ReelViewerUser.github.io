// api/oembed.js - This runs on the server, keeping keys safe.

// Vercel will automatically inject these environment variables when we deploy
// We will set these up later in Vercel settings.
const INSTAGRAM_APP_ID = process.env.INSTAGRAM_APP_ID;
const INSTAGRAM_APP_SECRET = process.env.INSTAGRAM_APP_SECRET;

// This is the main function Vercel runs
module.exports = async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'Missing URL parameter' });
    }

    // The official Facebook Graph API endpoint for oEmbed
    const apiEndpoint = 'graph.facebook.com';

    // We combine the App ID and Secret securely on the server side
    const accessToken = `${INSTAGRAM_APP_ID}|${INSTAGRAM_APP_SECRET}`;

    const fetchUrl = `${apiEndpoint}?url=${encodeURIComponent(url)}&access_token=${accessToken}`;

    try {
        const apiResponse = await fetch(fetchUrl);
        const data = await apiResponse.json();

        if (data.html) {
            // Success: send the embed HTML back to our frontend
            res.status(200).json({ html: data.html });
        } else {
            // Error from Instagram API
            res.status(400).json({ error: data.error.message || 'Error fetching data from Instagram API' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
