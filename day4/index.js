const fs = require('fs');

const input = process.argv[2] || 'data.txt';

fs.readFile(input, (err, content) =>
{
  if (err)
  {
    console.log(err.message);
    return;
  }

  console.log('part1:',
    content
      .toString()
      .split(/\s*\n\s*/)
      .filter(v => v)
      .map(v => v
        .split(',')
        .map(w => w
          .split('-')
          .map(x => parseInt(x, 10))
        )
      )
      .filter(([ l, r ]) =>
        l[0] >= r[0] && l[1] <= r[1] ||
        r[0] >= l[0] && r[1] <= l[1]
      )
      .length
  );

  console.log('part2:',
    content
      .toString()
      .split(/\s*\n\s*/)
      .filter(v => v)
      .map(v => v
        .split(',')
        .map(w => w
          .split('-')
          .map(x => parseInt(x, 10))
        )
      )
      .filter(([ l, r ]) =>
        l[0] >= r[0] && l[0] <= r[1] ||
        r[0] >= l[0] && r[0] <= l[1]
      )
      .length
  );
});
