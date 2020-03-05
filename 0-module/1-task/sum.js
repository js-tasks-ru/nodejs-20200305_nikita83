const sum = (a, b) => {
  if (typeof (a, b) === "number") {
    return a + b;
  } else {
    throw new TypeError("Не числа");
  }
};

module.exports = sum;
