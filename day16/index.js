import * as fs from 'fs/promises';
import Graph from './graph.js';

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
  // pop the item on the heap with the highest volume and return it
  const max = Math.max(...heap.map(v => v.volume));
  return heap.splice(heap.findIndex(v => v.volume === max), 1).pop();
}

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

function solve(valves, start)
{
  const graph = new Graph(v => v.id);
  const getValve = id => valves.find(v => v.id === id);

  // Insert all nodes
  graph.insert(...valves);

  // Insert all edges
  valves.forEach(v => v.to.forEach(d => graph.connect(v.id, d, v.flow)));

  const heap = [];
  const visited = {};
  const opened = {};
  heap.push({ ...getValve(start) });

  let t = 1;
  while (heap.length > 0 && t <= 30)
  {
    debug('heap', heap
      .map(v => `${v.id}: ${v.id in opened}, ${v.volume}`)
      .join('\n'));
    const valve = pop(heap);
    debug('try valve', valve.id, 'volume', valve.volume);
    if (valve.id in visited)
    {
      debug('  already visited');
      continue;
    }
    visited[valve.id] = true;
    if (t === 30)
    {
      debug('out of time');
      return valve.volume;
    }
    debug('add valves', valve.to);
    valve.to.forEach(v =>
    {
      const n = { ...getValve(v) };
      n.volume = valve.volume;
      heap.push(n);
    });
    if (! (valve.id in opened) && valve.flow !== 0)
    {
      // Only open valves that will yield anything
      debug('open valve', valve.id, 'flow', valve.flow);
      opened[valve.id] = t;
      valve.volume += valve.flow * (30 - 1);
      heap.push(valve);
    }
    t++;
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
      to: v[3].split(/\s*,\s*/),
      volume: 0
    }));

  debug(valves);

  debug(solve(valves, 'AA'));

  const part1 = maxflow(valves, valves.find(v => v.id === 'AA'), {}, 30);

  const part2 = 'todo';

  return { day: 16, part1, part2, duration: Date.now() - start };
}
