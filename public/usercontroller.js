angular.module('user', [])
  .controller('usercontroller', function ($http, $timeout) {

    var scope = this;

    scope.usernameAux = '';
    scope.nombre = '';
    scope.privateKey;
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

    scope.enviarMensaje = function (mensajeAux) {


      if (mensajeAux !== '') {
        $http.post('http://localhost:3000/message/' + scope.nombre + "/" + scope.contactoSeleccionado + "/" + cifrarMensaje(mensajeAux)).then(function success(response) {

        });

        scope.bufferTexto = '';
        mensajeAux = '';
      }

    };

    scope.updateData = () => {

      $http.get('http://localhost:3000/user/').then(function success(response) {
        scope.users = response.data

      });

      if (scope.contactoSeleccionado != '') {
        $http.get('http://localhost:3000/message/' + scope.nombre + "/" + scope.contactoSeleccionado).then(function success(response) {
          
          scope.mensajes = [];
          //scope.mensajes = response.data;
          scope.mensajes = desCifrarMensajes(response.data);
        });
      }

      $timeout(scope.updateData, 1000);
    };

    cifrarMensaje = (texto) => {

      var textoArray = [];
      var contactoSeleccionado = getUser();
      for (var i = 0; i < texto.length; i++) {
        textoArray[i] = pow(texto[i].charCodeAt(0), contactoSeleccionado.publicKey[0], contactoSeleccionado.publicKey[1]);
      }
      return textoArray;
    }

    desCifrarMensajes = (data) => {


      for (var j = 0; j < data.length; j++) {

        var textoArray = data[j].texto.split(",");
        var caracter = '';
        var contactoSeleccionado = getUser();
        var caracteres = '';

        for (var i = 0; i < textoArray.length; i++) {


          if(data[j].nombre == scope.nombre){

            caracter = '';
            var aux = pow(textoArray[i],contactoSeleccionado.privateKey[0],contactoSeleccionado.privateKey[1]);

            caracter = String.fromCharCode(aux);
            caracteres+=caracter;

          }

          if(data[j].nombre == scope.contactoSeleccionado){
            var aux = pow(textoArray[i],scope.privateKey[0],scope.privateKey[1]);
            //Math.pow(textoArray[i], scope.privateKey[0]) % scope.privateKey[1];

            caracter = String.fromCharCode(aux);
            caracteres+=caracter;
           
          }
          
        }
        data[j].texto = caracteres;
      }
      
      return data;
    }


    getUser = () => {

      for (var i = 0; i < scope.users.length; i++) {
        if (scope.contactoSeleccionado == scope.users[i].nombre) {
          return scope.users[i];
        }
      }
    }

    pow = (numero, potencia,n) => {
        
      var result = numero*numero;
      potencia--;
      
      while(potencia!=1){
          result *= numero;
          result = result%n;
          potencia--;
      }
      return result;
  }

    
  });