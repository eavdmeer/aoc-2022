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

function pop(heap)
{
  console.log(heap.map(v => v.volume + (30 - v.time) * v.valve.flow));

  // pop the item on the heap with the highest potential volume of
  // remaining time * flow rate and return it
  const max = Math.max(...heap.map(v =>
    v.volume + (30 - v.time) * v.valve.flow));
  debug('max heap value is', max);
  return heap.splice(heap
    .findIndex(v => v.volume + (30 - v.time) * v.valve.flow === max), 1)
    .pop();
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

function solve(valves, start)
{
  const graph = new Graph(v => v.id);
  const getValve = id => withFlow.find(v => v.id === id);

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

  const heap = [];
  const visited = new Set();

  // push start onto the heap
  heap.push({ volume: 0, time: 0, valve: getValve(start) });

  while (heap.length > 0)
  {
    debug('heap', heap);
    const { volume, time, valve } = pop(heap);
    debug('t =', time, ': try valve', valve.id, 'flow', valve.flow,
      'volume', volume);
    if (visited.has(valve.id))
    {
      debug('  already visited');
      continue;
    }
    visited.add(valve.id);
    if (visited.size === withFlow.length)
    {
      debug('  visited and opened all valves');
      return volume;
    }
    if (time === 30)
    {
      debug('out of time');
      return valve.volume;
    }
    debug('add valves', valve.dist);
    debug('opening valve, flow', valve.flow, 'for', 30 - time, 'minutes for a total volume of', valve.flow * (30 - time));

    Object.entries(valve.dist).forEach(([ id, dist ]) =>
      heap.push({
        volume: volume + valve.flow * (30 - time),
        time: time + 1 + dist,
        valve: getValve(id)
      }));
  }
  debug('out of search options');

  return -1;
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

  debug(solve(valves, 'AA'));

  // const part1 = maxflow(valves, valves.find(v => v.id === 'AA'), {}, 30);

  const part1 = 'todo';
  const part2 = 'todo';

  return { day: 16, part1, part2, duration: Date.now() - start };
}
