export type PlaceKind =
  | "island"
  | "cove"
  | "park"
  | "marina"
  | "point"
  | "town"
  | "landmark"
  | "depth"
  | "temperature"
  | "hazard"
  | "pin";

export type RegionId = "upper" | "narrows" | "lower";

export type Place = {
  id: string;
  name: string;
  kind: PlaceKind;
  lat: number;
  lon: number;
  region: RegionId;
  aliases?: string[];
  description: string;
  amenities?: string[];
  access?: string;
  /** Street / mailing address when known (marinas, parks). */
  address?: string;
  /** Public phone when known. */
  phone?: string;
  approx?: boolean;
  importance: 1 | 2 | 3;
  community?: boolean;
  /** Shared field report (depth / temp / hazard / custom pin). */
  field?: boolean;
  fieldValue?: string;
  /** Device-local personal pin — survives reload until explicitly deleted. */
  mine?: boolean;
};

export const KIND_LABEL: Record<PlaceKind, string> = {
  island: "Island",
  cove: "Cove",
  park: "Park",
  marina: "Marina",
  point: "Point",
  town: "Town",
  landmark: "Landmark",
  depth: "Depth",
  temperature: "Temperature",
  hazard: "Hazard",
  pin: "Pin",
};

export const KIND_ORDER: PlaceKind[] = [
  "island",
  "cove",
  "park",
  "marina",
  "point",
  "town",
  "landmark",
  "depth",
  "temperature",
  "hazard",
  "pin",
];

export const REGION_LABEL: Record<RegionId, string> = {
  upper: "Upper Lake",
  narrows: "The Narrows",
  lower: "Lower Lake",
};

export const LAKE_FACTS = {
  name: "Greers Ferry Lake",
  acres: "40,500",
  shoreline: "340 miles",
  depth: "198 ft",
  pool: "461.3 ft",
  counties: "Cleburne & Van Buren",
  damYear: "1963",
} as const;

/** Fit the whole reservoir, dam to Choctaw. */
export const LAKE_BOUNDS: [[number, number], [number, number]] = [
  [35.448, -92.42],
  [35.635, -91.96],
];

export const LAKE_CENTER = { lat: 35.542, lon: -92.145 };

export const REGION_LABELS: { id: RegionId; lat: number; lon: number; name: string }[] = [
  { id: "upper", lat: 35.575, lon: -92.255, name: "Upper Lake" },
  { id: "narrows", lat: 35.556, lon: -92.186, name: "The Narrows" },
  { id: "lower", lat: 35.528, lon: -92.07, name: "Lower Lake" },
];

export const PLACES: Place[] = [
  // ——— Islands ———
  {
    id: "sugar-loaf-island",
    name: "Sugar Loaf Mountain Island",
    kind: "island",
    lat: 35.561682,
    lon: -92.264888,
    region: "upper",
    aliases: ["Sugarloaf", "Sugar Loaf Island", "Sugar Loaf Mountain"],
    description:
      "The lake’s signature island: a forested mountain rising about 540 feet from the water, with a National Recreation Trail loop to the summit. Boat access only — Fairfield Bay Marina runs a shuttle in season. Not the same Sugar Loaf trail you can drive to in Heber Springs.",
    amenities: ["Hiking trail", "Summit views", "Boat-in only"],
    access: "Boat from Sugar Loaf Rec Area (Hwy 337) or Fairfield Bay Marina shuttle",
    importance: 3,
  },
  {
    id: "goat-island",
    name: "Goat Island",
    kind: "island",
    lat: 35.518689,
    lon: -92.085983,
    region: "lower",
    description:
      "A wooded island in the Big Water north of Eden Isle Marina, paired with Scout Island just to the northeast. AGFC has placed fish habitat around both islands. A classic ski-and-anchor stop on the lower lake.",
    access: "Boat from Eden Isle, Heber Springs, or Dam Site",
    importance: 3,
  },
  {
    id: "scout-island",
    name: "Scout Island",
    kind: "island",
    lat: 35.536745,
    lon: -92.077094,
    region: "lower",
    description:
      "Just northeast of Goat Island, between Cherokee Recreation Area and Heber Springs Rec. A favorite waypoint when running the east side of the Big Water toward Old Highway 25.",
    access: "Boat from Cherokee, Heber Springs, or Old Highway 25",
    importance: 3,
  },
  {
    id: "little-goat-island",
    name: "Little Goat Island",
    kind: "island",
    lat: 35.614522,
    lon: -92.097928,
    region: "lower",
    description:
      "A smaller island on the far north arm of the lower lake, well above Cherokee. Quieter water than the Big Water around Goat and Scout.",
    access: "Boat from Cherokee Recreation Area",
    importance: 2,
  },
  {
    id: "taylor-island",
    name: "Taylor Island",
    kind: "island",
    lat: 35.535911,
    lon: -92.126818,
    region: "lower",
    description:
      "Sits west of the Big Water near Shiloh and Budd Creek. A useful landmark when coming out of the Narrows into the lower lake.",
    access: "Boat from Shiloh Recreation Area",
    importance: 2,
  },
  {
    id: "poker-hill",
    name: "Poker Hill",
    kind: "island",
    lat: 35.578411,
    lon: -92.202097,
    region: "upper",
    description:
      "A named island just west of the town of Greers Ferry and north of Higden. Easy to pick out when running between Devil’s Fork and Higden Bay.",
    access: "Boat from Narrows, Devil’s Fork, or Mill Creek",
    importance: 2,
  },
  {
    id: "bird-island",
    name: "Bird Island",
    kind: "island",
    lat: 35.5148,
    lon: -92.1175,
    region: "lower",
    aliases: ["Purple Martin Island"],
    description:
      "A long, narrow island in the Big Water between Eden Isle and Millers Point. Cruisers still spot old house steps and a foundation on the bank. Purple martins roost here in season.",
    access: "Boat from Eden Isle or Shiloh",
    approx: true,
    importance: 2,
  },
  {
    id: "boat-ridge",
    name: "Boat Ridge Island",
    kind: "island",
    lat: 35.554244,
    lon: -92.3171,
    region: "upper",
    description:
      "A Fairfield Bay island on the west side of the upper lake, near the South Fork arm. A local landmark when leaving Fairfield Bay Marina toward Sugar Loaf Mountain.",
    access: "Boat from Fairfield Bay Marina",
    importance: 2,
  },
  {
    id: "eden-isle",
    name: "Eden Isle",
    kind: "island",
    lat: 35.505912,
    lon: -92.103484,
    region: "lower",
    aliases: ["Eden Isle Peninsula"],
    description:
      "A large residential peninsula — often called an island — on the south shore of the Big Water. Home to Eden Isle Marina, the Red Apple Inn, and some of the lake’s best-known shoreline.",
    amenities: ["Marina", "Dining", "Lodging"],
    access: "Hwy 110 west of Heber Springs, or by boat",
    importance: 3,
  },

  // ——— Coves & bays ———
  {
    id: "higden-bay",
    name: "Higden Bay",
    kind: "cove",
    lat: 35.5673,
    lon: -92.21682,
    region: "upper",
    description:
      "The bay wrapped around the town of Higden, just west of the Narrows. Mill Creek Rec sits on the north shore; Salt Creek feeds in from the south. A protected pocket when the Big Water is rough.",
    access: "Mill Creek Rec or by boat from the Narrows",
    importance: 3,
  },
  {
    id: "hurricane-bay",
    name: "Hurricane Bay",
    kind: "cove",
    lat: 35.5498,
    lon: -92.174874,
    region: "narrows",
    aliases: ["Hurricane Creek"],
    description:
      "Where Hurricane Creek meets the lake on the south side of the Narrows. A sharp, scenic pocket used as a weather hole when running between the two lakes.",
    access: "Boat from Narrows Recreation Area",
    importance: 2,
  },
  {
    id: "goff-cove",
    name: "Goff Cove",
    kind: "cove",
    lat: 35.479801,
    lon: -92.138484,
    region: "lower",
    description:
      "A named cove on the south arm near Goff Point and Cove Creek. Quieter water off the main Big Water run, popular with anglers working the south shoreline.",
    access: "Boat from Cove Creek Recreation Area",
    importance: 2,
  },
  {
    id: "cove-creek",
    name: "Cove Creek",
    kind: "cove",
    lat: 35.472,
    lon: -92.145,
    region: "lower",
    description:
      "The long south arm of the lower lake, ending at Cove Creek Recreation Area. One of the Corps’ named swimming and camping coves, well off the ski traffic of the Big Water.",
    amenities: ["Campground", "Boat ramp", "Swim beach"],
    access: "Cove Creek Rec (from Hwy 25 to Hwy 16) or by boat",
    importance: 3,
  },
  {
    id: "salt-creek",
    name: "Salt Creek Cove",
    kind: "cove",
    lat: 35.52424,
    lon: -92.2096,
    region: "upper",
    aliases: ["Salt Creek"],
    description:
      "Salt Creek enters the upper lake on the south shore opposite Higden. A winding, fishy arm used as a cutoff when working the south bank of the upper lake.",
    access: "Boat from Mill Creek or Sugar Loaf",
    importance: 2,
  },
  {
    id: "mill-creek",
    name: "Mill Creek Cove",
    kind: "cove",
    lat: 35.579,
    lon: -92.214,
    region: "upper",
    description:
      "The Mill Creek arm on the north side of Higden Bay. Mill Creek Recreation Area sits at the head of the cove — a rustic Corps park with a ramp and no hookups.",
    amenities: ["Boat ramp", "Camping"],
    access: "Mill Creek Rec from Higden (Hwy 16 / Hwy 92)",
    importance: 2,
  },
  {
    id: "hill-creek",
    name: "Hill Creek Cove",
    kind: "cove",
    lat: 35.60758,
    lon: -92.15571,
    region: "upper",
    description:
      "A deep north-shore cove above Devil’s Fork, with Hill Creek Recreation Area and Hill Creek Marina at the back. Edgemont sits on the ridge above. Protected water with a swim beach in season.",
    amenities: ["Marina", "Campground", "Swim beach", "Boat ramps"],
    access: "Hill Creek Rec from Drasco via Hwy 92 / Hwy 225",
    importance: 3,
  },
  {
    id: "devils-fork",
    name: "Devil’s Fork",
    kind: "cove",
    lat: 35.59869,
    lon: -92.16682,
    region: "upper",
    aliases: ["Devils Fork", "Devil's Fork Little Red River"],
    description:
      "The north arm of the upper lake where the Devil’s Fork of the Little Red River comes in. Devil’s Fork Recreation Area and Edgemont Bridge sit on this fork — a major fishing and camping cove.",
    amenities: ["Campground", "Boat ramps", "Swim areas"],
    access: "Devil’s Fork Rec from the town of Greers Ferry (Hwy 16)",
    importance: 3,
  },
  {
    id: "south-fork",
    name: "South Fork",
    kind: "cove",
    lat: 35.552,
    lon: -92.318,
    region: "upper",
    aliases: ["South Fork Little Red"],
    description:
      "The long southwest arm of the upper lake, running toward Shirley. South Fork Recreation Area sits up this fork. A quieter, riverine end of the reservoir.",
    amenities: ["Campground", "Boat ramp"],
    access: "South Fork Rec, or by boat from Choctaw / Fairfield Bay",
    approx: true,
    importance: 2,
  },
  {
    id: "choctaw-creek",
    name: "Choctaw Creek",
    kind: "cove",
    lat: 35.538,
    lon: -92.372,
    region: "upper",
    description:
      "The far western arm of the lake, ending at Choctaw Recreation Area near Clinton. Full-service Corps park with a marina, swim beach, and year-round camping — the west-end home port.",
    amenities: ["Marina", "Campground", "Swim beach", "Playground"],
    access: "From Clinton: US 65 to Hwy 330 east",
    approx: true,
    importance: 3,
  },
  {
    id: "shiloh-creek",
    name: "Shiloh Creek Cove",
    kind: "cove",
    lat: 35.53424,
    lon: -92.13571,
    region: "lower",
    aliases: ["Shiloh"],
    description:
      "Where Shiloh Creek meets the lower lake, just east of the Narrows. Shiloh Recreation Area and Shiloh Marina sit on this cove — the first big stop after you clear the gorge.",
    amenities: ["Marina", "Campground", "Boat ramp"],
    access: "Shiloh Rec from Hwy 16 / 110",
    importance: 2,
  },
  {
    id: "heber-springs-cove",
    name: "Heber Springs Cove",
    kind: "cove",
    lat: 35.5065,
    lon: -92.062,
    region: "lower",
    description:
      "The cove off Heber Springs Recreation Area, west of town on the south shore of the Big Water. Swim beach, marina, and a short run to Eden Isle, Goat Island, and the dam.",
    amenities: ["Marina", "Campground", "Swim beach", "Playground"],
    access: "Heber Springs Rec, 89 Park Road",
    importance: 2,
  },
  {
    id: "budd-creek",
    name: "Budd Creek Cove",
    kind: "cove",
    lat: 35.541745,
    lon: -92.114595,
    region: "lower",
    description:
      "A small named creek cove on the north side of the lower lake between Shiloh and Taylor Island. A quiet bank to work when the main channel is busy.",
    access: "Boat from Shiloh",
    importance: 1,
  },
  {
    id: "wagon-branch",
    name: "Wagon Branch Cove",
    kind: "cove",
    lat: 35.59313,
    lon: -92.2271,
    region: "upper",
    description:
      "A north-shore pocket west of Devil’s Fork and above Higden. A short, shaded branch used by anglers sliding along the Edgemont shoreline.",
    access: "Boat from Devil’s Fork or Mill Creek",
    importance: 1,
  },
  {
    id: "cherokee-cove",
    name: "Cherokee Cove",
    kind: "cove",
    lat: 35.555,
    lon: -92.082,
    region: "lower",
    description:
      "The pocket around Cherokee Recreation Area on the northeast shore. Scout Island sits just south. A convenient overnight cove if you launch from Cherokee.",
    amenities: ["Campground", "Boat ramp"],
    access: "Cherokee Rec from Drasco via Hwy 92 and Brownsville Road",
    importance: 2,
  },
  {
    id: "round-mt-cove",
    name: "Round Mountain Cove",
    kind: "cove",
    lat: 35.478,
    lon: -92.155,
    region: "lower",
    aliases: ["Round Mt Cove"],
    description:
      "Named on the Corps lake map near Goff Point on the south arm. A local fishing hole off the Cove Creek run.",
    access: "Boat from Cove Creek Rec",
    approx: true,
    importance: 1,
  },
  {
    id: "sandy-beach",
    name: "Sandy Beach",
    kind: "cove",
    lat: 35.4948,
    lon: -92.0375,
    region: "lower",
    description:
      "Heber Springs’ in-town beach on the lower lake. A popular swim and sunset stop; old roads from before the lake still run under the water nearby.",
    amenities: ["Swim beach", "Town access"],
    access: "Heber Springs waterfront",
    approx: true,
    importance: 2,
  },
  {
    id: "marina-cove",
    name: "Marina Cove",
    kind: "cove",
    lat: 35.527,
    lon: -92.006,
    region: "lower",
    aliases: ["Dam Site Cove"],
    description:
      "The cove beside Dam Site Recreation Area and Dam Site Marina, just west of the dam. Divers know it as a gentle-slope site; boaters use it as the last protected water before the dam face.",
    amenities: ["Marina", "Campground", "Swim beach"],
    access: "Dam Site Rec, 315 Heber Springs Road North",
    approx: true,
    importance: 2,
  },

  // ——— Parks ———
  {
    id: "dam-site-park",
    name: "Dam Site Park",
    kind: "park",
    lat: 35.52085,
    lon: -92.01061,
    region: "lower",
    aliases: ["Dam Site Recreation Area"],
    description:
      "The largest Corps park on the lake, at the dam in Heber Springs. Year-round camping, a marina, swim beach, and the William Carl Garner Visitor Center nearby. Dedicated with the dam by President Kennedy in 1963.",
    amenities: ["211 campsites", "Marina", "Swim beach", "Playground", "Dump station"],
    access: "Hwy 25 north of Heber Springs, follow signs",
    address: "315 Heber Springs Rd N, Heber Springs, AR 72543",
    importance: 3,
  },
  {
    id: "heber-springs-park",
    name: "Heber Springs Park",
    kind: "park",
    lat: 35.50124,
    lon: -92.07577,
    region: "lower",
    aliases: ["Heber Springs Recreation Area"],
    description:
      "Seasonal Corps park on the south shore west of town. Full facilities, a marina, and a short run to Eden Isle, Goat Island, and Sandy Beach.",
    amenities: ["114 campsites", "Marina", "Swim beach", "Playground"],
    access: "Hwy 110 west of Heber Springs, then Park Road",
    address: "89 Park Rd, Heber Springs, AR 72543",
    importance: 3,
  },
  {
    id: "jfk-park",
    name: "John F. Kennedy Park",
    kind: "park",
    lat: 35.51623,
    lon: -91.99636,
    region: "lower",
    aliases: ["JFK Park"],
    description:
      "Year-round Corps park just below the dam on Hatchery Road. Named for the president who dedicated the project. Next door to the National Fish Hatchery and the Little Red River trout tailwater.",
    amenities: ["68 campsites", "Boat ramp", "Playground", "Tailwater access"],
    access: "Cross the dam, second right onto Hatchery Road",
    address: "375 Hatchery Rd, Heber Springs, AR 72543",
    importance: 2,
  },
  {
    id: "old-hwy-25-park",
    name: "Old Highway 25 Park",
    kind: "park",
    lat: 35.53946,
    lon: -92.01313,
    region: "lower",
    aliases: ["Old Hwy 25", "Tumbling Shoals Park"],
    description:
      "A large seasonal Corps park on the north shore toward Tumbling Shoals. Group camping, a swim beach, and a straight shot across the Big Water to the dam and Eden Isle.",
    amenities: ["116 campsites", "Group camp", "Swim beach", "Boat ramp"],
    access: "Hwy 25 north of Heber Springs to Hwy 25S",
    address: "Old Hwy 25 / Tumbling Shoals, Heber Springs, AR",
    importance: 2,
  },
  {
    id: "cherokee-park",
    name: "Cherokee Park",
    kind: "park",
    lat: 35.55737,
    lon: -92.07674,
    region: "lower",
    aliases: ["Cherokee Recreation Area"],
    description:
      "A smaller seasonal campground on the northeast shore, looking down on Scout Island. Vault toilets, a ramp, and a quieter alternative to Dam Site.",
    amenities: ["30 campsites", "Boat ramp", "Dump station"],
    access: "From Drasco, Hwy 92 west then Brownsville Road",
    address: "475 Cherokee Park Rd, Heber Springs, AR",
    importance: 2,
  },
  {
    id: "cove-creek-park",
    name: "Cove Creek Park",
    kind: "park",
    lat: 35.46177,
    lon: -92.15386,
    region: "lower",
    aliases: ["Cove Creek Recreation Area"],
    description:
      "Seasonal Corps park at the head of the Cove Creek arm. Swim beach, camping, and a launch for the south-shore coves around Goff Point.",
    amenities: ["48 campsites", "Swim beach", "Boat ramp", "Showers"],
    access: "Heber Springs via Hwy 25, Hwy 16, then Cove Creek Road",
    importance: 2,
  },
  {
    id: "shiloh-park",
    name: "Shiloh Park",
    kind: "park",
    lat: 35.53859,
    lon: -92.14989,
    region: "lower",
    aliases: ["Shiloh Recreation Area"],
    description:
      "Seasonal park and marina where the Narrows opens into the lower lake. The historic community of Shiloh sat near here before the lake filled.",
    amenities: ["Campground", "Marina", "Boat ramp"],
    access: "Hwy 16 / 110 between Greers Ferry and Heber Springs",
    importance: 2,
  },
  {
    id: "narrows-park",
    name: "Narrows Park",
    kind: "park",
    lat: 35.563966,
    lon: -92.198208,
    region: "narrows",
    aliases: ["Narrows Recreation Area"],
    description:
      "The Corps park on the gorge that joins the two lakes. Marina, camping, and the tightest, most scenic run on Greers Ferry — watch for no-wake and traffic in the cut.",
    amenities: ["58 campsites", "Marina", "Boat ramp"],
    access: "Hwy 16 southwest of Greers Ferry, follow signs",
    address: "7699 Edgemont Rd, Higden, AR 72067",
    importance: 3,
  },
  {
    id: "devils-fork-park",
    name: "Devil’s Fork Park",
    kind: "park",
    lat: 35.58463,
    lon: -92.17853,
    region: "upper",
    aliases: ["Devils Fork Recreation Area"],
    description:
      "Year-round park on the Devil’s Fork arm north of Greers Ferry. Multiple ramps and swim areas; Edgemont Bridge is just up the fork.",
    amenities: ["55 campsites", "Boat ramps", "Swim areas", "Playground"],
    access: "Hwy 16 in Greers Ferry, follow Devil’s Fork Road",
    address: "73 Devils Fork Rd, Greers Ferry, AR 72067",
    importance: 2,
  },
  {
    id: "hill-creek-park",
    name: "Hill Creek Park",
    kind: "park",
    lat: 35.61326,
    lon: -92.14828,
    region: "upper",
    aliases: ["Hill Creek Recreation Area"],
    description:
      "Seasonal park and marina on the Hill Creek arm near Edgemont. One of the prettiest north-shore camps, with a swim beach and two ramps.",
    amenities: ["26 campsites", "Marina", "Swim beach", "Boat ramps"],
    access: "Drasco to Hwy 92 west, Hwy 225, then Hill Creek Road",
    address: "474 Hill Creek Rd, Edgemont, AR 72044",
    importance: 2,
  },
  {
    id: "mill-creek-park",
    name: "Mill Creek Park",
    kind: "park",
    lat: 35.58151,
    lon: -92.21871,
    region: "upper",
    aliases: ["Mill Creek Recreation Area"],
    description:
      "A rustic seasonal park north of Higden — no electric, vault toilets, a ramp and picnic shelter. The put-in for Higden Bay and Salt Creek.",
    amenities: ["31 primitive sites", "Boat ramp", "Picnic shelter"],
    access: "From Higden, Hwy 16 south, Hwy 92 west, Mill Creek Road",
    importance: 2,
  },
  {
    id: "sugar-loaf-park",
    name: "Sugar Loaf Park",
    kind: "park",
    lat: 35.545911,
    lon: -92.272377,
    region: "upper",
    aliases: ["Sugar Loaf Recreation Area"],
    description:
      "South-shore park looking across to Sugar Loaf Mountain Island. Campground, swim area, marina, and the usual boat-out point for the island trail.",
    amenities: ["Campground", "Marina", "Swim beach", "Boat ramp"],
    access: "Bee Branch via Hwy 92 to Hwy 337 west",
    address: "1389 Resort Rd, Higden, AR 72067",
    importance: 3,
  },
  {
    id: "choctaw-park",
    name: "Choctaw Park",
    kind: "park",
    lat: 35.532856,
    lon: -92.380434,
    region: "upper",
    aliases: ["Choctaw Recreation Area"],
    description:
      "The west-end full-service park near Clinton. Year-round camping, a marina, swim beach, and playground — the home ramp for the Choctaw Creek arm.",
    amenities: ["106 campsites", "Marina", "Swim beach", "Playground"],
    access: "Clinton: US 65 to Hwy 330 east",
    address: "3848 Hwy 330 E, Clinton, AR 72031",
    importance: 3,
  },
  {
    id: "south-fork-park",
    name: "South Fork Park",
    kind: "park",
    lat: 35.555633,
    lon: -92.325433,
    region: "upper",
    aliases: ["South Fork Recreation Area"],
    description:
      "Corps park up the South Fork arm toward Shirley. A quieter west-lake camp with a ramp at the riverine end of the reservoir.",
    amenities: ["Campground", "Boat ramp"],
    access: "South Fork arm, west of Fairfield Bay / Higden",
    importance: 1,
  },
  {
    id: "van-buren-park",
    name: "Van Buren Park",
    kind: "park",
    lat: 35.591,
    lon: -92.328,
    region: "upper",
    aliases: ["Van Buren Recreation Area"],
    description:
      "A Fairfield Bay–operated recreation area on the northwest shore of the upper lake. A local launch for the western bays around Choctaw and South Fork.",
    amenities: ["Boat access", "Picnic"],
    access: "Fairfield Bay / Hwy 330 area",
    approx: true,
    importance: 1,
  },
  {
    id: "fairfield-bay-park",
    name: "Fairfield Bay City Park",
    kind: "park",
    lat: 35.588082,
    lon: -92.302974,
    region: "upper",
    description:
      "Town park on the Fairfield Bay shoreline of the upper lake. The community is the north-shore hub for Sugar Loaf Mountain Island shuttles and west-lake boating.",
    amenities: ["Town park", "Lake access"],
    access: "Fairfield Bay",
    importance: 1,
  },

  // ——— Marinas ———
  {
    id: "eden-isle-marina",
    name: "Eden Isle Marina",
    kind: "marina",
    lat: 35.505912,
    lon: -92.095706,
    region: "lower",
    aliases: ["Yacht Harbor"],
    description:
      "Full-service marina on the Eden Isle peninsula, developed with the 1960s Eden Isle resort community after the lake filled. Goat and Scout Islands sit just to the north — fuel, slips, and a short run into the Big Water.",
    amenities: ["Fuel", "Slips", "Boat services", "Ship store"],
    access: "Yacht Harbor Road, Eden Isle",
    address: "10 Yacht Harbor Rd, Heber Springs, AR 72543",
    phone: "501-362-2232",
    importance: 3,
  },
  {
    id: "dam-site-marina",
    name: "Dam Site Marina",
    kind: "marina",
    lat: 35.5295,
    lon: -92.0076,
    region: "lower",
    aliases: ["Damsite Marina"],
    description:
      "Marina inside Dam Site Recreation Area, minutes from the dam face, William Carl Garner Visitor Center, and the cliffs above the Little Red tailwater. The Corps park was dedicated with the dam by President Kennedy in 1963.",
    amenities: ["Fuel", "Slips", "Ramp"],
    access: "Dam Site Rec, Heber Springs",
    address: "Dam Site Recreation Area, Heber Springs, AR",
    phone: "501-362-2333",
    importance: 2,
  },
  {
    id: "heber-springs-marina",
    name: "Heber Springs Marina",
    kind: "marina",
    lat: 35.50202,
    lon: -92.05932,
    region: "lower",
    aliases: ["Heber Rec Marina", "Heber Springs Marina/Heber Rec."],
    description:
      "The in-town marina at Heber Springs Recreation Area on Park Road. Closest fuel to Sandy Beach and a quick hop west to Eden Isle — the classic south-shore hub since the reservoir opened.",
    amenities: ["Fuel", "Slips", "Ramp"],
    access: "Heber Springs Rec, Park Road",
    address: "99 Park Rd, Heber Springs, AR 72543",
    phone: "501-362-8838",
    importance: 2,
  },
  {
    id: "narrows-marina",
    name: "Lacey's Narrows Marina",
    kind: "marina",
    lat: 35.560355,
    lon: -92.195708,
    region: "narrows",
    aliases: ["Narrows Marina", "Laceys Narrows Marina"],
    description:
      "Marina in the gorge between the upper and lower lakes at Narrows Park. Staging point for running the Narrows — stay aware of traffic and no-wake zones in the cut that joins the two pools.",
    amenities: ["Slips", "Ramp", "Camp nearby"],
    access: "Narrows Recreation Area, Edgemont Rd",
    address: "7674 Edgemont Rd, Higden, AR 72067",
    phone: "501-825-6214",
    importance: 2,
  },
  {
    id: "shiloh-marina",
    name: "Shiloh Marina",
    kind: "marina",
    lat: 35.539245,
    lon: -92.146263,
    region: "lower",
    description:
      "Marina at Shiloh Recreation Area, the first fuel and slips after you drop out of the Narrows into the lower lake. The historic community of Shiloh sat near here before the reservoir filled in the early 1960s.",
    amenities: ["Slips", "Fuel", "Ramp", "Rentals"],
    access: "Shiloh Recreation Area",
    address: "Shiloh Recreation Area, Greers Ferry / Heber Springs, AR",
    importance: 2,
  },
  {
    id: "hill-creek-marina",
    name: "Hill Creek Marina",
    kind: "marina",
    lat: 35.608966,
    lon: -92.148485,
    region: "upper",
    description:
      "North-shore marina at the back of Hill Creek Cove near Edgemont. A quiet upper-lake harbor with Corps camping next door and a short run to Devil’s Fork.",
    amenities: ["Slips", "Ramp"],
    access: "Hill Creek Recreation Area",
    address: "Hill Creek Rd, Edgemont, AR 72044",
    importance: 2,
  },
  {
    id: "fairfield-bay-marina",
    name: "Fairfield Bay Marina",
    kind: "marina",
    lat: 35.568133,
    lon: -92.298211,
    region: "upper",
    description:
      "Full-service marina on Hwy 330 on the south-west shore of the upper lake. Fuel, rentals, slips, and the seasonal shuttle toward Sugar Loaf Mountain Island — the resort town’s main waterfront since Fairfield Bay developed in the 1960s–70s.",
    amenities: ["Fuel", "Slips", "Rentals", "Island shuttle (seasonal)"],
    access: "Hwy 330 S, Fairfield Bay / Shirley",
    address: "4350 AR-330 S, Fairfield Bay, AR 72088",
    phone: "501-884-6030",
    importance: 3,
  },
  {
    id: "choctaw-marina",
    name: "Choctaw / Furgerson's Marina",
    kind: "marina",
    lat: 35.5327,
    lon: -92.3792,
    region: "upper",
    aliases: ["Choctaw Marina", "Furgerson's Marina", "Furgersons Marina"],
    description:
      "West-end marina next to Choctaw Recreation Area off Hwy 330 east of Clinton. Long known locally as Furgerson’s — the last (or first) fuel on the Choctaw Creek arm.",
    amenities: ["Fuel", "Slips", "Ramp"],
    access: "Choctaw Recreation Area, Hwy 330 E",
    address: "3848–3850 Hwy 330 E, Clinton, AR 72031",
    phone: "501-745-2666",
    importance: 2,
  },
  {
    id: "sugar-loaf-marina",
    name: "Sugar Loaf Marina",
    kind: "marina",
    lat: 35.5472,
    lon: -92.2708,
    region: "upper",
    description:
      "South-shore marina at Sugar Loaf Park looking straight at Sugar Loaf Mountain Island. A practical put-in if you are boating yourself to the National Recreation Trail on the island.",
    amenities: ["Slips", "Ramp"],
    access: "Sugar Loaf Recreation Area, Hwy 337",
    address: "1389 Resort Rd / Sugar Loaf Rec Area, Higden, AR",
    importance: 2,
  },

  // ——— Points ———
  {
    id: "millers-point",
    name: "Millers Point",
    kind: "point",
    lat: 35.510078,
    lon: -92.137651,
    region: "lower",
    aliases: ["Miller's Point"],
    description:
      "A prominent cape on the south shore of the lower lake, west of Eden Isle. Bird Island lies in the Big Water between this point and Eden Isle.",
    access: "Boat; visible from the Eden Isle / Shiloh run",
    importance: 2,
  },
  {
    id: "goff-point",
    name: "Goff Point",
    kind: "point",
    lat: 35.476467,
    lon: -92.160707,
    region: "lower",
    description:
      "The point at the mouth of the Cove Creek arm. Round Mountain Cove and Goff Cove wrap around it — a standard waypoint on the south-shore run.",
    access: "Boat from Cove Creek Rec",
    importance: 2,
  },
  {
    id: "bean-point",
    name: "Bean Point",
    kind: "point",
    lat: 35.462023,
    lon: -92.150707,
    region: "lower",
    description:
      "A named cape at the very head of the Cove Creek arm, beside Cove Creek Recreation Area.",
    access: "Cove Creek Rec",
    importance: 1,
  },
  {
    id: "silver-ridge",
    name: "Silver Ridge Peninsula",
    kind: "point",
    lat: 35.529245,
    lon: -92.059316,
    region: "lower",
    description:
      "A north-shore peninsula in the Big Water between Scout Island and Old Highway 25. A useful landmark when crossing toward the dam.",
    access: "Boat from Old Highway 25 or Cherokee",
    importance: 2,
  },

  // ——— Towns ———
  {
    id: "heber-springs",
    name: "Heber Springs",
    kind: "town",
    lat: 35.497696,
    lon: -92.032488,
    region: "lower",
    description:
      "The lake’s main town, at the dam. Old West Main, restaurants, the visitor center, Sandy Beach, and the Little Red River trout fishery all start here.",
    amenities: ["Dining", "Lodging", "Supplies"],
    access: "Hwy 25 / Hwy 110 / Hwy 16",
    importance: 3,
  },
  {
    id: "greers-ferry-town",
    name: "Greers Ferry",
    kind: "town",
    lat: 35.57702,
    lon: -92.17737,
    region: "upper",
    description:
      "The namesake town on the ridge above the Narrows and Devil’s Fork. Closest services to Narrows Park, Devil’s Fork, and Poker Hill.",
    amenities: ["Dining", "Supplies"],
    access: "Hwy 16 / Hwy 92",
    importance: 2,
  },
  {
    id: "higden",
    name: "Higden",
    kind: "town",
    lat: 35.57341,
    lon: -92.20321,
    region: "upper",
    description:
      "The original valley town was flooded when the lake filled; it was rebuilt on the hill above Higden Bay. Nursery pond and Mill Creek Rec sit nearby.",
    access: "Hwy 16 / Hwy 92",
    importance: 2,
  },
  {
    id: "stark",
    name: "Stark",
    kind: "landmark",
    lat: 35.552,
    lon: -92.135,
    region: "narrows",
    aliases: ["Stark AR", "Stark, AR"],
    description:
      "Valley community near Budd Creek and the Little Red River. The Before the dam overlay uses the green/blue USGS Greers Ferry 1973-style topo that still labels Stark — most of the old town site is under the lake now.",
    access: "Boat over the Narrows / Budd Creek arm — look for the historical label",
    approx: true,
    importance: 3,
  },
  {
    id: "fairfield-bay",
    name: "Fairfield Bay",
    kind: "town",
    lat: 35.605262,
    lon: -92.267733,
    region: "upper",
    description:
      "North-shore resort community on the upper lake. Marina, golf, and the seasonal shuttle to Sugar Loaf Mountain Island.",
    amenities: ["Marina", "Dining", "Lodging"],
    access: "Hwy 16 / Hwy 330",
    importance: 3,
  },
  {
    id: "edgemont",
    name: "Edgemont",
    kind: "town",
    lat: 35.6023,
    lon: -92.19626,
    region: "upper",
    description:
      "A small community on the north ridge above Devil’s Fork and Hill Creek. Edgemont Bridge crosses the fork just south of town.",
    access: "Hwy 16 / local roads north of Greers Ferry",
    importance: 1,
  },
  {
    id: "tumbling-shoals",
    name: "Tumbling Shoals",
    kind: "town",
    lat: 35.545,
    lon: -92.008,
    region: "lower",
    description:
      "Community on the north shore of the lower lake, home to Old Highway 25 Recreation Area.",
    access: "Hwy 25 north of the dam",
    approx: true,
    importance: 1,
  },

  // ——— Landmarks ———
  {
    id: "greers-ferry-dam",
    name: "Greers Ferry Dam",
    kind: "landmark",
    lat: 35.521371,
    lon: -91.994521,
    region: "lower",
    description:
      "USACE dam on the Little Red River, 1,704 feet across and 243 feet above the streambed. Dedicated October 3, 1963, by President John F. Kennedy. The lake is named for Bud Greer’s 1800s ferry.",
    amenities: ["Overlook", "Visitor center nearby"],
    access: "Hwy 25, Heber Springs",
    importance: 3,
  },
  {
    id: "the-narrows",
    name: "The Narrows",
    kind: "landmark",
    lat: 35.555,
    lon: -92.185,
    region: "narrows",
    aliases: ["Narrows Gorge"],
    description:
      "A water-filled gorge that joins the two lakes. The reservoir is really two bodies of water plus this cut — together about 40,500 acres. Tight channel; watch traffic, no-wake, and wind funnels.",
    access: "Boat between Narrows Park and Shiloh, or view from Hwy 16",
    approx: true,
    importance: 3,
  },
  {
    id: "visitor-center",
    name: "William Carl Garner Visitor Center",
    kind: "landmark",
    lat: 35.5245,
    lon: -92.0008,
    region: "lower",
    aliases: ["Garner Visitor Center"],
    description:
      "The Corps visitor center at the dam. Exhibits on the lake, the 1963 dedication, and the annual lakeshore cleanup Carl Garner started in 1969.",
    amenities: ["Exhibits", "Restrooms", "Overlook"],
    access: "700 Heber Springs Road North",
    approx: true,
    importance: 2,
  },
  {
    id: "fish-hatchery",
    name: "Greers Ferry National Fish Hatchery",
    kind: "landmark",
    lat: 35.513458,
    lon: -91.994929,
    region: "lower",
    description:
      "Federal hatchery on the tailwater below the dam. Raises trout for the Little Red River — one of Arkansas’s premier year-round trout streams. Visitor center with aquarium; self-guided tours.",
    amenities: ["Aquarium", "Tours", "Tailwater fishing"],
    access: "349 Hatchery Road, Heber Springs",
    importance: 2,
  },
  {
    id: "jfk-overlook",
    name: "JFK Memorial Overlook",
    kind: "landmark",
    lat: 35.5218,
    lon: -91.9915,
    region: "lower",
    aliases: ["Kennedy Overlook"],
    description:
      "Overlook on Hwy 25 at the dam, honoring President Kennedy’s 1963 dedication of Greers Ferry Dam. Classic postcard view of the Big Water.",
    amenities: ["Overlook", "Nature trail"],
    access: "Hwy 25 at the dam, Heber Springs",
    approx: true,
    importance: 2,
  },
  {
    id: "edgemont-bridge",
    name: "Edgemont Bridge",
    kind: "landmark",
    lat: 35.59619,
    lon: -92.17571,
    region: "upper",
    description:
      "The bridge over Devil’s Fork between Greers Ferry and Edgemont. A landmark when running the north arm, and a roadside view of the fork.",
    access: "Local roads north of Greers Ferry",
    importance: 1,
  },
  {
    id: "nursery-pond",
    name: "Greers Ferry Nursery Pond",
    kind: "landmark",
    lat: 35.57537,
    lon: -92.22104,
    region: "upper",
    aliases: ["AGFC Nursery Pond"],
    description:
      "Arkansas Game & Fish nursery pond above Higden Bay, used to raise fish for the lake. Visible from the Higden / Mill Creek shoreline.",
    access: "Near Higden; view from the water in Higden Bay",
    importance: 1,
  },
  // ——— From Greers Ferry Lake Cove Names KML ———
  {
    id: "unnamed-spot-35-5719-92-2170",
    name: "Unnamed spot (35.5719, -92.2170)",
    kind: "cove",
    lat: 35.57185382,
    lon: -92.21695189,
    region: "narrows",
    description:
      "Named place from the Greers Ferry Lake cove map: Unnamed spot (35.5719, -92.2170).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "drip-creek",
    name: "Drip Creek",
    kind: "cove",
    lat: 35.57257509,
    lon: -92.06373357,
    region: "lower",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "brittany-cove",
    name: "Brittany Cove",
    kind: "cove",
    lat: 35.55845091,
    lon: -92.08131941,
    region: "lower",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "twin-coves",
    name: "Twin Coves",
    kind: "cove",
    lat: 35.55877985,
    lon: -92.07614812,
    region: "lower",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "kidney-cove",
    name: "Kidney Cove",
    kind: "cove",
    lat: 35.52906503,
    lon: -92.05400097,
    region: "lower",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "tannenbaum",
    name: "Tannenbaum",
    kind: "cove",
    lat: 35.52406492,
    lon: -92.06155583,
    region: "lower",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "lake-eden",
    name: "Lake Eden",
    kind: "cove",
    lat: 35.49908199,
    lon: -92.10373952,
    region: "lower",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "big-dike",
    name: "Big Dike",
    kind: "cove",
    lat: 35.47626236,
    lon: -92.08943978,
    region: "lower",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "little-dike",
    name: "Little Dike",
    kind: "cove",
    lat: 35.49156065,
    lon: -92.06267800,
    region: "lower",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "old-road",
    name: "Old Road",
    kind: "cove",
    lat: 35.49894611,
    lon: -92.10284318,
    region: "lower",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "diamond-bluff",
    name: "Diamond Bluff",
    kind: "cove",
    lat: 35.51606887,
    lon: -92.19083902,
    region: "upper",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "tortoise-bay",
    name: "Tortoise Bay",
    kind: "cove",
    lat: 35.53839350,
    lon: -92.21329420,
    region: "narrows",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "parker-island",
    name: "Parker Island",
    kind: "park",
    lat: 35.53781426,
    lon: -92.20522146,
    region: "narrows",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "bondair",
    name: "Bondair",
    kind: "cove",
    lat: 35.53890175,
    lon: -92.18266921,
    region: "narrows",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "puddin-ridge",
    name: "Puddin' Ridge",
    kind: "cove",
    lat: 35.54322673,
    lon: -92.11499200,
    region: "lower",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "lake-ice-rd",
    name: "Lake Ice Rd.",
    kind: "cove",
    lat: 35.53943102,
    lon: -92.20744911,
    region: "narrows",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "five-fingers",
    name: "Five Fingers",
    kind: "cove",
    lat: 35.58864574,
    lon: -92.22818061,
    region: "upper",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "mystic-isle",
    name: "Mystic Isle",
    kind: "cove",
    lat: 35.60654700,
    lon: -92.17312881,
    region: "upper",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "jansen-s-lakefront-restaurant",
    name: "Jansen's Lakefront Restaurant",
    kind: "cove",
    lat: 35.60231637,
    lon: -92.18721703,
    region: "upper",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "middle-fork",
    name: "Middle Fork",
    kind: "cove",
    lat: 35.61416594,
    lon: -92.19460318,
    region: "upper",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "skypoint",
    name: "Skypoint",
    kind: "cove",
    lat: 35.60423668,
    lon: -92.14062105,
    region: "lower",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "midway-bluffs",
    name: "Midway Bluffs",
    kind: "cove",
    lat: 35.60717632,
    lon: -92.12607141,
    region: "lower",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "shirley",
    name: "Shirley",
    kind: "cove",
    lat: 35.65541970,
    lon: -92.32028977,
    region: "upper",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "wild-goose-creek",
    name: "Wild Goose Creek",
    kind: "cove",
    lat: 35.65660617,
    lon: -92.21971556,
    region: "upper",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "birdie-hollow",
    name: "Birdie Hollow",
    kind: "cove",
    lat: 35.64387869,
    lon: -92.22129783,
    region: "upper",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "brewer",
    name: "Brewer",
    kind: "cove",
    lat: 35.62238697,
    lon: -92.20916792,
    region: "upper",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "shop-hollow",
    name: "Shop Hollow",
    kind: "cove",
    lat: 35.62668815,
    lon: -92.19332038,
    region: "upper",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "brush-creek",
    name: "Brush Creek",
    kind: "cove",
    lat: 35.62601528,
    lon: -92.18743872,
    region: "upper",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "stewart-hollow",
    name: "Stewart Hollow",
    kind: "cove",
    lat: 35.62400789,
    lon: -92.21258831,
    region: "upper",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "punchin-hollow",
    name: "Punchin Hollow",
    kind: "cove",
    lat: 35.64123777,
    lon: -92.21534425,
    region: "upper",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "sandiff-river",
    name: "Sandiff River",
    kind: "cove",
    lat: 35.65044010,
    lon: -92.22592328,
    region: "upper",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "indian-creek",
    name: "Indian Creek",
    kind: "cove",
    lat: 35.66524478,
    lon: -92.25476395,
    region: "upper",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "greenbrier-creek",
    name: "Greenbrier Creek",
    kind: "cove",
    lat: 35.66663359,
    lon: -92.26149953,
    region: "upper",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "ship-branch",
    name: "Ship Branch",
    kind: "cove",
    lat: 35.66597414,
    lon: -92.26735247,
    region: "upper",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "weaver-creek",
    name: "Weaver Creek",
    kind: "cove",
    lat: 35.64480785,
    lon: -92.30100814,
    region: "upper",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "hump-hollow",
    name: "Hump Hollow",
    kind: "cove",
    lat: 35.64403605,
    lon: -92.29706353,
    region: "upper",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "weaver-creek-2",
    name: "Weaver Creek",
    kind: "cove",
    lat: 35.63958910,
    lon: -92.33712631,
    region: "upper",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "big-branch",
    name: "Big Branch",
    kind: "cove",
    lat: 35.64610445,
    lon: -92.33498772,
    region: "upper",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "harper-s-cove",
    name: "Harper's Cove",
    kind: "cove",
    lat: 35.55226911,
    lon: -92.36156590,
    region: "upper",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "dave-creek",
    name: "Dave Creek",
    kind: "cove",
    lat: 35.58633459,
    lon: -92.26656542,
    region: "upper",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "hooten-hollow",
    name: "Hooten Hollow",
    kind: "cove",
    lat: 35.57670210,
    lon: -92.25095384,
    region: "upper",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "grand-isle",
    name: "Grand Isle",
    kind: "cove",
    lat: 35.57838828,
    lon: -92.23708757,
    region: "upper",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "lynn-creek",
    name: "Lynn Creek",
    kind: "cove",
    lat: 35.58300959,
    lon: -92.28968847,
    region: "upper",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "enchanted-peninsula",
    name: "Enchanted Peninsula",
    kind: "cove",
    lat: 35.57754023,
    lon: -92.24741158,
    region: "upper",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "snakehead-cove",
    name: "Snakehead Cove",
    kind: "cove",
    lat: 35.57490000,
    lon: -92.28375851,
    region: "upper",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "green-creek",
    name: "Green Creek",
    kind: "cove",
    lat: 35.55686510,
    lon: -92.31772671,
    region: "upper",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "party-cove",
    name: "Party Cove",
    kind: "cove",
    lat: 35.56050008,
    lon: -92.33224804,
    region: "upper",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "thompson-creek",
    name: "Thompson Creek",
    kind: "cove",
    lat: 35.56233884,
    lon: -92.33521732,
    region: "upper",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "peter-rock-point",
    name: "Peter Rock Point",
    kind: "cove",
    lat: 35.54510930,
    lon: -92.35754505,
    region: "upper",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "archey-creek",
    name: "Archey Creek",
    kind: "cove",
    lat: 35.59033595,
    lon: -92.44691061,
    region: "upper",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "pee-dee-creek",
    name: "Pee Dee Creek",
    kind: "cove",
    lat: 35.59189483,
    lon: -92.41384528,
    region: "upper",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "big-branch-2",
    name: "Big Branch",
    kind: "cove",
    lat: 35.52390512,
    lon: -92.42331351,
    region: "upper",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "emerald-isle",
    name: "Emerald Isle",
    kind: "cove",
    lat: 35.55249781,
    lon: -92.33511909,
    region: "upper",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "eglantine",
    name: "Eglantine",
    kind: "cove",
    lat: 35.56226888,
    lon: -92.30970284,
    region: "upper",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "quiet-cove",
    name: "Quiet Cove",
    kind: "cove",
    lat: 35.56244459,
    lon: -92.31853862,
    region: "upper",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "steven-s-point",
    name: "Steven's Point",
    kind: "cove",
    lat: 35.54402891,
    lon: -92.31242777,
    region: "upper",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "bailey-hollow",
    name: "Bailey Hollow",
    kind: "cove",
    lat: 35.54696917,
    lon: -92.30794816,
    region: "upper",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "banker-s-cove",
    name: "Banker's Cove",
    kind: "cove",
    lat: 35.54316607,
    lon: -92.30763593,
    region: "upper",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "tee-pee-cove",
    name: "Tee Pee Cove",
    kind: "cove",
    lat: 35.57513580,
    lon: -92.27929012,
    region: "upper",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "lakeshore-dr",
    name: "Lakeshore Dr.",
    kind: "cove",
    lat: 35.58106151,
    lon: -92.26099825,
    region: "upper",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "kinderhook",
    name: "Kinderhook",
    kind: "cove",
    lat: 35.59597081,
    lon: -92.20685546,
    region: "upper",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "eva-turney-hollow",
    name: "Eva Turney Hollow",
    kind: "cove",
    lat: 35.59726454,
    lon: -92.21040833,
    region: "upper",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "edgewater",
    name: "Edgewater",
    kind: "cove",
    lat: 35.59721050,
    lon: -92.20138893,
    region: "upper",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "old-train-bridge",
    name: "Old Train Bridge",
    kind: "cove",
    lat: 35.60236632,
    lon: -92.18804612,
    region: "upper",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "salt-cave",
    name: "Salt Cave",
    kind: "cove",
    lat: 35.59321505,
    lon: -92.17194761,
    region: "upper",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "davidson-circle",
    name: "Davidson Circle",
    kind: "cove",
    lat: 35.60139510,
    lon: -92.14800109,
    region: "lower",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "launch-ramp-rd",
    name: "Launch Ramp Rd.",
    kind: "landmark",
    lat: 35.59251755,
    lon: -92.16332938,
    region: "upper",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "sylvan-shores",
    name: "Sylvan Shores",
    kind: "cove",
    lat: 35.60512789,
    lon: -92.13587045,
    region: "lower",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "oid-sunny-slope-rd",
    name: "OId Sunny Slope Rd.",
    kind: "cove",
    lat: 35.60780160,
    lon: -92.12638856,
    region: "lower",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "midway-bridge",
    name: "Midway Bridge",
    kind: "cove",
    lat: 35.60676503,
    lon: -92.12822951,
    region: "lower",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "devil-s-bluff",
    name: "Devil's Bluff",
    kind: "cove",
    lat: 35.60560519,
    lon: -92.12794027,
    region: "lower",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "frontier-canyon",
    name: "Frontier Canyon",
    kind: "cove",
    lat: 35.61871993,
    lon: -92.08528575,
    region: "lower",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "hooten-hollow-2",
    name: "Hooten Hollow",
    kind: "cove",
    lat: 35.62366216,
    lon: -92.09322029,
    region: "lower",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "wildcat-hollow",
    name: "Wildcat Hollow",
    kind: "cove",
    lat: 35.62132392,
    lon: -92.09629287,
    region: "lower",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "prim-rd-hwy-263",
    name: "Prim Rd. Hwy. 263",
    kind: "cove",
    lat: 35.63316791,
    lon: -92.05302618,
    region: "lower",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "beech-fork",
    name: "Beech Fork",
    kind: "cove",
    lat: 35.65811595,
    lon: -92.01564647,
    region: "lower",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "cedar-creek",
    name: "Cedar Creek",
    kind: "cove",
    lat: 35.65328890,
    lon: -91.99873405,
    region: "lower",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "yellow-branch",
    name: "Yellow Branch",
    kind: "cove",
    lat: 35.64043907,
    lon: -92.03027625,
    region: "lower",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "everett-ridge",
    name: "Everett Ridge",
    kind: "cove",
    lat: 35.68134608,
    lon: -92.05554796,
    region: "lower",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "bear-hollow",
    name: "Bear Hollow",
    kind: "cove",
    lat: 35.68512380,
    lon: -92.05690819,
    region: "lower",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "turkey-creek",
    name: "Turkey Creek",
    kind: "cove",
    lat: 35.66233917,
    lon: -92.03196566,
    region: "lower",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "turkey-creek-2",
    name: "Turkey Creek",
    kind: "cove",
    lat: 35.73107274,
    lon: -92.08532686,
    region: "lower",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "tick-creek",
    name: "Tick Creek",
    kind: "cove",
    lat: 35.73463152,
    lon: -92.29574878,
    region: "upper",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "porter-hollow",
    name: "Porter Hollow",
    kind: "cove",
    lat: 35.73263042,
    lon: -92.29461901,
    region: "upper",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "little-wild-goose-creek",
    name: "Little Wild Goose Creek",
    kind: "cove",
    lat: 35.67478856,
    lon: -92.23401139,
    region: "upper",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "wild-goose-creek-2",
    name: "Wild Goose Creek",
    kind: "cove",
    lat: 35.67673995,
    lon: -92.22257683,
    region: "upper",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "backbone-ridge",
    name: "Backbone Ridge",
    kind: "cove",
    lat: 35.68240496,
    lon: -92.22960102,
    region: "upper",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "bird-hollow",
    name: "Bird Hollow",
    kind: "cove",
    lat: 35.61554457,
    lon: -92.19793637,
    region: "upper",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "party-cove-2",
    name: "Party Cove",
    kind: "cove",
    lat: 35.60704585,
    lon: -92.12513121,
    region: "lower",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "john-f-kennedy-overlook",
    name: "John F. Kennedy Overlook",
    kind: "park",
    lat: 35.52022907,
    lon: -91.99225609,
    region: "lower",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "dam",
    name: "Dam",
    kind: "cove",
    lat: 35.52129318,
    lon: -91.99438690,
    region: "lower",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "big-lake",
    name: "Big Lake",
    kind: "cove",
    lat: 35.52578849,
    lon: -91.99120396,
    region: "lower",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "wackley-hollow",
    name: "Wackley Hollow",
    kind: "cove",
    lat: 35.52976088,
    lon: -91.98793698,
    region: "lower",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "robinson-hollow",
    name: "Robinson Hollow",
    kind: "cove",
    lat: 35.53396852,
    lon: -91.99579535,
    region: "lower",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "asphalt-beach",
    name: "Asphalt Beach",
    kind: "landmark",
    lat: 35.52784706,
    lon: -92.01260795,
    region: "lower",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "us-army-corps-of-engineers",
    name: "US Army Corps of Engineers",
    kind: "cove",
    lat: 35.52181510,
    lon: -91.99941234,
    region: "lower",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "little-red-river",
    name: "Little Red River",
    kind: "cove",
    lat: 35.51818989,
    lon: -91.99579852,
    region: "lower",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "old-hwy-25-park-beach",
    name: "Old Hwy 25 Park Beach",
    kind: "landmark",
    lat: 35.53420001,
    lon: -92.01546477,
    region: "lower",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "peter-creek",
    name: "Peter Creek",
    kind: "cove",
    lat: 35.56284983,
    lon: -91.97798260,
    region: "lower",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "copperas-spring-hollow",
    name: "Copperas Spring Hollow",
    kind: "cove",
    lat: 35.54981647,
    lon: -92.02494518,
    region: "lower",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "little-peter-creek",
    name: "Little Peter Creek",
    kind: "cove",
    lat: 35.56501987,
    lon: -92.01557268,
    region: "lower",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "drip-creek-2",
    name: "Drip Creek",
    kind: "cove",
    lat: 35.54592612,
    lon: -92.07082544,
    region: "lower",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "dug-hill-rd",
    name: "Dug Hill Rd.",
    kind: "cove",
    lat: 35.55345996,
    lon: -92.01796138,
    region: "lower",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "peter-creek-2",
    name: "Peter Creek",
    kind: "cove",
    lat: 35.53457477,
    lon: -92.03134325,
    region: "lower",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "collin-s-creek",
    name: "Collinâs Creek",
    kind: "cove",
    lat: 35.51406824,
    lon: -91.99127134,
    region: "lower",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "cow-shoals",
    name: "Cow Shoals",
    kind: "cove",
    lat: 35.51347807,
    lon: -91.93833052,
    region: "lower",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "prior-mountain",
    name: "Prior Mountain",
    kind: "cove",
    lat: 35.49168562,
    lon: -92.23195906,
    region: "upper",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "north-fork-cadron-creek",
    name: "North Fork Cadron Creek",
    kind: "cove",
    lat: 35.48919673,
    lon: -92.22854542,
    region: "upper",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "sugarloaf-mountain-the-lookout",
    name: "Sugarloaf Mountain/The Lookout",
    kind: "cove",
    lat: 35.49073271,
    lon: -91.98569441,
    region: "lower",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "rocky-top-falls",
    name: "Rocky Top Falls",
    kind: "cove",
    lat: 35.58140708,
    lon: -92.28811293,
    region: "upper",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "bridal-veil-falls",
    name: "Bridal Veil Falls",
    kind: "cove",
    lat: 35.46920811,
    lon: -92.03849691,
    region: "lower",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "pebble-beach",
    name: "Pebble Beach",
    kind: "landmark",
    lat: 35.49234450,
    lon: -92.05439511,
    region: "lower",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "narrows-launch",
    name: "Narrows Launch",
    kind: "landmark",
    lat: 35.56331361,
    lon: -92.19625244,
    region: "narrows",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "brush-creek-2",
    name: "Brush Creek",
    kind: "cove",
    lat: 35.62605816,
    lon: -92.18774517,
    region: "upper",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "hill-creek-boat-ramp",
    name: "Hill Creek Boat Ramp",
    kind: "landmark",
    lat: 35.60846115,
    lon: -92.14654146,
    region: "lower",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "old-road-2",
    name: "Old Road",
    kind: "cove",
    lat: 35.49446209,
    lon: -92.09989272,
    region: "lower",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "old-road-3",
    name: "Old Road",
    kind: "cove",
    lat: 35.56658278,
    lon: -92.21443575,
    region: "narrows",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  },
  {
    id: "mastercraft-alley",
    name: "Mastercraft Alley",
    kind: "cove",
    lat: 35.62014449,
    lon: -92.19013562,
    region: "upper",
    description:
      "From lake map data (KML).",
    access: "From Greers Ferry Lake cove names map",
    importance: 1,
  }
];

export function searchPlaces(query: string, places: Place[] = PLACES): Place[] {
  const q = query.trim().toLowerCase();
  if (!q) return places;
  return places.filter((p) => {
    if (p.name.toLowerCase().includes(q)) return true;
    if (p.kind.includes(q) || KIND_LABEL[p.kind].toLowerCase().includes(q)) return true;
    if (REGION_LABEL[p.region].toLowerCase().includes(q)) return true;
    if (p.aliases?.some((a) => a.toLowerCase().includes(q))) return true;
    if (p.description.toLowerCase().includes(q)) return true;
    return false;
  });
}

export function getPlace(id: string, extra: Place[] = []): Place | undefined {
  return PLACES.find((p) => p.id === id) ?? extra.find((p) => p.id === id);
}

export function regionFromPoint(lat: number, lon: number): RegionId {
  if (lon <= -92.22) return "upper";
  if (lon > -92.22 && lon < -92.16 && lat > 35.535 && lat < 35.575) return "narrows";
  if (lon <= -92.16) return "upper";
  return "lower";
}

export function communityCoveToPlace(row: {
  id: number;
  name: string;
  lat: number;
  lon: number;
  note: string | null;
}): Place {
  const region = regionFromPoint(row.lat, row.lon);
  return {
    id: `local-${row.id}`,
    name: row.name,
    kind: "cove",
    lat: row.lat,
    lon: row.lon,
    region,
    description:
      row.note?.trim() ||
      "A locally named cove, added by someone on the lake. Shared with every device.",
    access: "Community pin — tap the map near the pocket you know",
    importance: 2,
    community: true,
  };
}

export function fieldPinToPlace(row: {
  id: number;
  kind: "depth" | "temperature" | "hazard" | "pin";
  title: string;
  value: string | null;
  lat: number;
  lon: number;
  note: string | null;
}): Place {
  const region = regionFromPoint(row.lat, row.lon);
  const value = row.value?.trim() || undefined;
  const note = row.note?.trim();
  const blurb: Record<typeof row.kind, string> = {
    depth: value
      ? `Reported water depth: ${value}. Shared field reading.`
      : "A shared water-depth reading on the lake.",
    temperature: value
      ? `Reported water temperature: ${value}. Shared field reading.`
      : "A shared water-temperature reading on the lake.",
    hazard: "A shared hazard mark — use care and your own judgment on the water.",
    pin: "A shared custom pin dropped by someone on the lake.",
  };
  return {
    id: `field-${row.kind}-${row.id}`,
    name: row.title,
    kind: row.kind,
    lat: row.lat,
    lon: row.lon,
    region,
    description: note || blurb[row.kind],
    amenities: value ? [value] : undefined,
    access: "Field pin — shared across every device",
    importance: row.kind === "hazard" ? 3 : 2,
    field: true,
    fieldValue: value,
  };
}
