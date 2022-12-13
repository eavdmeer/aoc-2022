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

function neighbors(data, x, y)
{
  const points = [
    [ x + 1, y ],
    [ x, y + 1 ],
    [ x - 1, y ],
    [ x, y - 1 ]
  ];
  return points
    .filter(([ px, py ]) => px >= 0 && py >= 0 &&
      px < data.width && py < data.height &&
      data[py][px] - data[y][x] <= 1);
}

function pop(heap)
{
  // pop the item on the heap with the lowest cost and return it
  const min = Math.min(...heap.map(v => v.cost));
  return heap.splice(heap.findIndex(v => v.cost === min), 1).pop();
}

function solve(data, start, end)
{
  const path = [];
  const heap = [];
  heap.push({ cost: 0, loc: start });
  const visited = {};

  let h = 0;

  while (`${end.x},${end.y}` in visited === false)
  {
    if (heap.length === 0)
    {
      // throw new Error('No more open paths! Unable to reach end point!');
      return -1;
    }
    const { cost, loc } = pop(heap);

    const key = `${loc.x},${loc.y}`;
    if (key in visited) { continue; }

    path.push({ x: loc.x, y: loc.y, delta: data[loc.y][loc.x] - h });
    h = data[loc.y][loc.x];

    visited[key] = { cost, loc };

    if (loc.x === end.x && loc.y === end.y)
    {
      console.log(path);
      return cost;
    }

    neighbors(data, loc.x, loc.y).forEach(l =>
    {
      heap.push({ cost: cost + 1, loc: { x: l[0], y: l[1] } });
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

  const startPoints = [];
  data.forEach((row, y) =>
    row.forEach((h, x) =>
    {
      if (h === 0) { startPoints.push({ x, y }); }
    })
  );
  const part2 = Math.min(...startPoints
    .map(p => solve(data, p, end))
    .filter(v => v >= 0)
  );

  return { day: 12, part1, part2, duration: Date.now() - start };
}
