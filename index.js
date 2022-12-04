import day1 from './day1/index.js';
import day2 from './day2/index.js';
import day3 from './day3/index.js';
import day4 from './day4/index.js';

async function getResults()
{
  const result = [
    await day1('day1/data.txt'),
    await day2('day2/data.txt'),
    await day3('day3/data.txt'),
    await day4('day4/data.txt')
  ];
  return result.sort((a, b) => a.day - b.day);
}

getResults().then(console.log);
