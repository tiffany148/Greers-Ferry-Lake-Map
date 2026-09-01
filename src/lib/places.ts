export type PlaceKind =
  | "island"
  | "cove"
  | "park"
  | "marina"
  | "point"
  | "town"
  | "landmark";

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
  approx?: boolean;
  importance: 1 | 2 | 3;
  community?: boolean;
};

export const KIND_LABEL: Record<PlaceKind, string> = {
  island: "Island",
  cove: "Cove",
  park: "Park",
  marina: "Marina",
  point: "Point",
  town: "Town",
  landmark: "Landmark",
};

export const KIND_ORDER: PlaceKind[] = [
  "island",
  "cove",
  "park",
  "marina",
  "point",
  "town",
  "landmark",
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
    description:
      "Full-service marina on the Eden Isle peninsula. Goat and Scout Islands sit just to the north. Fuel, slips, and a short run into the heart of the Big Water.",
    amenities: ["Fuel", "Slips", "Boat services"],
    access: "Yacht Harbor Road, Eden Isle",
    importance: 3,
  },
  {
    id: "dam-site-marina",
    name: "Dam Site Marina",
    kind: "marina",
    lat: 35.5212,
    lon: -92.0078,
    region: "lower",
    description:
      "Marina inside Dam Site Recreation Area, minutes from the dam face, visitor center, and the cliffs above the tailwater.",
    amenities: ["Fuel", "Slips", "Ramp"],
    access: "Dam Site Rec, Heber Springs",
    approx: true,
    importance: 2,
  },
  {
    id: "heber-springs-marina",
    name: "Heber Springs Marina",
    kind: "marina",
    lat: 35.5024,
    lon: -92.0742,
    region: "lower",
    description:
      "The in-town marina at Heber Springs Recreation Area. Closest fuel to Sandy Beach and a quick hop to Eden Isle.",
    amenities: ["Fuel", "Slips", "Ramp"],
    access: "Heber Springs Rec, Park Road",
    approx: true,
    importance: 2,
  },
  {
    id: "narrows-marina",
    name: "Narrows Marina",
    kind: "marina",
    lat: 35.560355,
    lon: -92.195708,
    region: "narrows",
    description:
      "Marina in the gorge between the two lakes. The staging point for running the Narrows — stay right of traffic and watch the no-wake zones.",
    amenities: ["Slips", "Ramp"],
    access: "Narrows Recreation Area",
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
      "Marina at Shiloh Rec, the first fuel and slips after you drop out of the Narrows into the lower lake.",
    amenities: ["Slips", "Ramp"],
    access: "Shiloh Recreation Area",
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
      "North-shore marina at the back of Hill Creek Cove near Edgemont. A quiet upper-lake harbor with camping next door.",
    amenities: ["Slips", "Ramp"],
    access: "Hill Creek Recreation Area",
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
      "Full-service marina on Hwy 330, on the south-west shore of the upper lake. Fuel, rentals, slips, and the seasonal shuttle toward Sugar Loaf Mountain Island.",
    amenities: ["Fuel", "Slips", "Rentals", "Island shuttle (seasonal)"],
    access: "4350 Hwy 330 S, Fairfield Bay / Shirley",
    importance: 3,
  },
  {
    id: "choctaw-marina",
    name: "Choctaw Marina",
    kind: "marina",
    lat: 35.5327,
    lon: -92.3792,
    region: "upper",
    description:
      "West-end marina next to Choctaw Recreation Area, off Hwy 330 east of Clinton. The last (or first) fuel on the Choctaw Creek arm.",
    amenities: ["Fuel", "Slips", "Ramp"],
    access: "Choctaw Recreation Area, 3850 Hwy 330 E",
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
      "South-shore marina at Sugar Loaf Park, looking straight at the island trail. A practical put-in if you are boating yourself to the mountain.",
    amenities: ["Slips", "Ramp"],
    access: "Sugar Loaf Recreation Area, Hwy 337",
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
