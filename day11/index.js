import * as fs from 'node:fs/promises';

if (process.argv[2])
{
  day11(process.argv[2]).then(console.log);
}

function doround(monkeys, divider = 3, lcd = 1)
{
  monkeys.forEach(monkey =>
  {
    monkey.items = monkey.items.filter(item =>
    {
      const op = monkey.operation;
      const arg = parseInt(op[1], 10);

      monkey.inspections++;
      // worry level update
      let newitem;
      if (arg)
      {
        if (op[0] === '+') { newitem = item + arg; }
        else if (op[0] === '*') { newitem = item * arg; }
      }
      else
      {
        if (op[0] === '*') { newitem = item * item; }
      }

      if (divider !== 1)
      {
        // Monkey gets bored
        newitem = Math.floor(newitem / divider);
      }

      if (lcd !== 1)
      {
        // Scale down large items but keep their divisibility by each of
        // the dividers used by the monkeys inact by calculating the
        // remainder of the product of all dividers (lcm)
        //
        // lcm = d1 * d2 * d3
        //
        // x + a is divisible by d1 if x % lcm + a is divisible by d1
        // x * a is divisible by d1 if x % lcm * a is divisible by d1
        newitem %= lcd;
      }

      // Pass on item
      if (newitem % monkey.divider === 0)
      {
        monkeys[monkey.trueTarget].items.push(newitem);
      }
      else
      {
        monkeys[monkey.falseTarget].items.push(newitem);
      }

      return false;
    });
  });
}

export default async function day11(target)
{
  const start = Date.now();

  const content = await fs.readFile(target);

  const monkeys = content
    .toString()
    .split(/Monkey \d+:\n\s*/)
    .filter(v => v)
    .map(v => v.split(/\s*\n\s*/))
    .map(v => ({
      items: v[0]
        .replace(/Starting items:\s*/, '')
        .split(/\s*,\s*/).map(w => parseInt(w, 10)),
      operation: v[1].replace(/Operation: new = old\s*/, '').split(/\s+/),
      divider: parseInt(v[2].replace(/Test: divisible by\s*/, ''), 10),
      trueTarget: parseInt(v[3].replace(/If .* monkey\s*/, ''), 10),
      falseTarget: parseInt(v[4].replace(/If .* monkey\s*/, ''), 10),
      inspections: 0
    }));

  const monkeys1 = JSON.parse(JSON.stringify(monkeys));
  for (let i = 0; i < 20; i++) { doround(monkeys1); }

  const part1 = monkeys1
    .map(v => v.inspections)
    .sort((a, b) => b - a)
    .slice(0, 2)
    .reduce((a, v) => a * v, 1);

  const monkeys2 = JSON.parse(JSON.stringify(monkeys));
  const lcd = monkeys2.map(v => v.divider).reduce((a, v) => a * v, 1);
  for (let i = 0; i < 10000; i++) { doround(monkeys2, 1, lcd); }

  const part2 = monkeys2
    .map(v => v.inspections)
    .sort((a, b) => b - a)
    .slice(0, 2)
    .reduce((a, v) => a * v, 1);

  return { day: 11, part1, part2, duration: Date.now() - start };
}
