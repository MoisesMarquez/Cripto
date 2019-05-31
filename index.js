const express = require("express");
const app = express();

const NodeRSA = require('node-rsa');

app.use(express.static('public'));

app.use(express.static(__dirname + '/public'));


//////////////////////////////////////

var primos = [1009, 1013, 1019, 1021, 1031, 1033, 1039, 1049, 1051, 1061, 1063, 1069,

    1087, 1091, 1093, 1097, 1103, 1109, 1117, 1123, 1129, 1151, 1153, 1163, 1171, 1181, 1187, 1193, 1201, 1213, 1217, 1223,

    1229, 1231, 1237, 1249, 1259, 1277, 1279, 1283, 1289, 1291, 1297, 1301, 1303, 1307, 1319, 1321, 1327, 1361, 1367, 1373,

    1381, 1399, 1409, 1423, 1427, 1429, 1433, 1439, 1447, 1451, 1453, 1459, 1471, 1481, 1483, 1487, 1489, 1493, 1499, 1511,

    1523, 1531, 1543, 1549, 1553, 1559, 1567, 1571, 1579, 1583, 1597, 1601, 1607, 1609, 1613, 1619, 1621, 1627, 1637, 1657,

    1663, 1667, 1669, 1693, 1697, 1699, 1709, 1721, 1723, 1733, 1741, 1747, 1753, 1759, 1777, 1783, 1787, 1789, 1801, 1811,

    1823, 1831, 1847, 1861, 1867, 1871, 1873, 1877, 1879, 1889, 1901, 1907, 1913, 1931, 1933, 1949, 1951, 1973, 1979, 1987,

    1993, 1997, 1999, 2003];

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

    console.log('Mensaje:' + req.params.message);

    var messageKey1 = req.params.emisor + req.params.remitente;
    var messageKey2 = req.params.remitente + req.params.emisor;

    console.log('llave 1: '+messageKey1);
    console.log('llave 2: '+messageKey2);


    if (mensajes.get(messageKey1) != undefined) {

        messages = mensajes.get(messageKey1);

        var mensaje = {
            nombre: req.params.emisor,
            texto: req.params.message
        }
        messages.push(mensaje);

        mensajes.set(messageKey1, messages);
        console.log('Primer If');
    }

    if (mensajes.get(messageKey2) != undefined) {

        messages = mensajes.get(messageKey2);
        var mensaje = {
            nombre: req.params.emisor,
            texto: req.params.message
        }
        messages.push(mensaje);

        mensajes.set(messageKey2, messages);

        console.log('Segundo If');
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

