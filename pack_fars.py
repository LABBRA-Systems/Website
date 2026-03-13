"""
Convert fars_fatal_crashes.json into a flat binary file of int32 pairs.
Each crash is stored as two int32 values: lat*10000, lng*10000.
No metadata, no keys, no JSON overhead.

Output: media/crashes.bin
The JS side reads it as an Int32Array and divides by 10000 to get degrees.
"""

import json
import struct
from pathlib import Path

SRC = Path(__file__).parent / "media" / "fars_fatal_crashes.json"
OUT = Path(__file__).parent / "media" / "crashes.bin"

with open(SRC) as f:
    data = json.load(f)

buf = bytearray()
count = 0
for d in data:
    lat_i = int(round(d["latitude"] * 10000))
    lng_i = int(round(d["longitude"] * 10000))
    buf.extend(struct.pack("<ii", lat_i, lng_i))
    count += 1

with open(OUT, "wb") as f:
    f.write(buf)

print(f"{count} points -> {OUT} ({len(buf) / 1_048_576:.1f} MB)")
print(f"Down from {SRC.stat().st_size / 1_048_576:.1f} MB JSON")
