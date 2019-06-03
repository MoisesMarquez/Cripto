const express = require("express");
const app = express();

const NodeRSA = require('node-rsa');

app.use(express.static('public'));

app.use(express.static(__dirname + '/public'));


//////////////////////////////////////

var primos = [7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71,73,79,83,89,97,101];

var cont = 0;
var usuarios = [];
var mensajes = new Map();


app.post('/user/:nombre', function (req, res) {

    var keys = generateKeys();

    var user = {
        nombre: req.params.nombre,
        publicKey: [keys[0], keys[2]],
        privateKey: [keys[1], keys[2]]
    }

    usuarios.push(user);

    res.send(user);
});

app.get('/user/', function (req, res) {

    res.send(usuarios);

});


app.get('/message/:emisor/:remitente', function (req, res) {

    var messageKey1 = req.params.emisor + req.params.remitente;
    var messageKey2 = req.params.remitente + req.params.emisor;

    if (mensajes.get(messageKey1) != undefined) {
        res.send(mensajes.get(messageKey1));
    } else if (mensajes.get(messageKey2) != undefined) {
        res.send(mensajes.get(messageKey2));
    } else {
        res.send([]);
    }

});

app.post('/message/:emisor/:remitente/:message', function (req, res) {

    console.log("Mensaje de:  "+req.params.emisor);
    console.log("Mensaje para:"+req.params.remitente);
    console.log("Mensaje "+req.params.message);

    var messageKey1 = req.params.emisor + req.params.remitente;
    var messageKey2 = req.params.remitente + req.params.emisor;

    


    if (mensajes.get(messageKey1) != undefined) {

        messages = mensajes.get(messageKey1);

        var mensaje = {
            nombre: req.params.emisor,
            texto: req.params.message
        }
        messages.push(mensaje);

        mensajes.set(messageKey1, messages);
    }

    if (mensajes.get(messageKey2) != undefined) {

        messages = mensajes.get(messageKey2);
        var mensaje = {
            nombre: req.params.emisor,
            texto: req.params.message
        }
        messages.push(mensaje);

        mensajes.set(messageKey2, messages);
    } 
    
    if (mensajes.get(messageKey1) == undefined){
        var mensaje = {
            nombre: req.params.emisor,
            texto: req.params.message
        }
        var messages = [];

        messages.push(mensaje);
        mensajes.set(messageKey1, messages);
    }

    if (mensajes.get(messageKey2) == undefined){
        var mensaje = {
            nombre: req.params.emisor,
            texto: req.params.message
        }
        var messages = [];

        messages.push(mensaje);
        mensajes.set(messageKey2, messages);
        
    }

    res.send('OK');

});































function generateKeys() {

    var p = primos[cont];
    cont++;
    var q = primos[cont];
    cont++;

    var n = p * q;
    var e = getPrimoRelativo((p - 1) * (q - 1));
    var d = inverseMod(e, ((q - 1) * (p - 1)));

    return [e, d, n];
}

function getPrimoRelativo(numero) {

    for (var i = 4; i < numero; i++) {
        if (mcd(numero, i)) {
            e = inverseMod(numero, i);
            if (e) {
                return i;
            }
        }
    }
}

function mcd(a, b) {
    var resultado = 1;
    while (resultado != 0) {

        resultado = a % b;

        if (resultado != 0) {
            a = b;
            b = resultado;
        }
    }
    return b;
}

function inverseMod(a, m) {
    for (var x = 1; x <= m; ++x) {
        if (((a * x) % m) == 1) {
            return x;
        }
    }
    return 0;
}



app.listen(3000, () => {
    console.log("El servidor está inicializado en el puerto 3000");
});

