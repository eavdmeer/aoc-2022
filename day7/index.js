import * as fs from 'node:fs/promises';

if (process.argv[2])
{
  day7(process.argv[2]).then(console.log);
}

export default async function day7(target)
{
  const start = Date.now();

  const content = await fs.readFile(target);

  const path = [];
  const sizes = {};

  content
    .toString()
    .split(/\s*\n\s*/)
    .filter(v => v && v !== '$ ls' && ! /^dir/.test(v))
    .forEach(line =>
    {
      const m = line.match(/^\$ cd (.*)$/);
      const n = line.match(/^(\d+) (.*)$/);
      const p = path.join('/').replace('//', '/');
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
      }
      else if (n)
      {
        sizes[p] = sizes[p] ? sizes[p] + parseInt(n[1], 10) :
          parseInt(n[1], 10);
      }
    });

  const totalSizes = {};
  Object.keys(sizes).forEach(s =>
  {
    totalSizes[s] = Object.keys(sizes)
      .filter(k => k.startsWith(s))
      .reduce((a, v) => a + sizes[v], 0);
  });

  const limit = 100000;

  const selected = Object.entries(totalSizes)
    .filter(v => v[1] <= limit);

  console.log('selected', selected);

  const unique = selected
    .filter((p, i, a) =>
    {
      console.log('check', p[0]);
      console.log(! a.some(x => p[0].startsWith(`${x[0]}/`)));

      return ! a.some(x => p[0].startsWith(`${x[0]}/`));
    });

  console.log('unique', unique);

  const part1 = unique
    .reduce((a, v) => a + v[1], 0);

  const part2 = '';

  return { day: 7, part1, part2, duration: Date.now() - start };
}
