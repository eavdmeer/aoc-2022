import * as fs from 'fs/promises';
import makeDebug from 'debug';

const debug = makeDebug('day24');

import { MinPriorityQueue } from '@datastructures-js/priority-queue';
// import PriorityQueue from '../lib/priorityqueue.js';
import { lcm } from '../lib/lcm.js';

const X = 0;
const Y = 1;
const TYPE = 2;

/* eslint-disable quote-props */
const dirs = {
  '>': [ 1, 0 ],
  'v': [ 0, 1 ],
  '<': [ -1, 0 ],
  '^': [ 0, -1 ],
  'x': [ 0, 0 ]
};
/* eslint-enable quote-props */

const posmod = (v, n) => (v % n + n) % n;

if (process.argv[2])
{
  day24(process.argv[2]).then(console.log);
}

const blizzCache = {};

function findPath(data, width, height, entry, dest, time = 0)
{
  // Utility functions
  const key = (...args) => args[0] instanceof Array ?
    `${args[0][0]},${args[0][1]}` : `${args[0]},${args[1]}`;
  const same = (a, b) => a[X] === b[X] && a[Y] === b[Y];
  const dc = obj => JSON.parse(JSON.stringify(obj));

  // function to move all blizzards one time step
  const timeStep = input =>
    input.forEach(v =>
    {
      v[X] = 1 + posmod(v[X] - 1 + dirs[v[TYPE]][X], width - 2);
      v[Y] = 1 + posmod(v[Y] - 1 + dirs[v[TYPE]][Y], height - 2);
    });

  // Prepare the cache with all steps in the cycle
  const cycle = lcm(width - 2, height - 2);
  debug('cycle is:', cycle);
  const work = dc(data);
  for (let i = 0; i < cycle; i++)
  {
    if (! (i in blizzCache))
    {
      blizzCache[i] = new Set(work.map(v => key(v[X], v[Y])));
      timeStep(work);
    }
  }

  const seen = new Set();

  const heap = new MinPriorityQueue(v => v.cost);
  heap.push({ cost: time, pos: entry, path: [] });

  while (heap.size() > 0 && heap.size() < 200000)
  {
    const { cost, pos, path } = heap.dequeue();

    path.push(pos);

    if (same(pos, dest)) { return { cost, path }; }

    const seenKey = `${pos[X]}${pos[Y]}${cost % cycle}`;
    if (seen.has(seenKey)) { continue; }
    seen.add(seenKey);

    const taken = blizzCache[(cost + 1) % cycle];

    const canMove = [];
    Object.entries(dirs).forEach(([ k, d ]) =>
    {
      const p = [ pos[X] + d[X], pos[Y] + d[Y] ];
      if (! same(p, entry) && ! same(p, dest) && (
        p[X] <= 0 || p[X] >= width - 1 ||
        p[Y] <= 0 || p[Y] >= height - 1))
      {
        return;
      }
      if (! taken.has(key(p[X], p[Y])))
      {
        heap.push({ cost: cost + 1, pos: p, path: path.slice() });
        canMove.push(k);
      }
    });
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


  const path = findPath(blizzards, width, height, entry, exit, 0);

  debug('best path:', path);

  return path.cost;
}

function solve2(data, startTime)
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

  const path1 = findPath(blizzards, width, height, exit, entry, startTime);
  debug('path 1 cost:', path1.cost);
  const path2 = findPath(blizzards, width, height, entry, exit, path1.cost);
  debug('path 2 cost:', path2.cost);

  return path2.cost;
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

  const part1 = solve1(data);
  if (target.includes('example') && part1 !== 18)
  {
    throw new Error(`Invalid solution: ${part1}. Expecting; 18`);
  }

  const part2 = solve2(data, part1);
  if (target.includes('example') && part2 !== 54)
  {
    throw new Error(`Invalid solution: ${part2}. Expecting; 54`);
  }

  return { day: 24, part1, part2, duration: Date.now() - start };
}
