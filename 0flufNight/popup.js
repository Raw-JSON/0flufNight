const toggle = document.getElementById('enableToggle');
const slider = document.getElementById('intensitySlider');
const intVal = document.getElementById('intVal');

chrome.storage.local.get(['enabled', 'intensity'], (res) => {
    toggle.checked = res.enabled ?? false;
    slider.value = res.intensity ?? 30;
    intVal.innerText = `${slider.value}%`;
});

const update = () => {
    const state = { enabled: toggle.checked, intensity: parseInt(slider.value) };
    intVal.innerText = `${state.intensity}%`;
    chrome.storage.local.set(state);
    
    chrome.tabs.query({}, (tabs) => {
        tabs.forEach(tab => {
            chrome.tabs.sendMessage(tab.id, state).catch(() => {});
        });
    });
};

toggle.addEventListener('change', update);
slider.addEventListener('input', update);