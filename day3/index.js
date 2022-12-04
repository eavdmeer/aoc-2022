import * as fs from 'node:fs/promises';

if (process.argv[2])
{
  day3(process.argv[2] || 'data.txt');
}

export default async function day3(target)
{
  const content = await fs.readFile(target);
  const part1 = content
    .toString()
    .split(/\s*\n\s*/)
    .filter(v => v)
    .map(v => [ v.substring(0, v.length / 2), v.substring(v.length / 2) ])
    .map(([ l, r ]) => l.split('').filter(v => r.includes(v)).pop())
    .map(v => v.charCodeAt(0) - 96)
    .map(v => v < 0 ? v + 58 : v)
    .reduce((a, v) => a + v, 0);

  const elves = content
    .toString()
    .split(/\s*\n\s*/)
    .filter(v => v);

  const groupSize = 3;
  const groups = [];
  for (let i = 0; i < elves.length; i += groupSize)
  {
    groups.push(elves.slice(i, i + groupSize));
  }

  const part2 = groups
    .map(([ x, y, z ]) => x.split('')
      .filter(v => y.includes(v) && z.includes(v))
      .pop())
    .map(v => v.charCodeAt(0) - 96)
    .map(v => v < 0 ? v + 58 : v)
    .reduce((a, v) => a + v, 0);

  return { day: 3, part1, part2 };
}

