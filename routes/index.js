var express = require('express');
var router = express.Router();
const Movie = require('../models/movie.model');
const User = require('../models/user.model');
router.get('/', async (req, res)=> {
  // Lấy danh sách các category duy nhất
  const categories = await Movie.distinct('category');
  res.render('index', {categories });
});
router.get('/login', (req, res) => {
  res.render('login'); // render trang login.pug
});

// Route xử lý đăng nhập
router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user && user.password === req.body.password) {
      req.session.isLoggedIn = true; // Thiết lập session
      return res.redirect('/'); // Chuyển hướng về trang chính
  } else {
      res.render("login", {
          msg: "Invalid email or password"
      });
  }
});

router.get('/register', (req, res) => {
  res.render('register'); // render trang register.pug
});

router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body; // Thêm role vào từ form đăng ký

    // Kiểm tra nếu email đã tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('register', { msg: "Email already registered" });
    }

    const newUser = new User({
      username,
      email,
      password,
      roles: [role],
    });

    await newUser.save();

    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.render('register', { msg: "Error registering user" });
  }
});

module.exports = router;
