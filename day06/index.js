import * as fs from 'node:fs/promises';

if (process.argv[2])
{
  day6(process.argv[2]).then(console.log);
}

function getMarker(txt, size)
{
  const buffer = txt.substring(0, size).split('');

  for (let i = size; i < txt.length; i++)
  {
    if (buffer.filter((v, i, b) => b.indexOf(v) === i).length === size)
    {
      return [ buffer.join(''), i ];
    }
    buffer.push(txt.charAt(i));
    buffer.shift();
  }
  return [ '', -1 ];
}

export default async function day6(target)
{
  const start = Date.now();

  const content = await fs.readFile(target);

  const part1 = getMarker(content.toString(), 4)[1];

  const part2 = getMarker(content.toString(), 14)[1];

  return { day: 6, part1, part2, duration: Date.now() - start };
}
