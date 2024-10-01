/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontSize: {
				sm: ['16px', '18px'],
				base: ['18px', '20px'],
        lg: ['20px', '22px'],
        xl: ['22px', '24px'],
			},
			colors: {
				lavender: '#fdf0f5',
				strongpink: '#e32a6d',
				crimson: '#bc1150',
				garnet: '#42091e'
			}
		}
	},
	plugins: []
};
