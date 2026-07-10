import sys
from app import app
from pathlib import Path
from flask import render_template, request, jsonify
from app.music_scanner import MusicScanner

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/upload-scan', methods=['POST'])
def api_upload_scan():
    if 'files[]' not in request.files:
        return jsonify({"error": "No files found in payload"}), 400

    scanner = MusicScanner()
    files = request.files.getlist('files[]')
    tracks = []

    for file in files:
        # Filter files based on target format
        suffix = Path(file.filename).suffix.lower()
        if suffix in scanner.extensions:
            try:
                # Read file streams directly to temporary objects for parsing
                file_bytes = file.read()
                track_info = scanner.extract_from_uploaded_bytes(file_bytes, file.filename)
                tracks.append(track_info)
            except Exception as e:
                print(f"Failed to scan uploaded stream: {e}", file=sys.stderr)

    return jsonify({"tracks": tracks})