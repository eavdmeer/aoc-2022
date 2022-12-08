import * as fs from 'node:fs/promises';

if (process.argv[2])
{
  day8(process.argv[2]).then(console.log);
}

function visible(x, y, grid)
{
  const w = grid[0].length;
  const h = grid.length;
  if (x === 0 || y === 0 || x === w - 1 || y === h - 1)
  {
    return true;
  }

  console.log(x, y);

  console.log(
    grid[x]
      .map(v => v < grid[x][y])
  );

  console.log(
    grid
      .map(row => row[x])
      .map(v => v < grid[x][y])
  );

  return false;
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

  console.log(
    grid
      .map((row, y) => row.map((col, x) => visible(x, y, grid)))
  );

  console.log(grid);
  const part1 = '';

  const part2 = '';

  return { day: 9, part1, part2, duration: Date.now() - start };
}
