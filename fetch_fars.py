"""
Fetch U.S. fatal crash locations from NHTSA FARS bulk data files and write
to media/fars_fatal_crashes.json for the Leaflet map.

Usage:
    pip install requests
    python fetch_fars.py

Uses the FARS FTP zip files (CSV) for the Accident table, which contains
latitude/longitude for every fatal crash. Downloads year-by-year from
2010 through 2022.
"""

import csv
import io
import json
import os
import sys
import time
import zipfile
from pathlib import Path

try:
    import requests
except ImportError:
    print("requests is required:  pip install requests")
    sys.exit(1)

OUT_PATH = Path(__file__).parent / "media" / "fars_fatal_crashes.json"

YEARS = list(range(2010, 2023))

BASE_URL = "https://static.nhtsa.gov/nhtsa/downloads/FARS"

SENTINEL_LATS = {0.0, 77.7777, 88.8888, 99.9999}


def download_accident_csv(year: int) -> list[dict]:
    """Download the Accident CSV for one year from FARS FTP and parse rows."""
    # NHTSA changed file-naming conventions across years
    possible_urls = [
        f"{BASE_URL}/{year}/National/FARS{year}NationalCSV.zip",
        f"{BASE_URL}/{year}/National/fars{year}NationalCSV.zip",
        f"{BASE_URL}/{year}/National/FARS{year}NationalCSV.ZIP",
    ]

    zip_bytes = None
    for url in possible_urls:
        try:
            print(f"  Trying {url} ... ", end="", flush=True)
            resp = requests.get(url, timeout=120, stream=True)
            if resp.status_code == 200:
                zip_bytes = resp.content
                print(f"OK ({len(zip_bytes) / 1_048_576:.1f} MB)")
                break
            else:
                print(f"{resp.status_code}")
        except Exception as e:
            print(f"error: {e}")

    if zip_bytes is None:
        print(f"  [WARN] Could not download data for {year}")
        return []

    try:
        zf = zipfile.ZipFile(io.BytesIO(zip_bytes))
    except zipfile.BadZipFile:
        print(f"  [WARN] Bad zip file for {year}")
        return []

    accident_file = None
    for name in zf.namelist():
        lower = name.lower()
        if "accident" in lower and lower.endswith(".csv"):
            accident_file = name
            break

    if accident_file is None:
        print(f"  [WARN] No accident CSV found in zip for {year}. Files: {zf.namelist()[:10]}")
        return []

    print(f"  Parsing {accident_file} ...")
    raw = zf.read(accident_file)

    for encoding in ("utf-8", "latin-1", "cp1252"):
        try:
            text = raw.decode(encoding)
            break
        except UnicodeDecodeError:
            continue
    else:
        text = raw.decode("utf-8", errors="replace")

    reader = csv.DictReader(io.StringIO(text))
    records = []

    for row in reader:
        rec = parse_accident_row(row, year)
        if rec:
            records.append(rec)

    return records


def parse_accident_row(row: dict, fallback_year: int) -> dict | None:
    """Extract lat/lng/year and optional fields from one Accident CSV row."""
    lat_key = next((k for k in row if k.upper() == "LATITUDE"), None)
    lng_key = next((k for k in row if k.upper() in ("LONGITUD", "LONGITUDE")), None)

    if not lat_key or not lng_key:
        return None

    try:
        lat = float(row[lat_key])
        lng = float(row[lng_key])
    except (ValueError, TypeError):
        return None

    if lat in SENTINEL_LATS or abs(lat) > 90 or abs(lng) > 180 or (lat == 0 and lng == 0):
        return None

    year_key = next((k for k in row if k.upper() == "YEAR"), None)
    year = int(row[year_key]) if year_key and row[year_key] else fallback_year

    out = {
        "latitude": round(lat, 6),
        "longitude": round(lng, 6),
        "year": year,
    }

    hr_key = next((k for k in row if k.upper() == "HIT_RUN"), None)
    if hr_key and str(row.get(hr_key, "")).strip() == "1":
        out["hit_and_run"] = True

    rj_key = next((k for k in row if k.upper() in ("RELJCT1", "RELJCT2", "REL_JUNC")), None)
    if rj_key and str(row.get(rj_key, "")).strip() in ("1", "2", "3"):
        out["intersection"] = True

    return out


def main():
    all_records = []

    for year in YEARS:
        print(f"\n=== {year} ===")
        records = download_accident_csv(year)
        print(f"  {len(records)} valid crash locations")
        all_records.extend(records)
        time.sleep(0.5)

    print(f"\nTotal records before dedup: {len(all_records)}")

    seen = set()
    unique = []
    for rec in all_records:
        key = (rec["latitude"], rec["longitude"], rec["year"])
        if key not in seen:
            seen.add(key)
            unique.append(rec)

    print(f"Unique records: {len(unique)}")

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUT_PATH, "w") as f:
        json.dump(unique, f, separators=(",", ":"))

    size_mb = OUT_PATH.stat().st_size / 1_048_576
    print(f"\nWrote {OUT_PATH}  ({size_mb:.1f} MB)")


if __name__ == "__main__":
    main()
