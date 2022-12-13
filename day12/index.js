import * as fs from 'node:fs/promises';

let doDebug = false;
if (process.argv[2])
{
  doDebug = process.argv[2].includes('example');
  day12(process.argv[2]).then(console.log);
}

function debug(...args)
{
  if (! doDebug) { return; }
  console.log(...args);
}

function neighbors(data, x, y, reverse = false)
{
  const points = [
    { x: x + 1, y },
    { x, y: y + 1 },
    { x: x - 1, y },
    { x, y: y - 1 }
  ];
  return points
    .filter(p => p.x >= 0 && p.y >= 0 &&
      p.x < data.width && p.y < data.height &&
      (! reverse && data[p.y][p.x] - data[y][x] <= 1 ||
       reverse && data[y][x] - data[p.y][p.x] <= 1
      ));
}

function popCheapest(heap)
{
  // pop the item on the heap with the lowest cost and return it
  const min = Math.min(...heap.map(v => v.cost));
  return heap.splice(heap.findIndex(v => v.cost === min), 1).pop();
}

function solve(data, start, end, reverse = false)
{
  const path = [];
  let h = 0;

  // Implement Dijkstra's algorithm for finding the shortest path:
  // Keep track of candidates on a priority queue or heap.
  //
  // Keep track of visited places in a hash.
  //
  // Add the start point to the heap to begin.
  //
  // Repeat until we reach the target or run out of candidates:
  // - Take the candidate with the lowest cost so far off the heap
  // - If we've visited this coordinate already, continue to the next
  // - Add candidate to list of visited.
  // - Check if we reached the destination
  // - If not, add all neighbors on the priority queue
  //
  const heap = [];
  heap.push({ cost: 0, loc: start });
  const visited = {};

  while (`${end.x},${end.y}` in visited === false)
  {
    if (heap.length === 0)
    {
      throw new Error('No more open paths! Unable to reach end point!');
    }
    const { cost, loc } = popCheapest(heap);

    const key = `${loc.x},${loc.y}`;
    if (key in visited) { continue; }

    path.push({ x: loc.x, y: loc.y, delta: data[loc.y][loc.x] - h });
    h = data[loc.y][loc.x];

    visited[key] = { cost, loc };

    if (reverse && h === 0)
    {
      debug(path);
      return cost;
    }
    else if (loc.x === end.x && loc.y === end.y)
    {
      debug(path);
      return cost;
    }

    neighbors(data, loc.x, loc.y, reverse).forEach(l =>
    {
      heap.push({ cost: cost + 1, loc: { x: l.x, y: l.y } });
    });
  }

  return -1;
}

export default async function day12(target)
{
  const start = Date.now();

  const content = await fs.readFile(target);

  const begin = { x: null, y: null };
  const end = { x: null, y: null };
  const data = content
    .toString()
    .split(/\s*\n\s*/)
    .filter(v => v)
    .map((v, y) => v.split('')
      .map((c, x) =>
      {
        if (c === 'S')
        {
          begin.x = x;
          begin.y = y;
          return 0;
        }
        else if (c === 'E')
        {
          end.x = x;
          end.y = y;
          return 25;
        }
        return c.charCodeAt(0) - 97;
      })
    );
  //
  // Insert width and height property for convenience
  data.width = data[0].length;
  data.height = data.length;

  debug('begin:', begin, 'end:', end);

  const part1 = solve(data, begin, end);

  // Backtrack from the end to the nearest square that's zero
  const part2 = solve(data, end, begin, true);

  return { day: 12, part1, part2, duration: Date.now() - start };
}
