const path = require('path');

module.exports = {
        entry: './src/timed-dialog.js',
        output: {
            filename: 'timed-dialog.min.js',
            path: path.resolve(__dirname, 'dist'),
        }
};
