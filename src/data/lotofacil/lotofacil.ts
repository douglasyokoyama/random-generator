import { Loteria } from "../../definitions";

const data: Loteria[] = require("./response_lotofacil.json");

// Function to check if a number is prime
function isPrime(num: number): boolean {
  for (let i = 2; i < num; i++) if (num % i === 0) return false;
  return num > 1;
}

export const lotofacil = data.map((loteria) => {
  return {
    ...loteria,
    dezenas: loteria.dezenas.map((num) => parseInt(num, 10)),
  };
});

type Analitics = {
  [key: number]: { min: number; max: number };
};

const analitics: Analitics = {};
const evenCount: { [key: number]: number } = {};
const primesCountHash: { [key: number]: number } = {};
const primesCountInEvenCount: { [key: number]: { [key: number]: number } } = {};
const repeatedFromLast3Count: { [key: number]: number } = {};
const repeatedFromLast2Count: { [key: number]: number } = {};

lotofacil.forEach((loteria, index) => {
  // min and max
  for (let i = 0; i < 15; i++) {
    if (!analitics[i])
      analitics[i] = { min: loteria.dezenas[i], max: loteria.dezenas[i] };
    if (analitics[i]?.min > loteria.dezenas[i])
      analitics[i].min = loteria.dezenas[i];
    if (analitics[i]?.max < loteria.dezenas[i])
      analitics[i].max = loteria.dezenas[i];
  }

  // even and odd
  const even = loteria.dezenas.filter((num) => num % 2 === 0).length;
  if (!evenCount[even]) evenCount[even] = 0;
  evenCount[even]++;

  // prime numbers
  const primeCount = loteria.dezenas.filter(isPrime).length;
  if (!primesCountHash[primeCount]) primesCountHash[primeCount] = 0;
  primesCountHash[primeCount]++;

  if (!primesCountInEvenCount[primeCount])
    primesCountInEvenCount[primeCount] = {};
  if (!primesCountInEvenCount[primeCount][even])
    primesCountInEvenCount[primeCount][even] = 0;
  primesCountInEvenCount[primeCount][even]++;

  // repeated from last 3
  const lastThree = lotofacil
    .slice(index - 3, index)
    .map((loteria) => loteria.dezenas);
  const numbersThree = lastThree.flat();
  // Count the occurrences of each number
  const countsThree = numbersThree.reduce((acc, num) => {
    acc[num] = (acc[num] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
  // Filter out the numbers that only appear once
  const repeatedThreeCounts = Object.entries(countsThree).filter(
    ([num, count]) => count === 3
  );
  if (!repeatedFromLast3Count[repeatedThreeCounts.length])
    repeatedFromLast3Count[repeatedThreeCounts.length] = 0;
  repeatedFromLast3Count[repeatedThreeCounts.length]++;

  // repeated from last 2
  const lastTwo = lotofacil
    .slice(index - 2, index)
    .map((loteria) => loteria.dezenas);
  const numbersTwo = lastTwo.flat();
  // Count the occurrences of each number
  const countsTwo = numbersTwo.reduce((acc, num) => {
    acc[num] = (acc[num] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
  // Filter out the numbers that only appear once
  const repeatedTwoCounts = Object.entries(countsTwo).filter(
    ([num, count]) => count === 2
  );
  if (!repeatedFromLast2Count[repeatedTwoCounts.length])
    repeatedFromLast2Count[repeatedTwoCounts.length] = 0;
  repeatedFromLast2Count[repeatedTwoCounts.length]++;
  
});

// console.log("anal", analitics);
// console.log("evens", evenCount);
// console.log("primes", primesCountHash);
console.log("primesInEven", primesCountInEvenCount);
console.log("repeatedFromLast3", repeatedFromLast3Count);
console.log("repeatedFromLast2", repeatedFromLast2Count);

export const isNumbersAlreadyDrawn = (numbers: number[]): boolean => {
  return lotofacil.some((loteria) => {
    return numbers.every((num) => loteria.dezenas.includes(num));
  });
};

export const primesCount = (numbers: number[]): number => {
  return numbers.filter(isPrime).length;
};

export const hasRepeatedFromLastDays = (numbers: number[], repeated: number): boolean => {
  const lastThree = lotofacil.slice(-1).map((loteria) => loteria.dezenas);
  const numbersThree = lastThree.flat();
  const uniqueNumbers = [...new Set(numbersThree)];
  const commonNumbers = uniqueNumbers.filter((num) => numbers.includes(num));
  console.log(commonNumbers.length)
  return commonNumbers.length === repeated;
}