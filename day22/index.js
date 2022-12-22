import * as fs from 'fs/promises';
import { gcd } from '../lib/lcm.js';

/* eslint max-statements-per-line: ["error", { "max": 4 }] */

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

function solve1(board, moves)
{
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
    debug('move', m, 'pos:', pos, 'vector:', vector);
    if (isNaN(m)) { rotate[m](vector); }
    else
    {
      for (let i = 0; i < m; i++)
      {
        debug('  step', i + 1, 'pos:', pos, 'vector:', vector);
        const np = {
          x: pos.x + vector.x,
          y: pos.y + vector.y
        };
        let ch = board[np.y]?.charAt(np.x);
        debug('   new pos:', np, 'char:', JSON.stringify(ch));

        // handle overflow
        if (ch === ' ' || ch === '' || ch === undefined)
        {
          debug('   off the grid');
          // We walked off grid
          if (vector.y > 0)
          {
            let p = board[np.y - 1]?.charAt(np.x);
            while (p && p !== ' ')
            {
              np.y--;
              p = board[np.y - 1]?.charAt(np.x);
            }
            debug('   corrected to top edge', np);
          }
          else if (vector.y < 0)
          {
            let p = board[np.y + 1]?.[np.x];
            while (p && p !== ' ')
            {
              np.y++;
              p = board[np.y + 1]?.[np.x];
            }
            debug('   corrected to bottom edge', np);
          }
          else if (vector.x > 0)
          {
            np.x = board[np.y].search(/[^ ]/);
            debug('   corrected to left edge', np);
          }
          else if (vector.x < 0)
          {
            np.x = board[np.y].length - 1;
            debug('   corrected to right edge', np);
          }
        }
        if (np.x < 0 || np.y < 0 ||
          np.x >= width || np.y >= height ||
          np.x >= board[np.y].width ||
          board[np.y]?.charAt(np.x) === ' ')
        {
          throw new Error(`off the board: ${np.x}, ${np.y}`);
        }
        ch = board[np.y]?.charAt(np.x);
        debug('   char at np is', ch);
        if (ch === '#') { debug('   blocked at', np); break; }
        pos.x = np.x; pos.y = np.y;
      }
    }
  });
  debug('all moves done', pos);

  return score(pos, vector);
}

function solve2(board, moves)
{
  // Initial position
  const pos = { x: board[0].indexOf('.'), y: 0 };
  debug('pos:', pos);

  // Initial vector
  const vector = { x: 1, y: 0 };
  debug('vector:', vector);

  const width = board.reduce((a, v) => v.length > a ? v.length : a, 0);
  const height = board.length;
  debug('width:', width, 'height:', height);

  // Detect cube size
  const cubeSize = gcd(...board
    .map(v => v.trim().length)
    .filter((v, i, a) => a.indexOf(v) === i));
  debug('cube size is:', cubeSize);

  moves.forEach(m =>
  {
    debug('move', m, 'pos:', pos, 'vector:', vector);
    if (isNaN(m)) { rotate[m](vector); }
    else
    {
      for (let i = 0; i < m; i++)
      {
        debug('  step', i + 1, 'pos:', pos, 'vector:', vector);
        const np = {
          x: pos.x + vector.x,
          y: pos.y + vector.y
        };
        let ch = board[np.y]?.charAt(np.x);
        debug('   new pos:', np, 'char:', JSON.stringify(ch));

        // handle overflow
        if (ch === ' ' || ch === '' || ch === undefined)
        {
          debug('   off the grid');
          // We walked off grid
          if (vector.y > 0)
          {
            let p = board[np.y - 1]?.charAt(np.x);
            while (p && p !== ' ')
            {
              np.y--;
              p = board[np.y - 1]?.charAt(np.x);
            }
            debug('   corrected to top edge', np);
          }
          else if (vector.y < 0)
          {
            let p = board[np.y + 1]?.[np.x];
            while (p && p !== ' ')
            {
              np.y++;
              p = board[np.y + 1]?.[np.x];
            }
            debug('   corrected to bottom edge', np);
          }
          else if (vector.x > 0)
          {
            np.x = board[np.y].search(/[^ ]/);
            debug('   corrected to left edge', np);
          }
          else if (vector.x < 0)
          {
            np.x = board[np.y].length - 1;
            debug('   corrected to right edge', np);
          }
        }
        if (np.x < 0 || np.y < 0 ||
          np.x >= width || np.y >= height ||
          np.x >= board[np.y].width ||
          board[np.y]?.charAt(np.x) === ' ')
        {
          throw new Error(`off the board: ${np.x}, ${np.y}`);
        }
        ch = board[np.y]?.charAt(np.x);
        debug('   char at np is', ch);
        if (ch === '#') { debug('   blocked at', np); break; }
        pos.x = np.x; pos.y = np.y;
      }
    }
  });
  debug('all moves done', pos);
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

  doDebug = false;
  const part1 = solve1(data, instructions);
  if (target.includes('example') && part1 !== 6032)
  {
    throw new Error(`Invalid solution: ${part1}. Expecting; 6032`);
  }

  doDebug = process.argv[2].includes('example');
  const part2 = solve2(data, instructions);
  if (target.includes('example') && part2 !== 'todo')
  {
    throw new Error(`Invalid solution: ${part1}. Expecting; 5031`);
  }

  return { day: 22, part1, part2, duration: Date.now() - start };
}
