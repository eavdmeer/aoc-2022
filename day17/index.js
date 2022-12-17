import * as fs from 'fs/promises';

let doDebug = false;
if (process.argv[2])
{
  doDebug = process.argv[2].includes('example');
  day17(process.argv[2]).then(console.log);
}

function debug(...args)
{
  if (! doDebug) { return; }
  console.log(...args);
}

const EMPTY = '.';
const ROCK = '#';
const NEW = '@';

const w = 7;
const rocks = [
  [ 2, 3, 4, 5 ],
  [ 3, 9, 10, 11, 17 ],
  [ 2, 3, 4, 11, 18 ],
  [ 2, 9, 16, 23 ],
  [ 2, 3, 9, 10 ]
];
debug('rocks', rocks);

function solve(jets, limit)
{
  // Empty board to start with
  const board = [];

  const draw = (current = []) =>
  {
    const max = Math.max(board[0] || 0, Array.from(current).pop() || 0);
    const line = [];
    const lines = [];
    for (let i = 0; i < w * Math.ceil(max / w); i++)
    {
      line.push(current.includes(i) ? NEW :
        board.includes(i) ? ROCK : EMPTY);
      if (i % w === w - 1)
      {
        lines.push(line.join(''));
        line.length = 0;
      }
    }
    console.log(lines.reverse().join('\n'));
  };
  const onBoard = v => board.includes(v);
  const same = (a, b) => a.every((v, i) => b[i] === v);

  const right = rock => rock.some(v => (v + 1) % w === 0) ||
      rock.some(v => onBoard(v + 1)) ?
    Array.from(rock) :
    rock.map(v => v + 1);
  const left = rock => rock.some(v => v % w === 0) ||
      rock.some(v => onBoard(v - 1)) ?
    Array.from(rock) :
    rock.map(v => v - 1);
  const down = rock => rock.some(v => v < w) ||
      rock.some(v => onBoard(v - w)) ?
    Array.from(rock) :
    rock.map(v => v - w);

  let j = 0;
  for (let i = 0; i < limit; i++)
  {
    // Put a new rock on the board
    let rock = rocks[i % rocks.length];
    const maxy = board[0] !== undefined ? 1 + Math.floor(board[0] / w) : 0;

    const offset = w * (maxy + 3);
    rock = rock.map(v => v + offset);
    debug('starting new rock');
    if (doDebug) { draw(rock); }

    /* eslint-disable-next-line no-constant-condition */
    while (true)
    {
      const before = Array.from(rock);
      debug('before:', before);

      // Move with the air jet
      switch (jets[j])
      {
        case '>':
          rock = right(rock);
          break;
        case '<':
          rock = left(rock);
          break;
        default:
      }
      const mid = Array.from(rock);
      if (doDebug)
      {
        debug('bump', jets[j], same(before, mid) ? 'does nothing' : 'done');
        draw(rock);
      }

      // Move down
      debug('move down');
      rock = down(rock);
      if (same(mid, rock)) { debug('unable to move down'); }
      if (doDebug) { draw(rock); }

      debug('after:', rock);

      // Next jet
      j = (j + 1) % jets.length;

      if (same(rock, mid))
      {
        // Add to the board
        debug('placing on the board');
        rock.forEach(v => board.push(v));
        board.push(...rock);
        board.sort((a, b) => b - a);
        debug('board', board);
        if (doDebug) { draw(); }
        break;
      }
    }
  }
  debug('done placing', limit, 'rocks');

  return Math.ceil(board[0] / w);
}

export default async function day17(target)
{
  const start = Date.now();

  const content = await fs.readFile(target);

  const jets = content
    .toString()
    .trim()
    .split('')
    .filter(v => v);
  debug('jets:', jets);

  const max = 2022;

  if (max > 20) { doDebug = false; }

  const part1 = solve(jets, max);

  // const part2 = solve(jets, 1000000000000);
  const part2 = 'todo';

  return { day: 17, part1, part2, duration: Date.now() - start };
}

