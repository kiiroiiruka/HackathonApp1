module.exports = [
    {
        ignores: ['dist'], // 無視するファイル・ディレクトリ
    },
    {
        files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: 'module',
            parser: '@typescript-eslint/parser',
            globals: {
                browser: true,
                node: true,
            },
        },
        plugins: {
            '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
            prettier: require('eslint-plugin-prettier'),
            react: require('eslint-plugin-react'),
            'react-native': require('eslint-plugin-react-native'),
        },
        settings: {
            react: {
                version: 'detect', // Reactバージョンを自動検出
            },
        },
        rules: {
            // ESLint推奨ルール
            ...require('eslint/conf/eslint-recommended').rules,
            // React推奨ルール
            ...require('eslint-plugin-react/configs/recommended').rules,
            // React Nativeルール
            ...require('eslint-plugin-react-native/configs/all').rules,
            // Prettierルール
            'prettier/prettier': 'error',
            // カスタムルール
            'prefer-const': 'error',
            'consistent-return': 'error',
            'prefer-template': 'error',
            'no-multiple-empty-lines': ['error', { max: 2 }],
            'no-mixed-spaces-and-tabs': 'error',
        },
    },
];
