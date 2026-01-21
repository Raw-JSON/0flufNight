chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ 
        enabled: false, 
        intensity: 30, 
        mode: 'amber', 
        scheduled: false,
        startTime: "20:00",
        endTime: "07:00"
    });
    chrome.alarms.create('checkSchedule', { periodInMinutes: 1 });
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'checkSchedule') {
        chrome.storage.local.get(['scheduled', 'startTime', 'endTime', 'intensity', 'mode'], (res) => {
            if (res.scheduled && res.startTime && res.endTime) {
                const now = new Date();
                const currentTime = now.getHours() * 60 + now.getMinutes();
                
                const [sH, sM] = res.startTime.split(':').map(Number);
                const [eH, eM] = res.endTime.split(':').map(Number);
                const startTime = sH * 60 + sM;
                const endTime = eH * 60 + eM;

                let isNight = false;
                if (startTime > endTime) {
                    // Spans midnight (e.g., 8 PM to 7 AM)
                    isNight = currentTime >= startTime || currentTime < endTime;
                } else {
                    // Same day range (e.g., 9 AM to 5 PM)
                    isNight = currentTime >= startTime && currentTime < endTime;
                }

                chrome.storage.local.set({ enabled: isNight });
                const state = { enabled: isNight, intensity: res.intensity, mode: res.mode };
                
                chrome.tabs.query({}, (tabs) => {
                    tabs.forEach(tab => {
                        chrome.tabs.sendMessage(tab.id, state).catch(() => {});
                    });
                });
            }
        });
    }
});