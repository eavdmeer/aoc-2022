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

/*
function maxflow(nodes, node, opened, remaining)
{
  debug('check node', node.id, 'remaining', remaining, 'opened', opened);
  if (remaining <= 0) { return 0; }
  const getNode = id => nodes.find(v => v.id === id);

  let best = 0;
  if (! (node.id in opened))
  {
    const val = (remaining - 1) * node.flow;
    node.to.forEach(id =>
    {
      const n = getNode(id);
      if (val)
      {
        debug('open', id, 'val', val);
        const nopened = { ...opened };
        nopened[node.id] = true;
        best = Math.max(best,
          val + maxflow(nodes, n, nopened, remaining - 2));

      }
      best = Math.max(best, maxflow(nodes, n, opened, remaining - 1));
    });
  }
  debug('returning', best);
  return best;
}
*/

function makeKey(time, valve, opened)
{
  return `${time}-${valve}-${Object.keys(opened).join('-')}`;
}

let fromCache = 0;

function dfs(valves, valveId, time, volume, cache, opened)
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

  const key = makeKey(valveId, time, opened);
  if (key in cache)
  {
    db('returning from cache');
    fromCache++;
    return cache[key];
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
      const nopened = { ...opened };
      db('jumping to node', vid, 'from', valveId, 'at time', ntime,
        'to open valve at dist', dist);

      return dfs(valves, vid, ntime, nvolume, cache, nopened);
    });

  nvolume = Math.max(nvolume, ...results);

  db('storing cache for key', key, nvolume);
  cache[key] = nvolume;

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

  fromCache = 0;
  const val = dfs(withFlow, start, duration, 0, {}, {});
  debug('from cache:', fromCache);

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
