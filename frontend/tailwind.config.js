/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Outfit', 'sans-serif'],
            },
            colors: {
                dark: {
                    900: '#111827', // Gray 900
                    800: '#1F2937', // Gray 800
                    700: '#374151', // Gray 700
                },
                accent: {
                    purple: '#8b5cf6',
                    blue: '#3b82f6',
                }
            }
        },
    },
    plugins: [],
}
