import * as fs from 'node:fs/promises';
import makeDebug from 'debug';

const debug = makeDebug('day13');

/* eslint-disable no-eval */

if (process.argv[2])
{
  day13(process.argv[2]).then(console.log);
}

function compare(left, right)
{
  debug('compare:', left, 'and:', right);
  if (left !== undefined && right === undefined)
  {
    debug('  right is out of items first, wrong order');
    return 1;
  }
  if (left === undefined && right !== undefined)
  {
    debug('  left is out of items first, correct order');
    return -1;
  }

  if (typeof left === 'number' && typeof right === 'number')
  {
    debug('  comparing', left, right);
    if (left < right)
    {
      debug('  correct order');
      return -1;
    }
    else if (left > right)
    {
      debug('  wrong order');
      return 1;
    }
    debug('  need more checks');
    return 0;
  }

  if (typeof left !== 'object' || typeof right !== 'object')
  {
    debug('  one side is not an array');
    return compare(
      typeof left === 'object' ? left : [ left ],
      typeof right === 'object' ? right : [ right ]);
  }

  debug('  both arrays');

  for (let j = 0; j < Math.max(left.length, right.length); j++)
  {
    switch (compare(left[j], right[j]))
    {
      case -1:
        return -1;
      case 1:
        return 1;
      default:
        break;
    }
  }
  return 0;
}

export default async function day13(target)
{
  const start = Date.now();

  const content = await fs.readFile(target);

  const data = content
    .toString()
    .split(/\s*\n\n\s*/)
    .filter(v => v)
    .map(v => v.split(/\s*\n\s*/))
    .map(([ l, r ]) => [ eval(l), eval(r) ]);

  debug(data);

  const part1 = data
    .map(([ l, r ]) => compare(l, r) !== 1)
    .reduce((a, v, i) => a + (v ? i + 1 : 0), 0);

  const packets = [
    [ [ 2 ] ],
    [ [ 6 ] ]
  ];
  data.forEach(([ l, r ]) =>
  {
    packets.push(l);
    packets.push(r);
  });

  const sorted = packets.sort(compare);

  const part2 =
    (1 + sorted.findIndex(v => JSON.stringify(v) === '[[2]]')) *
    (1 + sorted.findIndex(v => JSON.stringify(v) === '[[6]]'));

  return { day: 13, part1, part2, duration: Date.now() - start };
}
