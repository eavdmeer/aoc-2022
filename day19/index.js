import * as fs from 'fs/promises';

let doDebug = false;
if (process.argv[2])
{
  doDebug = process.argv[2].includes('example');
  day19(process.argv[2]).then(console.log);
}

function debug(...args)
{
  if (! doDebug) { return; }
  console.log(...args);
}

function solve1()
{
  return 0;
}

export default async function day19(target)
{
  const start = Date.now();
  debug('starting');

  const content = await fs.readFile(target);

  const re = /^Each (.*) robot costs ([^.]+)$/;

  /* eslint-disable no-shadow */
  const blueprints = content
    .toString()
    .trim()
    .replace(/\s*\n\s*/g, ' ')
    .replace(/\s*Each/g, 'Each')
    .split(/\s*Blueprint\s*/)
    .filter(v => v)
    .map(v => v.split(/\s*:\s*/))
    .map(v => [ v[0], v[1]
      .split('.')
      .filter(v => v)
      .map(v => v.match(re))
      .map(v => [ v[1], v[2]
        .split(/\s*and\s*/)
        .map(v => v.split(/\s+/))
        .reduce((a, [ v, k ]) => { a[k] = v; return a; }, {})
      ])
      .reduce((a, [ k, v ]) => { a[k] = v; return a; }, {})
    ])
    .map(v => ({ id: v[0], ...v[1] }));

  debug('blueprints', blueprints);

  const part1 = solve1(blueprints);

  const part2 = 'todo';

  return { day: 19, part1, part2, duration: Date.now() - start };
}
