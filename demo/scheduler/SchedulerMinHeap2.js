// 源码地址：https://github.com/facebook/react/blob/main/packages/scheduler/src/SchedulerMinHeap.js
function pop(heap) {
  if (heap.length === 0) {
    return null;
  }
  const first = heap[0];
  // JavaScript 的 pop 方法删除并返回数组的最后一个元素
  const last = heap.pop();
  if (last !== first) {
    heap[0] = last;
    siftDown(heap, last, 0);
  }
  return first;
}

// 层级表示
//         2
//       /   \
//      4     7
//     / \   / \
//    8   9 10  14

function siftDown(heap, node, i) {
  let index = i;
  const length = heap.length;
  const halfLength = length >>> 1;
  while (index < halfLength) {
    const leftIndex = (index + 1) * 2 - 1;
    const left = heap[leftIndex];
    const rightIndex = leftIndex + 1;
    const right = heap[rightIndex];

    // 如果 left 比 node 小
    if (compare(left, node) < 0) {
      // 如果 right 比 left 还小，说明 right 最小，right 与 node 交换
      if (rightIndex < length && compare(right, left) < 0) {
        heap[index] = right;
        heap[rightIndex] = node;
        index = rightIndex;
      }
      // 说明 left 最小，left 与 node 交换
      else {
        heap[index] = left;
        heap[leftIndex] = node;
        index = leftIndex;
      }
    }
    // 如果 left node 大，但 right 比 node 小，right 与 node 交换
    else if (rightIndex < length && compare(right, node) < 0) {
      heap[index] = right;
      heap[rightIndex] = node;
      index = rightIndex;
    } else {
      // 子元素都比 node 大
      return;
    }
  }
}

// 示例代码
let taskQueue = [{ sortIndex: 2 }, { sortIndex: 5 }, { sortIndex: 7 }, { sortIndex: 12 }, { sortIndex: 22 }, { sortIndex: 17 }, { sortIndex: 25 }];
pop(taskQueue)
// [{"sortIndex":5},{"sortIndex":12},{"sortIndex":7},{"sortIndex":25},{"sortIndex":22},{"sortIndex":17}]
console.log(JSON.stringify(taskQueue))


// 假设父节点的 index 为 x，那么左子节点的 index 为 2x + 1，右子节点的 index 为 2x + 2
// 每一次 shiftDown，index 的最大变化就是 2x + 2，而 2x + 2 最大只能等于 length - 1

// 因为 2x + 2 <= length - 1
// 所以 x <= length/2 - 1.5

// 我们知道 y >>> 1 ，在 y 为正数的情况下，计算的结果为 y/2 - 0.5 或者 y/2

// 如果 x <= length/2 - 1.5
// 那么肯定 x < length/2 - 0.5 以及 x < length/2
// 所以肯定 x < length >>> 1
