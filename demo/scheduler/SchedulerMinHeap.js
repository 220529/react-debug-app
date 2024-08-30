// 源码地址：https://github.com/facebook/react/blob/main/packages/scheduler/src/SchedulerMinHeap.js
function push(heap, node) {
  const index = heap.length;
  heap.push(node);
  siftUp(heap, node, index);
}

function siftUp(heap, node, i) {
  let index = i;
  while (index > 0) {
    // 获取父节点的索引位置
    const parentIndex = (index - 1) >>> 1;
    const parent = heap[parentIndex];
    if (compare(parent, node) > 0) {
      // 如果父节点更大，就交换位置
      heap[parentIndex] = node;
      heap[index] = parent;
      index = parentIndex;
    } else {
      // 直到父节点更小，就退出
      return;
    }
  }
}

function compare(a, b) {
  // 首先比较 sortIndex，其次是 id
  const diff = a.sortIndex - b.sortIndex;
  return diff !== 0 ? diff : a.id - b.id;
}

// 测试代码
let taskQueue = [{ sortIndex: 2 }, { sortIndex: 7 }, { sortIndex: 5 }, { sortIndex: 12 }, { sortIndex: 22 }, { sortIndex: 17 }];
push(taskQueue, { sortIndex: 1 })
console.log(JSON.stringify(taskQueue))
