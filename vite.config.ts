import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path';
import mkcert from 'vite-plugin-mkcert';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
	    template: {
		    compilerOptions: {
			    isCustomElement: tag => tag === 'iconify-icon', // Set the 'iconify-icon' tag as a web component
		    },
	    },
    }),
	  mkcert(), // Use mkcert for enabling HTTPS in localhost
  ],
	
	resolve: {
		alias: {
			'~': resolve(__dirname, 'src'), // Set an alias for the 'src' directory
			'@': resolve(__dirname, 'src'), // Set an alias for the 'src' directory
		},
	},
})
