import { writeFile } from 'fs/promises';

const LOTERIA_URL = 'https://loteriascaixa-api.herokuapp.com/api/';
export const fetchLoteriaAndSave = async (loteria: string) => {
  const response = await fetch(LOTERIA_URL + loteria);
  const data = await response.json();

  const dataString = JSON.stringify(data, null, 2);
  await writeFile(`./src/data/${loteria}/response_${loteria}.json`, dataString);
}