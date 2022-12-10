import * as fs from 'node:fs/promises';

if (process.argv[2])
{
  day10(process.argv[2]).then(console.log);
}

export default async function day10(target)
{
  // const debug = target.includes('example');

  const start = Date.now();

  const content = await fs.readFile(target);

  const cycles = {
    addx: 2,
    noop: 1
  };
  const signalStrength = (cycle, reg) => cycle * reg;

  // Read all code
  const code = content
    .toString()
    .split(/\s*\n\s*/)
    .filter(v => v)
    .map(v => v.split(/\s+/))
    .map(([ op, arg ]) => ({ op, arg: arg ? parseInt(arg, 10) : null }));

  // Execute the code
  let xreg = 1;
  const values = [];
  code.forEach(line =>
  {
    for (let i = 0; i < cycles[line.op]; i++) { values.push(xreg); }
    if (line.op === 'addx') { xreg += line.arg; }
  });
  values.push(xreg);

  let sum = 0;
  for (let i = 19; i < values.length; i += 40)
  {
    sum += signalStrength(i + 1, values[i]);
  }

  const part1 = sum;

  const screen = {
    width: 40,
    height: 6,
    pixels: []
  };

  const row = [];
  values.forEach((x, i) =>
  {
    const p = i % screen.width;
    row.push(p >= x - 1 && p <= x + 1 ? '#' : ' ');

    if (p === screen.width - 1)
    {
      screen.pixels.push(row.join(''));
      row.length = 0;
    }
  });

  const part2 = screen.pixels;

  return { day: 10, part1, part2, duration: Date.now() - start };
}
