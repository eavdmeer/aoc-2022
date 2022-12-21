import * as fs from 'fs/promises';
import linear from 'linear-solve';

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

  const jobs = data
    .filter(v => isNaN(v[1]))
    .map(([ id, job ]) => [ id, job.map(v => v in values ? values[v] : v) ]);

  debug('values', values);
  debug('jobs', jobs);
  const pruneJobs = i => jobs.splice(i, 1);
  const reduced = v => v[2].every(t => /[*+-/0-9]/.test(t));

  /* eslint-disable-next-line no-unmodified-loop-condition */
  while (! ('root' in values))
  {
    // Find all jobs that are ready to be calculated
    /* eslint-disable no-eval */
    const ready = jobs
      .map((v, i) => [ i, v[0], v[1] ])
      .filter(reduced);

    // Update all known values
    ready
      .map(v => [ v[1], eval(v[2].join(' ')) ])
      .forEach(([ id, val ]) => values[id] = val);

    // Take completed out of jobs
    ready.map(v => v[0])
      .sort((a, b) => b - a)
      .forEach(pruneJobs);

    // Replace symbols with values
    jobs.forEach(job =>
    {
      job[1] = job[1].map(t => t in values ? values[t] : t);
    });
    /*
    jobs = jobs
      .map(([ id, job ]) =>
        [ id, job.map(t => t in values ? values[t] : t) ]);
    */
  }
  debug('values', values);
  debug('jobs', jobs);

  return values.root;
}

function solve2(data)
{
  const values = data
    .filter(v => v[0] !== 'humn' && v[0] !== 'root')
    .filter(v => ! isNaN(v[1]) && v[0] !== 'humn' && v[0] !== 'root')
    .map(v => [ v[0], parseInt(v[1], 10) ])
    .reduce((a, [ k, v ]) => { a[k] = v; return a; }, {});

  const rootTerms = data
    .find(v => v[0] === 'root')
    .pop()
    .filter(v => ! /[*+-/]/.test(v));

  const jobs = data
    .filter(v => v[0] !== 'humn' && v[0] !== 'root')
    .map(([ id, job ]) => [ id, job.map(v => v in values ? values[v] : v) ])
    .map(([ id, job ]) =>
      [ id, id !== 'root' ? job : [ job[0], '==', job[2] ] ])
    .map(([ id, job ]) => [ id, id !== 'humn' ? job : [ 'pppw', '+', '0' ] ]);

  // Extra equation for our desired outcome
  jobs.push([ rootTerms[0], [ rootTerms[1], '+', 0 ] ]);

  // Utility functions
  const pruneJob = i => jobs.splice(i, 1);
  const reduced = v => v[2].every(t => /[*+-/0-9]/.test(t));
  const reduce = () => jobs.forEach(job =>
  {
    job[1] = job[1].map(t => t in values ? values[t] : t);
  });
  const getCount = () => Object.keys(values).length;

  let lastCount = -1;

  /* eslint-disable-next-line no-constant-condition */
  while (getCount() !== lastCount)
  {
    lastCount = getCount();

    // Find all jobs that are ready to be calculated
    const ready = jobs
      .map((v, i) => [ i, v[0], v[1] ])
      .filter(reduced);

    // Update all known values
    ready
      .map(v => [ v[1], eval(v[2].join(' ')) ])
      .forEach(([ id, val ]) => values[id] = val);

    // Take completed out of jobs, highest index first
    ready.map(v => v[0])
      .sort((a, b) => b - a)
      .forEach(pruneJob);

    // Replace symbols with values
    reduce();
  }

  debug('final values', values);
  debug('final jobs', jobs);

  debug('equations:\n', jobs.map(([ left, right ]) =>
    `${left in values ? values[left] : left} = ${right.join(' ')}`).join('\n'));

  // Get all unknown variables
  const unknown = jobs
    .map(([ l, r ]) => `${l},${r[0]},${r[2]}`).join(',')
    .match(/[^,]{4}/g)
    .filter(v => !(v in values))
    .filter((v, i, a) => a.indexOf(v) === i)
    .sort();

  debug('unknown:', unknown);

  const matrix = jobs.map(([ left, [ p1, oper, p2 ] ]) =>
  {
    const terms = { left: {}, right: 0 };
    unknown.forEach(k => terms.left[k] = 0);

    const num = isNaN(p1) ? p2 : p1;
    const symbol = isNaN(p1) ? p1 : p2;

    if (left in values)
    {
      terms.right = -values[left];
    }
    else
    {
      terms.left[left] = 1;
    }
    if (oper === '+')
    {
      terms.right += num;
      terms.left[symbol] = -1;
    }
    else if (oper === '-')
    {
      terms.right -= num;
      terms.left[symbol] = isNaN(p1) ? -1 : 1;
    }
    else if (oper === '/')
    {
      Object.keys(terms.left).forEach(k => terms.left[k] *= num);
      terms.left[symbol] = -1;
      terms.right *= num;
    }
    else if (oper === '*')
    {
      terms.left[symbol] = -num;
    }
    return [
      ...Object.keys(terms.left).sort().map(k => terms.left[k]),
      terms.right
    ];
  });
  debug('matrix', matrix);
  if (matrix.some(row => row.length !== unknown.length + 1))
  {
    throw new Error('bad conversion');
  }

  const n = [];
  matrix.forEach(row => n.push(row.pop()));
  const solution = linear.solve(matrix, n);
  const idx = unknown.indexOf('humn');

  return solution[idx];
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

  doDebug = false;
  const part1 = solve1(data);
  doDebug = true;

  const part2 = solve2(data);

  return { day: 21, part1, part2, duration: Date.now() - start };
}
