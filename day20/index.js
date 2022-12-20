import * as fs from 'fs/promises';

let doDebug = false;
if (process.argv[2])
{
  doDebug = process.argv[2].includes('example');
  day20(process.argv[2]).then(console.log);
}

/*
 * The encrypted file is a list of numbers. To mix the file, move each
 * number forward or backward in the file a number of positions equal to
 * the value of the number being moved. The list is circular, so moving a
 * number off one end of the list wraps back around to the other end as if
 * the ends were connected.
 */

function debug(...args)
{
  if (! doDebug) { return; }
  console.log(...args);
}

function Node(value, len)
{
  this.value = value;
  this.len = len;
  this.right = undefined;
  this.left = undefined;
}
Node.prototype.move = function()
{
  if (this.value === 0) { return; }
  /* eslint-disable-next-line consistent-this */
  let node = this;
  for (let i = 0; i < Math.abs(this.value) % (this.len - 1); i++)
  {
    node = this.value > 0 ? node.right : node.left;
  }
  this.unlink();
  if (this.value > 0)
  {
    node.append(this);
  }
  else
  {
    node.insert(this);
  }
};
Node.prototype.append = function(node)
{
  node.right = this.right;
  node.left = this;

  this.right.left = node;
  this.right = node;
};
Node.prototype.insert = function(node)
{
  node.left = this.left;
  node.right = this;

  this.left.right = node;
  this.left = node;
};
Node.prototype.unlink = function()
{
  this.left.right = this.right;
  this.right.left = this.left;
};
Node.prototype.toString = function()
{
  /* eslint-disable-next-line */
  let n = this;
  const parts = [];
  do
  {
    parts.push(n.value);
    n = n?.right;
  } while (n && n !== this);

  return parts.join(', ');
};

function solve1(data, scale = 1, runs = 1)
{
  const len = data.length;
  const nodes = data.map(v => new Node(scale * v, len));
  nodes.forEach((n, i, a) =>
  {
    n.left = a[i - 1 < 0 ? i - 1 + a.length : i - 1];
    n.right = a[(i + 1) % a.length];
  });

  for (let i = 0; i < runs; i++) { nodes.forEach(n => n.move()); }

  doDebug = true;
  const zero = nodes.find(v => v.value === 0);
  const vals = [ 1000, 2000, 3000 ].map(idx =>
  {
    let n = zero;
    for (let i = 0; i < idx % len; i++) { n = n.right; }
    return n?.value;
  });
  const answer = vals.reduce((a, v) => a + v, 0);
  debug('vals:', vals, 'answer:', answer);

  return answer;
}

export default async function day20(target)
{
  const start = Date.now();
  debug('starting');

  const content = await fs.readFile(target);

  /* eslint-disable no-shadow */
  const data = content
    .toString()
    .trim()
    .split(/\s*\n\s*/)
    .filter(v => v)
    .map(v => parseInt(v, 10));
  /* eslint-enable no-shadow */

  debug('data', data);

  const part1 = solve1(data);

  const part2 = solve1(data, 811589153, 10);

  return { day: 20, part1, part2, duration: Date.now() - start };
}
