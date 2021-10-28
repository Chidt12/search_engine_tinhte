module.exports = {
    purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        screens: {
            'xs': '468px',

            'sm': '640px',
            // => @media (min-width: 640px) { ... }

            'md': '768px',
            // => @media (min-width: 768px) { ... }

            'xmd': '867px',
            'semi-md': '960px',

            'lg': '1094px',
            // => @media (min-width: 1024px) { ... }
            'semi-lg': '1200px',

            'xl': '1280px',
            // => @media (min-width: 1280px) { ... }

            '2xl': '1536px',
            // => @media (min-width: 1536px) { ... }
        }
    },
    variants: {
        extend: {
            inset: ['hover', 'focus'],
            textColor: ['active']
        },
    },
    plugins: [
        require('@tailwindcss/line-clamp')
    ],
}