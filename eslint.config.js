import antfu from '@antfu/eslint-config';

export default antfu({
	stylistic: {
		indent: 'tab',
		semi: true,
		overrides: {
			'curly': ['error', 'all'],
			'style/brace-style': ['error', '1tbs'],
			'test/prefer-lowercase-title': ['error', { ignore: ['describe'] }],
		},
	},

	javascript: {
		overrides: {
			'no-console': 'warn',
		},
	},

	typescript: {
		tsconfigPath: 'tsconfig.json',
	},
});
