var menuMocks = [
  {
    method: 'GET',
    url: '/menu',
    result: {
      "status": {
        "code": 200,
        "name": "OK"
      },
      "result": [
        {
          "path": "/about",
          "title": "About"
        },
        {
          "path": "/resume",
          "title": "Resume"
        },
        {
          "path": "/animation",
          "title": "Animation"
        },
        {
          "path": "",
          "title": "Artworks",
          "dropdown": true,
          "nestedMenu": [
            {
              "path": "/artworks/sketches",
              "title": "Sketches"
            },
            {
              "path": "/artworks/classical_drawings",
              "title": "Classical Drawings"
            },
            {
              "path": "/artworks/3d",
              "title": "3d"
            },
            {
              "path": "/artworks/2d",
              "title": "2d"
            }
          ]
        }
      ],
      "error": {}
    }
  }
];