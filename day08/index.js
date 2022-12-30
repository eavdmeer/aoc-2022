import * as fs from 'node:fs/promises';

if (process.argv[2])
{
  day8(process.argv[2]).then(console.log);
}

function viewScore(x, y, grid)
{
  const w = grid[0].length;
  const h = grid.length;

  if (x === 0 || y === 0 || x === w - 1 || y === h - 1)
  {
    return 0;
  }

  const z = grid[y][x];

  return (
    (1 + grid[y].slice(x + 1, w)
      .findIndex(v => v >= z) || w - x - 1) *
    (1 + grid[y].slice(0, x)
      .findIndex(v => v >= z) || x) *
    (1 + grid.slice(y + 1, h)
      .map(v => v[x])
      .findIndex(v => v >= z) || h - y - 1) *
    (1 + grid.slice(0, y)
      .map(v => v[x])
      .findIndex(v => v >= z) || y)
  );
}

function visible(x, y, grid)
{
  const w = grid[0].length;
  const h = grid.length;
  const z = grid[y][x];

  return (
    x === 0 || y === 0 || x === w - 1 || y === h - 1 ||
    z > Math.max(...grid[y].slice(x + 1, w)) ||
    z > Math.max(...grid[y].slice(0, x)) ||
    z > Math.max(...grid.slice(y + 1, h).map(v => v[x])) ||
    z > Math.max(...grid.slice(0, y).map(v => v[x]))
  );
}

export default async function day8(target)
{
  const start = Date.now();

  const content = await fs.readFile(target);

  const grid = content
    .toString()
    .split(/\s*\n\s*/)
    .filter(v => v)
    .map(v => v.split('').map(w => parseInt(w, 10)));

  let count = 0;
  for (let y = 0; y < grid.length; y++)
  {
    for (let x = 0; x < grid[0].length; x++)
    {
      count += visible(x, y, grid) ? 1 : 0;
    }
  }
  const part1 = count;

  const scores = [];
  for (let y = 0; y < grid.length; y++)
  {
    for (let x = 0; x < grid[0].length; x++)
    {
      scores.push(viewScore(x, y, grid));
    }
  }
  const part2 = Math.max(...scores);

  return { day: 9, part1, part2, duration: Date.now() - start };
}
