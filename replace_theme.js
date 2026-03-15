const fs = require('fs');
const path = require('path');

function replaceTokens(filePath) {
  if (!fs.existsSync(filePath)) {
    console.warn('File not found:', filePath);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/blue-/g, 'violet-');
  content = content.replace(/#135bec/g, '#7c3aed');
  fs.writeFileSync(filePath, content);
  console.log('Updated ' + filePath);
}

const files = [
  'civix-app/src/index.css',
  'civix-app/src/pages/TrendingMapPage.tsx',
  'civix-app/src/pages/SignupPage.tsx',
  'civix-app/src/pages/ReportIssuePage.tsx',
  'civix-app/src/pages/ProfilePage.tsx',
  'civix-app/src/pages/LoginPage.tsx',
  'civix-app/src/pages/HomeFeed.tsx',
  'civix-app/src/pages/EditReportPage.tsx',
  'civix-app/src/components/FeedItem.tsx',
  'civix-app/src/components/MapComponents.tsx'
];

files.forEach(f => replaceTokens(path.join(__dirname, f)));
