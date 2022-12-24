import PriorityQueue from './priorityqueue.js';

const queue = new PriorityQueue(v => v.cost);

describe('PriorityQueue', () =>
{
  beforeEach(() => queue.clear());
  it('correctly clears elements', () =>
  {
    expect(queue).toHaveLength(0);
    queue.push({ cost: 1, id: 0 });
    expect(queue).toHaveLength(1);
    queue.clear();
    expect(queue).toHaveLength(0);
  });
  it('correctly adds elements', () =>
  {
    queue.push({ cost: 1, id: 0 });
    queue.push({ cost: 2, id: 1 });
    queue.push({ cost: 3, id: 3 });
    expect(queue).toHaveLength(3);
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
    expect(queue.pop()).toBeUndefined();
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
    expect(queue.shift()).toBeUndefined();
  });
  it('works with the default value function', () =>
  {
    const t = new PriorityQueue();
    t.push(1);
    t.push(5);
    t.push(3);
    t.push(7);
    expect(t.pop()).toBe(7);
    expect(t.shift()).toBe(1);
    t.push(12);
    expect(t.pop()).toBe(12);
    t.push(0);
    expect(t.shift()).toBe(0);
  });
  it('does proper string conversion', () =>
  {
    queue.push({ cost: 1, id: 0 });
    queue.push({ cost: 2, id: 1 });
    expect(queue.toString())
      .toBe('[{"cost":1,"id":0},{"cost":2,"id":1}]');
  });
});
