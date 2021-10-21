module.exports = {
  purge: [
    './src/**/*.html',
    './src/**/*.vue',
    './src/**/*.jsx',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    inset:{
      '0': 0,
      auto: 'auto',
    },
    fontSize: {
      xxs: ['9px', '12px'],
      xs: ['12px', '12px'],
      sm: ['16px', '20px'],
      md: ['18px', '24px'],
      lg: ['18px', '28px'],
      xl: ['26px', '32px'],
      xxl: ['30px', '32px'],
      txs: ['10px', '14px'],
      tsm: ['14px', '20px'],
      tmd: ['16px', '24px'],
      tlg: ['15px', '22px'],
      txl: ['23px', '26px'],
    },
    extend: {
      margin: {
        '18': '4.5rem',
        '15':'3.75rem'
       },
      width:{
        '18': '90px',
        '5/10' : '50%',
        '6/10' : '60%',
        'popup' : '900px'
      },
      colors:{
        gray:{
          primary: '#444444'
        },
        blue:{
          primary:'#306eb5',
          link: '#3B82F6'
        },
        red:{
          primary: '#dc3545'
        }
      },
      screens: {
        'tsm': '768px',
      }
    },
  },
  variants: {
    extend: {
      fontWeight: ['hover', 'focus'],
      opacity: ['disabled'],
    },
  },
  plugins: [],
}
