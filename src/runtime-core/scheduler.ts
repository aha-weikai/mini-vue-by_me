const queue: any[] = [];

let isFlushPending = false;

const p = Promise.resolve();

export function queueJobs(job) {
  if (!queue.includes(job)) {
    queue.push(job);
  }

  queueFlush();
}

function queueFlush() {
  // 使一次微任务队列中只创建一个微任务
  // 微任务队列执行后，在重新创建
  if (isFlushPending) return;
  isFlushPending = true;

  nextTick(flushJobs);
}

export function nextTick(fn) {
  return fn ? p.then(fn) : p;
}

function flushJobs() {
  isFlushPending = false;
  let job;
  while ((job = queue.shift())) {
    job && job();
  }
}
