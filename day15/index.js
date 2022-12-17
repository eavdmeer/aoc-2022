import * as fs from 'node:fs/promises';

let doDebug = false;
if (process.argv[2])
{
  doDebug = process.argv[2].includes('example');
  day15(process.argv[2]).then(console.log);
}

function debug(...args)
{
  if (! doDebug) { return; }
  console.log(...args);
}

export default async function day15(target)
{
  const start = Date.now();

  const content = await fs.readFile(target);

  const re = /^.* at x=(-?\d+), y=(-?\d+): .* at x=(-?\d+), y=(-?\d+)$/;

  const manhatten = (x1, y1, x2, y2) => Math.abs(x2 - x1) + Math.abs(y2 - y1);

  const sensors = content
    .toString()
    .split(/\s*\n\s*/)
    .filter(v => v)
    .map(v => v.match(re))
    .map((v, i) => ({
      id: i,
      x: parseInt(v[1], 10),
      y: parseInt(v[2], 10),
      nearest: {
        x: parseInt(v[3], 10),
        y: parseInt(v[4], 10)
      }
    }))
    .map(v =>
    {
      v.radius = manhatten(v.x, v.y, v.nearest.x, v.nearest.y);
      return v;
    });

  debug(sensors);

  const yval = target.includes('example') ? 10 : 2000000;

  // x-interval in range for a sensor for a certain y value
  const range = (sensor, y) =>
  {
    const dx = sensor.radius - Math.abs(sensor.y - y);
    return dx < 0 ? [] : [ sensor.x - dx, sensor.x + dx ];
  };
  const ranges = sensors
    .map(v => range(v, yval))
    .filter(v => v.length)
    .sort((a, b) => a[0] - b[0]);
  debug(ranges);

  // Reduce all overlapping intervals
  const reduced = [];
  let [ min, max ] = ranges[0];
  ranges.forEach(([ nextMin, nextMax ]) =>
  {
    if (nextMin > max)
    {
      // Found unconnected new interval
      reduced.push([ min, max ]);
      min = nextMin;
      max = nextMax;
    }
    else if (nextMax > max)
    {
      // Overlapping interval. Extend our current maximum
      max = nextMax;
    }
  });
  // Add last interval we were working on
  reduced.push([ min, max ]);
  debug('reduced:', reduced);

  const part1 = reduced
    .map(v => v[1] - v[0])
    .reduce((a, v) => a + v, 0);

  /*
   * line equations of the bounding lines for each sensor
   *
   *  Downward
   *filter  y = -x + sensor.y + sensor.x + sensor.radius
   *  y = -x + sensor.y + sensor.x - sensor.radius

   *  Upward
   *  y = x + sensor.y - sensor.x + sensor.radius
   *  y = x + sensor.y - sensor.x - sensor.radius
   */
  const part2 = 'todo';

  const down = [
    ...sensors.map(s => s.y + s.x + s.radius),
    ...sensors.map(s => s.y + s.x - s.radius) ];
  debug(down);

  const up = [
    ...sensors.map(s => s.y - s.x + s.radius),
    ...sensors.map(s => s.y - s.x - s.radius) ];
  debug(up);

  return { day: 15, part1, part2, duration: Date.now() - start };
}
