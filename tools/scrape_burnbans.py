#!/usr/bin/env python3
"""Fetch Arkansas Forestry Division county burn bans and write burnbans.json."""
import json, re, ssl, sys, urllib.request, html, datetime
SRC = "https://mip.agri.arkansas.gov/agtools/Forestry/Fire_Info/Burn_Bans?show_districts=False"
ctx = ssl.create_default_context()
try:
    raw = urllib.request.urlopen(urllib.request.Request(SRC, headers={"User-Agent": "Mozilla/5.0"}), timeout=30, context=ctx).read()
except Exception:  # server sends an incomplete certificate chain
    ctx = ssl._create_unverified_context()
    raw = urllib.request.urlopen(urllib.request.Request(SRC, headers={"User-Agent": "Mozilla/5.0"}), timeout=30, context=ctx).read()
t = re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", raw.decode("utf-8", "replace"))))
m = re.search(r"Burn Bans as of ([0-9/]+ [0-9:]+ [AP]M)", t)
c = re.search(r"Burn Ban Counties \((\d+)\) (.*?) Privacy Policy", t)
if not m: sys.exit("could not find burn ban date")
names = []
if c:
    names = [n.strip().replace("Saint Francis", "St. Francis") for n in c.group(2).split(",") if n.strip()]
    if len(names) != int(c.group(1)): sys.exit("count mismatch %d vs %s" % (len(names), c.group(1)))
out = {"source": "Arkansas Department of Agriculture, Forestry Division", "source_url": SRC,
       "as_of": m.group(1), "fetched_utc": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
       "counties_under_ban": names}
json.dump(out, open(sys.argv[1] if len(sys.argv) > 1 else "burnbans.json", "w"), indent=1)
print(len(names), "counties", m.group(1))
