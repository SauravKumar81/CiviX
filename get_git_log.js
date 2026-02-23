const { execSync } = require('child_process');
const output = execSync('git log --format="%H %s" -n 10').toString();
require('fs').writeFileSync('gitlog.json', JSON.stringify({ log: output }));
