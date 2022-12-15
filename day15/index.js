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
    }));

  debug(data);

  const part1 = '';

  const part2 = '';

  return { day: 14, part1, part2, duration: Date.now() - start };
}
