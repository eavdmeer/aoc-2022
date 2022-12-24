import PriorityQueue from './priorityqueue.js';

const queue = new PriorityQueue(v => v.cost);

describe('PriorityQueue', () =>
{
  beforeEach(() => queue.clear());
  it('correctly clears elements', () =>
  {
    expect(queue.length).toBe(0);
    queue.push({ cost: 1, id: 0 });
    expect(queue.length).toBe(1);
    queue.clear();
    expect(queue.length).toBe(0);
  });
  it('correctly adds elements', () =>
  {
    queue.push({ cost: 1, id: 0 });
    queue.push({ cost: 2, id: 1 });
    queue.push({ cost: 3, id: 3 });
    expect(queue.length().toBe(3));
  });
  it('pops elements by highest cost correctly', () =>
  {
    queue.push({ cost: 1, id: 0 });
    queue.push({ cost: 2, id: 1 });
    queue.push({ cost: 4, id: 2 });
    queue.push({ cost: 3, id: 3 });
    queue.push({ cost: 0, id: 4 });
    expect(queue.pop()).toEqual({ cost: 4, id: 2 });
    expect(queue.pop()).toEqual({ cost: 3, id: 3 });
    expect(queue.pop()).toEqual({ cost: 2, id: 1 });
    expect(queue.pop()).toEqual({ cost: 1, id: 0 });
    expect(queue.pop()).toEqual({ cost: 0, id: 4 });
  });
  it('shifts elements by lowest cost correctly', () =>
  {
    queue.push({ cost: 1, id: 0 });
    queue.push({ cost: 2, id: 1 });
    queue.push({ cost: 4, id: 2 });
    queue.push({ cost: 3, id: 3 });
    queue.push({ cost: 0, id: 4 });
    expect(queue.shift()).toEqual({ cost: 0, id: 4 });
    expect(queue.shift()).toEqual({ cost: 1, id: 0 });
    expect(queue.shift()).toEqual({ cost: 2, id: 1 });
    expect(queue.shift()).toEqual({ cost: 3, id: 3 });
    expect(queue.shift()).toEqual({ cost: 4, id: 2 });
  });
});
