import * as fs from 'node:fs/promises';

let doDebug = false;
if (process.argv[2])
{
  doDebug = process.argv[2].includes('example');
  day14(process.argv[2]).then(console.log);
}

function debug(...args)
{
  if (! doDebug) { return; }
  console.log(...args);
}

export default async function day14(target)
{
  const start = Date.now();

  const content = await fs.readFile(target);

  const re = /^.* at x=(-?\d+), y=(-?\d+): .* at x=(-?\d+), y=(-?\d+)$/;

  const manhatten = (x1, y1, x2, y2) => Math.abs(x2 - x1) + Math.abs(y2 - y1);

  const data = content
    .toString()
    .split(/\s*\n\s*/)
    .filter(v => v)
    .map(v => v.match(re))
    .map((v, i) => ({
      id: i,
      x: parseInt(v[1], 10),
      y: parseInt(v[2], 10),
      nearest: {
        x: parseInt(v[3], 10),
        y: parseInt(v[4], 10)
      }
    }))
    .map(v =>
    {
      v.radius = manhatten(v.x, v.y, v.nearest.x, v.nearest.y);
      return v;
    });

  debug(data);

  const y = target.includes('example') ? 10 : 2000000;

  const beacons = data
    .filter(v => v.nearest.y === y)
    .map(v => v.nearest.x)
    .filter((v, i, a) => a.indexOf(v) === i);
  debug('beacons at y =', y, beacons);

  const minx = Math.min(...data.map(v => v.x - v.radius));
  const maxx = Math.max(...data.map(v => v.x + v.radius));

  let cnt = 0;
  for (let x = minx; x < maxx; x++)
  {
    if (data.some(sensor =>
      manhatten(x, y, sensor.x, sensor.y) <= sensor.radius) &&
      ! beacons.includes(x))
    {
      cnt++;
    }
  }

  const part1 = cnt;

  const part2 = '';

  return { day: 14, part1, part2, duration: Date.now() - start };
}
