export default function PriorityQueue(valFun = v => v)
{
  this.val = valFun;
  this.heap = [];
  this.length = 0;
}
PriorityQueue.prototype.push = function(...args)
{
  this.heap.push(...args);
  this.length = this.heap.length;
};
PriorityQueue.prototype.shift = function()
{
  let min = Number.MAX_SAFE_INTEGER;
  let index = -1;
  for (let i = 0; i < this.heap.length; i++)
  {
    const v = this.val(this.heap[i]);
    if (v < min)
    {
      min = v;
      index = i;
    }
  }

  if (index < 0) { return undefined; }
  this.length--;

  return this.heap.splice(index, 1)[0];
};
PriorityQueue.prototype.pop = function()
{
  let max = Number.MIN_SAFE_INTEGER;
  let index = -1;
  for (let i = 0; i < this.heap.length; i++)
  {
    const v = this.val(this.heap[i]);
    if (v > max)
    {
      max = v;
      index = i;
    }
  }

  if (index < 0) { return undefined; }
  this.length--;

  return this.heap.splice(index, 1)[0];
};
PriorityQueue.prototype.clear = function()
{
  this.heap.length = 0;
  this.length = 0;
};
PriorityQueue.prototype.toString = function()
{
  return JSON.stringify(this.heap);
};
