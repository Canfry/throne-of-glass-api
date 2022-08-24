import axios from 'axios';
import * as cheerio from 'cheerio';
import mysql from 'mysql';

// Create connection to database
const connectionString = process.env.DATABASE_URL || '';
const connection = mysql.createConnection(connectionString);
connection.connect();

const getCharactersPageNames = async () => {
  const url =
    'https://throneofglass.fandom.com/wiki/Category:Kingdom_of_Ash_characters';
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  const categories = $('ul.category-page__members-for-char');

  const characterPageNames = [''];
  for (let i = 0; i < categories.length; i++) {
    const ul = categories[i];
    const charactersLIs = $(ul).find('li.category-page__member');
    for (let j = 0; j < charactersLIs.length; j++) {
      const li = charactersLIs[j];
      const path =
        $(li).find('a.category-page__member-link').attr('href') || '';
      const name = path.replace('/wiki/', '');
      characterPageNames.push(name);
      // console.log(name);
    }
  }

  return characterPageNames;

  // console.log(data);
};

const getCharacterInfo = async (characterName: string) => {
  const url = 'https://throneofglass.fandom.com/wiki/' + characterName;
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  let name = $(
    'div[data-source="full name"] > div.pi-data-value.pi-font'
  ).text();
  const species = $(
    'div[data-source="species"] > div.pi-data-value.pi-font'
  ).text();
  const image = $('.thumb.tright > a > img').attr('src');

  if (!name) {
    name = characterName.replace('_', ' ');
  }

  const characterInfo = {
    name,
    species,
    image,
  };

  return characterInfo;
};

const loadCharacters = async () => {
  const characterPageNames = await getCharactersPageNames();
  // const characterInfoArray = [];
  // for (let i = 0; i < characterPageNames.length; i++) {
  //   const characterInfo = await getCharacterInfo(characterPageNames[i]);
  //   characterInfoArray.push(characterInfo);
  // }
  // console.log(characterInfoArray);
  // THIS TAKE A LOT OF TIME TO LOAD SO CAN USE:
  const characterInfoPromises = characterPageNames.map((characterName) =>
    getCharacterInfo(characterName)
  );
  const characters = await Promise.all(characterInfoPromises);
  const values = characters.map((character, i) => [
    i,
    character.name,
    character.species,
    character.image,
  ]);
  // console.log(characters);
  const sql = 'INSERT INTO characters (id, name, species, image) VALUES ?';
  connection.query(sql, [values], (err) => {
    if (err) {
      console.error("AAHHHH it didn't work");
    } else {
      console.log('AAAYYYY DB IS POPULATED');
    }
  });
};

// getCharactersPageNames();
loadCharacters();
