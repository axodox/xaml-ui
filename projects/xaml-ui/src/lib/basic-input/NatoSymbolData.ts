// MIL-STD-2525C field option data for the NATO symbol picker.
//
// A SIDC is a 15-character code, sliced positionally:
//   1: coding scheme | 2: affiliation | 3: battle dimension | 4: status
//   5-10: function id (the "main icon", scheme+dimension dependent)
//   11: modifier 1 | 12: modifier 2 | 13-14: country | 15: order of battle
//
// The FunctionIcons table below is a curated (not exhaustive) subset. Every code
// here was validated against milsymbol's `isValid()`; extend it as needed — any
// scheme/dimension without curated entries falls back to a single generic icon.

export interface SymbolOption {
  /** The character(s) placed at this SIDC position. */
  Code: string;
  /** Human-readable label shown in the dropdown. */
  Name: string;
}

export const CodingSchemes: SymbolOption[] = [
  { Code: 'S', Name: 'Warfighting' },
  { Code: 'G', Name: 'Tactical Graphics' },
  { Code: 'W', Name: 'Weather / METOC' },
  { Code: 'I', Name: 'Signals Intelligence' },
  { Code: 'O', Name: 'Stability Operations' },
  { Code: 'E', Name: 'Emergency Management' },
];

export const Affiliations: SymbolOption[] = [
  { Code: 'P', Name: 'Pending' },
  { Code: 'U', Name: 'Unknown' },
  { Code: 'A', Name: 'Assumed Friend' },
  { Code: 'F', Name: 'Friend' },
  { Code: 'N', Name: 'Neutral' },
  { Code: 'S', Name: 'Suspect' },
  { Code: 'H', Name: 'Hostile' },
  { Code: 'J', Name: 'Joker' },
  { Code: 'K', Name: 'Faker' },
];

export const BattleDimensions: SymbolOption[] = [
  { Code: 'P', Name: 'Space' },
  { Code: 'A', Name: 'Air' },
  { Code: 'G', Name: 'Ground' },
  { Code: 'S', Name: 'Sea Surface' },
  { Code: 'U', Name: 'Sea Subsurface' },
  { Code: 'F', Name: 'SOF' },
  { Code: 'Z', Name: 'Unknown' },
];

export const Statuses: SymbolOption[] = [
  { Code: 'P', Name: 'Present' },
  { Code: 'A', Name: 'Anticipated / Planned' },
  { Code: 'C', Name: 'Present / Fully Capable' },
  { Code: 'D', Name: 'Present / Damaged' },
  { Code: 'X', Name: 'Present / Destroyed' },
  { Code: 'F', Name: 'Present / Full to Capacity' },
];

// Position 11 — echelon / mobility indicator flag (units use the echelon flags).
export const Modifier1Options: SymbolOption[] = [
  { Code: '-', Name: 'None' },
  { Code: 'A', Name: 'Headquarters' },
  { Code: 'B', Name: 'Task Force HQ' },
  { Code: 'C', Name: 'Feint / Dummy HQ' },
  { Code: 'D', Name: 'Feint / Dummy + TF HQ' },
  { Code: 'E', Name: 'Task Force' },
  { Code: 'F', Name: 'Feint / Dummy' },
  { Code: 'G', Name: 'Feint / Dummy + Task Force' },
];

// Position 12 — echelon size (units).
export const Modifier2Options: SymbolOption[] = [
  { Code: '-', Name: 'None' },
  { Code: 'A', Name: 'Team / Crew' },
  { Code: 'B', Name: 'Squad' },
  { Code: 'C', Name: 'Section' },
  { Code: 'D', Name: 'Platoon / Detachment' },
  { Code: 'E', Name: 'Company / Battery / Troop' },
  { Code: 'F', Name: 'Battalion / Squadron' },
  { Code: 'G', Name: 'Regiment / Group' },
  { Code: 'H', Name: 'Brigade' },
  { Code: 'I', Name: 'Division' },
  { Code: 'J', Name: 'Corps / MEF' },
  { Code: 'K', Name: 'Army' },
  { Code: 'L', Name: 'Army Group / Front' },
  { Code: 'M', Name: 'Region' },
  { Code: 'N', Name: 'Command' },
];

// Function-id (positions 5-10) options, keyed by coding scheme then battle
// dimension. Validated against milsymbol. Extend freely.
const FUNCTION_ICONS: { [scheme: string]: { [dimension: string]: [string, string][] } } = {
  S: {
    G: [
      ['------', 'Generic'], ['U-----', 'Unit'], ['UC----', 'Combat'],
      ['UCD---', 'Air Defense'], ['UCDS--', 'Air Defense (Short Range)'],
      ['UCI---', 'Infantry'], ['UCIL--', 'Infantry (Light)'], ['UCIM--', 'Infantry (Motorized)'],
      ['UCIZ--', 'Infantry (Mechanized)'], ['UCIN--', 'Infantry (Naval)'],
      ['UCA---', 'Armor'], ['UCAA--', 'Armor (Airborne)'], ['UCAW--', 'Armor (Wheeled)'],
      ['UCR---', 'Reconnaissance / Cavalry'], ['UCF---', 'Field Artillery'],
      ['UCFH--', 'Field Artillery (Self-Propelled)'], ['UCFR--', 'Rocket Artillery'],
      ['UCE---', 'Engineer'], ['UCM---', 'Missile'], ['UCV---', 'Aviation'],
      ['UCVR--', 'Aviation (Rotary Wing)'], ['US----', 'Combat Support'],
      ['USS---', 'Supply'], ['USM---', 'Medical'], ['UST---', 'Transport'],
      ['UU----', 'Combat Service Support'], ['UUM---', 'Maintenance'],
      ['E-----', 'Equipment'], ['EW----', 'Weapon'], ['EWM---', 'Missile Launcher'],
      ['EWMA--', 'Anti-Tank Missile'], ['EV----', 'Vehicle'], ['EVA---', 'Armored Vehicle'],
      ['EVAT--', 'Tank'], ['EVU---', 'Utility Vehicle'], ['I-----', 'Installation'],
      ['IM----', 'Military Base'], ['IMG---', 'Missile / Rocket Site'],
    ],
    A: [
      ['------', 'Track'], ['M-----', 'Military'], ['MF----', 'Military Fixed Wing'],
      ['MFF---', 'Fighter'], ['MFB---', 'Bomber'], ['MFA---', 'Attack / Strike'],
      ['MFC---', 'Cargo'], ['MFT---', 'Tanker'], ['MFR---', 'Reconnaissance'],
      ['MFP---', 'Patrol'], ['MH----', 'Rotary Wing (Helicopter)'], ['MHA---', 'Attack Helicopter'],
      ['MHU---', 'Utility Helicopter'], ['C-----', 'Civilian'], ['CF----', 'Civilian Fixed Wing'],
      ['WM----', 'Missile'],
    ],
    P: [
      ['------', 'Track'], ['V-----', 'Space Vehicle'],
    ],
    S: [
      ['------', 'Track'], ['C-----', 'Combatant'], ['CL----', 'Line (Combatant)'],
      ['CLCV--', 'Carrier'], ['CLBB--', 'Battleship'], ['CLCC--', 'Cruiser'],
      ['CLDD--', 'Destroyer'], ['CLFF--', 'Frigate'], ['N-----', 'Non-Combatant'],
      ['NR----', 'Auxiliary'], ['O-----', 'Own Ship'],
    ],
    U: [
      ['------', 'Track'], ['S-----', 'Submarine'], ['SF----', 'Submarine (Fast)'],
      ['SN----', 'Submarine (Nuclear)'], ['SO----', 'Diesel-Electric Submarine'],
      ['N-----', 'Non-Submarine'], ['W-----', 'Weapon (Torpedo)'],
    ],
    F: [
      ['------', 'Track'], ['N-----', 'Naval SOF'], ['NS----', 'SEAL'],
      ['G-----', 'Ground SOF'], ['GS----', 'Special Forces'], ['GR----', 'Ranger'],
      ['A-----', 'Aviation SOF'],
    ],
  },
};

/** Function-icon options for a coding scheme + battle dimension, generic fallback.
 * Always returns a fresh array so callers can rely on reference changes. */
export function getFunctionIcons(scheme: string, dimension: string): SymbolOption[] {
  let entries = FUNCTION_ICONS[scheme]?.[dimension];
  if (!entries || entries.length === 0) return [{ Code: '------', Name: 'Generic' }];
  return entries.map(([Code, Name]) => ({ Code, Name }));
}
