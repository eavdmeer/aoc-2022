import day1 from './day1/index.js';
import day2 from './day2/index.js';
import day3 from './day3/index.js';
import day4 from './day4/index.js';
import day5 from './day5/index.js';
import day6 from './day6/index.js';
import day7 from './day7/index.js';

async function getResults()
{
  const result = [
    await day1('day1/data.txt'),
    await day2('day2/data.txt'),
    await day3('day3/data.txt'),
    await day4('day4/data.txt'),
    await day5('day5/data.txt'),
    await day6('day6/data.txt'),
    await day7('day7/data.txt')
  ];
  return result.sort((a, b) => a.day - b.day);
}

getResults().then(console.log);
