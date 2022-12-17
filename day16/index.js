import Graph from './graph.js';
import * as fs from 'fs/promises';

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

export default async function day16(target)
{
  const start = Date.now();

  const content = await fs.readFile(target);

  const re = /^Valve (..) .*rate=(\d+); .* valves? (.*)$/;
  const nodes = content
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

  // Create a graph with all nodes and connections
  const graph = new Graph(v => v.id);
  nodes.forEach(node => graph.insert(node));
  nodes.forEach(node => node.to.forEach(n => graph.connect(node.id, n)));

  debug(graph.nodes());
  debug(graph.edges());

  console.log(graph.findPath('AA', 'HH'));
  console.log(graph.findPath('AA'));

  const part1 = 'todo';

  const part2 = 'todo';

  return { day: 16, part1, part2, duration: Date.now() - start };
}
