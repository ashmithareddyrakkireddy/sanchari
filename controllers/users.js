const User = require('../models/user');

module.exports.renderRegisterForm =(req, res) => {
    res.render('register')
}

module.exports.registerUser =async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ email, username });
        const newuser = await User.register(user, password);
        req.login(newuser,function(err){
            if(err){
                return next(err);
            }else{
                req.flash('success', "U are Registered,Welcome to Yelpcamp");
                console.log(newuser);
                res.redirect('/campgrounds');
            }
        })
        
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

module.exports.renderLoginForm =  (req, res) => {
    res.render('login');
}

module.exports.LoginUser = async (req, res) => {
    req.flash('success', "Welcome ,You are logged in!");
    const newurl = (res.locals.returnTo || '/campgrounds')
    res.redirect(newurl);
}

module.exports.LogoutUser =  (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Logged out ,Goodbye!');
        res.redirect('/campgrounds');
    });
}
