# express-custom-api


## Install
```js
npm install --save express-custom-api
```
or
```js
yarn add express-custom-api
```

## How to use

```js
const express = require('express');
require('express-custom-api')(express);

let app = express();

app.info('/list', {method: 'get'}); //add info for **app** path `/list` with method `get`
app.get('/list', (req, res)=>{});

let router = express.Router();
router.info('/set', {method: 'post'}) //add info for **router** path `/set` with method `post`
router.post('/set', (req, res)=>{})

app.use('/list', router);

console.log(app.getInfo());
````

This will add two methods for main app


## Methods

This script add two methods which visible from the main app and from router app:
- `info(path, infoObject)` - Add info
- `getInfo(onlyCurrent)` - Obtain array of all methods

