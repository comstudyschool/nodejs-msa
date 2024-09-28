const fs = require('fs');

// 파일 읽기 (비동기)
fs.readFile('example.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
  console.log('2. File content:', data);
});

console.log('1. This message appears before the file is read.');
