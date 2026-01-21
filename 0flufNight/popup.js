const elements = {
    toggle: document.getElementById('enableToggle'),
    slider: document.getElementById('intensitySlider'),
    intVal: document.getElementById('intVal'),
    modeSelect: document.getElementById('modeSelect'),
    scheduleToggle: document.getElementById('scheduleToggle'),
    startTime: document.getElementById('startTime'),
    endTime: document.getElementById('endTime')
};

chrome.storage.local.get(['enabled', 'intensity', 'mode', 'scheduled', 'startTime', 'endTime'], (res) => {
    elements.toggle.checked = res.enabled ?? false;
    elements.slider.value = res.intensity ?? 30;
    elements.modeSelect.value = res.mode ?? 'amber';
    elements.scheduleToggle.checked = res.scheduled ?? false;
    elements.startTime.value = res.startTime ?? "20:00";
    elements.endTime.value = res.endTime ?? "07:00";
    elements.intVal.innerText = `${elements.slider.value}%`;
});

const update = () => {
    const state = { 
        enabled: elements.toggle.checked, 
        intensity: parseInt(elements.slider.value),
        mode: elements.modeSelect.value,
        scheduled: elements.scheduleToggle.checked,
        startTime: elements.startTime.value,
        endTime: elements.endTime.value
    };
    elements.intVal.innerText = `${state.intensity}%`;
    chrome.storage.local.set(state);
    
    chrome.tabs.query({}, (tabs) => {
        tabs.forEach(tab => {
            chrome.tabs.sendMessage(tab.id, state).catch(() => {});
        });
    });
};

Object.values(elements).forEach(el => {
    el.addEventListener('change', update);
});
elements.slider.addEventListener('input', update);