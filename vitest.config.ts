import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		environment: 'node',
		globals: true,
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './app'),
			'@middlewares': path.resolve(__dirname, './app/assets'),
			'@utils': path.resolve(__dirname, './app/utils'),
			'@validationSchemas': path.resolve(
				__dirname,
				'./app/validationSchemas'
			),
			'@customTypes': path.resolve(__dirname, './app/types'),
		},
	},
});
