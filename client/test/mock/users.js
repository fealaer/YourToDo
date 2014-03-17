var usersMocks = [
  {
    method: 'GET',
    url: 'api/v0/users',
    result: {
      "status": {
        "code": 200,
        "name": "OK"
      },
      "result": [
        {
          "username": "Neo",
          "avatar": "uploads/images/users/neo.jpeg",
          "_id": "5260001073657b99d0000001",
          "quotes": [
            "I know kung fu.",
            "Mr. Wizard. Get me the hell out of here."
          ]
        },
        {
          "username": "Agent Smith",
          "avatar": "uploads/images/users/agent-smith.jpeg",
          "_id": "528e5420c4f9fe3f78000001",
          "quotes": [
            "Never send a human to do a machine's job."
          ]
        },
        {
          "username": "Trinity",
          "avatar": "uploads/images/users/trinity.jpeg",
          "_id": "528e5420c4f9fe3f78000002",
          "quotes": [
            "Dodge this."
          ]
        },
        {
          "username": "Mouse",
          "avatar": "uploads/images/users/mouse.jpeg",
          "_id": "528e5420c4f9fe3f78000003",
          "quotes": [
            "To deny our own impulses is to deny the very thing that makes us human."
          ]
        }
      ],
      "error": {}
    }
  }
];