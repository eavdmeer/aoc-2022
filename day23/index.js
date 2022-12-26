import * as fs from 'fs/promises';
import makeDebug from 'debug';

const debug = makeDebug('day23');

const X = 0;
const Y = 1;

// Shortcuts for all 8 compass directions
const compass = {
  N: [ 0, -1 ],
  NE: [ 1, -1 ],
  E: [ 1, 0 ],
  SE: [ 1, 1 ],
  S: [ 0, 1 ],
  SW: [ -1, 1 ],
  W: [ -1, 0 ],
  NW: [ -1, -1 ]
};

if (process.argv[2])
{
  day23(process.argv[2]).then(console.log);
}

function solve1(data, rounds = 10)
{
  const key = (...args) => args[0] instanceof Array ?
    `${args[0][0]},${args[0][1]}` : `${args[0]},${args[1]}`;
  const unkey = k => k.split(',').map(v => parseInt(v, 10));

  const elves = new Set();
  data.forEach((row, y) =>
  {
    row.forEach((col, x) =>
    {
      if (col === '#') { elves.add(key(x, y)); }
    });
  });

  /*
    No Elf in the N, NE, or NW, propose moving N
    No Elf in the s, SE, or SW, propose moving S
    No Elf in the W, NW, or SW, propose moving W
    No Elf in the E, NE, or SE, propose moving E
  */
  const checks = [
    [ [ 'N', 'NE', 'NW' ], 'N' ],
    [ [ 'S', 'SE', 'SW' ], 'S' ],
    [ [ 'W', 'NW', 'SW' ], 'W' ],
    [ [ 'E', 'NE', 'SE' ], 'E' ]
  ];

  const max = rounds < 0 ? 100000000 : 10;
  for (let i = 0; i < max; i++)
  {
    const proposals = [];
    const once = new Set();
    const twice = new Set();
    elves.forEach(elf =>
    {
      const [ x, y ] = unkey(elf);

      // Check all compass directions
      if (Object.values(compass)
        .every(v => ! elves.has(key(x + v[X], y + v[Y]))))
      {
        return;
      }

      // Check each of the sets in order and stop on any match
      checks.some(([ dirs, step ]) =>
      {
        // Check for any occupied direction
        if (dirs.map(v => compass[v])
          .some(v => elves.has(key(x + v[X], y + v[Y]))))
        {
          return false;
        }

        const np = key(x + compass[step][X], y + compass[step][Y]);
        if (! twice.has(np))
        {
          if (once.has(np))
          {
            twice.add(np);
          }
          else
          {
            once.add(np);
            proposals.push([ elf, np ]);
          }
        }

        return true;
      });
    });

    // Exit for part2 if there are no more changes
    if (rounds < 0 && proposals.length === 0)
    {
      return i + 1;
    }

    proposals
      .filter(v => !twice.has(v[1]))
      .forEach(([ elf, npos ]) =>
      {
        elves.delete(elf);
        elves.add(npos);
      });

    // Move first check to the end
    checks.push(checks.shift());
  }

  const dim = {
    xmin: Number.MAX_SAFE_INTEGER,
    xmax: Number.MIN_SAFE_INTEGER,
    ymin: Number.MAX_SAFE_INTEGER,
    ymax: Number.MIN_SAFE_INTEGER
  };
  elves.forEach(elf =>
  {
    const [ x, y ] = unkey(elf);
    if (x < dim.xmin) { dim.xmin = x; }
    if (x > dim.xmax) { dim.xmax = x; }
    if (y < dim.ymin) { dim.ymin = y; }
    if (y > dim.ymax) { dim.ymax = y; }
  });

  return (1 + dim.xmax - dim.xmin) * (1 + dim.ymax - dim.ymin) - elves.size;
}

function solve2(data)
{
  return solve1(data, -1);
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
    .filter(v => v)
    .map(v => v.split(''));
  /* eslint-enable no-shadow */

  const part1 = solve1(data);
  if (target.includes('example') && part1 !== 110)
  {
    throw new Error(`Invalid solution: ${part1}. Expecting; 110`);
  }

  const part2 = solve2(data);
  if (target.includes('example') && part2 !== 20)
  {
    throw new Error(`Invalid solution: ${part2}. Expecting; 20`);
  }
  /*
  const part2 = 'disabled';
  */

  return { day: 23, part1, part2, duration: Date.now() - start };
}
