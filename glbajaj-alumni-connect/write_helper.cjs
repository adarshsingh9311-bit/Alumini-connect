const fs = require('fs');
const filePath = process.argv[2];
const chunks = [];
process.stdin.on('data', c => chunks.push(c));
process.stdin.on('end', () => {
  fs.writeFileSync(filePath, Buffer.concat(chunks));
  console.log('Successfully written to ' + filePath);
});
