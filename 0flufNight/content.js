const FILTER_ID = 'ofluf-night-element';

const getFilter = () => {
    let el = document.getElementById(FILTER_ID);
    if (!el) {
        el = document.createElement('div');
        el.id = FILTER_ID;
        el.style.cssText = `
            position: fixed;
            top: 0; left: 0;
            width: 100vw; height: 100vh;
            pointer-events: none;
            z-index: 2147483647;
            mix-blend-mode: multiply;
            display: none;
        `;
        (document.body || document.documentElement).appendChild(el);
    }
    return el;
};

const render = (enabled, intensity) => {
    const el = getFilter();
    if (enabled) {
        el.style.display = 'block';
        el.style.backgroundColor = `rgba(255, 150, 0, ${intensity / 100})`;
    } else {
        el.style.display = 'none';
    }
};

chrome.storage.local.get(['enabled', 'intensity'], (res) => {
    render(res.enabled, res.intensity);
});

chrome.runtime.onMessage.addListener((msg) => {
    render(msg.enabled, msg.intensity);
});