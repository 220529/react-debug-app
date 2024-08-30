/**
 * 版权所有 (c) 2013-present，Facebook，Inc.
 *
 * 此源代码在根目录下的 LICENSE 文件中使用 MIT 许可证进行许可。
 *
 * @providesModule ReactDOMFrameScheduling
 * @flow
 */

'use strict';

// 这是一个用于 requestIdleCallback 的内置 polyfill。它的工作原理是通过调度
// 一个 requestAnimationFrame，记录帧开始的时间，然后调度一个 postMessage，该消息在绘制后调度。
// 在 postMessage 处理程序中，尽可能多地进行工作，直到时间 + 帧率。
// 通过将空闲调用分离到单独的事件时钟中，我们确保布局、绘制和其他浏览器工作都计入可用时间。
// 帧率是动态调整的。

import type { Deadline } from 'ReactFiberReconciler';

var ExecutionEnvironment = require('fbjs/lib/ExecutionEnvironment');

if (__DEV__) {
  var warning = require('fbjs/lib/warning');

  if (
    ExecutionEnvironment.canUseDOM &&
    typeof requestAnimationFrame !== 'function'
  ) {
    warning(
      false,
      'React 依赖于 requestAnimationFrame。确保在旧浏览器中加载 polyfill。http://fb.me/react-polyfills',
    );
  }
}

// TODO: 由于 Fiber 目前不支持取消，因此无法取消。
let rIC: (callback: (deadline: Deadline) => void) => number;

if (!ExecutionEnvironment.canUseDOM) {
  rIC = function (frameCallback: (deadline: Deadline) => void): number {
    setTimeout(() => {
      frameCallback({
        timeRemaining() {
          return Infinity;
        },
      });
    });
    return 0;
  };
} else if (typeof requestIdleCallback !== 'function') {
  // Polyfill requestIdleCallback.

  var scheduledRAFCallback = null;
  var scheduledRICCallback = null;

  var isIdleScheduled = false;
  var isAnimationFrameScheduled = false;

  var frameDeadline = 0;
  // 我们最初假设以 30fps 运行，但随后的启发式跟踪将根据更频繁的动画帧调整此值。
  var previousFrameTime = 33;
  var activeFrameTime = 33;

  var frameDeadlineObject = {
    timeRemaining: typeof performance === 'object' &&
      typeof performance.now === 'function'
      ? function () {
        // 我们假设如果有性能计时器，rAF 回调会得到性能计时器的值。不确定这是否始终正确。
        return frameDeadline - performance.now();
      }
      : function () {
        // 作为后备，我们使用 Date.now。
        return frameDeadline - Date.now();
      },
  };

  // 我们使用 postMessage 技巧将空闲工作推迟到重绘之后。
  var messageKey = '__reactIdleCallback$' + Math.random().toString(36).slice(2);
  var idleTick = function (event) {
    if (event.source !== window || event.data !== messageKey) {
      return;
    }
    isIdleScheduled = false;
    var callback = scheduledRICCallback;
    scheduledRICCallback = null;
    if (callback !== null) {
      callback(frameDeadlineObject);
    }
  };
  // 假设在此环境中我们有 addEventListener。对于旧的 IE 可能需要更好的方法。
  window.addEventListener('message', idleTick, false);

  var animationTick = function (rafTime) {
    isAnimationFrameScheduled = false;
    var nextFrameTime = rafTime - frameDeadline + activeFrameTime;
    if (
      nextFrameTime < activeFrameTime &&
      previousFrameTime < activeFrameTime
    ) {
      if (nextFrameTime < 8) {
        // 防御性编程。我们不支持超过 120hz 的帧率。
        // 如果低于这个值，可能是一个 bug。
        nextFrameTime = 8;
      }
      // 如果一个帧运行时间较长，那么下一个帧可以较短以赶上。
      // 如果连续两帧较短，那么说明我们的帧率实际上比我们当前优化的帧率要高。
      // 我们相应地动态调整我们的启发式算法。例如，如果我们在 120hz 的显示器或 90hz 的 VR 显示器上运行。
      // 从中选取两者的最大值，以防其中一个由于错过帧截止期而产生异常。
      activeFrameTime = nextFrameTime < previousFrameTime
        ? previousFrameTime
        : nextFrameTime;
    } else {
      previousFrameTime = nextFrameTime;
    }
    frameDeadline = rafTime + activeFrameTime;
    if (!isIdleScheduled) {
      isIdleScheduled = true;
      window.postMessage(messageKey, '*');
    }
    var callback = scheduledRAFCallback;
    scheduledRAFCallback = null;
    if (callback !== null) {
      callback(rafTime);
    }
  };

  rIC = function (callback: (deadline: Deadline) => void): number {
    // 这假设我们一次只调度一个回调，因为 Fiber 就是这样使用的。
    scheduledRICCallback = callback;
    if (!isAnimationFrameScheduled) {
      // 如果 rAF 尚未调度一个，我们需要调度一个帧。
      // TODO: 如果这个 rAF 没有实现，因为浏览器进行了节流，我们可能仍然希望使用 setTimeout 触发 rIC，以备不时之需以确保继续执行工作。
      isAnimationFrameScheduled = true;
      requestAnimationFrame(animationTick);
    }
    return 0;
  };
} else {
  rIC = requestIdleCallback;
}

exports.rIC = rIC;
