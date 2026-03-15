/**
 * characters.js — Source of Truth
 * All names, narrative text, and media URLs live here.
 * Swap placeholder values for real content without touching any component.
 */

const PLACEHOLDER_IMG  = (seed) => `https://picsum.photos/seed/${seed}/400/400`
const PLACEHOLDER_WIDE = (seed) => `https://picsum.photos/seed/${seed}/800/450`
const PLACEHOLDER_ICON = (seed) => `https://picsum.photos/seed/${seed}/80/80`

export const characters = [
  {
    id: 'vex',
    name: 'Vex Morrow',
    role: 'The Architect',
    profileImage: PLACEHOLDER_IMG('vex-profile'),
    thumbnailImage: PLACEHOLDER_IMG('vex-thumb'),

    narrativeText: `They say Vex designed half the city's underground transit lines — 
the other half she simply commandeered. Nobody asks where the blueprints came from anymore. 
She arrives before dawn and disappears before questions do. Her ledger is meticulous. 
Her loyalties are not.`,

    mainFeedMedia: {
      type: 'image',
      url: PLACEHOLDER_WIDE('vex-main'),
      alt: 'Vex Morrow — The Architect',
    },

    thumbnailImages: [
      { id: 'vex-t1', url: PLACEHOLDER_IMG('vex-t1'), caption: 'Site 7' },
      { id: 'vex-t2', url: PLACEHOLDER_IMG('vex-t2'), caption: 'The Vault' },
      { id: 'vex-t3', url: PLACEHOLDER_IMG('vex-t3'), caption: 'North Gate' },
      { id: 'vex-t4', url: PLACEHOLDER_IMG('vex-t4'), caption: 'Substation' },
    ],

    assetTrayIcons: [
      { id: 'vex-a1', url: PLACEHOLDER_ICON('vex-icon1'), label: 'Blueprint' },
      { id: 'vex-a2', url: PLACEHOLDER_ICON('vex-icon2'), label: 'Keycard' },
      { id: 'vex-a3', url: PLACEHOLDER_ICON('vex-icon3'), label: 'Transit Map' },
      { id: 'vex-a4', url: PLACEHOLDER_ICON('vex-icon4'), label: 'Cipher' },
      { id: 'vex-a5', url: PLACEHOLDER_ICON('vex-icon5'), label: 'Lens' },
    ],

    ending: 'good',
    endingMedia: {
      type: 'image',
      url: PLACEHOLDER_WIDE('vex-end-good'),
      alt: 'Vex walks free',
    },
  },

  {
    id: 'lorne',
    name: 'Lorne Ashby',
    role: 'The Fixer',
    profileImage: PLACEHOLDER_IMG('lorne-profile'),
    thumbnailImage: PLACEHOLDER_IMG('lorne-thumb'),

    narrativeText: `Lorne never broke a contract — he simply renegotiated them on the fly, 
in the dark, at gunpoint if necessary. His philosophy: every lock has a price, every person 
has a weakness, and every witness has an expiry date. He smells of motor oil and old money.`,

    mainFeedMedia: {
      type: 'image',
      url: PLACEHOLDER_WIDE('lorne-main'),
      alt: 'Lorne Ashby — The Fixer',
    },

    thumbnailImages: [
      { id: 'lorne-t1', url: PLACEHOLDER_IMG('lorne-t1'), caption: 'Garage' },
      { id: 'lorne-t2', url: PLACEHOLDER_IMG('lorne-t2'), caption: 'The Docks' },
      { id: 'lorne-t3', url: PLACEHOLDER_IMG('lorne-t3'), caption: 'Pawn Shop' },
      { id: 'lorne-t4', url: PLACEHOLDER_IMG('lorne-t4'), caption: 'Rooftop' },
    ],

    assetTrayIcons: [
      { id: 'lorne-a1', url: PLACEHOLDER_ICON('lorne-icon1'), label: 'Wrench' },
      { id: 'lorne-a2', url: PLACEHOLDER_ICON('lorne-icon2'), label: 'Dossier' },
      { id: 'lorne-a3', url: PLACEHOLDER_ICON('lorne-icon3'), label: 'Burner' },
      { id: 'lorne-a4', url: PLACEHOLDER_ICON('lorne-icon4'), label: 'Cuffs' },
      { id: 'lorne-a5', url: PLACEHOLDER_ICON('lorne-icon5'), label: 'Scanner' },
    ],

    ending: 'bad',
    endingMedia: {
      type: 'image',
      url: PLACEHOLDER_WIDE('lorne-end-bad'),
      alt: 'Lorne caught at the docks',
    },
  },

  {
    id: 'sable',
    name: 'Sable Quinn',
    role: 'The Ghost',
    profileImage: PLACEHOLDER_IMG('sable-profile'),
    thumbnailImage: PLACEHOLDER_IMG('sable-thumb'),

    narrativeText: `Three governments have declared Sable Quinn officially dead. 
She finds this convenient. She moves through systems the way smoke moves through a keyhole — 
nothing holds her, nothing stops her. The only record of her passage is what's missing 
from the room she just left.`,

    mainFeedMedia: {
      type: 'image',
      url: PLACEHOLDER_WIDE('sable-main'),
      alt: 'Sable Quinn — The Ghost',
    },

    thumbnailImages: [
      { id: 'sable-t1', url: PLACEHOLDER_IMG('sable-t1'), caption: 'Embassy' },
      { id: 'sable-t2', url: PLACEHOLDER_IMG('sable-t2'), caption: 'Archive' },
      { id: 'sable-t3', url: PLACEHOLDER_IMG('sable-t3'), caption: 'Terminal' },
      { id: 'sable-t4', url: PLACEHOLDER_IMG('sable-t4'), caption: 'Safe House' },
    ],

    assetTrayIcons: [
      { id: 'sable-a1', url: PLACEHOLDER_ICON('sable-icon1'), label: 'Passports' },
      { id: 'sable-a2', url: PLACEHOLDER_ICON('sable-icon2'), label: 'Transmitter' },
      { id: 'sable-a3', url: PLACEHOLDER_ICON('sable-icon3'), label: 'Lock Pick' },
      { id: 'sable-a4', url: PLACEHOLDER_ICON('sable-icon4'), label: 'Flash Drive' },
      { id: 'sable-a5', url: PLACEHOLDER_ICON('sable-icon5'), label: 'Vial' },
    ],

    ending: 'good',
    endingMedia: {
      type: 'image',
      url: PLACEHOLDER_WIDE('sable-end-good'),
      alt: 'Sable vanishes at the border',
    },
  },

  {
    id: 'draft',
    name: 'Draft Kolov',
    role: 'The Muscle',
    profileImage: PLACEHOLDER_IMG('draft-profile'),
    thumbnailImage: PLACEHOLDER_IMG('draft-thumb'),

    narrativeText: `Draft has been hired, fired, betrayed, and hired again by the same people 
seven times. He holds no grudges — grudges slow you down. What he does hold is a reinforced 
steel door that used to be a wall, which he walked through in 1987 and still jokes about 
at Christmas.`,

    mainFeedMedia: {
      type: 'image',
      url: PLACEHOLDER_WIDE('draft-main'),
      alt: 'Draft Kolov — The Muscle',
    },

    thumbnailImages: [
      { id: 'draft-t1', url: PLACEHOLDER_IMG('draft-t1'), caption: 'Gym' },
      { id: 'draft-t2', url: PLACEHOLDER_IMG('draft-t2'), caption: 'Checkpoint' },
      { id: 'draft-t3', url: PLACEHOLDER_IMG('draft-t3'), caption: 'Warehouse' },
      { id: 'draft-t4', url: PLACEHOLDER_IMG('draft-t4'), caption: 'Alley' },
    ],

    assetTrayIcons: [
      { id: 'draft-a1', url: PLACEHOLDER_ICON('draft-icon1'), label: 'Radio' },
      { id: 'draft-a2', url: PLACEHOLDER_ICON('draft-icon2'), label: 'Vest' },
      { id: 'draft-a3', url: PLACEHOLDER_ICON('draft-icon3'), label: 'Manifest' },
      { id: 'draft-a4', url: PLACEHOLDER_ICON('draft-icon4'), label: 'Flare' },
      { id: 'draft-a5', url: PLACEHOLDER_ICON('draft-icon5'), label: 'Chain' },
    ],

    ending: 'bad',
    endingMedia: {
      type: 'image',
      url: PLACEHOLDER_WIDE('draft-end-bad'),
      alt: 'Draft cornered in the warehouse',
    },
  },

  {
    id: 'petra',
    name: 'Petra Vane',
    role: 'The Broker',
    profileImage: PLACEHOLDER_IMG('petra-profile'),
    thumbnailImage: PLACEHOLDER_IMG('petra-thumb'),

    narrativeText: `Petra doesn't steal things. She creates the conditions under which 
things become available. Her office is a café table. Her ledger is her memory. 
She has brokered deals between people who would have shot each other on sight — 
and usually did, after she'd already been paid and left.`,

    mainFeedMedia: {
      type: 'image',
      url: PLACEHOLDER_WIDE('petra-main'),
      alt: 'Petra Vane — The Broker',
    },

    thumbnailImages: [
      { id: 'petra-t1', url: PLACEHOLDER_IMG('petra-t1'), caption: 'Café' },
      { id: 'petra-t2', url: PLACEHOLDER_IMG('petra-t2'), caption: 'Gallery' },
      { id: 'petra-t3', url: PLACEHOLDER_IMG('petra-t3'), caption: 'Hotel Lobby' },
      { id: 'petra-t4', url: PLACEHOLDER_IMG('petra-t4'), caption: 'Train Car' },
    ],

    assetTrayIcons: [
      { id: 'petra-a1', url: PLACEHOLDER_ICON('petra-icon1'), label: 'Ledger' },
      { id: 'petra-a2', url: PLACEHOLDER_ICON('petra-icon2'), label: 'Signet' },
      { id: 'petra-a3', url: PLACEHOLDER_ICON('petra-icon3'), label: 'Earpiece' },
      { id: 'petra-a4', url: PLACEHOLDER_ICON('petra-icon4'), label: 'Envelope' },
      { id: 'petra-a5', url: PLACEHOLDER_ICON('petra-icon5'), label: 'Compact' },
    ],

    ending: 'good',
    endingMedia: {
      type: 'image',
      url: PLACEHOLDER_WIDE('petra-end-good'),
      alt: 'Petra departs on the night train',
    },
  },

  {
    id: 'rook',
    name: 'Rook Delacey',
    role: 'The Wraith',
    profileImage: PLACEHOLDER_IMG('rook-profile'),
    thumbnailImage: PLACEHOLDER_IMG('rook-thumb'),

    narrativeText: `Rook exists in the margins of surveillance footage — always at the edge 
of frame, face turned away, gone before the timestamp catches up. His only known 
signature is a single playing card left at the scene: the eight of spades. 
Nobody knows why. He might not, either.`,

    mainFeedMedia: {
      type: 'image',
      url: PLACEHOLDER_WIDE('rook-main'),
      alt: 'Rook Delacey — The Wraith',
    },

    thumbnailImages: [
      { id: 'rook-t1', url: PLACEHOLDER_IMG('rook-t1'), caption: 'Casino' },
      { id: 'rook-t2', url: PLACEHOLDER_IMG('rook-t2'), caption: 'Roof' },
      { id: 'rook-t3', url: PLACEHOLDER_IMG('rook-t3'), caption: 'Corridor' },
      { id: 'rook-t4', url: PLACEHOLDER_IMG('rook-t4'), caption: 'Exit' },
    ],

    assetTrayIcons: [
      { id: 'rook-a1', url: PLACEHOLDER_ICON('rook-icon1'), label: 'Card' },
      { id: 'rook-a2', url: PLACEHOLDER_ICON('rook-icon2'), label: 'Wire' },
      { id: 'rook-a3', url: PLACEHOLDER_ICON('rook-icon3'), label: 'Lighter' },
      { id: 'rook-a4', url: PLACEHOLDER_ICON('rook-icon4'), label: 'Monocle' },
      { id: 'rook-a5', url: PLACEHOLDER_ICON('rook-icon5'), label: 'Smoke Can' },
    ],

    ending: 'bad',
    endingMedia: {
      type: 'image',
      url: PLACEHOLDER_WIDE('rook-end-bad'),
      alt: 'Rook identified on security tape',
    },
  },
]

export default characters
