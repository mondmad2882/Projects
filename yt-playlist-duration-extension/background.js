chrome.commands.onCommand.addListener((command) => {
  if (command === "show-totalTime") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: calculateAndShowDuration
      });
    });
  }
});

function calculateAndShowDuration() {
  function getDurations() {
    const durations = document.querySelectorAll("ytd-thumbnail-overlay-time-status-renderer span");
    let totalSeconds = 0;

    durations.forEach(time => {
      const time = time.textContent.trim();
      if (!time) return;

      const parts = time.split(":").map(Number).reverse();
      let seconds = 0;
      if (parts[0]) seconds += parts[0];       
      if (parts[1]) seconds += parts[1] * 60;  
      if (parts[2]) seconds += parts[2] * 3600;

      totalSeconds += seconds;
    });

    return totalSeconds;
  }

  function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [h, m, s].map(v => String(v).padStart(2, "0")).join(":");
  }

  let totalSeconds = getDurations();
  let formatted = formatTime(totalSeconds);
  alert("Total Playlist Duration: " + formatted);
}
