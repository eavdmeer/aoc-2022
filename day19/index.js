import * as fs from 'fs/promises';

const materials = [ 'ore', 'clay', 'obsidian', 'geode' ];

let doDebug = false;
if (process.argv[2])
{
  doDebug = process.argv[2].includes('example');
  day19(process.argv[2]).then(console.log);
}

function debug(...args)
{
  if (! doDebug) { return; }
  console.log(...args);
}

function makeKey(time, robots, mined)
{
  return `${time}-${Object.values(robots).join('_')})-${Object.values(mined).join('_')})`;
}

let fromCache = 0;
const optimizations = { cache: true, truncate: true };

function dfs(blueprint, maxSpend, cache, time, robots, mined)
{
  // - dfs
  // - don't build more robots than their own resource requirement (ore
  //   costs 4 ore, so 4 ore robots could build a new robot every minute)
  // - throw away any access resources (50 ore, 10 minutes left, never
  //   need more than 4 ore in a minute for the factory => throw away 10 ore)
  const db = (...args) => debug(time, '-', ...args);

  db('-----', 'min', time, '----');
  db('robots:', robots);
  db('mined:', mined);

  db('xxx', 'materials', Object.values(mined), 'bots', Object.values(robots));

  if (time === 0) { return mined.geode; }

  const key = makeKey(time, robots, mined);
  if (optimizations.cache && key in cache)
  {
    fromCache++;
    return cache[key];
  }

  let max = mined.geode + robots.geode * time;
  db('initial max for', key, max);

  // How long until we can build a robot of the types that we need?
  const canBuild = materials
    // filter for robots we actually need
    .filter(m => robots[m] < maxSpend[m])
    // filter for recipes we have the required robots for
    .filter(m => Object.keys(blueprint[m]).every(v => robots[v]))
    .map(m => [ m, Object.entries(blueprint[m])
      .map(([ k, v ]) => Math.ceil((v - mined[k]) / robots[k])) ])
    .map(m => [ m[0], Math.max(...m[1]) ])
    .filter(m => m[1] >= 0)
    .filter(m => time - m[1] - 1 > 0);

  if (canBuild.length)
  {
    db('building', canBuild
      .map(v => `${v[0]} in ${v[1]} min`)
      .join(', '));
  }

  const results = canBuild
    .map(([ type, wait ]) =>
    {
      db('can build', type, 'robot in', wait, 'minutes');
      const nrobots = { ...robots };
      const nmined = { ...mined };
      const rtime = time - wait - 1;

      // Handle production
      db('available materials:', nmined);
      db('adding materials:', robots);
      materials.filter(m => robots[m]).forEach(m =>
        nmined[m] += robots[m] * (wait + 1));
      db('new available materials:', nmined);

      if (optimizations.truncate)
      {
        db('truncating access materials');
        materials.filter(m => m !== 'geode').forEach(m =>
          nmined[m] = Math.min(nmined[m], rtime * maxSpend[m]));
        db('materials after truncate:', nmined);
      }

      // Add robot
      nrobots[type]++;
      db('built', type, 'robot', nrobots);

      // Take materials for the build
      db('available materials:', nmined);
      db('using', blueprint[type]);
      Object.entries(blueprint[type]).forEach(([ k, v ]) => nmined[k] -= v);
      db('left over:', nmined);

      db('xxx', 'jumping ahead to', rtime, 'for', type);

      return dfs(blueprint, maxSpend, cache, rtime, nrobots, nmined);
    });

  db('results for branches', results);

  max = Math.max(max, ...results);

  db('storing cache value for key', key, max);
  cache[key] = max;

  return max;
}

function solveBlueprint(blueprint, duration)
{
  // Find maximum number of robots to build of each type
  const maxSpend = { ore: 0, clay: 0, obsidian: 0, geode: 10000000 };
  materials.forEach(m =>
    Object.entries(blueprint[m]).forEach(([ k, v ]) =>
      maxSpend[k] = Math.max(v, maxSpend[k])));

  debug('maxSpend', maxSpend);

  const time = duration;
  const cache = {};
  const robots = { ore: 1, clay: 0, obsidian: 0, geode: 0 };
  const mined = { ore: 0, clay: 0, obsidian: 0, geode: 0 };
  fromCache = 0;
  const res = dfs(blueprint, maxSpend, cache, time, robots, mined);
  debug('from cache', fromCache);

  return res;
}

function solve1(data)
{
  const scores = Object.entries(data)
    .map(([ k, v ]) => [ k, solveBlueprint(v, 24) ])
    .reduce((a, [ k, v ]) => { a[k] = v; return a; }, {});
  debug(scores);

  return Object.entries(scores).reduce((a, [ k, v ]) =>
    a + parseInt(k, 10) * v, 0);
}

function solve2(data)
{
  const scores = Object.entries(data)
    .slice(0, 3)
    .map(([ k, v ]) => [ k, solveBlueprint(v, 32) ])
    .reduce((a, [ k, v ]) => { a[k] = v; return a; }, {});
  debug(scores);

  return Object.entries(scores).reduce((a, v) => a * v[1], 1);
}

export default async function day19(target)
{
  const start = Date.now();
  debug('starting');

  const content = await fs.readFile(target);

  const re = /^Each (.*) robot costs ([^.]+)$/;

  /* eslint-disable no-shadow */
  const blueprints = content
    .toString()
    .trim()
    .replace(/\s*\n\s*/g, ' ')
    .replace(/\s*Each/g, 'Each')
    .split(/\s*Blueprint\s*/)
    .filter(v => v)
    .map(v => v.split(/\s*:\s*/))
    .map(v => [ v[0], v[1]
      .split('.')
      .filter(v => v)
      .map(v => v.match(re))
      .map(v => [ v[1], v[2]
        .split(/\s*and\s*/)
        .map(v => v.split(/\s+/))
        .reduce((a, [ v, k ]) => { a[k] = v; return a; }, {})
      ])
      .reduce((a, [ k, v ]) => { a[k] = v; return a; }, {})
    ])
    .reduce((a, [ k, v ]) => { a[k] = v; return a; }, {});

  debug('blueprints', blueprints);

  doDebug = false;
  const part1 = solve1(blueprints);

  const part2 = solve2(blueprints);

  return { day: 19, part1, part2, duration: Date.now() - start };
}
