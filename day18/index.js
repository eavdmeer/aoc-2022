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

const setCache = (key, val) =>
{
  debug('set cache', key, 'to', val);
  cache[key] = val;
};

const getCache = key =>
{
  debug('found in cache:', cache[key]);
  return cache[key];
};

function enclosed(drops, x, y, z, xr, yr, zr)
{
  debug('enclosed', drops);
  const stack = [ [ x, y, z ] ];
  const seen = new Set();

  const occupied = (ax, ay, az) =>
    drops.some(v => ax === v[0] && ay === v[1] && az === v[2]);

  const key = `[ ${x}, ${y}, ${z} ]`;
  debug('check', [ x, y, z ], xr, yr, zr);

  if (key in cache) { return getCache(key); }

  // Occupied cell
  if (occupied(x, y, z))
  {
    debug('occupied cell => not enclosed');
    // setCache(key, false);
    return false;
  }
  debug('not an occupied cell');

  while (stack.length > 0)
  {
    const [ px, py, pz ] = stack.pop();

    const wkey = `[ ${px}, ${py}, ${pz} ]`;
    debug('while check', [ px, py, pz ]);
    if (wkey in cache)
    {
      const v = getCache(wkey);
      setCache(key, v);
      return v;
    }

    // Check occupied cells
    if (occupied(px, py, pz))
    {
      debug('occupied => continue');
      continue;
    }
    debug('not occupied');

    // Out of bounds check
    if (px > xr.max || px < xr.min ||
      py > yr.max || py < yr.min ||
      pz > zr.max || pz < zr.min)
    {
      debug('out of bounds => not enclosed');
      setCache(key, false);
      setCache(wkey, false);
      return false;
    }
    debug('not out of bounds');

    // Prevent infiinite looping
    if (seen.has(wkey))
    {
      debug('already visited');
      continue;
    }
    seen.add(wkey);
    debug('not visited yet');

    // Add neighbors
    stack.push([ px + 1, py, pz ]);
    stack.push([ px - 1, py, pz ]);
    stack.push([ px, py + 1, pz ]);
    stack.push([ px, py - 1, pz ]);
    stack.push([ px, py, pz + 1 ]);
    stack.push([ px, py, pz - 1 ]);
  }

  debug('fall through');
  setCache(key, true);

  return true;
}

function solve2(drops, part1)
{
  // Determine coordinate ranges
  const xr = {
    min: Math.min(...drops.map(v => v[0])),
    max: Math.max(...drops.map(v => v[0]))
  };
  debug('x-range:', xr);
  const yr = {
    min: Math.min(...drops.map(v => v[1])),
    max: Math.max(...drops.map(v => v[1]))
  };
  debug('y-range:', yr);
  // Data is sorted by z
  const zr = { min: drops[0][2], max: drops[drops.length - 1][2] };
  debug('z-range:', zr);

  // Collect all air bubbles
  const bubbles = [];

  // Examine each z-slice
  for (let z = zr.min; z < zr.max; z++)
  {
    for (let x = xr.min; x < xr.max; x++)
    {
      for (let y = yr.min; y < yr.max; y++)
      {
        const res = enclosed(drops, x, y, z, xr, yr, zr);
        debug([ x, y, z ], 'is', res ? 'enclosed' : 'not enclosed');
        if (res)
        {
          bubbles.push([ x, y, z ]);
        }
      }
    }
  }

  const surface = solve1(bubbles);
  debug('enclosed air', bubbles.length, bubbles, 'surface:', surface);

  return part1 - surface;
}

export default async function day18(target)
{
  const start = Date.now();

  const content = await fs.readFile(target);

  const droplets = content
    .toString()
    .trim()
    .split(/\s*\n\s*/)
    .filter(v => v)
    .map(v => v.split(/\s*,\s*/).map(w => parseInt(w, 10)))
    .sort((a, b) => a[2] - b[2]);

  debug('droplets:', droplets);

  const part1 = solve1(droplets);

  /*
  const cube4x4x4 = [
    // Base layer
    [ 2, 2, 1 ],
    [ 3, 2, 1 ],

    [ 2, 3, 1 ],
    [ 3, 3, 1 ],

    // Layer 1
    [ 2, 1, 2 ],
    [ 3, 1, 2 ],

    [ 1, 2, 2 ],
    [ 4, 2, 2 ],

    [ 1, 3, 2 ],
    [ 4, 3, 2 ],

    [ 2, 4, 2 ],
    [ 3, 4, 2 ],

    // Layer 2
    [ 2, 1, 3 ],
    [ 3, 1, 3 ],

    [ 1, 2, 3 ],
    [ 4, 2, 3 ],

    [ 1, 3, 3 ],
    [ 4, 3, 3 ],

    [ 2, 4, 3 ],
    [ 3, 4, 3 ],

    // Top layer
    [ 2, 2, 4 ],
    [ 3, 2, 4 ],

    [ 2, 3, 4 ],
    [ 3, 3, 4 ]
  ];

  doDebug = true;
  const part2 = solve2(cube4x4x4, 0);
  */

  const part2 = solve2(droplets, part1);

  return { day: 18, part1, part2, duration: Date.now() - start };
}

