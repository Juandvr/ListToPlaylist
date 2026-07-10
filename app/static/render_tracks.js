// Redraw Table Rows dynamically based on state
function renderTracks() {
    const emptyState = document.getElementById('empty-state');
    const trackTable = document.getElementById('track-table');
    const trackRows = document.getElementById('track-rows');

    // Reset UI View
    trackRows.innerHTML = '';

    if (currentTracks.length === 0) {
        emptyState.classList.remove('hidden');
        trackTable.classList.add('hidden');
        document.getElementById('stat-count').innerText = "0";
        document.getElementById('stat-tagged').innerText = "0";
        return;
    }

    emptyState.classList.add('hidden');
    trackTable.classList.remove('hidden');

    let taggedCount = 0;

    currentTracks.forEach((track, index) => {
        if (track.has_tags) taggedCount++;

        const row = document.createElement('tr');
        row.className = "hover:bg-slate-900/50 transition border-b border-slate-800";

        row.innerHTML = `
                    <td class="py-3 pl-2">
                        <input type="checkbox" checked id="checkbox-${index}" class="w-4 h-4 rounded text-red-600 focus:ring-red-500 border-slate-700 bg-slate-800">
                    </td>
                    <td class="py-3 pl-2">
                        <span class="px-2 py-0.5 rounded text-[10px] font-bold tracking-wide ${getBadgeColor(track.format)}">
                            ${track.format}
                        </span>
                    </td>
                    <td class="py-3 max-w-[220px] truncate">
                        <div class="font-medium text-slate-200" title="${track.raw_filename}">${track.raw_filename}</div>
                        <div class="text-[10px] text-slate-500 truncate" title="${track.absolute_path}">${track.absolute_path}</div>
                    </td>
                    <td class="py-3 pr-2">
                        <div class="relative flex items-center">
                            <input type="text" value="${track.search_query}" id="query-${index}" 
                                   oninput="updateQuery(${index}, this.value)"
                                   class="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-red-500">
                            ${track.has_tags ?
                '<i data-lucide="tag" class="w-3.5 h-3.5 text-emerald-500 absolute right-3"></i>' :
                '<i data-lucide="help-circle" class="w-3.5 h-3.5 text-amber-500 absolute right-3" title="No tag info; parsed from file title"></i>'
            }
                        </div>
                    </td>
                `;
        trackRows.appendChild(row);
    });

    document.getElementById('stat-count').innerText = currentTracks.length;
    document.getElementById('stat-tagged').innerText = taggedCount;
    lucide.createIcons();
}

function getBadgeColor(fmt) {
    switch (fmt) {
        case 'MP3': return 'bg-sky-500/10 text-sky-400 border border-sky-500/20';
        case 'FLAC': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
        case 'WAV': return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
        default: return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
    }
}

export { renderTracks }