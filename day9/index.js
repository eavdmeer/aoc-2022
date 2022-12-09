import * as fs from 'node:fs/promises';

if (process.argv[2])
{
  day9(process.argv[2]).then(console.log);
}

function draw(knots)
{
  // console.log('knots:', knots);
  const zero = [ ...knots, { x: 0, y: 0 } ];

  const xmin = Math.min(...zero.map(v => v.x)) - 1;
  const xmax = 1 + Math.max(...zero.map(v => v.x));
  const ymin = Math.min(...zero.map(v => v.y)) - 1;
  const ymax = 1 + Math.max(...zero.map(v => v.y));

  const rows = [];
  for (let y = ymin; y <= ymax; y++)
  {
    const row = [];
    for (let x = xmin; x <= xmax; x++) { row.push('.'); }
    rows.push(row);
  }

  zero.reverse().forEach((k, i) =>
    rows[ymax - k.y][k.x - xmin] = i === 10 ? 'H' : i === 0 ? 's' : 10 - i
  );
  console.log(rows.map(r => r.join('')).join('\n'));
}

const move = {
  r: p => p.x++,
  l: p => p.x--,
  d: p => p.y--,
  u: p => p.y++
};

function drag(h, t, debug = false)
{
  if (Math.abs(t.x - h.x) > 1 || Math.abs(t.y - h.y) > 1)
  {
    if (t.x !== h.x)
    {
      move[t.x < h.x ? 'r' : 'l'](t);
    }
    if (t.y !== h.y)
    {
      move[t.y < h.y ? 'u' : 'd'](t);
    }

    if (debug)
    {
      console.log('  moved to:', t);
    }
  }
  else if (debug)
  {
    console.log(h, t, 'nothing to do');
  }
}

export default async function day9(target)
{
  const debug = target.includes('example');

  const start = Date.now();

  const content = await fs.readFile(target);

  const moves = content
    .toString()
    .split(/\s*\n\s*/)
    .filter(v => v)
    .map(v => v.split(/\s+/))
    .map(([ d, c ]) => ({ dir: d.toLowerCase(), count: parseInt(c, 10) }));

  const h = { x: 0, y: 0 };
  const t = { x: 0, y: 0 };

  let visited = { '0, 0': true };

  moves.forEach(m =>
  {
    for (let i = 0; i < m.count; i++)
    {
      // Move the head
      move[m.dir](h);
      // Drag the tail
      drag(h, t);
      visited[`${t.x}, ${t.y}`] = true;
    }
  });

  const part1 = Object.keys(visited).length;

  const knots = [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 }
  ];

  visited = { '0, 0': true };
  moves.forEach(m =>
  {
    if (debug) { console.log('move', m.dir, m.count, 'steps'); }
    for (let i = 0; i < m.count; i++)
    {
      // Move the head
      move[m.dir](knots[0]);
      // Drag the rest of the body
      for (let k = 1; k < knots.length; k++)
      {
        drag(knots[k - 1], knots[k], false);
      }
      visited[`${knots[9].x}, ${knots[9].y}`] = true;
    }
    if (debug) { draw(knots); }
  });

  const part2 = Object.keys(visited).length;

  return { day: 9, part1, part2, duration: Date.now() - start };
}
