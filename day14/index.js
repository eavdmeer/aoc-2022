import * as fs from 'node:fs/promises';

/* eslint-disable no-eval */

// Markers
const EMPTY = '.';
const SAND = 'o';
const SOURCE = '+';
const STONE = '#';

let doDebug = false;
if (process.argv[2])
{
  doDebug = process.argv[2].includes('example');
  day14(process.argv[2]).then(console.log);
}

function debug(...args)
{
  if (! doDebug) { return; }
  console.log(...args);
}

function Grid(lines, source, addFloor = false)
{
  debug('create grid from', lines);

  this.source = source;

  const points = [ { x: 500, y: 0 } ];
  lines.forEach(line => line.forEach(p => points.push(p)));

  this.xmin = Math.min(...points.map(v => v.x));
  this.xmax = Math.max(...points.map(v => v.x));
  this.ymin = Math.min(...points.map(v => v.y));
  this.ymax = Math.max(...points.map(v => v.y));

  if (addFloor)
  {
    // Required width for a full pyramid
    const w = 2 + this.ymax - this.ymin;
    debug('adding floor width', 2 * w);

    if (500 - this.xmin < w) { this.xmin = 500 - w; }
    if (this.xmax - 500 < w) { this.xmax = 500 + w; }

    this.ymax += 2;
  }

  // Allocate an empty grid with columns for each x
  this.cols = [];
  for (let x = this.xmin; x <= this.xmax; x++)
  {
    const col = [];
    for (let y = this.ymin; y <= this.ymax; y++)
    {
      col.push(EMPTY);
    }
    this.cols.push(col);
  }

  // Utility functions
  this.putChar = (p, c) => this.cols[p.x - this.xmin][p.y - this.ymin] = c;
  this.charAt = p => this.cols[p.x - this.xmin]?.[p.y - this.ymin];
  this.getCol = x => this.cols[x - this.xmin];
  this.draw = clear =>
  {
    if (clear) { console.clear(); }

    const rows = [];
    for (let y = 0; y < this.cols[0].length; y++)
    {
      const row = [];
      for (let x = 0; x < this.cols.length; x++)
      {
        row.push(this.cols[x][y]);
      }
      rows.push(row);
    }
    console.log(rows.map(r => r.join('')).join('\n'));
  };
  this.dropSand = (p = this.source) =>
  {
    debug('dropping sand from:', p);

    // Source is already occupied with sand
    if (this.charAt(p) === SAND) { return false; }

    let x = p.x;
    let y = p.y;
    const free = (v, yv) => yv > y && v !== EMPTY;
    while (y < this.ymax)
    {
      const idx = this.getCol(x).findIndex(free);

      // Fell through the colomn. Done
      if (idx === undefined) { break; }

      // Check the column on the left
      const left = this.charAt({ x: x - 1, y: idx });
      // Fell off the grid on the left side
      if (left === undefined) { break; }
      if (left === EMPTY)
      {
        x--;
        y = idx;
        continue;
      }

      // Check the column on the right
      const right = this.charAt({ x: x + 1, y: idx });
      // Fell off the grid on the right side
      if (left === undefined) { break; }
      if (right === EMPTY)
      {
        x++;
        y = idx;
        continue;
      }

      // Sand settles
      debug('settling grain of sand');
      this.putChar({ x: x, y: idx - 1 }, SAND);

      return true;
    }

    return false;
  };

  // Draw the sand origin
  this.putChar({ x: this.source.x, y: this.source.y }, SOURCE);

  // Draw all lines
  const allLines = [ ...lines ];
  if (addFloor)
  {
    allLines.push([
      { x: this.xmin, y: this.ymax },
      { x: this.xmax, y: this.ymax }
    ]);
    debug('added floor line', allLines);
  }
  allLines.forEach(line =>
  {
    for (let i = 0; i < line.length - 1; i++)
    {
      const p1 = line[i];
      const p2 = line[i + 1];
      if (p1.x === p2.x)
      {
        // vertical line
        for (let y = Math.min(p1.y, p2.y); y <= Math.max(p1.y, p2.y); y++)
        {
          this.putChar({ x: p1.x, y }, STONE);
        }
      }
      else if (p1.y === p2.y)
      {
        // horizontal
        for (let x = Math.min(p1.x, p2.x); x <= Math.max(p1.x, p2.x); x++)
        {
          this.putChar({ x, y: p1.y }, STONE);
        }
      }
    }
  });

}

export default async function day14(target)
{
  const start = Date.now();

  const content = await fs.readFile(target);

  const data = content
    .toString()
    .split(/\s*\n\s*/)
    .filter(v => v)
    .map(v => v.split(/\s*->\s*/)
      .map(w => w.split(',')
        .map(m => parseInt(m, 10))
      )
      .map(w => ({ x: w[0], y: w[1] }))
    );

  const g1 = new Grid(data, { x: 500, y: 0 });

  let cnt = 0;
  while (g1.dropSand())
  {
    if (doDebug) { g1.draw(true); }
    cnt++;
  }

  const part1 = cnt;

  const g2 = new Grid(data, { x: 500, y: 0 }, true);
  cnt = 0;
  while (g2.dropSand())
  {
    if (doDebug) { g2.draw(true); }
    cnt++;
  }

  const part2 = cnt;

  return { day: 14, part1, part2, duration: Date.now() - start };
}
