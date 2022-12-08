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

  const scores = { left: x, right: w - x - 1, up: y, down: h - y - 1 };

  // Check right
  for (let xi = x + 1; xi < w; xi++)
  {
    if (grid[y][xi] >= z)
    {
      scores.right = xi - x;
      break;
    }
  }

  // Check left
  for (let xi = x - 1; xi >= 0; xi--)
  {
    if (grid[y][xi] >= z)
    {
      scores.left = x - xi;
      break;
    }
  }

  // Check down
  for (let yi = y + 1; yi < h; yi++)
  {
    if (grid[yi][x] >= z)
    {
      scores.down = yi - y;
      break;
    }
  }

  // Check up
  for (let yi = y - 1; yi >= 0; yi--)
  {
    if (grid[yi][x] >= z)
    {
      scores.up = y - yi;
      break;
    }
  }

  return Object.values(scores).reduce((a, v) => a * v, 1);
}

function visible(x, y, grid)
{
  const w = grid[0].length;
  const h = grid.length;

  if (x === 0 || y === 0 || x === w - 1 || y === h - 1)
  {
    return true;
  }

  const z = grid[y][x];

  const votes = { left: true, right: true, up: true, down: true };

  // Check right
  for (let xi = x + 1; xi < w; xi++)
  {
    if (grid[y][xi] >= z)
    {
      votes.right = false;
      break;
    }
  }

  // Check left
  for (let xi = 0; xi < x; xi++)
  {
    if (grid[y][xi] >= z)
    {
      votes.left = false;
      break;
    }
  }

  // Check down
  for (let yi = y + 1; yi < h; yi++)
  {
    if (grid[yi][x] >= z)
    {
      votes.down = false;
      break;
    }
  }

  // Check up
  for (let yi = 0; yi < y; yi++)
  {
    if (grid[yi][x] >= z)
    {
      votes.up = false;
      break;
    }
  }

  return Object.values(votes).reduce((a, v) => a || v, false);
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
