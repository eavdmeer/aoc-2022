import * as fs from 'fs/promises';

let doDebug = false;
if (process.argv[2])
{
  doDebug = process.argv[2].includes('example');
  day18(process.argv[2]).then(console.log);
}

function debug(...args)
{
  if (! doDebug) { return; }
  console.log(...args);
}

function solve1(drops)
{
  let score = 0;
  drops.forEach(d =>
  {
    // assume all sides are free
    score += 6;
    drops.forEach(v =>
    {
      score -= [
        d[0] + 1 === v[0] && d[1] === v[1] && d[2] === v[2] ? 1 : 0,
        d[0] - 1 === v[0] && d[1] === v[1] && d[2] === v[2] ? 1 : 0,
        d[0] === v[0] && d[1] + 1 === v[1] && d[2] === v[2] ? 1 : 0,
        d[0] === v[0] && d[1] - 1 === v[1] && d[2] === v[2] ? 1 : 0,
        d[0] === v[0] && d[1] === v[1] && d[2] + 1 === v[2] ? 1 : 0,
        d[0] === v[0] && d[1] === v[1] && d[2] - 1 === v[2] ? 1 : 0
      ].reduce((a, w) => a + w, 0);
    });
  });

  return score;
}

const cache = {};

function enclosed(drops, x, y, z, xr, yr, zr)
{
  const stack = [ [ x, y, z ] ];
  const seen = new Set();

  const occupied = (ax, ay, az) =>
    drops.some(v => ax === v[0] && ay === v[1] && az === v[2]);

  const key = `[ ${x}, ${y}, ${z} ]`;
  if (key in cache) { return cache[key]; }

  // Occupied cell
  if (occupied(x, y, z)) { return false; }

  while (stack.length > 0)
  {
    const [ px, py, pz ] = stack.pop();

    const wkey = `[ ${px}, ${py}, ${pz} ]`;
    if (wkey in cache)
    {
      const v = cache[wkey];
      cache[key] = v;
      return v;
    }

    // Check occupied cells
    if (occupied(px, py, pz)) { continue; }

    // Out of bounds check
    if (px > xr.max || px < xr.min ||
      py > yr.max || py < yr.min ||
      pz > zr.max || pz < zr.min)
    {
      cache[key] = false;
      cache[wkey] = false;
      return false;
    }

    // Prevent infiinite looping
    if (seen.has(wkey)) { continue; }
    seen.add(wkey);

    // Add neighbors
    stack.push([ px + 1, py, pz ]);
    stack.push([ px - 1, py, pz ]);
    stack.push([ px, py + 1, pz ]);
    stack.push([ px, py - 1, pz ]);
    stack.push([ px, py, pz + 1 ]);
    stack.push([ px, py, pz - 1 ]);
  }

  cache[key] = true;

  return true;
}

function solve2(drops, part1)
{
  // Determine coordinate ranges
  const xr = {
    min: Math.min(...drops.map(v => v[0])),
    max: Math.max(...drops.map(v => v[0]))
  };
  const yr = {
    min: Math.min(...drops.map(v => v[1])),
    max: Math.max(...drops.map(v => v[1]))
  };
  // Data is sorted by z
  const zr = { min: drops[0][2], max: drops[drops.length - 1][2] };

  // Collect all air bubbles
  const bubbles = [];

  // Examine each coordinate in the bounding box
  for (let z = zr.min; z < zr.max; z++)
  {
    for (let x = xr.min; x < xr.max; x++)
    {
      for (let y = yr.min; y < yr.max; y++)
      {
        if (enclosed(drops, x, y, z, xr, yr, zr))
        {
          bubbles.push([ x, y, z ]);
        }
      }
    }
  }

  return part1 - solve1(bubbles);
}

export default async function day18(target)
{
  const start = Date.now();
  debug('starting');

  const content = await fs.readFile(target);

  const droplets = content
    .toString()
    .trim()
    .split(/\s*\n\s*/)
    .filter(v => v)
    .map(v => v.split(/\s*,\s*/).map(w => parseInt(w, 10)))
    .sort((a, b) => a[2] - b[2]);

  const part1 = solve1(droplets);

  const part2 = solve2(droplets, part1);

  return { day: 18, part1, part2, duration: Date.now() - start };
}

