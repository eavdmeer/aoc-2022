import * as fs from 'fs/promises';

let doDebug = false;
if (process.argv[2])
{
  doDebug = process.argv[2].includes('example');
  day20(process.argv[2]).then(console.log);
}

/*
 * The encrypted file is a list of numbers. To mix the file, move each
 * number forward or backward in the file a number of positions equal to
 * the value of the number being moved. The list is circular, so moving a
 * number off one end of the list wraps back around to the other end as if
 * the ends were connected.
 */

function debug(...args)
{
  if (! doDebug) { return; }
  console.log(...args);
}

function solve1(data)
{
  const result = data.slice();
  const len = data.length;
  const locations = data.map((v, i) => i);
  debug('locations', locations);

  debug('initial arrangement');
  debug(result.join(', '));
  data.forEach(v =>
  {
    // Find first occurrence
    const idx = result.indexOf(v);
    // Take it out
    result.splice(idx, 1);
    const nidx = idx + v <= 0 ?
      idx + v + len - 1 :
      idx + v > len - 1 ?
        1 + (idx + v) % len :
        idx + v;
    debug('moving', v, 'to new index', nidx);
    result.splice(nidx, 0, v);
    debug(result.join(', '));
  });
  return 'todo';
}

function solve2()
{
  return 'todo';
}

export default async function day20(target)
{
  const start = Date.now();
  debug('starting');

  const content = await fs.readFile(target);

  /* eslint-disable no-shadow */
  const data = content
    .toString()
    .trim()
    .split(/\s*\n\s*/)
    .filter(v => v)
    .map(v => parseInt(v, 10));
  /* eslint-enable no-shadow */

  debug('data', data);

  const part1 = solve1(data);

  const part2 = solve2(data);

  return { day: 20, part1, part2, duration: Date.now() - start };
}
