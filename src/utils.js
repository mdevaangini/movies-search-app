function add(num1, num2) {
  console.log(num1 + num2);
}

const debouncedFn = debounce(add, 1000);
const throttledFn = throttle(add, 1000);
debouncedFn(1, 2);
throttledFn(1, 2);

function debounce(fn, delay) {
  let timer = null;

  return function (...args) {
    clearTimeout(timer);

    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

function throttle(fn, delay) {
  let shouldThrottle = false;

  return function (...args) {
    if (!shouldThrottle) return;

    shouldThrottle = true;
    setTimeout(() => {
      shouldThrottle = false;
    }, delay);

    fn(...args);
  };
}
