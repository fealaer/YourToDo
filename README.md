# Andrey Pushkarev TopTal test project

- [Demo](#demo)
- [Description](#description)
- [How to start](#start)
- [Development](#development)
- [Heroku](#heroku)

## Demo
[demo](http://toptal-test-project.herokuapp.com)

## Description
This is ToDo list management application where user can:
- register and log in;
- have my todo list displayed;
- manipulate his list (add/remove/modify entries);
- assign priorities to the entries;
- do all features above using a very simple REST api.

The front-end is using Ajax exclusively.
It has two versions:
- first without any design/UI/logo, etc, only plain html;
- second has all this stuff.

## How to start

Get code
```shell
git clone http://git.toptal.com/gkalman/andrey-pushkarev-project.git
```

Test that everything works fine
```shell
npm install && bower install && npm test
```

## Development

Run server in development mode
```shell
npm start
```

Run all tests
```shell
npm test
```

For run in production mode use
```shell
NODE_ENV=production node server/app.js
```

## Heroku

For release on heroku

**Note:** you need to configure heroku first

**Note:** branch release will be updated to master and released

```shell
./release.sh
```