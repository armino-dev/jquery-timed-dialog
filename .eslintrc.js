module.exports = {
    env: {
        browser: true,
        es6: true,
        jquery: true,
    },
    root: true,
    extends: ['jquery', 'eslint:recommended'],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
        _: 'readonly',
        $: 'readonly',
        jQuery: 'readonly',
    },
    parserOptions: {
        ecmaVersion: 11,
        sourceType: 'module',
    },
    plugins: ['jquery'],
    rules: {
        'global-require': 0,
        'import/no-named-as-default': 0,
        'import/no-named-as-default-member': 0,
        'no-underscore-dangle': 0,
        'no-plusplus': 0,
        'no-console': 0,
    },
    noInlineConfig: false,
    reportUnusedDisableDirectives: true,
};
