var authMocks = [
  {
    method: 'POST',
    url: '/signin',
    data: {username: 'Neo', password: 'almostsuper'},
    result: {
      "status": {
        "code": 200,
        "name": "OK"
      },
      "result": {
        "username": "Neo",
        "_id": "5260001073657b99d0000001",
        "avatar": 'uploads/images/users/neo.jpeg',
        "quotes": ["I know kung fu.", "Mr. Wizard. Get me the hell out of here."]
      },
      "error": {}
    }
  },
  {
    method: 'POST',
    url: '/signin',
    result: {
      "status": {
        "code": 400,
        "name": "Bad Request"
      },
      "result": {},
      "error": {
        "message": "Wrong username or password",
        "code": 400,
        "moreInfo": "http://localhost:3000/api/docs/errors/400"
      }
    }
  },
  {
    method: 'POST',
    url: '/signout',
    result: {
      "status": {
        "code": 200,
        "name": "OK"
      },
      "result": {},
      "error": {}
    }
  }
];