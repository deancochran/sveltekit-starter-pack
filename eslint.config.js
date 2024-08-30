import eslintPrettier from 'eslint-config-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';
export default [
	{
		ignores: [
			'.svelte-kit/*',
			'.vscode/*',
			'.env/*',
			'build/*',
			'cert/*',
			'node_modules/*',
			'static/*'
			// '*config.cjs',
			// '*config.ts',
			// '*typescript-fetch-client/api.ts'
		]
	},
	{ files: ['**/*.{js,mjs,cjs,ts}'] },
	{ languageOptions: { globals: { ...globals.browser, ...globals.node } } },
	// eslint.configs.recommended,
	...tseslint.configs.recommended,
	{
		rules: {
			// camelcase: [
			// 	'error',
			// 	{
			// 		properties: 'never',
			// 		ignoreImports: true,
			// 		ignoreGlobals: true,
			// 		ignoreDestructuring: true
			// 	}
			// ],
			'@typescript-eslint/no-unused-vars': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-empty-object-type': 'off',
			'@typescript-eslint/no-require-imports': 'off'
		}
	},
	eslintPrettier
];
