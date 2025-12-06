function displayReel() {
    const link = document.getElementById('reelLink').value;
    const viewer = document.getElementById('viewer');
    viewer.innerHTML = '<p>Fetching embed code...</p>';

    if (link) {
        // We call our own API endpoint hosted by Vercel
        fetch(`/api/oembed?url=${encodeURIComponent(link)}`)
            .then(response => response.json())
            .then(data => {
                if (data.html) {
                    viewer.innerHTML = data.html;
                    // Instagram requires this script to make the embed look correct
                    // We need to re-process the embeds after injecting new HTML
                    if (window.instgrm) {
                        window.instgrm.Embeds.process();
                    } else {
                        // If it's not loaded yet, we load it dynamically
                        const script = document.createElement('script');
                        script.async = true;
                        script.src = "//www.instagram.com";
                        document.head.appendChild(script);
                    }
                } else {
                    viewer.innerHTML = `<p>Error: ${data.error || 'Could not retrieve embed code.'}</p>`;
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
                viewer.innerHTML = `<p>Network Error: Ensure the link is valid and the server is running.</p>`;
            });
    } else {
        viewer.innerHTML = '<p>Please enter a valid Instagram link.</p>';
    }
}
