import { currentTracks } from "./main.js";

// Action Buttons
window.exportJSON = function () {
    const activeList = getFilteredTracks();
    if (activeList.length === 0) {
        showModal("No tracks selected", "Make sure you check the 'Use' box for tracks you wish to save.");
        return;
    }

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activeList, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "youtube_music_queries.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
};

function getFilteredTracks() {
    return currentTracks.filter((_, idx) => {
        const el = document.getElementById(`checkbox-${idx}`);
        return el && el.checked;
    });
}

export { getFilteredTracks }