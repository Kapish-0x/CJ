import readline from 'readline';

const rl = readline.createInterface({ input: process.stdin });
const lines = [];
rl.on('line', line => lines.push(line.trim()));
rl.on('close', () => {
  const str = lines[0];        // input string
  const reversed = str.split('').reverse().join('');
  console.log(reversed);       // output reversed string
});
