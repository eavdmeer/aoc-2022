import * as fs from 'fs/promises';
import { MinPriorityQueue } from '@datastructures-js/priority-queue';
import makeDebug from 'debug';

const debug = makeDebug('day16');

let mapped = false;
const enabled = { 1: true, 2: false };

if (process.argv[2])
{
  day16(process.argv[2]).then(console.log);
}

const valves = {};
const tunnels = {};

const dists = {};
const nonempty = [];

const indices = {};

const cache = {};

function dfs(time, valve, bitmask)
{
  const key = `${time}-${valve}-${bitmask}`;
  if (key in cache) { return cache[key]; }

  let maxval = 0;

  Object.keys(dists[valve]).forEach(neighbor =>
  {
    const bit = 1 << indices[neighbor];
    if (bitmask & bit) { return; }
    const remtime = time - dists[valve][neighbor] - 1;
    if (remtime <= 0) { return; }
    maxval = Math.max(maxval, dfs(remtime, neighbor, bitmask | bit) +
      valves[neighbor] * remtime);
  });

  cache[key] = maxval;
  return maxval;
}

function mapOpenValues(buffer)
{
  if (mapped) { return; }

  mapped = true;

  buffer
    .toString()
    .split(/\s*\n\s*/)
    .filter(v => v)
    .forEach(line =>
    {
      debug('line:', line);
      const valve = line.trim().split(' ')[1];
      const flow = parseInt(line.split(';')[0].split('=')[1], 10);
      const targets = line.trim().split(/to valves?\s*/)[1].split(/\s*,\s*/);
      valves[valve] = flow;
      tunnels[valve] = targets;
    });
  debug('valves:', valves);
  debug('tunnels:', tunnels);

  Object.keys(valves).forEach(valve =>
  {
    // if (valve === 'AA' && ! valves[valve]) { return; }

    if (valve !== 'AA') { nonempty.push(valve); }

    dists[valve] = { [valve]: 0, AA: 0 };
    const visited = new Set(valve);

    const queue = new MinPriorityQueue(v => v[0]);
    queue.push([ 0, valve ]);

    while (queue.size())
    {
      const [ distance, position ] = queue.dequeue();
      tunnels[position].forEach(neighbor =>
      {
        if (visited.has(neighbor)) { return; }
        visited.add(neighbor);
        if (valves[neighbor])
        {
          // TODO: check subobject creation
          dists[valve][neighbor] = distance + 1;
        }
        queue.push([ distance + 1, neighbor ]);
      });

      delete dists[valve][valve];
      if (valve !== 'AA') { delete dists[valve].AA; }
    }
  });

  debug('dists:', dists);

  nonempty.forEach((element, index) => indices[element] = index);
  debug('indices:', indices);
}

function solve1(buffer)
{
  mapOpenValues(buffer);

  return dfs(30, 'AA', 0);
}

function solve2(buffer)
{
  mapOpenValues(buffer);

  const b = (1 << nonempty.length) - 1;

  let m = 0;

  for (let i = 0; i < Math.floor((b + 1) / 2); i++)
  {
    m = Math.max(m, dfs(26, 'AA', i) + dfs(26, 'AA', b ^ i));
  }

  debug('maximum volume:', m);

  return m;
}

export default async function day16(target)
{
  const start = Date.now();

  const buffer = await fs.readFile(target);

  const part1 = enabled[1] ? solve1(buffer) : 'todo';
  if (target.includes('example') && part1 !== 1651)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; 1651`);
  }

  const part2 = enabled[2] ? solve2(valves) : 'todo';
  if (target.includes('example') && (part2 !== 'todo' && part2 !== 1707))
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; 1707`);
  }

  return { day: 16, part1, part2, duration: Date.now() - start };
}
