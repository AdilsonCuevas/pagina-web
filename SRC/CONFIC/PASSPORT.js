const LocalStritegy = require('passport-local').Strategy;
const User = require('../APP/MODELS/USER');

module.exports = function (passport) {
    //serializar los datos cuando se logean guerdan los datos en una session passport
    //para no logiarnos a cada momento
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
    //proceso inverso de serializar busca el id y le da dos respuestas
    //el error o el usuario
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
    //cuando se autentica que pasara despues
    //SINGUP
    passport.use('local-singup', new LocalStritegy({
        usernameField: 'email',
        passwordFiled: 'password',
        passReqToCallback: true
    },
        // buscar el usuario como se esta registrando
        //puede generar un error o el usuario --done es un callback
    function (req, email, password, done) {
        User.findOne({'local.email': email}, function (err, user) { //buscar UN usuario
            if(err) {return done(err); } // si toma un error es porque no existe un ususario
            if(user) {return done(null, false, req.flash('SingupMessage', 'The email is already taker.'));} //mediante las rutas
            else {var newUser = new User; //crea un nuevo usuario
            newUser.local.email = email;
            newUser.local.password = newUser.generateHash(password); //enviar la contraseña ya cifrada
            newUser.save(function (err) {  //guarda los datos optiene un error
                if(err) {throw err;} //parar la aplicacion
                return done(null, newUser); // ha sido satisfactorio
            });}
        });
    }));

    //LOGIN
    passport.use('local-login', new LocalStritegy({
            usernameField: 'email',
            passwordFiled: 'password',
            passReqToCallback: true
        },
        // buscar el usuario como se esta registrando
        //puede generar un error o el usuario --done es un callback
        function (req, email, password, done) {
            User.findOne({'local.email': email}, function (err, user) { //buscar UN usuario
                if(err) {return done(err); } // si toma un error es porque no existe un ususario
                if(!user) {return done(null, false, req.flash('loginMessage', 'NO user found.'));} //mediante las rutas
                // no hay ususario y no hya error entonces debe buscar si el usuario permite ingresar
                if(!user.validatePassword(password)) {
                    return  done(null, false, req.flash('loginMessage', 'Wrong password'));}
                return done(null, user);
            });
        }));

}