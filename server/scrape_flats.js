const puppeteer = require('puppeteer');
const pgp = require('pg-promise')();
const db = pgp('postgres://postgres:123123@127.0.0.1/parse_flats');

let scrape = async () => {
    const browser = await puppeteer.launch({ headless: false, , args: ['--no-sandbox'] });
    const page = await browser.newPage();
    const TARGET_PARSING_PAGES = 500;

    await page.goto('https://www.sreality.cz/en/search/for-sale/apartments');
    await page.setViewport({ width: 1920, height: 1080 });
    await new Promise(resolve => setTimeout(resolve, 2000));

    const flats = [];
    for (let currentPage = 1; currentPage <= 50; currentPage++) {

        if (flats.length === TARGET_PARSING_PAGES) {
            break;
        }

      await page.goto(`https://www.sreality.cz/hledani/prodej/byty?strana=${currentPage}`);
      await new Promise(resolve => setTimeout(resolve, 1000));

      const result = await page.evaluate(() => {
        let flats = [];
        let title = document.querySelectorAll('#page-layout > div.content-cover > div.content-inner > div.transcluded-content.ng-scope > div > div > div > div > div > div > div > div > div > span > h2 > a > span');
        let imageUrl = document.querySelectorAll('#page-layout > div.content-cover > div.content-inner > div.transcluded-content.ng-scope > div > div > div > div > div:nth-child(4) > div > div > preact > div > div > a:nth-child(1) > img')
        let price = document.querySelectorAll('#page-layout > div.content-cover > div.content-inner > div.transcluded-content.ng-scope > div > div > div > div > div > div > div > div > div > span > span.price.ng-scope > span')

        for (let i = 0; i < title.length; i++) {
          flats.push({
            title: title[i].innerText,
            imageUrl: imageUrl[i].src,
            price: price[i].innerText,
          });
        }
        return flats;
      });

      flats.push(...result);
    }

    await browser.close();

    // Save data to PostgreSQL
    try {
        await db.none(`
          CREATE TABLE IF NOT EXISTS flats (
            id SERIAL PRIMARY KEY,
            title TEXT,
            imageUrl TEXT,
            price TEXT
          );
        `);

        for (const flat of flats) {
          await db.none(`
            INSERT INTO flats (title, imageUrl, price)
            VALUES ($1, $2, $3);
          `, [flat.title, flat.imageUrl, flat.price]);
        }

        console.log('Successfully saved data to PostgreSQL');
      } catch (error) {
        console.error('Error: ', error);
      } finally {
        pgp.end();
      }

    return flats;
  };
  

scrape().then((value) => {
    console.log(value);
});