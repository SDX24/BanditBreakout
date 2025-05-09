#!/usr/bin/env zsh
#
# upload_asset.sh
# ------------------------------------------------------------------
# Upload a **single file** to MongoDB.
#
#   ▸ You choose which path prefix to strip from the filename
#     before it is stored in the database.
#   ▸ Small files (≤ THRESHOLD_MiB) are stored as BinData via
#     **mongosh**; larger ones go to GridFS via **mongofiles**.
#
# ------------------------------------------------------------------
# USAGE
#   ./upload_asset.sh <FILE> <PREFIX_TO_STRIP> \
#                     [MONGO_URI] [DB] [COLL] [GRIDFS_BUCKET] [THRESHOLD_MiB]
#
# EXAMPLE
#   ./upload_asset.sh /home/user/project/assets/logo.png /home/user/project \
#       mongodb://localhost:27017 game_assets assets assets_fs 16
# ------------------------------------------------------------------

set -euo pipefail

# ------------------------ argument parsing -------------------------
if [[ $# -lt 2 ]]; then
  echo "Usage: $0 <FILE> <PREFIX_TO_STRIP> [MONGO_URI] [DB] [COLL] [GRIDFS_BUCKET] [THRESHOLD_MiB]"
  exit 1
fi

FILE="$1"                             # absolute or relative path to the file
STRIP_PREFIX="$2"                     # part of the path to remove
MONGO_URI="${3:-mongodb://localhost:27017}"
DB="${4:-game_assets}"
COLL="${5:-assets}"
GRIDFS_BUCKET="${6:-assets_fs}"
THRESHOLD=$(( ${7:-16} * 1024 * 1024 ))   # MiB → bytes
# ------------------------------------------------------------------

# -------------------------- validation -----------------------------
[[ -f "$FILE" ]] || { echo "Error: '$FILE' is not a file"; exit 1; }

for cmd in mongosh mongofiles; do
  command -v "$cmd" &>/dev/null || { echo "Error: '$cmd' not found in \$PATH"; exit 1; }
done
# ------------------------------------------------------------------

# ------------- determine filename & file‑size ----------------------
filesize() { stat -f%z "$1" 2>/dev/null || stat -c%s "$1"; }

SIZE=$(filesize "$FILE")
# remove prefix (if it matches) and any leading “/”
FILENAME="${FILE#"$STRIP_PREFIX"}"
FILENAME="${FILENAME#/}"                # ensure no leading slash
MIME=$(file --brief --mime-type "$FILE")
# ------------------------------------------------------------------

# ---------------------- upload logic -------------------------------
if (( SIZE > THRESHOLD )); then
  printf "🎥  Uploading to GridFS: %s (%.2f MiB)\n" "$FILENAME" "$((SIZE/1024/1024.0))"
  mongofiles --uri="$MONGO_URI/$DB" \
             --prefix="$GRIDFS_BUCKET" \
             put "$FILENAME" --local "$FILE" --replace
else
  printf "📄  Uploading as BinData: %s (%.2f MiB)\n" "$FILENAME" "$((SIZE/1024/1024.0))"
  mongosh "$MONGO_URI/$DB" --quiet <<EOF
const fs = require('fs');
const buf = fs.readFileSync("$FILE");
db.getSiblingDB("$DB").getCollection("$COLL").insertOne({
  filename: "$FILENAME",
  data: new BinData(0, buf.toString('base64')),
  contentType: "$MIME",
  size: buf.length,
  uploadedAt: new Date()
});
EOF
fi
# ------------------------------------------------------------------

echo "✓ Done."

