#!/usr/bin/env zsh
#
# assets.sh
#  - filters your runtime assets
#  - skips Voice lines & BanditBreakout_hifi.mov
#  - embeds small files via mongosh (fs.readFileSync)
#  - streams large files via mongofiles (--prefix)
#  - guarantees exactly ONE copy per filename (last write wins)

# --- USAGE & PARAMETER PARSING ──────────────────────────────────────
if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <ASSETS_DIR> [MONGO_URI] [DB] [COLL] [GRIDFS_BUCKET] [THRESHOLD_MiB]"
  echo
  echo "  ASSETS_DIR      directory containing your assets (required)"
  echo "  MONGO_URI       MongoDB connection URI (default: mongodb://localhost:27017)"
  echo "  DB              database name (default: game_assets)"
  echo "  COLL            collection for small files (default: assets)"
  echo "  GRIDFS_BUCKET   GridFS bucket prefix (default: assets_fs)"
  echo "  THRESHOLD_MiB   size threshold in MiB (default: 16)"
  exit 1
fi

# pull in positional args (with sensible defaults)
ASSETS_DIR="$1"
MONGO_URI="${2:-mongodb://localhost:27017}"
DB="${3:-game_assets}"
COLL="${4:-assets}"
GRIDFS_BUCKET="${5:-assets_fs}"
# threshold in bytes (default 16 MiB)
THRESHOLD=$(( ${6:-16} * 1024 * 1024 ))

# -------------------------------------------------------------------
# ensure mongosh + mongofiles are available
for cmd in mongosh mongofiles; do
  if ! command -v $cmd &>/dev/null; then
    echo "Error: '$cmd' not found. Install it or add to your PATH."
    exit 1
  fi
done

# -------------------------------------------------------------------
# one‑off: enforce uniqueness on filename for the small‑file collection
mongosh "$MONGO_URI/$DB" --quiet <<'EOF'
db.getCollection("'"$COLL"'").createIndex(
  { filename: 1 },
  { unique: true }
)
EOF
# -------------------------------------------------------------------

# helper: get filesize in bytes (macOS / BSD stat)
filesize() {
  stat -f%z "$1"
}

# walk & filter
find "$ASSETS_DIR" \
  \( -path "*/Voice lines/*" -o -name "BanditBreakout_hifi.mov" \) -prune \
  -o -type f \( -iname '*.png' -o -iname '*.svg' -o -iname '*.mp3' \
               -o -iname '*.wav' -o -iname '*.mp4' -o -iname '*.csv' \) -print0 \
| while IFS= read -r -d '' file; do
    size=$(filesize "$file")
    rel="${file#"$ASSETS_DIR"/}"          # filename to store in DB
    mime=$(file --brief --mime-type "$file")
    [[ $mime == text/plain || $mime == text/x-csv ]] && mime=text/csv

    if (( size > THRESHOLD )); then
      # ---------------- LARGE FILE → GridFS -------------------------
      # --replace guarantees we always keep just the newest copy
      echo "🎥 [GridFS] $rel  ($(printf '%.2f' "$((size/1024/1024.0))") MiB)"
      mongofiles \
        --uri="$MONGO_URI/$DB" \
        --prefix="$GRIDFS_BUCKET" \
        put "$rel" --local "$file" --replace
    else
      # ---------------- SMALL FILE → regular collection -------------
      echo "📄 [Doc]    $rel  ($(printf '%.2f' "$((size/1024/1024.0))") MiB)"
      mongosh "$MONGO_URI/$DB" --quiet <<EOF
const fs   = require('fs');
const data = fs.readFileSync("$file");     // read file as Buffer
db.getCollection("$COLL").replaceOne(
  { filename: "$rel" },                    // match on filename
  {
    filename:    "$rel",
    data:        new BinData(0, data.toString('base64')),
    contentType: "$mime",
    size:        data.length,
    uploadedAt:  new Date()
  },
  { upsert: true }                         // overwrite or insert atomically
);
EOF
    fi
  done
