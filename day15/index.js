import * as fs from 'node:fs/promises';
import makeDebug from 'debug';

const debug = makeDebug('day15');

if (process.argv[2])
{
  day15(process.argv[2]).then(console.log);
}

function findIntervals(sensors, yval)
{
  // x-interval in range for a sensor for a certain y value
  const range = (sensor, y) =>
  {
    const dx = sensor.radius - Math.abs(sensor.y - y);
    return dx < 0 ? [] : [ sensor.x - dx, sensor.x + dx ];
  };

  // Map all sensors to their x-range
  const ranges = sensors
    .map(v => range(v, yval))
    .filter(v => v.length)
    .sort((a, b) => a[0] - b[0]);
  debug(ranges);

  // Reduce any overlapping intervals
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

  return reduced;
}

function solve1(sensors, yval)
{
  return findIntervals(sensors, yval)
    .map(v => v[1] - v[0])
    .reduce((a, v) => a + v, 0);
}

function solve2(sensors)
{
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
  const down = [
    ...sensors.map(s => s.y + s.x + s.radius),
    ...sensors.map(s => s.y + s.x - s.radius) ];
  debug(down);

  const up = [
    ...sensors.map(s => s.y - s.x + s.radius),
    ...sensors.map(s => s.y - s.x - s.radius) ];
  debug(up);
  return 'todo';
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
      bx: parseInt(v[3], 10),
      by: parseInt(v[4], 10)
    }))
    .map(v =>
    {
      debug(v.x, v.y, v.bx, v.by);
      v.radius = manhatten(v.x, v.y, v.bx, v.by);
      return v;
    });

  debug(sensors);

  const yval = target.includes('example') ? 10 : 2000000;

  const part1 = solve1(sensors, yval);
  if (target.includes('example') && part1 !== 26)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; 26`);
  }

  const part2 = solve2(sensors);
  if (target.includes('example') && part2 !== 'todo')
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; 'todo'`);
  }


  return { day: 15, part1, part2, duration: Date.now() - start };
}
