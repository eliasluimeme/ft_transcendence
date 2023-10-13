import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-floor':
          'linear-gradient(90deg, rgba(126, 130, 135, 0.44) 2.64%, rgba(66, 69, 73, 0.00) 102.5%)',
          'gradient-floor-rev':
          'linear-gradient(-90deg, rgba(126, 130, 135, 0.44) 2.64%, rgba(66, 69, 73, 0.00) 102.5%)'
    },
  },
  },
  plugins: [],
}
export default config
