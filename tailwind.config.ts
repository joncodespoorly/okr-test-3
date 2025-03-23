import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#3D9970',
        'primary-foreground': '#FFFFFF',
        secondary: '#39CCCC',
        'secondary-foreground': '#FFFFFF',
        destructive: '#FF4136',
        'destructive-foreground': '#FFFFFF',
        background: '#0E1116',
        foreground: '#FFFFFF',
        card: '#1A1E23',
        'card-foreground': '#FFFFFF',
        border: 'rgba(255, 255, 255, 0.1)',
        input: 'rgba(255, 255, 255, 0.1)',
        ring: '#3D9970',
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem',
      },
    },
  },
  plugins: [],
};

export default config; 