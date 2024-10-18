// middleware/auth.js

const isAuthenticated = (req, res, next) => {
    if (req.session.isLoggedIn) {
        return next();  // Tiếp tục nếu người dùng đã đăng nhập
    } else {
        res.redirect('/login');  // Chuyển hướng nếu chưa đăng nhập
    }
};

module.exports = isAuthenticated;
