const debounce = (callback, wait) => {
  let timeout;

  return () => {
    let args=arguments;
    window.clearTimeout(timeout);
    timeout = window.setTimeout(() => {
      timeout = null;
      callback.apply(this, args);
    }, wait);
  };
};

export default debounce;
