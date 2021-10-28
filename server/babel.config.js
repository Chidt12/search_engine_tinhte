module.exports = {
    plugins: [
        ['module-resolver', {
            'root': ['./dist'],
            'alias': {
                '@': './',
                '@packages': './packages',
                '@loaders': './loaders',
                '@models': './models',
                '@api': './api'
            }
        }]
    ],
};