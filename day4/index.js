import * as fs from 'node:fs/promises';

if (process.argv[2])
{
  day4(process.argv[2]).then(console.log);
}

export default async function day4(target)
{
  const content = await fs.readFile(target);
  const part1 = content
    .toString()
    .split(/\s*\n\s*/)
    .filter(v => v)
    .map(v => v
      .split(',')
      .map(w => w
        .split('-')
        .map(x => parseInt(x, 10))
      )
    )
    .filter(([ l, r ]) =>
      l[0] >= r[0] && l[1] <= r[1] ||
      r[0] >= l[0] && r[1] <= l[1]
    )
    .length;

  const part2 =
    content
      .toString()
      .split(/\s*\n\s*/)
      .filter(v => v)
      .map(v => v
        .split(',')
        .map(w => w
          .split('-')
          .map(x => parseInt(x, 10))
        )
      )
      .filter(([ l, r ]) =>
        l[0] >= r[0] && l[0] <= r[1] ||
        r[0] >= l[0] && r[0] <= l[1]
      )
      .length;
  return { day: 4, part1, part2 };
}
