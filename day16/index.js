import * as fs from 'fs/promises';
import Graph from '../lib/graph.js';

let doDebug = false;
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

function dfs(valves, valveId, time, volume, opened)
{
  const db = (...args) => debug(time, '-', ...args);
  const findValve = id => valves.find(v => v.id === id);

  db('-----', 'min', time, '----');
  db('valve :', valveId);
  db('volume:', volume);
  db('opened:', opened);

  if (time === 0) { return volume; }

  // All valves are open
  if (valves.filter(v => !(v.id in opened)).length === 0)
  {
    db('all valves are already open');
    return volume;
  }

  const valve = findValve(valveId);
  if (valve === undefined)
  {
    throw new Error(`unable to find valve ${valveId}`);
  }

  // Open the current valve and add all the volume it can produce
  let nvolume = volume + (time - 1) * valve.flow;
  db('valve', valveId, 'with flow', valve.flow, 'opened for',
    time - 1, 'remaining minutes');
  db('new maximum volume is', nvolume);
  opened[valveId] = true;

  db('checking connected valves');
  const results = Object
    .entries(valve.dist)
    .filter(([ k ]) => ! (k in opened))
    .map(([ vid, dist ]) =>
    {
      const ntime = time - dist - (valveId === 'AA' ? 0 : 1);
      if (ntime < 1)
      {
        db('skipping node', vid, 'as there is no time to open it');
        return 0;
      }
      const nopened = { ...opened };
      db('jumping to node', vid, 'from', valveId, 'at time', ntime,
        'to open valve at dist', dist);

      return dfs(valves, vid, ntime, nvolume, nopened);
    });

  nvolume = Math.max(nvolume, ...results);

  db('Best value for', valveId, 'is', nvolume);

  return nvolume;
}

function solve(valves, start, duration = 30)
{
  const graph = new Graph(v => v.id);

  // Insert all nodes
  graph.insert(...valves);

  // Insert all edges
  valves.forEach(v => v.to.forEach(d => graph.connect(v.id, d)));

  // Get all valves with non-zero flow
  const withFlow = valves
    .filter(v => v.id === 'AA' || v.flow > 0)
    .map(v => ({ id: v.id, flow: v.flow }));

  debug('valves with flow', withFlow);

  // Add distances using the graph
  withFlow.forEach(f1 =>
  {
    f1.dist = withFlow
      .filter(v => v !== f1)
      .map(f2 => [ f2.id, graph.findPath(f1.id, f2.id).cost ])
      .reduce((a, [ k, v ]) => { a[k] = v; return a; }, {});
  });
  debug('valves with distances', withFlow);

  const val = dfs(withFlow, start, duration, 0, {});

  return val;
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

  const part1 = solve(valves, 'AA');
  const part2 = 'todo';

  return { day: 16, part1, part2, duration: Date.now() - start };
}
