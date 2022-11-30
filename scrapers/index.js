require('child_process').execSync('node omniunits/raw.js', {
    stdio: 'inherit'
});
require('child_process').execSync('node dbbs/raw.js', {
    stdio: 'inherit'
});