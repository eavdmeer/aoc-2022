function lcm(a, b)
{
  return Math.abs(b) * Math.abs(a) / gcd(a, b);
}

function gcd(a, b)
{
  // Don't modify function arguments
  let la = a;
  let lb = b;

  while (lb !== 0)
  {
    const t = lb;
    lb = la % lb;
    la = t;
  }
  return a;
}

export default { lcm, gcd };
