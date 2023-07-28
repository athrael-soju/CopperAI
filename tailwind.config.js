/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        // Color Palette 419: A beautiful combination of dark and light shades of green, off-white, and deep brown colors.
        palette419_1: '#130c0e',
        palette419_2: '#31282b',
        palette419_3: '#84a07c',
        palette419_4: '#c3d8d2',
        palette419_5: '#f4f4f2',

        // Colors from Color Palette 2130
        palette2130_1: '#2e3a23',
        palette2130_2: '#495e5d',
        palette2130_3: '#92a295',
        palette2130_4: '#e0eee2',
        palette2130_5: '#ffffff',

        // Colors from Color Palette 4341
        palette4341_1: '#1a2634',
        palette4341_2: '#534847',
        palette4341_3: '#a37774',
        palette4341_4: '#eab89f',
        palette4341_5: '#e7d5c7',

        // Color Palette #3438: A sophisticated and simple gamma combines brown, smoothly turning into beige and cream, with sky blue
        palette3438_1: '#1c0f0b',
        palette3438_2: '#ab6e50',
        palette3438_3: '#e4b18e',
        palette3438_4: '#fff5e7',
        palette3438_5: '#e9f3fb',

        // Colors from Color Palette 2564 - Pleasant and calm color gamma
        palette2564_1: '#50423d',
        palette2564_2: '#8d7361',
        palette2564_3: '#c9bbae',
        palette2564_4: '#eeebe7',
        palette2564_5: '#8b8da0',

        // Colors from Color Palette 1770 - The colours of this palette are very noble
        palette1770_1: '#866a67',
        palette1770_2: '#9a9385',
        palette1770_3: '#c5bfa7',
        palette1770_4: '#e6dbc8',
        palette1770_5: '#4e5560',

        // Colors from Color Palette 741 - This is a monochrome brown palette
        palette741_1: '#f7f3f4',
        palette741_2: '#c18d7f',
        palette741_3: '#9a784a',
        palette741_4: '#5b3511',
        palette741_5: '#310401',

        // Colors from Color Palette 1647 - This palette is based on a combination of late autumn shades
        palette1647_1: '#f3d8a0',
        palette1647_2: '#d8b67d',
        palette1647_3: '#ae7954',
        palette1647_4: '#7f432f',
        palette1647_5: '#261b17',

        // Colors from Color Palette 1742 - Colour of blue water in combination with shades of brown
        palette1742_1: '#205b6c',
        palette1742_2: '#b3b192',
        palette1742_3: '#d5bb96',
        palette1742_4: '#957748',
        palette1742_5: '#4f422d',

        // Colors from Color Palette 3182 - The monochrome range, consisting of eye-pleasing shades of brown
        palette3182_1: '#3c240d',
        palette3182_2: '#624a2d',
        palette3182_3: '#8d7053',
        palette3182_4: '#c8bcb1',
        palette3182_5: '#e4dacf',

        // Colors from Color Palette 1042 - This calm palette is full of shades of brown
        palette1042_1: '#433512',
        palette1042_2: '#927D4E',
        palette1042_3: '#ECDDB6',
        palette1042_4: '#CA9A4E',
        palette1042_5: '#7D2A0C',
      },
    },
  },
  variants: {},
  plugins: [],
};
