export default function PriorityQueue(valFun = v => v)
{
  this.val = valFun;
  this.heap = [];
}
PriorityQueue.prototype.push = function(...args)
{
  this.heap.push(...args);
};
PriorityQueue.prototype.shift = function()
{
  const min = Math.min(...this.heap.map(v => this.val(v)));

  return this.heap
    .splice(this.heap.findIndex(v => this.val(v) === min), 1)
    .pop();
};
PriorityQueue.prototype.pop = function()
{
  const max = Math.max(...this.heap.map(v => this.val(v)));

  return this.heap
    .splice(this.heap.findIndex(v => this.val(v) === max), 1)
    .pop();
};
PriorityQueue.prototype.length = function()
{
  return this.heap.length;
};
PriorityQueue.prototype.clear = function()
{
  this.heap.length = 0;
};
PriorityQueue.prototype.toString = function()
{
  return this.heap.toString();
};
