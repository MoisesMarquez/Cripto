angular.module('Autoridad', [])
  .controller('autoridadController', function ($http,$timeout) {

    var scope = this;
    scope.users = [];
    
    scope.iniciar = () => {
        console.log("iniciar")
        
        $http.get('http://localhost:3000/user/').then(function success(response) {
            console.log("http")
        scope.users = response.data
        console.log(response.data)
      });
        $timeout(scope.iniciar,1000);
      };

  });