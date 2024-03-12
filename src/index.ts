import { writeFile } from "fs/promises";
import { Random } from "random-js";
import {
  hasRepeatedFromLastDays,
  isNumbersAlreadyDrawn,
  primesCount
} from "./data/lotofacil/lotofacil";
import { fetchLoteriaAndSave } from "./lib/loteria.service";


const random = new Random();
const CONCOURSE = 3052;
const LOTOFACIL_QUANTITY = 15;
const LOTOFACIL_MIN = 1;
const LOTOFACIL_MAX = 25;

const generateRandomNumber = (
  min: number,
  max: number,
  isEven: boolean
): number => {
  let num: number;
  do {
    num = random.integer(min, max);
  } while (isEven && num % 2 !== 0);
  return num;
};

const generateNumbers = (
  quantity: number,
  quantityEven: number,
  min: number,
  max: number
): number[] => {
  if (max - min + 1 < quantity) {
    throw new Error(
      "The range is too small to generate the required quantity of unique numbers."
    );
  }

  const numbers: number[] = [];

  for (let i = 0; i < quantityEven; i++) {
    let num: number;
    do {
      num = generateRandomNumber(min, max, true);
    } while (numbers.includes(num));
    numbers.push(num);
  }

  for (let i = 0; i < quantity - quantityEven; i++) {
    let num: number;
    do {
      num = generateRandomNumber(min, max, false);
    } while (numbers.includes(num));
    numbers.push(num);
  }

  return numbers.sort((a, b) => a - b);
};

const generateBlockNumbers = (
  even: number,
  prime: number,
  quantity: number
): number[][] => {
  const draws: number[][] = [];
  for (let i = 0; i < quantity; i++) {
    do {
      const numbers = generateNumbers(
        LOTOFACIL_QUANTITY,
        even,
        LOTOFACIL_MIN,
        LOTOFACIL_MAX
      );
      if (
        !isNumbersAlreadyDrawn(numbers) &&
        primesCount(numbers) === prime &&
        hasRepeatedFromLastDays(numbers, 9)
      ) {
        const repeated = draws.some((loteria) => {
          return numbers.every((num) => loteria.includes(num));
        });
        if (repeated) {
          continue;
        }
        draws.push(numbers);
        break;
      }
    } while (true);
  }
  return draws;
};

const generateConcourse = async () => {
  await fetchLoteriaAndSave("lotofacil");

  const guesses = [];

  guesses.push(...generateBlockNumbers(6, 4, 1));
  guesses.push(...generateBlockNumbers(6, 5, 1));
  guesses.push(...generateBlockNumbers(6, 6, 1));
  guesses.push(...generateBlockNumbers(7, 4, 1));
  guesses.push(...generateBlockNumbers(7, 5, 1));
  guesses.push(...generateBlockNumbers(7, 6, 1));
  guesses.push(...generateBlockNumbers(7, 7, 1));
  guesses.push(...generateBlockNumbers(8, 4, 1));
  guesses.push(...generateBlockNumbers(8, 5, 1));
  guesses.push(...generateBlockNumbers(8, 6, 1));

  console.log(guesses);

  let data = {
    concurse: CONCOURSE,
    result: [],
    guesses,
  };

  const dataString = JSON.stringify(data, null, 2);
  await writeFile(`./src/data/lotofacil/guesses/${CONCOURSE}.json`, dataString);
};

generateConcourse();
