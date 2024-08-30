// 参考 MDN Background Tasks API 这篇文章
// https://developer.mozilla.org/zh-CN/docs/Web/API/Background_Tasks_API#example

let taskHandle = null;
let taskList = [
  () => {
    console.log('task1')
  },
  () => {
    console.log('task2')
  },
  () => {
    console.log('task3')
  }
]

function runTaskQueue(deadline) {
  console.log(`deadline: ${deadline.timeRemaining()}`)
  while ((deadline.timeRemaining() > 0 || deadline.didTimeout) && taskList.length) {
    let task = taskList.shift();
    task();
  }
  console.log("taskList", taskList);
  if (taskList.length) {
    taskHandle = requestIdleCallback(runTaskQueue, { timeout: 1000 });
  } else {
    taskHandle = 0;
  }
}

requestIdleCallback(runTaskQueue, { timeout: 1000 })
