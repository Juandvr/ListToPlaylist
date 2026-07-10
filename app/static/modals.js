import { getFilteredTracks } from "./action_buttons.js";

const createBtn = document.getElementById('create-playlist-btn')

// Interactive Modals
window.showModal = function (title, description) {
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-desc').innerText = description;
    document.getElementById('modal').classList.remove('hidden');
};

window.closeModal = function () {
    document.getElementById('modal').classList.add('hidden');
};

createBtn.onclick = () => {
    const tracks = getFilteredTracks();
    if (tracks.length === 0) {
        showModal("No selection detected", "Please check at least one track to include.");
        return;
    }
    showModal("Ready for YouTube Integration!", `You have ${tracks.length} tracks chosen. To link this directly to YouTube, you can implement OAuth2 using 'google-api-python-client' in Flask to auto-generate a playlist.`);
};