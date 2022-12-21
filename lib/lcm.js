export function lcm(a, b)
{
  return Math.abs(b) * Math.abs(a) / gcd(a, b);
}

export function gcd(...args)
{
  let x = args[0];

  for (var i = 1; i < args.length; i++)
  {
    let y = args[i];
    while (y)
    {
      const t = y;
      y = x % y;
      x = t;
    }
  }
  return x;
}
