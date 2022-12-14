import * as fs from 'node:fs/promises';

/* eslint-disable no-eval */

let doDebug = false;
if (process.argv[2])
{
  doDebug = process.argv[2].includes('example');
  day14(process.argv[2]).then(console.log);
}

function debug(...args)
{
  if (! doDebug) { return; }
  console.log(...args);
}

export default async function day14(target)
{
  const start = Date.now();

  const content = await fs.readFile(target);

  const data = content
    .toString()
    .split(/\s*\n\s*/)
    .filter(v => v)
    .map(v => v.split(/\s*->\s*/)
      .map(w => w.split(',')
        .map(m => parseInt(m, 10))
      )
      .map(w => ({ x: w[0], y: w[1] }))
    );

  debug(data);

  const part1 = '';

  const part2 = '';

  return { day: 14, part1, part2, duration: Date.now() - start };
}
