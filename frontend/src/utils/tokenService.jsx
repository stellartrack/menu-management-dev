let tokenGetters = {
  laravel: () => null,
  node: () => null,
};

export const registerGetToken = (type, fn) => {
  if (type && fn && typeof fn === "function") {
    tokenGetters[type] = fn;
  }
};

export const getToken = (type) => {
  if (type && tokenGetters[type]) {
    return tokenGetters[type]();
  }
  return null;
};
