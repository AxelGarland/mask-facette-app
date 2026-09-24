// Everything the poster section needs from you lives here.

// 1. Where inquiries go. Replace with the new address once it exists.
export const CONTACT_EMAIL = 'hello@kindred.example';

// 2. Product facts. Anything in [square brackets] is shown as a placeholder.
export const POSTER_FACTS = [
  { label: 'Price', value: '[Price to be set]' },
  { label: 'Edition', value: '[Edition size to be set]' },
  { label: 'Size', value: '[Sizes to be set]' },
  { label: 'Paper and print', value: '[Paper and print details to be set]' },
];

// 3. The posters. Files live in /public/posters. These ten are stand-ins at
//    842 x 1191 px. Replace each file with the print-resolution export (same
//    filename) and update `width` / `height` if the ratio changes.
export const POSTERS = Array.from({ length: 10 }, (_, i) => {
  const n = String(i + 1).padStart(2, '0');
  return {
    id: `crowd-${n}`,
    name: `Crowd ${n}`,
    src: `/posters/crowd-${n}.png`,
    width: 842,
    height: 1191,
  };
});

// 4. Mockups. Drop images in /public/mockups and add an entry per scene.
//    `slot` says where the poster sits on the mockup image, as percentages of
//    the image: left / top edge of the poster and its width. `rotate` is in
//    degrees. `blend: true` multiplies the poster into the photo so shadows
//    and paper texture show through. Each entry adds a tab to the viewer.
//
//    Example:
//    {
//      id: 'living-room',
//      label: 'Room',
//      src: '/mockups/living-room.jpg',
//      width: 2400, height: 1600,
//      slot: { left: 41.5, top: 12, width: 17, rotate: 0 },
//      blend: true,
//    },
export const MOCKUPS = [];
