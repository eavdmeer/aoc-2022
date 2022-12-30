import * as fs from 'node:fs/promises';

if (process.argv[2])
{
  day07(process.argv[2]).then(console.log);
}

export default async function day07(target)
{
  const start = Date.now();

  const content = await fs.readFile(target);

  const path = [];
  const sizes = {};

  content
    .toString()
    .split(/\s*\n\s*/)
    // Ignore enpty lines, dir and ls entries
    .filter(v => v && v !== '$ ls' && ! /^dir/.test(v))
    .forEach(line =>
    {
      const m = line.match(/^\$ cd (.*)$/);
      if (m)
      {
        if (m[1] === '..')
        {
          path.pop();
        }
        else
        {
          path.push(m[1]);
        }
        return;
      }
      const n = line.match(/^(\d+) (.*)$/);
      if (n)
      {
        const size = parseInt(n[1], 10);
        // Add size to this directory and all its parents
        path.forEach((dir, i) =>
        {
          const p = path.slice(0, i + 1).join('/');
          sizes[p] = sizes[p] ? sizes[p] + size : size;
        });
      }
    });

  const limit = 100000;

  const part1 = Object.entries(sizes)
    .filter(v => v[1] <= limit)
    .reduce((a, v) => a + v[1], 0);

  const diskSize = 70000000;
  const required = 30000000;
  const inUse = sizes['/'];
  const toFree = required - (diskSize - inUse);

  const part2 = Object.entries(sizes)
    .sort((a, b) => a[1] - b[1])
    .filter(v => v[1] >= toFree)
    .shift()
    .pop();

  return { day: 7, part1, part2, duration: Date.now() - start };
}
