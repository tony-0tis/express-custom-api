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

app.info('/list', {method: 'get'}); //add info for app path `/list` with method `get`
app.get('/list', (req, res)=>{});

let router = express.Router();
router.info('/set', {method: 'post'}) //add info for router path `/set` with method `post`
router.post('/set', (req, res)=>{})

app.use('/list', router);

app.get('/other1', (req, res)=>{});
app.use('/other2', (req, res)=>{});

app.info('/something', {method: 'get'}); //add info for app path `/something` with method `get`

console.log(app.getInfo());
````

This will add two methods for main app


## Methods
This script add two methods which visible from the main app and from router app:
- `info(path, infoObject)` - Add info
- `getInfo(onlyCurrent)` - Obtain array of all methods

#### `info` method
Can be called in any place for the same `app` or `router` instance, except cases, when the full path is specified.

Accepts two parameters:
- `path` - Same path as setted to method or full path(when path adden in the underlying router)
- `infoObject` - Object with information about path
  - `method` - parameter, to match methods with info, null for use
  - `*` - other parameters like `title`, `desription` avaliable

#### `getInfo` method
Obtain array of avaliable methods. Each element of array would be an object.
Expamle:
```js
[ { path: '/list',
    type: 'info',
    methodMatch: true,
    info: { method: 'get' } },
  { path: '/something',
    type: 'info',
    methodMatch: false,
    info: { method: 'get' } },
  { path: '/other1', type: 'method', info: { method: 'get' } },
  { path: '/other2', type: 'method' },
  { path: '/list/set',
    type: 'info',
    methodMatch: true,
    info: { method: 'post' } } ]
```