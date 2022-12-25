import * as fs from 'fs/promises';
import Graph from '../lib/graph.js';

let doDebug = false;
const enabled = { 1: true, 2: false };

if (process.argv[2])
{
  doDebug = process.argv[2].includes('example');
  day16(process.argv[2]).then(console.log);
}

function debug(...args)
{
  if (! doDebug) { return; }
  console.log(...args);
}

const cache = {};

const cacheKey = (i, t, s) => `${i}-${t}-${Object.entries(s)
  .sort()
  .map(([ k, v ]) => `${k}=${v ? 1 : 0}`)
  .join(':')}`;
const cachePut = (k, v) => cache[k] = v;
const cacheHas = k => k in cache;
const cacheGet = k => cache[k];

const findValve = (valves, id) => valves.find(v => v.id === id);

function dfs(valves, valveId, time, opened)
{
  const key = cacheKey(valveId, time, opened);
  if (cacheHas(key)) { return cacheGet(key); }

  const valve = findValve(valves, valveId);

  // Open the current valve and add all the volume it can produce
  const volume = valve ? (time - 1) * valve.flow : 0;
  opened[valveId] = true;

  const results = Object
    .entries(valve.dist)
    .filter(([ k ]) => ! (k in opened))
    .map(([ vid, dist ]) =>
    {
      const ntime = time - dist - (valveId === 'AA' ? 0 : 1);
      if (ntime < 1) { return 0; }
      const nopened = { ...opened };

      return dfs(valves, vid, ntime, nopened);
    });

  const best = Math.max(0, ...results);

  cachePut(key, volume + best);

  return volume + best;
}

function mapOpenValves(data)
{
  const graph = new Graph(v => v.id);

  // Insert all nodes
  graph.insert(...data);

  // Insert all edges
  data.forEach(v => v.to.forEach(d => graph.connect(v.id, d)));

  // Get all valves with non-zero flow
  const valves = data
    .filter(v => v.id === 'AA' || v.flow > 0)
    .map(v => ({ id: v.id, flow: v.flow }));

  debug('valves with flow', valves);

  // Add distances using the graph
  valves.forEach(f1 =>
  {
    f1.dist = valves
      .filter(v => v !== f1)
      .map(f2 => [ f2.id, graph.findPath(f1.id, f2.id).cost ])
      .reduce((a, [ k, v ]) => { a[k] = v; return a; }, {});
  });
  debug('valves with distances', valves);

  return valves;
}

function solve1(data)
{
  return dfs(mapOpenValves(data), 'AA', 30, {});
}

function solve2(data)
{
  const valves = mapOpenValves(data);

  const list = valves.map(v => v.id).filter(v => v !== 'AA');
  debug('all valves with flow:', list);

  const b = (1 << list.length) - 1;
  debug('checking', Math.floor((b + 1) / 2), 'combinations');

  let max = 0;

  for (let i = 1; i < Math.floor((b + 1) / 2); i++)
  {
    const targets = {};
    for (let j = 0; j < list.length; j++)
    {
      if (i & 1 << j) { targets[list[j]] = true; }
    }
    debug('my targets for', i, targets);
    const nonTargets = list.filter(v => ! (v in targets))
      .reduce((a, v) => { a[v] = true; return a; }, {});
    debug('elephant targets for', i, nonTargets);

    const mine = dfs(valves, 'AA', 26, targets);
    const el = dfs(valves, 'AA', 26, nonTargets);
    debug('mine:', mine, 'elephants:', el);
    if (mine + el > max)
    {
      debug('new max:', mine + el);
      max = mine + el;
    }
  }

  debug('max value is:', max);
  return max;
}

export default async function day16(target)
{
  const start = Date.now();

  const content = await fs.readFile(target);
  const re = /^Valve (..) .*rate=(\d+); .* valves? (.*)$/;
  const valves = content
    .toString()
    .split(/\s*\n\s*/)
    .filter(v => v)
    .map(v => v.match(re))
    .map(v => ({
      id: v[1],
      flow: parseInt(v[2], 10),
      to: v[3].split(/\s*,\s*/)
    }));

  debug('all valves', valves);

  // const part1 = maxflow(valves, valves.find(v => v.id === 'AA'), {}, 30);

  const part1 = enabled[1] ? solve1(valves) : 'todo';
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
