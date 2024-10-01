const baseConverter = (number, base) => {
  const convertedValue = parseInt(number, base);
  if (isNaN(convertedValue)) {
    throw new Error(`Conversion failed for number: ${number} in base: ${base}`);
  }
  return convertedValue;
};

const interpolation = (points, xi) => {
  let result = 0;
  const n = points.length;

  for (let i = 0; i < n; i++) {
    let term = points[i][1]; // Get the y-value
    for (let j = 0; j < n; j++) {
      if (j !== i) {
        term *= (xi - points[j][0]) / (points[i][0] - points[j][0]);
      }
    }
    result += term;
  }

  return result;
};

// Helper function to get all combinations of k elements from array
const getCombinations = (array, k) => {
  const results = [];

  const helper = (start, currentCombination) => {
    if (currentCombination.length === k) {
      results.push([...currentCombination]);
      return;
    }
    for (let i = start; i < array.length; i++) {
      currentCombination.push(array[i]);
      helper(i + 1, currentCombination);
      currentCombination.pop();
    }
  };

  helper(0, []);
  return results;
};

const processDataAndInterpolate = (data) => {
  const points = [];

  // Convert the data and prepare points for interpolation
  for (const [key, value] of Object.entries(data)) {
    if (key !== "keys") {
      const base = value.base;
      const numValue = value.value;
      const base10Value = baseConverter(numValue, parseInt(base));
      points.push([parseInt(key), base10Value]); // (x, y) pair
    }
  }

  return points;
};

const findSecret = (data) => {
  const { k } = data.keys; // We only need k
  const points = processDataAndInterpolate(data);

  // Get all combinations of k points from the n points
  const combinations = getCombinations(points, k);

  const constantsMap = new Map();
  const wrongPoints = []; // Store wrong points that did not match any constant
  const countMap = new Map(); // Track counts of each constant

  // Perform interpolation for each combination
  for (const combination of combinations) {
    const interpolatedValue = interpolation(combination, 0);
    const roundedValue = interpolatedValue; // Round for comparison to avoid floating point issues

    // Check if the constant is already seen
    if (constantsMap.has(roundedValue)) {
      // Increment the count for this constant
      countMap.set(roundedValue, countMap.get(roundedValue) + 1);
    } else {
      constantsMap.set(roundedValue, combination);
      countMap.set(roundedValue, 1); // Initialize count
      wrongPoints.push(combination); // Store this combination as a "wrong point"
    }
  }

  // Check for a matching constant with exactly k occurrences
  let foundMatchingConstant = null;
  for (const [constant, count] of countMap.entries()) {
    if (count >= k) {
      foundMatchingConstant = constant;
      break; // We found a matching constant with exactly k occurrences
    }
  }

  // Output the results
  if (foundMatchingConstant) {
    // Do something with foundMatchingConstant if needed
  } else {
    console.log("No matching constant found.");
  }

  // Output wrong points that did not yield matching constants
  wrongPoints.forEach((point) => {
    // Do something with the wrong points if needed
  });

  return foundMatchingConstant; // Return the matching constant or null
};

const array = [];
const data1 = require("./data1.json");
const secret1 = findSecret(data1);
array.push(secret1);

const data2 = require("./data2.json");
const secret2 = findSecret(data2);
array.push(secret2);

console.log(array);
