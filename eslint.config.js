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
            // 必要なルールを手動で定義
            'no-unused-vars': 'warn',
            'no-undef': 'error',
            'react/prop-types': 'off',
            'react/react-in-jsx-scope': 'off',
            'react-native/no-unused-styles': 'warn',
            'react-native/split-platform-components': 'warn',
            'react-native/no-inline-styles': 'warn',
            'react-native/no-color-literals': 'warn',
            'prettier/prettier': 'error', // Prettierルールを適用
            // カスタムルール
            'prefer-const': 'error',
            'consistent-return': 'error',
            'prefer-template': 'error',
            'no-multiple-empty-lines': ['error', { max: 2 }],
            'no-mixed-spaces-and-tabs': 'error',
        },
    },
];
