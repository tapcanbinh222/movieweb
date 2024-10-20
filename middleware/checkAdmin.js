// middleware/checkAdmin.js
const User = require('../models/user.model');

const checkAdmin = async (req, res, next) => {
  // Kiểm tra xem người dùng đã đăng nhập hay chưa
  if (!req.session.isLoggedIn) {
    return res.redirect('/login'); // Nếu chưa đăng nhập, chuyển hướng về trang login
  }

  try {
    // Tìm người dùng hiện tại từ session
    const user = await User.findById(req.session.userId).populate('roles'); // Giả sử bạn lưu ID người dùng trong session

    // Kiểm tra nếu người dùng có vai trò admin
    if (user && user.roles.some(role => role.name === 'admin')) {
      return next(); // Nếu là admin, cho phép tiếp tục
    } else {
      // Nếu không phải admin, chuyển hướng về trang chính với thông báo
      res.redirect('/?msg=You do not have permission to perform this action.');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

module.exports = checkAdmin;

