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
        `${d[0] + 1},${d[1]},${d[2]}` === `${v[0]},${v[1]},${v[2]}` ? 1 : 0,
        `${d[0] - 1},${d[1]},${d[2]}` === `${v[0]},${v[1]},${v[2]}` ? 1 : 0,
        `${d[0]},${d[1] + 1},${d[2]}` === `${v[0]},${v[1]},${v[2]}` ? 1 : 0,
        `${d[0]},${d[1] - 1},${d[2]}` === `${v[0]},${v[1]},${v[2]}` ? 1 : 0,
        `${d[0]},${d[1]},${d[2] + 1}` === `${v[0]},${v[1]},${v[2]}` ? 1 : 0,
        `${d[0]},${d[1]},${d[2] - 1}` === `${v[0]},${v[1]},${v[2]}` ? 1 : 0
      ].reduce((a, w) => a + w, 0);
    });
  });

  return score;
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
    .map(v => v.split(/\s*,\s*/).map(w => parseInt(w, 10)));

  debug('droplets:', droplets);

  const part1 = solve1(droplets);
  const part2 = 'todo';

  return { day: 18, part1, part2, duration: Date.now() - start };
}

