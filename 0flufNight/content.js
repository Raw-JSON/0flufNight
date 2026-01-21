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
            display: none;
            transition: opacity 0.3s ease;
        `;
        (document.body || document.documentElement).appendChild(el);
    }
    return el;
};

const render = (state) => {
    const el = getFilter();
    if (state.enabled) {
        el.style.display = 'block';
        const alpha = state.intensity / 100;
        
        // Reset styles
        el.style.backgroundColor = 'transparent';
        el.style.backdropFilter = 'none';
        el.style.mixBlendMode = 'normal';

        if (state.mode === 'amber') {
            el.style.backgroundColor = `rgba(255, 150, 0, ${alpha})`;
            el.style.mixBlendMode = 'multiply';
        } else if (state.mode === 'grayscale') {
            el.style.backdropFilter = `grayscale(${state.intensity}%)`;
        } else if (state.mode === 'dim') {
            el.style.backgroundColor = `rgba(0, 0, 0, ${alpha})`;
        }
    } else {
        el.style.display = 'none';
    }
};

chrome.storage.local.get(['enabled', 'intensity', 'mode'], (res) => {
    render(res);
});

chrome.runtime.onMessage.addListener((msg) => {
    render(msg);
});