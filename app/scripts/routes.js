(function(){

angular.module("game").config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: 'app/partials/home/home.tpl.html',
      controller: 'HomeController'
    });

  $urlRouterProvider.otherwise('home');
}])



})();