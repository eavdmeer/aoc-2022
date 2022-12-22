import * as fs from 'fs/promises';
import { gcd } from '../lib/lcm.js';

/* eslint max-statements-per-line: ["error", { "max": 4 }] */
/* eslint-disable no-constant-condition */

let doDebug = false;
if (process.argv[2])
{
  doDebug = process.argv[2].includes('example');
  day22(process.argv[2]).then(console.log);
}

function debug(...args)
{
  if (! doDebug) { return; }
  console.log(...args);
}

const rotate = {
  r: v => { const t = v.x; v.x = -v.y; v.y = t; return v; },
  l: v => { const t = v.x; v.x = v.y; v.y = -t; return v; }
};

const score = (pos, vector) =>
{
  /*
   Facing is:
     0 for right (>),
     1 for down (v),
     2 for left (<),
     and 3 for up (^).
   The final password is the sum of 1000 times the row, 4 times the
   column, and the facing
   */

  const vscore = ({ x, y }) =>
  {
    switch (`${x},${y}`)
    {
      case '1,0': return 0;
      case '0,1': return 1;
      case '-1,0': return 2;
      case '0,-1': return 3;
      default: return 0;
    }
  };

  return 1000 * (pos.y + 1) + 4 * (pos.x + 1) + vscore(vector);
};

function solve1M2(grid, moves)
{
  let c = 0;
  let r = 0;
  let dr = 0;
  let dc = 1;

  const width = Math.max(...grid.map(v => v.length));
  const height = grid.length;

  grid.forEach((row, i) => grid[i] = row.padEnd(width));

  while (grid[r].charAt(c) !== '.') { c++; }
  debug('starting in', c, r);

  moves.forEach(move =>
  {
    if (isNaN(move))
    {
      if (move === 'r') { const t = dr; dr = dc; dc = -t; }
      if (move === 'l') { const t = dr; dr = -dc; dc = t; }
      return;
    }
    for (let i = 0; i < move; i++)
    {
      let nr = r;
      let nc = c;
      while (true)
      {
        nr = (nr + dr) % height;
        nc = (nc + dc) % width;
        if (grid[nr].charAt(nc) !== ' ') { break; }
      }
      if (grid[nr].charAt(nc) === '#') { break; }
      c = nc;
      r = nr;
    }
  });
  debug('ending in', c, r);

  return score({ x: c, y: r }, { x: dc, y: dr });
}

function solve1(board, moves, method = 1)
{
  if (method === 2) { return solve1M2(board, moves); }
  // Initial position
  const pos = { x: board[0].indexOf('.'), y: 0 };
  debug('pos:', pos);

  // Initial vector
  const vector = { x: 1, y: 0 };
  debug('vector:', vector);

  const width = board.reduce((a, v) => v.length > a ? v.length : a, 0);
  const height = board.length;
  debug('width:', width, 'height:', height);

  moves.forEach(m =>
  {
    if (isNaN(m)) { rotate[m](vector); }
    else
    {
      for (let i = 0; i < m; i++)
      {
        const np = { x: pos.x + vector.x, y: pos.y + vector.y };

        // handle overflow
        const ch = board[np.y]?.charAt(np.x);
        if (ch === ' ' || ch === '' || ch === undefined)
        {
          const search = {
            x: vector.x === 0 ? 0 : vector.x > 0 ? -1 : 1,
            y: vector.y === 0 ? 0 : vector.y > 0 ? -1 : 1
          };
          let p = board[np.y + search.y]?.charAt(np.x + search.x);
          while (p && p !== ' ')
          {
            debug('char is', JSON.stringify(p), 'keep searching');
            np.x += search.x;
            np.y += search.y;
            p = board[np.y + search.y]?.charAt(np.x + search.x);
          }
        }

        if (board[np.y]?.charAt(np.x) === '#') { break; }

        pos.x = np.x; pos.y = np.y;
      }
    }
  });
  debug('all moves done', pos);

  return score(pos, vector);
}

function solve2()
{
  return 'todo';
}

export default async function day22(target)
{
  const start = Date.now();
  debug('starting');

  const content = await fs.readFile(target);

  /* eslint-disable no-shadow */
  const data = content
    .toString()
    .split(/\s*\n/)
    .filter(v => v);
  /* eslint-enable no-shadow */

  const instructions = data.pop().match(/\d+|[LR]/g)
    .map(v => isNaN(v) ? v.toLowerCase() : parseInt(v, 10));
  debug('instructions:', instructions);

  debug('data', data);

  const part1 = solve1(data, instructions, 2);
  if (target.includes('example') && part1 !== 6032)
  {
    throw new Error(`Invalid solution: ${part1}. Expecting; 6032`);
  }

  const part2 = solve2(data, instructions);
  if (target.includes('example') && part2 !== 'todo')
  {
    throw new Error(`Invalid solution: ${part1}. Expecting; 5031`);
  }

  return { day: 22, part1, part2, duration: Date.now() - start };
}
