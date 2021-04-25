const express = require('express');
const path = require('path'); // manejar rutas de direcciones
const mongoose = require('mongoose'); //coneccion mongodb
const passport = require('passport'); //autenticacion
const flash = require('connect-flash');
const morgan = require('morgan'); //metodos HTTP y mostrarlos en consola
const cookieparser = require('cookie-parser');
const bodyparser = require('body-parser'); // procesar informacion
const session = require('express-session');
const app = express();

const { url } = require('./CONFIC/DATABASE');

mongoose.connect(url);

require('./CONFIC/PASSPORT')(passport); //requerir configuracion

//setting
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'VIEWS')); //ubicacion de carpetas
app.set('view engine', 'ejs'); //motor de plantillas

// middlewares
app.use(morgan('dev')); //mensajes por consola de desarrollo
app.use(cookieparser()); //convertir cookie e interpretarlas
app.use(bodyparser.urlencoded({extend: false})); //interpretacion de formularios por url
app.use(session({
   secret: 'tele-electronica',
   resave: false, //no se guarde constantemente
   saveUninitialized: false
})); //manejar sesiones de express
app.use(passport.initialize());
app.use(passport.session()); // unir a sesiones para no pedirlo constantemente
app.use(flash()); // mensajes entre HTML

// routes
require('./APP/ROUTES')(app, passport);


// static files
app.use(express.static(path.join(__dirname, 'PUBLIC'))); //ARCHIVOS CCS IMAGENES Y FUNETES ETC

app.listen(app.get('port'), () => {
   console.log('server on port', app.get('port'));
});
