import makeDebug from 'debug';

const debug = makeDebug('snafu');
const p1 = { 0: 0, 1: 1, 2: 2, '=': 0, '-': 0 };
const p2 = { 0: 0, 1: 0, 2: 0, '=': 2, '-': 1 };

export function fromSnafu(v)
{
  return parseInt(v.replace(/[012=-]/g, m => p1[m]), 5) -
    parseInt(v.replace(/[012=-]/g, m => p2[m]), 5);
}

export function toSnafu(v)
{
  debug('converting', v, 'to SNAFU');
  let total = v;
  const output = [];
  while (total !== 0)
  {
    const rem = total % 5;
    total = Math.floor(total / 5);
    output.unshift('012=-'.charAt(rem));
    if (rem > 2) { total++; }
  }
  debug('done with loop', 'total:', total, 'output:', output);
  return output.join('');
}
