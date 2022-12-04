const fs = require('fs');

const input = process.argv[2] || 'data.txt';

fs.readFile(input, (err, content) =>
{
  if (err)
  {
    console.log(err.message);
    return;
  }
  const totals = content
    .toString()
    .split('\n\n')
    .map(v => v
      .split(/\s*\n\s*/)
      .filter(w => w !== '')
      .reduce((a, w) => a + parseInt(w, 10), 0)
    );

  const max = Math.max(...totals);
  console.log(totals.indexOf(max) + 1, max);

  const top3 = totals.sort().reverse().slice(0, 3).reduce((a, v) => a + v, 0);
  console.log(top3);

});
