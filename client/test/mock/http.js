angular.module('e2e-http-mock', ['mainApp', 'ngMockE2E'])
    .run(function ($httpBackend) {
      $httpBackend.whenGET(/^\/views.*/).passThrough();
      var mocks = [].concat(
          authMocks,
          pagesMocks,
          galleriesMocks,
          recentMocks,
          menuMocks
      );
      for (var i = 0; i < mocks.length; ++i) {
        $httpBackend.when(mocks[i].method, mocks[i].url, mocks[i].data).respond(mocks[i].result);
      }
    });
angular.module('mainApp').requires.push('e2e-http-mock');