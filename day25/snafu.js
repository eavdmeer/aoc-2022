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
  const result = [];
  debug('converting', v, 'to SNAFU');
  const digits = v.toString(5).split('');
  debug('digits:', digits);

  let carry = false;
  digits.reverse().forEach(digit =>
  {
    debug('digit:', digit, 'carry:', carry);
    switch (digit)
    {
      case '0':
        result.unshift(carry ? 1 : 0);
        carry = false;
        break;
      case '1':
        result.unshift(carry ? 2 : 1);
        carry = false;
        break;
      case '2':
        result.unshift(carry ? '=' : 2);
        break;
      case '3':
        result.unshift(carry ? '-' : '=');
        carry = true;
        break;
      case '4':
        result.unshift(carry ? '0' : '-');
        carry = true;
        break;
      default:
        result.unshift(digit);
    }
  });
  if (carry) { result.unshift(1); }
  debug('result:', result.join(''));

  return result.join('');
}
