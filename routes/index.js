var express = require('express');
var router = express.Router();
const Movie = require('../models/movie.model');
const User = require('../models/user.model');
const Role = require('../models/role.model')
router.get('/', async (req, res)=> {
  // Lấy danh sách các category duy nhất
  const isLoggedIn = req.session.isLoggedIn || false;
  const categories = await Movie.distinct('category');
  const msg = req.query.msg;
  res.render('index', {categories , isLoggedIn,msg });
});
router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Tìm người dùng theo email
    const user = await User.findOne({ email }).populate('roles');
    console.log(user.roles);

    // Kiểm tra nếu người dùng tồn tại và mật khẩu khớp
    if (user && password === user.password) {
      req.session.isLoggedIn = true; // Đặt trạng thái đăng nhập
      req.session.userId = user._id; // Lưu ID người dùng vào session
      res.redirect('/'); // Chuyển hướng về trang chính
    } else {
      res.render('login', { msg: 'Invalid email or password.' }); // Thông báo lỗi
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.get('/register', (req, res) => {
  res.render('register'); // render trang register.pug
});

router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body; // Lấy role từ form

    // Kiểm tra nếu email đã tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('register', { msg: "Email already registered" });
    }

    // Tìm role dựa trên tên (ví dụ: 'user' hoặc 'admin')
    const roleDoc = await Role.findOne({ name: role });
    if (!roleDoc) {
      return res.render('register', { msg: "Invalid role selected" });
    }

    // Tạo user mới với role là ObjectId của vai trò tìm thấy
    const newUser = new User({
      username,
      email,
      password,
      roles: [roleDoc._id], // Gán ObjectId của role vào
    });

    await newUser.save(); // Lưu user vào cơ sở dữ liệu

    res.redirect('/login'); // Chuyển hướng sau khi đăng ký thành công
  } catch (err) {
    console.error(err);
    res.render('register', { msg: "Error registering user" });
  }
});

module.exports = router;
