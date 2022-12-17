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

function solve(valves, start)
{
  const graph = new Graph(v => v.id);

  // Insert all nodes
  graph.insert(...valves);

  // Insert all edges
  valves.forEach(v => v.to.forEach(d => graph.connect(v.id, d, v.flow)));

  return graph.findPath(start);
}

async function day16(target)
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
      open: false
    }));

  debug(valves);

  debug(solve(valves, 'AA'));

  const part1 = 'todo';

  const part2 = 'todo';

  return { day: 16, part1, part2, duration: Date.now() - start };
}
