import * as fs from 'fs/promises';

let doDebug = false;
if (process.argv[2])
{
  doDebug = process.argv[2].includes('example');
  day25(process.argv[2]).then(console.log);
}

function debug(...args)
{
  if (! doDebug) { return; }
  console.log(...args);
}

function solve1(data)
{
  const p1 = { 0: 0, 1: 1, 2: 2, '=': 0, '-': 0 };
  const p2 = { 0: 0, 1: 0, 2: 0, '=': 2, '-': 1 };

  const fromSnafu = v => parseInt(v.replace(/[012=-]/g, m => p1[m]), 5) -
      parseInt(v.replace(/[012=-]/g, m => p2[m]), 5);

  const toSnafu = v =>
  {
    const result = [];
    debug('converting', v, 'to SNAFU');
    const digits = v.toString(5).split('');
    debug('digits:', digits);

    let carry = false;
    digits.reverse().forEach(digit =>
    {
      debug('digit:', digit, 'carry:', carry);
      switch (digit)
      {
        case '0':
          result.unshift(carry ? 1 : 0);
          carry = false;
          break;
        case '1':
          result.unshift(carry ? 2 : 1);
          carry = false;
          break;
        case '2':
          result.unshift(carry ? '=' : 2);
          break;
        case '3':
          result.unshift(carry ? '-' : '=');
          carry = true;
          break;
        case '4':
          result.unshift(carry ? '0' : '-');
          carry = true;
          break;
        default:
          result.unshift(digit);
      }
    });
    if (carry) { result.unshift(1); }
    debug('result:', result.join(''));

    return result.join('');
  };

  const tests = [
    [ 1, '1' ],
    [ 2, '2' ],
    [ 3, '1=' ],
    [ 4, '1-' ],
    [ 5, '10' ],
    [ 6, '11' ],
    [ 7, '12' ],
    [ 8, '2=' ],
    [ 9, '2-' ],
    [ 10, '20' ],
    [ 15, '1=0' ],
    [ 20, '1-0' ],
    [ 2022, '1=11-2' ],
    [ 12345, '1-0---0' ],
    [ 314159265, '1121-1110-1=0' ]
  ];

  const failed = tests
    .map(([ input, output ]) => [ input, output, toSnafu(input) ])
    .filter(([ , output, compare ]) => compare !== output);
  if (failed.length !== 0)
  {
    failed.forEach(v => console.log('*** test failed:', v));
    throw new Error('Test cases failed!');
  }

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
