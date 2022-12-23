import * as fs from 'fs/promises';

let doDebug = false;
if (process.argv[2])
{
  doDebug = process.argv[2].includes('example');
  day23(process.argv[2]).then(console.log);
}

function debug(...args)
{
  if (! doDebug) { return; }
  console.log(...args);
}

function solve1()
{
  return 'todo';
}

function solve2()
{
  return 'todo';
}

export default async function day23(target)
{
  const start = Date.now();
  debug('starting');

  const content = await fs.readFile(target);

  /* eslint-disable no-shadow */
  const data = content
    .toString()
    .trim()
    .split(/\s*\n\s*/)
    .filter(v => v);
  /* eslint-enable no-shadow */

  debug('data', data);

  const part1 = solve1(data);
  if (target.includes('example') && part1 !== 'todo')
  {
    throw new Error(`Invalid solution: ${part1}. Expecting; 'todo'`);
  }

  const part2 = solve2(data);
  if (target.includes('example') && part2 !== 'todo')
  {
    throw new Error(`Invalid solution: ${part1}. Expecting; 'todo'`);
  }

  return { day: 23, part1, part2, duration: Date.now() - start };
}
