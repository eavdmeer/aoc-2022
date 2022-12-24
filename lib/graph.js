import PriorityQueue from '../lib/priorityqueue.js';

export default function Graph(idFunction = JSON.stringify)
{
  this.id = idFunction;
  this.data = {
    nodes: [],
    edges: []
  };
}

Graph.prototype.nodes = function()
{
  return this.data.nodes;
};
Graph.prototype.edges = function()
{
  return this.data.edges;
};
Graph.prototype.insert = function(...args)
{
  this.data.nodes.push(...args);
};
Graph.prototype.connect = function(n, m, weight = 1, uni = false)
{
  // Arguments could be object or IDs
  const src = typeof n === 'object' ? this.id(n) : n;
  const dst = typeof m === 'object' ? this.id(m) : m;
  this.data.edges.push({ src, dst, weight });
  if (! uni) { this.data.edges.push({ src: dst, dst: src, weight }); }
};
Graph.prototype.findNode = function(id)
{
  this.data.nodes.find(node => id === this.id(node));
};
Graph.prototype.findPath = function(n, m)
{
  // Arguments could be object or IDs
  const src = typeof n === 'object' ? this.id(n) : n;
  const dst = m === undefined ? undefined :
    typeof m === 'object' ? this.id(m) : m;

  const heap = new PriorityQueue(v => v.cost);
  heap.push({ cost: 0, node: src, path: [] });
  const visited = {};

  while (heap.length > 0)
  {
    const { cost, node, path } = heap.shift();
    if (node in visited) { continue; }
    path.push(node);
    visited[node] = { cost, path };
    if (node === dst)
    {
      return { cost, path };
    }

    this.data.edges.filter(v => v.src === node)
      .forEach(edge =>
        heap.push({
          cost: cost + edge.weight,
          node: edge.dst,
          path: [ ...path ]
        }));
  }
  return visited;
};
