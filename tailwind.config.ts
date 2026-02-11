import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary Dark Palette — oklch for opacity modifier support
        'void-black': 'oklch(0.07 0.01 285)',
        'deep-space': 'oklch(0.13 0.01 285)',
        'slate-shadow': 'oklch(0.18 0.01 285)',

        // Neon Accents
        'cyber-cyan': 'oklch(0.81 0.17 200)',
        'electric-blue': 'oklch(0.62 0.18 260)',
        'neon-green': 'oklch(0.87 0.25 160)',
        'plasma-purple': 'oklch(0.56 0.24 295)',
        'volt-yellow': 'oklch(0.83 0.15 85)',
        'alert-red': 'oklch(0.58 0.22 27)',

        // Neutral Grays
        'ghost-gray': 'oklch(0.44 0.02 260)',
        'steel-gray': 'oklch(0.70 0.01 260)',
        'bright-gray': 'oklch(0.92 0.01 260)',
      },
      fontFamily: {
        orbitron: ['Orbitron', 'Rajdhani', 'Exo 2', 'sans-serif'],
        inter: ['Inter', 'Roboto', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'neon-cyan': '0 0 20px rgba(0, 217, 255, 0.4)',
        'neon-cyan-lg': '0 0 30px rgba(0, 217, 255, 0.7)',
        'neon-green': '0 0 15px rgba(0, 255, 136, 0.3)',
        'neon-red': '0 0 15px rgba(239, 68, 68, 0.4)',
        card: '0 8px 32px rgba(0, 0, 0, 0.4)',
      },
      backgroundImage: {
        'grid-pattern':
          'linear-gradient(rgba(0, 217, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 217, 255, 0.05) 1px, transparent 1px)',
        'gradient-primary': 'linear-gradient(135deg, #3b82f6 0%, #00d9ff 100%)',
        'gradient-genesis': 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
        'gradient-mining': 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
        'gradient-invalid': 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
      },
      backgroundSize: {
        grid: '20px 20px',
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shake: 'shake 0.4s cubic-bezier(.36,.07,.19,.97) both',
      },
      keyframes: {
        shake: {
          '10%, 90%': { transform: 'translateX(-2px)' },
          '20%, 80%': { transform: 'translateX(4px)' },
          '30%, 50%, 70%': { transform: 'translateX(-6px)' },
          '40%, 60%': { transform: 'translateX(6px)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
