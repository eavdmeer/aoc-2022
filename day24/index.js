import * as fs from 'fs/promises';
import PriorityQueue from '../lib/priorityqueue.js';

const X = 0;
const Y = 1;
const TYPE = 2;

const dirs = {
  '>': [ 1, 0 ],
  /* eslint-disable-next-line quote-props */
  'v': [ 0, 1 ],
  '<': [ -1, 0 ],
  '^': [ 0, -1 ]
};

const posmod = (v, n) => (v % n + n) % n;

let doDebug = false;
if (process.argv[2])
{
  doDebug = process.argv[2].includes('example');
  day24(process.argv[2]).then(console.log);
}

function debug(...args)
{
  if (! doDebug) { return; }
  console.log(...args);
}

const blizzCache = {};

function findPath(entry, data, dest, timeStep)
{
  // Utility functions
  const key = (...args) => args[0] instanceof Array ?
    `${args[0][0]},${args[0][1]}` : `${args[0]},${args[1]}`;
  const same = (a, b) => a[X] === b[X] && a[Y] === b[Y];
  const dc = obj => JSON.parse(JSON.stringify(obj));

  const heap = new PriorityQueue(v => v.cost);
  heap.push({ cost: 0, pos: entry, path: [] });
  blizzCache[0] = data;

  while (heap.length > 0 && heap.length < 200000)
  {
    const { cost, pos, path } = heap.shift();
    debug('try(', heap.length, '): cost:', cost, 'pos:',
      pos, 'path:', path);
    path.push(pos);
    if (same(pos, dest))
    {
      debug('destination', dest, 'reached');
      return { cost, path };
    }

    if (!(cost + 1 in blizzCache))
    {
      const n = dc(blizzCache[cost]);
      timeStep(n);
      blizzCache[cost + 1] = n;
    }
    const bliz = blizzCache[cost + 1];

    const taken = new Set(bliz.map(v => key(v[X], v[Y])));

    const canMove = [];
    Object.entries(dirs).forEach(([ k, d ]) =>
    {
      const p = [ pos[X] + d[X], pos[Y] + d[Y] ];
      if (
        p[X] <= 0 || p[X] >= bliz.width - 1 ||
        p[Y] <= 0 || p[Y] >= bliz.height - 1)
      {
        debug('wall', k, 'at', p);
        return;
      }
      if (! taken.has(key(p[X], p[Y])))
      {
        debug('can move', k, 'to:', p);
        heap.push({ cost: cost + 1, pos: p, path: path.slice() });
        canMove.push(k);
      }
      else
      {
        debug('unable to move', k, 'to:', p);
      }
    });

    debug('canMove:', canMove);

    // If we can't move, we can wait in place, but only if no blizzard has
    // hit our current position
    if (canMove.length === 0)
    {
      if (taken.has(key(pos)))
      {
        debug('got hit by a blizzard, invalid path at', pos);
      }
      else
      {
        debug('waiting in place:', pos);
        heap.push({ cost: cost + 1, pos, path: path.slice() });
      }
    }
  }
  throw new Error(`Unable to find a valid path to (${dest[X]}, ${dest[Y]})`);
}

function solve1(data)
{
  const width = data[0].length;
  const height = data.length;

  const entry = [];
  const exit = [];
  const blizzards = [];
  data.forEach((row, y) =>
  {
    row.forEach((col, x) =>
    {
      if (/[><^v]/.test(col)) { blizzards.push([ x, y, col ]); }
      if (y === 0 && col === '.') { entry.push(x, y); }
      if (y === height - 1 && col === '.') { exit.push(x, y); }
    });
  });
  debug('0 : blizzards:', blizzards);
  debug('entry:', entry);
  debug('exit:', exit);
  debug('width:', width);
  debug('height:', height);

  // function to move all blizzards one time step
  const timeStep = input =>
    input.forEach(v =>
    {
      v[X] = 1 + posmod(v[X] - 1 + dirs[v[TYPE]][X], width - 2);
      v[Y] = 1 + posmod(v[Y] - 1 + dirs[v[TYPE]][Y], height - 2);
    });

  blizzards.width = width;
  blizzards.height = height;
  const path = findPath(entry, blizzards, exit, timeStep);

  debug('best path:', path);

  return path.cost;
}

function solve2()
{
  return 'todo';
}

export default async function day24(target)
{
  const start = Date.now();
  debug('starting');

  const content = await fs.readFile(target);

  /* eslint-disable no-shadow */
  const data = content
    .toString()
    .trim()
    .split(/\s*\n\s*/)
    .filter(v => v)
    .map(v => v.split(''));
  /* eslint-enable no-shadow */

  debug('data', data);

  doDebug = true;
  const part1 = solve1(data);
  if (target.includes('example') && part1 !== 18)
  {
    throw new Error(`Invalid solution: ${part1}. Expecting; 18`);
  }

  const part2 = solve2(data);
  if (target.includes('example') && part2 !== 'todo')
  {
    throw new Error(`Invalid solution: ${part2}. Expecting; 'todo'`);
  }

  return { day: 24, part1, part2, duration: Date.now() - start };
}
