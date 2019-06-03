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
          console.log('Limpiando Mensajes')
          scope.mensajes = [];
          //scope.mensajes = response.data;
          scope.mensajes = desCifrarMensajes(response.data);
          console.log("Mensajes: ");
          console.log(scope.mensajes);
        });
      }

      $timeout(scope.updateData, 1000);
    };

    cifrarMensaje = (texto) => {

      var textoArray = [];
      var contactoSeleccionado = getUser();
      for (var i = 0; i < texto.length; i++) {
        console.log("Cifrando");
        console.log(texto[i].charCodeAt(0)+" ^ "+contactoSeleccionado.publicKey[0]+" % "+contactoSeleccionado.publicKey[1]);
        textoArray[i] = Math.pow(texto[i].charCodeAt(0), contactoSeleccionado.publicKey[0]) % contactoSeleccionado.publicKey[1];
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
            console.log("Descifrando");
            console.log(textoArray[i]+" ^ "+contactoSeleccionado.privateKey[0]+" % "+contactoSeleccionado.privateKey[1]);
            //var aux = BigInt(Math.pow(textoArray[i],contactoSeleccionado.privateKey[0])%contactoSeleccionado.privateKey[1]);
            var aux = Math.pow(855,2753) % 3233;
            console.log(aux);

            //caracter =   % contactoSeleccionado.privateKey[1];
            
            
            console.log("caracter: "+caracter);
          }

          if(data[j].nombre == scope.contactoSeleccionado){
            texto += Math.pow(textoArray[i], scope.privateKey[0]) % scope.privateKey[1];
           
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























  });