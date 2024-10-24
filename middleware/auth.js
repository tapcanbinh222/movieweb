// middleware/auth.js

const isAuthenticated = (req, res, next) => {
    if (req.session.isLoggedIn) {
        return next();
    } else {
        res.redirect('/login');
    }
};

module.exports = isAuthenticated;
