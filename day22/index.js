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
  r: v => { [ v.x, v.y ] = [ -v.y, v.x ]; return v; },
  l: v => { [ v.x, v.y ] = [ v.y, -v.x ]; return v; }
};

// JavaScript % operator is kinda weird. -2 % 10 => -2
const posmod = (v, n) => (v % n + n) % n;

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
      if (move === 'r') { [ dr, dc ] = [ dc, -dr ]; }
      if (move === 'l') { [ dr, dc ] = [ -dc, dr ]; }
      return;
    }
    for (let i = 0; i < move; i++)
    {
      let nr = r;
      let nc = c;
      while (true)
      {
        nr = posmod(nr + dr, height);
        nc = posmod(nc + dc, width);
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

function solve2(grid, moves)
{
  // Get cube dimensions
  const shape = [];
  grid.forEach(v =>
  {
    if (v.trim().length !== shape[shape.length - 1])
    {
      shape.push(v.trim().length);
    }
  });
  const cubeSize = gcd(...shape);
  debug('cube characteristics: size:', cubeSize, 'shape:', shape);

  let c = 0;
  let r = 0;
  let dr = 0;
  let dc = 1;

  const width = Math.max(...grid.map(v => v.length));

  grid.forEach((row, i) => grid[i] = row.padEnd(width));

  while (grid[r].charAt(c) !== '.') { c++; }
  debug('starting in', c, r);

  moves.forEach(move =>
  {
    if (isNaN(move))
    {
      console.log('at', c, r, 'rotate', move.toUpperCase());
      if (move === 'r') { [ dr, dc ] = [ dc, -dr ]; }
      if (move === 'l') { [ dr, dc ] = [ -dc, dr ]; }
      return;
    }
    for (let i = 0; i < move; i++)
    {
      console.log('from', c, r, 'move', dc, dr, 'steps:', move);

      // New location
      let nc = c + dc;
      let nr = r + dr;

      console.log('    try new location', nc, nr);

      // Possibly new direction
      let ndc = dc;
      let ndr = dr;

      if (nr < 0 && nc >= 50 <= nc < 100 && ndr === -1)
      {
        console.log('case-a');
        [ ndr, ndc ] = [ 0, 1 ];
        [ nr, nc ] = [ nc + 100, 0 ];
      }
      else if (nc < 0 && nr >= 150 <= nr < 200 && ndc === -1)
      {
        console.log('case-b');
        [ ndr, ndc ] = [ 1, 0 ];
        [ nr, nc ] = [ 0, nr - 100 ];
      }
      else if (nr < 0 && nc >= 100 <= nc < 150 && ndr === -1)
      {
        console.log('case-c');
        [ nr, nc ] = [ 199, nc - 100 ];
      }
      else if (nr >= 200 && nc >= 0 <= nc < 50 && ndr === 1)
      {
        console.log('case-d');
        [ nr, nc ] = [ 0, nc + 100 ];
      }
      else if (nc >= 150 && nr >= 0 <= nr < 50 && ndc === 1)
      {
        console.log('case-e');
        ndc = -1;
        [ nr, nc ] = [ 149 - nr, 99 ];
      }
      else if (nc === 100 && nr >= 100 <= nr < 150 && ndc === 1)
      {
        console.log('case-f');
        ndc = -1;
        [ nr, nc ] = [ 149 - nr, 149 ];
      }
      else if (nr === 50 && nc >= 100 <= nc < 150 && ndr === 1)
      {
        console.log('case-g');
        [ ndr, ndc ] = [ 0, -1 ];
        [ nr, nc ] = [ nc - 50, 99 ];
      }
      else if (nc === 100 && nr >= 50 <= nr < 100 && ndc === 1)
      {
        console.log('case-h');
        [ ndr, ndc ] = [ -1, 0 ];
        [ nr, nc ] = [ 49, nr + 50 ];
      }
      else if (nr === 150 && nc >= 50 <= nc < 100 && ndr === 1)
      {
        console.log('case-i');
        [ ndr, ndc ] = [ 0, -1 ];
        [ nr, nc ] = [ nc + 100, 49 ];
      }
      else if (nc === 50 && nr >= 150 <= nr < 200 && ndc === 1)
      {
        console.log('case-j');
        [ ndr, ndc ] = [ -1, 0 ];
        [ nr, nc ] = [ 149, nr - 100 ];
      }
      else if (nr === 99 && nc >= 0 <= nc < 50 && ndr === -1)
      {
        console.log('case-k');
        [ ndr, ndc ] = [ 0, 1 ];
        [ nr, nc ] = [ nc + 50, 50 ];
      }
      else if (nc === 49 && nr >= 50 <= nr < 100 && ndc === -1)
      {
        console.log('case-l');
        [ ndr, ndc ] = [ 1, 0 ];
        [ nr, nc ] = [ 100, nr - 50 ];
      }
      else if (nc === 49 && nr >= 0 <= nr < 50 && ndc === -1)
      {
        console.log('case-m');
        ndc = 1;
        [ nr, nc ] = [ 149 - nr, 0 ];
      }
      else if (nc < 0 && nr >= 100 <= nr < 150 && ndc === -1)
      {
        console.log('case-n');
        ndc = 1;
        [ nr, nc ] = [ 149 - nr, 50 ];
      }

      if (grid[nr].charAt(nc) === '#')
      {
        console.log('    blocked');
        break;
      }

      // Use new prosition and direction
      c = nc;
      r = nr;
      dc = ndc;
      dr = ndr;
      console.log('    final:', c, r, 'dir:', dc, dr);
    }
  });
  debug('ending in', c, r);

  return score({ x: c, y: r }, { x: dc, y: dr });
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

  // This solution will not work on the example!
  doDebug = true;
  const part2 = target.includes('a') ? 'todo' :
    solve2(data, instructions);
  if (target.includes('example') && part2 !== 'todo')
  {
    throw new Error(`Invalid solution: ${part1}. Expecting; 5031`);
  }

  return { day: 22, part1, part2, duration: Date.now() - start };
}
