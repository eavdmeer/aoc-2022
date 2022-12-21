import * as fs from 'fs/promises';

let doDebug = false;
if (process.argv[2])
{
  doDebug = process.argv[2].includes('example');
  day21(process.argv[2]).then(console.log);
}

function debug(...args)
{
  if (! doDebug) { return; }
  console.log(...args);
}

function solve1(data)
{
  const values = data
    .filter(v => ! isNaN(v[1]))
    .map(v => [ v[0], parseInt(v[1], 10) ])
    .reduce((a, [ k, v ]) => { a[k] = v; return a; }, {});

  let jobs = data
    .filter(v => isNaN(v[1]))
    .map(([ id, job ]) => [ id, job.map(v => v in values ? values[v] : v) ]);

  debug('values', values);
  debug('jobs', jobs);
  const pruneJobs = i => jobs.splice(i, 1);

  /* eslint-disable-next-line no-unmodified-loop-condition */
  while (! ('root' in values))
  {
    // Find all jobs that are ready to be calculated
    /* eslint-disable no-eval */
    const ready = jobs
      .map((v, i) => [ i, v[0], v[1] ])
      .filter(v => v[2].every(t => /[*+-/]/.test(t) || ! isNaN(t)));

    // Update all known values
    ready
      .map(v => [ v[1], eval(v[2].join(' ')) ])
      .forEach(([ id, val ]) => values[id] = val);

    // Take completed out of jobs
    ready.map(v => v[0])
      .sort((a, b) => b - a)
      .forEach(pruneJobs);

    // Replace symbols with values
    jobs = jobs
      .map(([ id, job ]) =>
        [ id, job.map(t => t in values ? values[t] : t) ]);
  }
  debug('values', values);
  debug('jobs', jobs);

  return values.root;
}

function solve2()
{
  return 'todo';
}

export default async function day21(target)
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
    .map(v => v.split(/\s*:\s*/))
    .map(v => [ v[0], v[1].split(/\s+/) ]);

  /* eslint-enable no-shadow */

  debug('data', data);

  const part1 = solve1(data);

  const part2 = solve2(data);

  return { day: 21, part1, part2, duration: Date.now() - start };
}
