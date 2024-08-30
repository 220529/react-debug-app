const sleep = delay => {
  for (let start = Date.now(); Date.now() - start <= delay;) { }
}

let taskHandle = null;
let taskList = [
  () => {
    console.log('task1')
    sleep(50)
  },
  () => {
    console.log('task2')
    sleep(50)
  },
  () => {
    console.log('task3')
    sleep(50)
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
