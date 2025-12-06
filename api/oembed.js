// api/oembed.js

const INSTAGRAM_APP_ID = process.env.INSTAGRAM_APP_ID;
const INSTAGRAM_APP_SECRET = process.env.INSTAGRAM_APP_SECRET;

module.exports = async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'Missing URL parameter' });
    }

    // Correct oEmbed endpoint — must include https:// and the full path
    const apiEndpoint = 'https://graph.facebook.com/v19.0/instagram_oembed';

    const accessToken = `${INSTAGRAM_APP_ID}|${INSTAGRAM_APP_SECRET}`;

    // Build the full URL properly
    const fetchUrl = `${apiEndpoint}?url=${encodeURIComponent(url)}&access_token=${accessToken}&omitscript=true`;

    try {
        const apiResponse = await fetch(fetchUrl);
        const data = await apiResponse.json();

        if (data.html) {
            res.status(200).json({ html: data.html });
        } else {
            res.status(400).json({ error: data.error?.message || 'Error fetching data from Instagram API' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
