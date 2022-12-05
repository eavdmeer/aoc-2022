import * as fs from 'node:fs/promises';

if (process.argv[2])
{
  day4(process.argv[2] || 'data.txt');
}

export default async function day4(target)
{
  const content = await fs.readFile(target);

  // Split content on an empty line
  const [ stacksContent, movesContent ] = content.toString().split('\n\n');

  // Get all stacks data, but reverse it
  const data = stacksContent
    .split(/\s*\n\s*/)
    .filter(v => v)
    .reverse();

  // Create all the stacks from the first line of the stack data
  const stacks = data
    .shift()
    .split(/\s+/)
    .filter(v => v)
    .reduce((a, v) => { a[v] = []; return a; }, {});

  // Extract all elements on the stacks and push them
  data
    .map(v =>
    {
      const res = [];
      for (let i = 1; i < v.length; i += 4)
      {
        res.push(v.charAt(i));
      }
      return res;
    })
    .forEach(v =>
      v.forEach((s, i) =>
      {
        if (! /^\s*$/.test(s))
        {
          stacks[i + 1].push(s);
        }
      })
    );

  // Parse all move instructions
  const moves = movesContent
    .split(/\s*\n\s*/)
    .filter(v => v)
    .map(v => v.match(/^move (\d+) from (\d+) to (\d+)$/))
    .map(m => ({ from: m[2], to: m[3], count: m[1] }));

  moves.forEach(m =>
  {
    for (let i = 0; i < m.count; i++)
    {
      const popped = stacks[m.from].pop();
      stacks[m.to].push(popped);
    }
  });

  const part1 = Object.values(stacks).map(v => v.pop()).join('');

  const part2 = '';

  return { day: 5, part1, part2 };
}
