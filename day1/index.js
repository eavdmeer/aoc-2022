import * as fs from 'node:fs/promises';

if (process.argv[2])
{
  day1(process.argv[2]).then(console.log);
}

export default async function day1(target)
{
  const start = Date.now();

  const content = await fs.readFile(target);

  const totals = content
    .toString()
    .split('\n\n')
    .map(v => v
      .split(/\s*\n\s*/)
      .filter(w => w !== '')
      .reduce((a, w) => a + parseInt(w, 10), 0)
    );

  const part1 = Math.max(...totals);

  const part2 = totals
    .sort()
    .reverse()
    .slice(0, 3)
    .reduce((a, v) => a + v, 0);

  return { day: 1, part1, part2, duration: Date.now() - start };
}
