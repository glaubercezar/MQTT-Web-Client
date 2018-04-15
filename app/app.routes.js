(function() {

  angular
    .module('app.routes', ['ngRoute'])
    .config(function($routeProvider) {

      $routeProvider
      .when('/home', {
        templateUrl: 'templates/home.tpl.html',
        controller: 'HomeController as vm'
      })  
      .when('/enviroments', {
        templateUrl: 'templates/enviroments.tpl.html',
        controller: 'EnviromentsController as vm'
      })
      .otherwise({
        redirectTo: '/home'
      });

    });

})();