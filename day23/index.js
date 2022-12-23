import * as fs from 'fs/promises';

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

function solve1(data)
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

  debug('grid:', elves);

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

  const expectSize = elves.size;

  for (let i = 0; i < 10; i++)
  {
    debug('round:', i + 1);
    const proposals = [];
    elves.forEach(elf =>
    {
      const [ x, y ] = unkey(elf);

      // Check all compass directions
      if (Object.values(compass)
        .every(v => ! elves.has(key(x + v[X], y + v[Y]))))
      {
        debug('no neighbors at all, no proposal');
        return;
      }

      // Check each of the sets in order and stop on any match
      checks.some(([ dirs, step ]) =>
      {
        // Check for any occupied direction
        if (dirs.map(v => compass[v])
          .some(v => elves.has(key(x + v[X], y + v[Y]))))
        {
          debug('elf', elf, dirs.join(','), 'not all free, continuing');
          return false;
        }
        const np = key(x + compass[step][X], y + compass[step][Y]);
        debug('elf', elf, dirs.join(', '), 'are free, propose', step, 'to', np);
        proposals.push([ elf, np ]);
        return true;
      });
    });

    proposals
      // Eliminate all proposals with duplicate position
      .filter((v, i, a) => a.filter(w => w[1] === v[1]).length === 1)
      .forEach(([ elf, npos ]) =>
      {
        debug('move', elf, 'to new position', npos);
        if (elves.has(npos)) { throw new Error(`${npos} occupied!`); }
        elves.delete(elf);
        elves.add(npos);
        if (elves.has(elf)) { throw new Error(`${npos} still there!`); }
        if (elves.size !== expectSize) { throw new Error('size mismatch!'); }
      });

    // Move first check to the end
    checks.push(checks.shift());
  }

  debug('elves:', elves);

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
  debug('range is:', dim);

  return (1 + dim.xmax - dim.xmin) * (1 + dim.ymax - dim.ymin) - elves.size;
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
    .filter(v => v)
    .map(v => v.split(''));
  /* eslint-enable no-shadow */

  debug('data', data);

  const part1 = solve1(data);
  if (target.includes('example') && part1 !== 110)
  {
    throw new Error(`Invalid solution: ${part1}. Expecting; 110`);
  }

  const part2 = solve2(data);
  if (target.includes('example') && part2 !== 'todo')
  {
    throw new Error(`Invalid solution: ${part1}. Expecting; 'todo'`);
  }

  return { day: 23, part1, part2, duration: Date.now() - start };
}
