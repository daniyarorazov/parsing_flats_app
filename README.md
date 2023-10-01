# parsing_flats_app

Inside folder <code>client/</code> and <code>server/</code> require run command
```
npm install
```

For parsing data from <b>sreality</b>, you should run next command in server/. It opens chromium browser and parse data
```
node scrape_flats.js
```

For API, you should run this command:
```
node server.js
```
Also configure your local postgresql in <code>server.js</code>
```
const pool = new Pool({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'parse_flats',
  password: '123123',
  port: 5432,
});
```

For React, run command
```
npm run dev
```

