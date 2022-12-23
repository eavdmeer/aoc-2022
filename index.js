import day1 from './day1/index.js';
import day2 from './day2/index.js';
import day3 from './day3/index.js';
import day4 from './day4/index.js';
import day5 from './day5/index.js';
import day6 from './day6/index.js';
import day7 from './day7/index.js';
import day8 from './day8/index.js';
import day9 from './day9/index.js';
import day10 from './day10/index.js';
import day11 from './day11/index.js';
import day12 from './day12/index.js';
import day13 from './day13/index.js';
import day14 from './day14/index.js';
import day15 from './day15/index.js';
import day16 from './day16/index.js';
import day17 from './day17/index.js';
import day18 from './day18/index.js';
import day19 from './day19/index.js';
import day20 from './day20/index.js';
import day21 from './day21/index.js';
import day22 from './day22/index.js';
import day23 from './day23/index.js';

async function getResults()
{
  const report = v =>
  {
    console.log(`day ${v.day} solved in ${v.duration} ms`);
    return v;
  };
  const result = [
    await day1('day1/data.txt').then(report),
    await day2('day2/data.txt').then(report),
    await day3('day3/data.txt').then(report),
    await day4('day4/data.txt').then(report),
    await day5('day5/data.txt').then(report),
    await day6('day6/data.txt').then(report),
    await day7('day7/data.txt').then(report),
    await day8('day8/data.txt').then(report),
    await day9('day9/data.txt').then(report),
    await day10('day10/data.txt').then(report),
    await day11('day11/data.txt').then(report),
    await day12('day12/data.txt').then(report),
    await day13('day13/data.txt').then(report),
    await day14('day14/data.txt').then(report),
    await day15('day15/data.txt').then(report),
    await day16('day16/data.txt').then(report),
    await day17('day17/data.txt').then(report),
    await day18('day18/data.txt').then(report),
    await day19('day19/data.txt').then(report),
    await day20('day20/data.txt').then(report),
    await day21('day21/data.txt').then(report),
    await day22('day22/data.txt').then(report),
    await day23('day23/data.txt').then(report)
  ];
  return result.sort((a, b) => a.day - b.day);
}

const start = Date.now();

getResults()
  .then(res =>
  {
    console.log(res);
    console.log(`Total duration: ${Date.now() - start}ms`);
  });

