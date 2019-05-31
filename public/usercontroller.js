angular.module('user', [])
  .controller('usercontroller', function ($http,$timeout) {

    var scope = this;

    scope.usernameAux = '';
    scope.nombre = '';
    scope.privateKey
    scope.users = [];
    scope.aux = ''
    scope.created = false;
    scope.mensajes = [];
    scope.contactoSeleccionado = '';
    scope.bufferTexto = '';


    scope.createUser = (useraux) => {

      $http.post('http://localhost:3000/user/' + useraux).then(function success(response) {

        scope.nombre = response.data.nombre
        scope.privateKey = response.data.privateKey
        scope.created = true;
        scope.updateData();

      });
    };

    scope.setContactoSeleccionado = (nombre) => {

      scope.contactoSeleccionado = nombre;
    };

    scope.enviarMensaje = function(mensajeAux) {
      console.log('paso 1');

      if(mensajeAux !== ''){
        console.log('paso 2')
        $http.post('http://localhost:3000/message/' + scope.nombre + "/" + scope.contactoSeleccionado+"/"+mensajeAux).then(function success(response) {

        });
        scope.bufferTexto = '';
        mensajeAux='';
        console.log('paso 3')
      }
      console.log('paso 4')
    };

    scope.updateData = () => {

      $http.get('http://localhost:3000/user/').then(function success(response) {
        scope.users = response.data

      });

      if (scope.contactoSeleccionado != '') {
        $http.get('http://localhost:3000/message/' + scope.nombre + "/" + scope.contactoSeleccionado).then(function success(response) {
          console.log('Limpiando Mensajes')
          scope.mensajes = [];
          scope.mensajes = response.data;

        });
      }

      $timeout(scope.updateData,1000);
    };






















  });