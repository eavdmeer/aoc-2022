const fs = require('fs');

const input = process.argv[2] || 'data.txt';

fs.readFile(input, (err, content) =>
{
  if (err)
  {
    console.log(err.message);
    return;
  }

  const score = {
    'A X': 3 + 1,
    'A Y': 6 + 2,
    'A Z': 0 + 3,

    'B X': 0 + 1,
    'B Y': 3 + 2,
    'B Z': 6 + 3,

    'C X': 6 + 1,
    'C Y': 0 + 2,
    'C Z': 3 + 3
  };

  console.log('part1:',
    content
      .toString()
      .split(/\s*\n\s*/)
      .filter(v => v)
      .map(v => score[v])
      .reduce((a, v) => a + v, 0)
  );

  /*
    A: 'rock',        X: 'rock',
    B: 'paper',       Y: 'paper',
    C: 'scissors',    Z: 'scissors'
  */

  // X means you need to lose,
  // Y means you need to end the round in a draw,
  // and Z means you need to win
  const choice = {
    'A X': 'Z',
    'A Y': 'X',
    'A Z': 'Y',

    'B X': 'X',
    'B Y': 'Y',
    'B Z': 'Z',

    'C X': 'Y',
    'C Y': 'Z',
    'C Z': 'X'
  };
  console.log('part1:',
    content
      .toString()
      .split(/\s*\n\s*/)
      .filter(v => v)
      .map(v => `${v[0]} ${choice[v]}`)
      .map(v => score[v])
      .reduce((a, v) => a + v, 0)
  );
});
