/**
 * characters.js — Source of Truth
 * All names, narrative text, and media URLs live here.
 * Swap placeholder values for real content without touching any component.
 */

/** Landing page — looping background video inside the main slot */
export const landingVideoUrl = '/videos/landing-loop.webm'

/** Transition video that plays between Landing and SelectionGrid */
export const transitionVideoUrl = '/videos/intro-transition.webm'

/** Shared ending videos — good end if all 5 assets collected, bad end otherwise */
export const goodEndVideoUrl = '/videos/end-good.webm'
export const badEndVideoUrl  = '/videos/end-bad.webm'

const PLACEHOLDER_IMG  = (seed) => `https://picsum.photos/seed/${seed}/400/400`
const PLACEHOLDER_WIDE = (seed) => `https://picsum.photos/seed/${seed}/800/450`
const PLACEHOLDER_ICON = (seed) => `https://picsum.photos/seed/${seed}/80/80`

/** The five shared evidence assets — same on every character's tray */
export const assetTrayIcons = [
  { id: 'asset-1', url: '/images/asset-clock.png',   label: 'Clock'  },
  { id: 'asset-2', url: '/images/asset-candy.png',   label: 'Candy'  },
  { id: 'asset-3', url: '/images/asset-mask.png',    label: 'Mask'   },
  { id: 'asset-4', url: '/images/asset-phone.png',   label: 'Phone'  },
  { id: 'asset-5', url: '/images/asset-teacup.png',  label: 'Teacup' },
]

export const characters = [
  {
    id: 'stern',
    name: 'Stern Law',
    role: 'The Architect',
    profileImage: '/images/stern-profile.png',
    thumbnailImage: '/images/stern-thumb.png',
    previewVideo: '/videos/stern-preview.webm',
    decorativeVideo: '/videos/stern-deco-loop.webm',

    narrativeText: `Suddenly understood. Urgency. Chasing my target, but what was it?`,

    mainFeedMedia: {
      type: 'video',
      url: '/videos/stern-main.webm',
      alt: 'Stern Law — The Architect',
    },

    thumbnailImages: [
      { id: 'stern-t1', type: 'video', url: '/videos/stern-t1.webm', caption: 'Site 7' },
      { id: 'stern-t2', type: 'video', url: '/videos/stern-t2.webm', caption: 'The Vault' },
      { id: 'stern-t3', type: 'video', url: '/videos/stern-t3.webm', caption: 'North Gate' },
      { id: 'stern-t4', type: 'video', url: '/videos/stern-t4.webm', caption: 'Substation' },
    ],

    unlocksAssetIndex: 0,

    ending: 'good',
    endingMedia: {
      type: 'image',
      url: PLACEHOLDER_WIDE('stern-end-good'),
      alt: 'Stern walks free',
    },
  },

  {
    id: 'slink',
    name: 'Sly & Flash Slink',
    role: 'The Fixer',
    profileAspectClass: 'aspect-[4/3]',
    profileImage: '/images/slink-profile.png',
    thumbnailImage: '/images/slink-thumb.png',
    previewVideo: '/videos/slink-preview.webm',
    decorativeVideo: '/videos/slink-deco-loop.webm',

    narrativeText: `So close. Stealing in secret, then looting in the open. Fighting over a bag of sugar... was it that important?`,

    mainFeedMedia: {
      type: 'video',
      url: '/videos/slink-main.webm',
      alt: 'Sly & Flash Slink — The Fixer',
    },

    thumbnailImages: [
      { id: 'slink-t1', type: 'video', url: '/videos/slink-t1.webm', caption: 'Garage' },
      { id: 'slink-t2', type: 'video', url: '/videos/slink-t2.webm', caption: 'The Docks' },
      { id: 'slink-t3', type: 'video', url: '/videos/slink-t3.webm', caption: 'Pawn Shop' },
      { id: 'slink-t4', type: 'video', url: '/videos/slink-t4.webm', caption: 'Rooftop' },
    ],

    unlocksAssetIndex: 1,

    ending: 'bad',
    endingMedia: {
      type: 'image',
      url: PLACEHOLDER_WIDE('slink-end-bad'),
      alt: 'Slink caught at the docks',
    },
  },

  {
    id: 'meek',
    name: 'Meek Gore',
    role: 'The Muscle',
    profileImage: '/images/meek-profile.png',
    thumbnailImage: '/images/meek-thumb.png',
    previewVideo: '/videos/meek-preview.webm',
    decorativeVideo: '/videos/meek-deco-loop.webm',

    narrativeText: `A red stain that won't stop spreading, but the clock won't turn back. I am trapped in the After.`,

    mainFeedMedia: {
      type: 'video',
      url: '/videos/meek-main.webm',
      alt: 'Meek Gore — The Muscle',
    },

    thumbnailImages: [
      { id: 'meek-t1', type: 'video', url: '/videos/meek-t1.webm', caption: 'Gym' },
      { id: 'meek-t2', type: 'video', url: '/videos/meek-t2.webm', caption: 'Checkpoint' },
      { id: 'meek-t3', type: 'video', url: '/videos/meek-t3.webm', caption: 'Warehouse' },
      { id: 'meek-t4', type: 'video', url: '/videos/meek-t4.webm', caption: 'Alley' },
    ],

    unlocksAssetIndex: 2,

    ending: 'bad',
    endingMedia: {
      type: 'image',
      url: PLACEHOLDER_WIDE('meek-end-bad'),
      alt: 'Meek cornered in the warehouse',
    },
  },

  {
    id: 'odd',
    name: 'Odd Hop',
    role: 'The Broker',
    profileImage: '/images/odd-profile.png',
    thumbnailImage: '/images/odd-thumb.png',
    previewVideo: '/videos/odd-preview.webm',
    decorativeVideo: '/videos/odd-deco-loop.webm',

    narrativeText: `Castle becomes forest. Turned around, a crowd was speaking to me at once.
`,

    mainFeedMedia: {
      type: 'video',
      url: '/videos/odd-main.webm',
      alt: 'Odd Hop — The Broker',
    },

    thumbnailImages: [
      { id: 'odd-t1', type: 'video', url: '/videos/odd-t1.webm', caption: 'Café' },
      { id: 'odd-t2', type: 'video', url: '/videos/odd-t2.webm', caption: 'Gallery' },
      { id: 'odd-t3', type: 'video', url: '/videos/odd-t3.webm', caption: 'Hotel Lobby' },
      { id: 'odd-t4', type: 'video', url: '/videos/odd-t4.webm', caption: 'Train Car' },
    ],

    unlocksAssetIndex: 3,

    ending: 'good',
    endingMedia: {
      type: 'image',
      url: PLACEHOLDER_WIDE('odd-end-good'),
      alt: 'Odd departs on the night train',
    },
  },

  {
    id: 'drowse',
    name: 'Drowse Heal',
    role: 'The Wraith',
    profileImage: '/images/drowse-profile.png',
    thumbnailImage: '/images/drowse-thumb.png',
    previewVideo: '/videos/drowse-preview.webm',
    decorativeVideo: '/videos/drowse-deco-loop.webm',

    narrativeText: `Floating, detached. Something happens nearby, but I refuse to turn my head.`,

    mainFeedMedia: {
      type: 'video',
      url: '/videos/drowse-main.webm',
      alt: 'Drowse Heal — The Wraith',
    },

    thumbnailImages: [
      { id: 'drowse-t1', type: 'video', url: '/videos/drowse-t1.webm', caption: 'Casino' },
      { id: 'drowse-t2', type: 'video', url: '/videos/drowse-t2.webm', caption: 'Roof' },
      { id: 'drowse-t3', type: 'video', url: '/videos/drowse-t3.webm', caption: 'Corridor' },
      { id: 'drowse-t4', type: 'video', url: '/videos/drowse-t4.webm', caption: 'Exit' },
    ],

    unlocksAssetIndex: 4,

    ending: 'bad',
    endingMedia: {
      type: 'image',
      url: PLACEHOLDER_WIDE('drowse-end-bad'),
      alt: 'Drowse identified on security tape',
    },
  },
]

export default characters
