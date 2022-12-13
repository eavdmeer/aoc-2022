import * as fs from 'node:fs/promises';

let doDebug = false;
if (process.argv[2])
{
  doDebug = process.argv[2].includes('example');
  day12(process.argv[2]).then(console.log);
}

function debug(...args)
{
  if (! doDebug) { return; }
  console.log(...args);
}

// Optimistic estimate of the total risk from (x,y) to the bottom right,
// assuming all remaining risk values are 1 and starting at current cost
function estimate(data, x, y, cost)
{
  return cost + data.width - 1 - x + data.height - y - 1;
}

function riskLevel(data, x, y)
{
  // const r = data[y % data.height][x % data.width];
  const r = 1;
  const b = Math.floor(x / data.width) + Math.floor(y / data.height);

  // risk level of (x,y)
  return Math.floor((r + b) / 10) + (r + b) % 10;
}

function getNeighbors(data, x, y)
{
  const points = [
    [ x + 1, y ],
    [ x, y + 1 ],
    [ x - 1, y ],
    [ x, y - 1 ]
  ];
  return points
    .filter(([ px, py ]) => px >= 0 && py >= 0 &&
      px < data.width && py < data.height &&
      Math.abs(data[py][px] - data[y][x]) <= 1);
}

function getPathRisk(data, start, end)
{
  // start open paths at start point (xStart, yStart)
  const open = {};
  open[`${start.x},${start.y}`] = [ 0, estimate(data, start.x, start.y, 0) ];

  // keep track of closed paths who's neighbors have been investigated
  const closed = {};

  // repeat until we've reached the bottom right
  /* eslint-disable-next-line no-unmodified-loop-condition */
  while (`${end.x},${end.y}` in closed === false)
  {
    debug('open:', open);
    debug('closed:', closed);

    // Sanity check
    if (Object.keys(open).length === 0)
    {
      throw new Error('No more open paths! Unable to reach end point!');
    }

    // move the most promising entry (x,y) on open to closed
    const min = Math.min(...Object.values(open).map(v => v[1]));
    debug('min:', min);
    const [ x, y ] = Object.entries(open)
      .find(([ , v ]) => v[1] === min)
      .shift()
      .split(',')
      .map(v => parseInt(v, 10));
    debug('[x, y]', [ x, y ]);

    const key = `${x},${y}`;
    const [ d, e ] = open[key];
    debug('[d, e]', [ d, e ]);
    closed[key] = [ d, e ];
    delete open[key];

    // move neighbors of (x,y) to open if they are not already on closed
    getNeighbors(data, x, y).forEach(([ v, w ]) =>
    {
      debug('neighbor:', [ v, w ]);
      if (`${v},${w}` in closed === false)
      {
        const d00 = Math.min(
          (open[`${v},${w}`] || [ 999999999999 ])[0],
          d + riskLevel(data, v, w));
        open[`${v},${w}`] = [ d00, estimate(data, v, w, d00) ];
      }
    });
  }

  debug('cost:', closed[`${end.x},${end.y}`][0]);

  return closed[`${end.x},${end.y}`][0];
}

export default async function day12(target)
{
  const start = Date.now();

  const content = await fs.readFile(target);

  const begin = { x: null, y: null };
  const end = { x: null, y: null };
  const data = content
    .toString()
    .split(/\s*\n\s*/)
    .filter(v => v)
    .map((v, y) => v.split('')
      .map((c, x) =>
      {
        if (c === 'S')
        {
          begin.x = x;
          begin.y = y;
          return 0;
        }
        else if (c === 'E')
        {
          end.x = x;
          end.y = y;
          return 25;
        }
        return c.charCodeAt(0) - 97;
      })
    );
  //
  // Insert width and height property for convenience
  data.width = data[0].length;
  data.height = data.length;

  debug('begin:', begin, 'end:', end);

  const part1 = getPathRisk(data, begin, end);

  const part2 = '';

  return { day: 12, part1, part2, duration: Date.now() - start };
}
