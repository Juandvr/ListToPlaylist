import mutagen
import os
from mutagen.easyid3 import EasyID3
from mutagen.flac import FLAC
from mutagen.wave import WAVE
from mutagen.mp4 import MP4
from pathlib import Path

class MusicScanner:
    def __init__(self):
        self.extensions = {'.mp3', '.flac', '.wav', '.m4a'}

    def extract_metadata(self, file_path: Path) -> dict:
        """Extracts audio tags cleanly, with smart fallbacks for YouTube optimization."""
        filename_clean = file_path.stem
        title = None
        artist = None
        ext = file_path.suffix.lower()

        try:
            # Leverage mutagen.File for auto-detection or use specific fallback parsers
            audio = mutagen.File(file_path)
            
            if audio is not None:
                if ext == '.mp3':
                    # EasyID3 provides simple dictionary mapping for MP3
                    try:
                        id3 = EasyID3(file_path)
                        title = id3.get('title', [None])[0]
                        artist = id3.get('artist', [None])[0]
                    except Exception:
                        title = audio.get('TIT2', [None])[0]
                        artist = audio.get('TPE1', [None])[0]
                elif ext == '.m4a':
                    title = audio.get('\xa9nam', [None])[0]
                    artist = audio.get('\xa9ART', [None])[0]
                else:
                    # Generic tag extractor for FLAC, WAV, etc.
                    title = audio.get('title', [None])[0]
                    artist = audio.get('artist', [None])[0]

        except Exception as e:
            # Seamless logging without crashing the web app
            print(f"Skipping metadata tags for {file_path.name}: {e}", file=sys.stderr)

        # Optimize the search query representation
        if title and artist:
            youtube_search_query = f"{artist} - {title}"
        elif title:
            youtube_search_query = title
        else:
            # Clean up raw filename (remove underscores, dashes, duplicate spacing)
            cleaned = filename_clean.replace('_', ' ').replace('-', ' - ')
            # Collapse double spaces
            youtube_search_query = " ".join(cleaned.split())

        return {
            "raw_filename": file_path.name,
            "search_query": youtube_search_query.strip(),
            "absolute_path": str(file_path),
            "format": ext[1:].upper() if ext else "UNKNOWN",
            "has_tags": bool(title or artist)
        }

    def extract_from_uploaded_bytes(self, file_bytes, filename: str) -> dict:
        """Extracts tags from in-memory bytes (used when browser uploads files directly)."""
        # Save briefly to a temporary file or read in-memory if supported
        # For compatibility with mutagen, we write to a temporary file structure
        import tempfile
        ext = Path(filename).suffix.lower()
        
        with tempfile.NamedTemporaryFile(suffix=ext, delete=False) as temp_file:
            temp_file.write(file_bytes)
            temp_path = Path(temp_file.name)
        
        try:
            metadata = self.extract_metadata(temp_path)
            metadata["raw_filename"] = filename
            metadata["absolute_path"] = "Uploaded File"
        finally:
            # Always clean up the temporary file
            if temp_path.exists():
                os.remove(temp_path)
                
        return metadata