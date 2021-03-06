angular.module("app", [
  'ui.bootstrap',
  'category',
  'goals',
  'ui.router',
  'angularMoment',
  'Auth'
])
.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/signin');

  $stateProvider.state('goals', {
    url: '/goals',
    templateUrl: './goals/goals.html',
    controller: 'goalsController',
    authenticate: true
  })
  .state('signin', {
    url: '/signin',
    templateUrl: './auth/signin.html',
    authenticate: false
  })
  // .state('category', {
  //   url: '/',
  //   templateUrl: './category/category.html',
  //   controller: 'categoryController'
  // })
  .state('dashboard', {
    url: '/',
    templateUrl: './dashboard/dashboard.html',
    controller: 'categoryController',
    authenticate: true
  });
})
.run(['$rootScope', '$location', '$state', '$window', function ($rootScope, $location, $state, $window, sAuth) {

  $rootScope.user = {};

  function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    $rootScope.user.status = response.status;
    // $rootScope.user.name = response.name;
    // $rootScope.user.email = response.email;
    console.log('LOOK FOR THIS NOW!!!!',response);
    console.log('LOOK FOR THIS NOW!!!!',$rootScope.user);

    if (response.status === 'connected') {
      $state.go('dashboard');
    } else if (response.status === 'not_authorized') {
      $state.go('signin');
    } else {
      $state.go('signin');
    }
  }

  $window.fbAsyncInit = function() {
    FB.init({
      appId      : '1654239444895169',
      cookie     : true,  // enable cookies to allow the server to access
      status     : true,
                          // the session
      xfbml      : true,  // parse social plugins on this page
      version    : 'v2.5' // use graph api version 2.5
    });

    FB.Event.subscribe('auth.authResponseChange', function(res) {

      if (res.status === 'connected') {
        FB.api('/me', function(res) {
          $rootScope.$apply(function() {
            $rootScope.user = res;
          });
        });
        $state.go('dashboard');
      } else {
        FB.logout(function(res) {
          $rootScope.$apply(function() {
            $rootScope.user = {};
          });
        });
        $state.go('signin');
      }

    });
  };

  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

}]);
