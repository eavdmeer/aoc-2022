import * as fs from 'fs/promises';
import { fromSnafu, toSnafu } from './snafu.js';
import makeDebug from 'debug';

const debug = makeDebug('day25');

if (process.argv[2])
{
  day25(process.argv[2]).then(console.log);
}

function solve1(data)
{
  const total = data
    .map(v => fromSnafu(v))
    .reduce((a, v) => a + v, 0);

  const compare = fromSnafu(toSnafu(total));
  if (compare !== total)
  {
    throw Error(`SNAFU comparison failed! ${compare} !== ${total}`);
  }

  debug('total:', total, '5-based:', total.toString(5));

  return toSnafu(total.toString(5));
}

function solve2()
{
  return 'todo';
}

export default async function day25(target)
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
  if (target.includes('example') && part1 !== '2=-1=0')
  {
    throw new Error(`Invalid solution: ${part1}. Expecting; '2=-1=0'`);
  }

  const part2 = solve2(data);
  if (target.includes('example') && part2 !== 'todo')
  {
    throw new Error(`Invalid solution: ${part2}. Expecting; 'todo'`);
  }

  return { day: 25, part1, part2, duration: Date.now() - start };
}
