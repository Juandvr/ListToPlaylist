import { showAlert } from "./utils.js";
import { renderTracks } from "./render_tracks.js";
import { currentTracks } from "./main.js";

// Track Directory selection for uploading
const fileUploader = document.getElementById('file-uploader');
const selectedFilesCount = document.getElementById('selected-files-count');
const btnUploadScan = document.getElementById('btn-upload-scan');

fileUploader.addEventListener('change', (e) => {
    const count = e.target.files.length;
    if (count > 0) {
        selectedFilesCount.innerText = `${count} audio files selected.`;
        selectedFilesCount.classList.remove('hidden');
        btnUploadScan.classList.remove('hidden');
    } else {
        selectedFilesCount.classList.add('hidden');
        btnUploadScan.classList.add('hidden');
    }
});

// Scan Uploaded Files Action
btnUploadScan.addEventListener('click', async () => {
    const files = fileUploader.files;
    if (files.length === 0) {
        showAlert('No files selected.', 'error');
        return;
    }

    showAlert('Uploading and extracting file headers, please wait...', 'info');

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append('files[]', files[i]);
    }

    try {
        const response = await fetch('/api/upload-scan', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        if (response.ok) {
            currentTracks = data.tracks;
            renderTracks();
            showAlert(`Uploaded and processed ${currentTracks.length} track(s) successfully!`, 'success');
        } else {
            showAlert(data.error || 'Failed to analyze uploaded files.', 'error');
        }
    } catch (err) {
        showAlert('Error communicating upload payload to server.', 'error');
    }
});

window.updateQuery = function (index, value) {
    currentTracks[index].search_query = value;
};