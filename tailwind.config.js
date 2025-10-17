/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  content: [
    './app/components/**/*.{vue,js,ts}',
    './app/pages/**/*.vue',
    './app/layouts/**/*.vue',
    './app/plugins/**/*.{js,ts}',
    './app/app.vue',
    './app/error.vue'
  ],
  theme: {
    extend: {
      colors: {
        // Design System AFAAS - Paleta Minimalista
        // Inspirada em plantas medicinais e terapias holísticas
        
        // Cores principais - Verde natural e suave
        primary: {
          50: '#f0f9f4',
          100: '#dcf2e4',
          200: '#bae5cd',
          300: '#8bd2ad',
          400: '#5ab889',
          500: '#3a9d6d',  // cor principal
          600: '#2a7d56',
          700: '#226547',
          800: '#1d503a',
          900: '#194231',
          950: '#0c251b'
        },
        
        // Secundária - Tom terroso/argila
        secondary: {
          50: '#f9f7f4',
          100: '#f1ede5',
          200: '#e3dac9',
          300: '#d0c0a6',
          400: '#bca384',
          500: '#a88968',
          600: '#8f6f56',
          700: '#765a48',
          800: '#624b3e',
          900: '#534136',
          950: '#2d221c'
        },
        
        // Neutros - Cinzas suaves com leve tom verde
        neutral: {
          50: '#f8f9f8',
          100: '#f0f2f1',
          200: '#e2e6e4',
          300: '#ccd3cf',
          400: '#acb6b1',
          500: '#8a9790',
          600: '#6f7c76',
          700: '#5c6661',
          800: '#4d5551',
          900: '#424745',
          950: '#262928'
        },
        
        // Cores semânticas
        success: {
          light: '#dcf2e4',
          DEFAULT: '#3a9d6d',
          dark: '#226547'
        },
        warning: {
          light: '#fef3c7',
          DEFAULT: '#d97706',
          dark: '#92400e'
        },
        danger: {
          light: '#fee2e2',
          DEFAULT: '#dc2626',
          dark: '#991b1b'
        },
        info: {
          light: '#dbeafe',
          DEFAULT: '#3b82f6',
          dark: '#1e40af'
        },
        
        // Tokens semânticos para o sistema
        brand: {
          DEFAULT: '#3a9d6d',
          light: '#5ab889',
          dark: '#2a7d56',
          foreground: '#ffffff'
        },
        surface: {
          DEFAULT: '#ffffff',
          muted: '#f8f9f8',
          elevated: '#ffffff',
          overlay: 'rgba(0, 0, 0, 0.5)'
        },
        border: {
          DEFAULT: '#e2e6e4',
          light: '#f0f2f1',
          strong: '#ccd3cf'
        },
        text: {
          DEFAULT: '#262928',
          muted: '#6f7c76',
          light: '#8a9790',
          inverted: '#ffffff',
          brand: '#3a9d6d'
        }
      },
      
      // Espaçamentos e dimensões
      spacing: {
        18: '4.5rem',
        88: '22rem',
        128: '32rem'
      },
      
      // Raios de borda - suaves e consistentes
      borderRadius: {
        sm: '0.25rem',    // 4px
        DEFAULT: '0.5rem', // 8px
        md: '0.5rem',      // 8px
        lg: '0.75rem',     // 12px
        xl: '1rem',        // 16px
        '2xl': '1.25rem',  // 20px
        '3xl': '1.5rem'    // 24px
      },
      
      // Tipografia
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Consolas', 'monospace']
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],      // 12px
        sm: ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
        base: ['1rem', { lineHeight: '1.5rem' }],     // 16px
        lg: ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
        xl: ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem' }],    // 24px
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],   // 36px
        '5xl': ['3rem', { lineHeight: '1' }]            // 48px
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700'
      },
      
      // Sombras - sutis e naturais
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.08)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.08)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.08)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.08)',
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.08)',
        elevated: '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.08)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
        none: 'none'
      },
      
      // Transições
      transitionDuration: {
        DEFAULT: '200ms',
        fast: '150ms',
        slow: '300ms'
      },
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
        bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
      },
      
      // Opacidades
      opacity: {
        3: '0.03',
        7: '0.07',
        15: '0.15'
      }
    }
  },
  plugins: []
}

