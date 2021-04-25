module.exports = (app, passport) => {
  app.get('/', (req, res) => {
      res.render('INDEX');
  });

  app.get('/login', (req, res) => {
      res.render('login', {
          message: req.flash('loginMessage')
      });
  });

  app.get('/signup', (req, res) => {
      res.render('signup', {
          message: req.flash('SingupMessage')
      });
  });

  app.post('/login', passport.authenticate('local-login', {
      //successRedirect: '/profile', // si se puede logear
      failureRedirect: '/login', //produce fallas
      failureFlash: true // los mensajes de http se puedan visualizar
  }));

    app.post('/signup', passport.authenticate('local-singup', {
        //successRedirect: '/profile', //se pudo registrar
        failureRedirect: '/signup', // falla el registro
        failureFlash: true // los mensajes de http se puedan visualizar
    }));

    app.get('/profile', isLoggedIn, (req, res) => {
        res.render('profile', {
            user: req.user
        });
    });
    // salir de la cuenta
    app.get('/logout', (req, res) => {
        req.logOut();
        res.redirect('/')
    });
};
    // si esta autenticado o no
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {return next();}
    res.redirect('/');
}
