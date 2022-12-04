import * as fs from 'node:fs/promises';

if (process.argv[2])
{
  day2(process.argv[2] || 'data.txt');
}

export default async function day2(target)
{
  const content = await fs.readFile(target);
  /*
        A: 'rock',        X: 'rock',
        B: 'paper',       Y: 'paper',
        C: 'scissors',    Z: 'scissors'
      */

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

  const part1 = content
    .toString()
    .split(/\s*\n\s*/)
    .filter(v => v)
    .map(v => score[v])
    .reduce((a, v) => a + v, 0);

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
  const part2 = content
    .toString()
    .split(/\s*\n\s*/)
    .filter(v => v)
    .map(v => `${v[0]} ${choice[v]}`)
    .map(v => score[v])
    .reduce((a, v) => a + v, 0);

  return { day: 2, part1, part2 };
}
