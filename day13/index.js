import * as fs from 'node:fs/promises';

/* eslint-disable no-eval */

let doDebug = false;
if (process.argv[2])
{
  doDebug = process.argv[2].includes('example');
  day13(process.argv[2]).then(console.log);
}

function debug(...args)
{
  if (! doDebug) { return; }
  console.log(...args);
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
    .map(([ l, r ]) => ({ l: eval(l), r: eval(r) }));

  debug(data);

  const part1 = '';

  const part2 = '';

  return { day: 13, part1, part2, duration: Date.now() - start };
}
