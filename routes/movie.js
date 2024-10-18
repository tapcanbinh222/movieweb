var express = require('express');
var router = express.Router();
const Movie = require('../models/movie.model');
const User = require('../models/user.model');
const multer = require('multer');
//thu vien fs để xóa file ảnh 
const fs = require('fs');
const path = require('path');
// routes/movie.js
const isAuthenticated = require('../middleware/auth'); // Import middleware

//setup multer de luu image
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})
const upload = multer({ storage: storage });

// Route để hiển thị danh sách phim theo category
router.get('/category/:categoryName', isAuthenticated, async (req, res) => {
  const categoryName = req.params.categoryName;
  const keyword = req.query.keyword || ''; // Lấy từ khóa tìm kiếm, nếu không có thì mặc định là rỗng
  try {
    // Tìm tất cả các phim theo category
    const query = { category: categoryName };
    // Nếu có từ khóa tìm kiếm, thêm điều kiện tìm kiếm vào query
    if (keyword) {
      query.name = { $regex: keyword, $options: 'i' }; // Tìm kiếm không phân biệt hoa thường
    }
    const movies = await Movie.find(query); // Tìm kiếm các phim theo category và từ khóa
    const categories = await Movie.distinct('category'); // Lấy danh sách các category
    res.render('movie/index', { movies, categories, categoryName, keyword }); // Render view
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});
// Route để tìm kiếm phim
router.get('/search', async (req, res) => {
  const keyword = req.query.keyword || '';
  const category = req.query.category; // Lấy category từ query params
  let movies;
  if (keyword) {
    // Nếu có từ khóa tìm kiếm, tìm kiếm theo tên trong category đã chỉ định
    movies = await Movie.find({
      name: { $regex: keyword, $options: 'i' }, // Tìm kiếm không phân biệt hoa thường
      category: category // Giữ nguyên category
    });
  } else {
    // Nếu không có từ khóa, trả về danh sách phim theo category
    movies = await Movie.find({ category: category });
  }

  const categories = await Movie.distinct('category'); // Lấy danh sách các category
  res.render('movie/index', { movies, categories, category, keyword }); // Render lại view
});



// CREATE MOVIE
router.get('/create',isAuthenticated, (req, res) => {
  res.render('movie/create');
});

router.post('/create', upload.single('image'), async (req, res) => {
  // Tạo một đối tượng movie mới với dữ liệu từ req.body
  const movie = new Movie(req.body);
  // Kiểm tra xem file có được tải lên không
  if (req.file) {
    movie.image = req.file.filename; // Gán tên file hình ảnh
  } else {
    return res.status(400).send('Image file is required.'); // Trả về lỗi nếu không có hình ảnh
  }
  try {
    await movie.save(); // Lưu movie vào cơ sở dữ liệu
    res.redirect("/"); // Chuyển hướng về trang chính sau khi tạo thành công
  } catch (err) {
    console.error(err); // Ghi lại lỗi vào console
    res.status(500).send('Server Error.'); // Trả về lỗi 500 nếu xảy ra lỗi trong quá trình lưu
  }
});



//DELETE


// Route để hiển thị danh sách phim cần xóa
router.get('/delete',isAuthenticated, async (req, res) => {
  const keyword = req.query.keyword || ''; // Lấy keyword từ query, mặc định là chuỗi rỗng
  try {
    // Tìm các movie dựa trên tên phim
    const movies = await Movie.find({ name: new RegExp(keyword, 'i') }); // 'i' để tìm không phân biệt chữ hoa chữ thường
    res.render('movie/delete', { movies }); // Render trang delete với danh sách phim
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.post('/delete/:id', async (req, res) => {
  try {
    // Tìm movie để lấy tên tệp hình ảnh
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).send('Movie not found');
    }
    // Xóa bản ghi khỏi MongoDB
    await Movie.findByIdAndDelete(req.params.id);
    // Xóa tệp hình ảnh khỏi hệ thống tệp
    const imagePath = path.join(__dirname, '../public/images', movie.image);
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error('Error deleting image:', err);
      } else {
        console.log('Image deleted successfully');
      }
    });
    res.redirect('/movie/delete');
  } catch (err) {
    console.log(err);
    res.status(500).send('Error deleting movie');
  }
});


// Route xử lý logout bằng phương thức POST
// Route xử lý đăng xuất
router.post('/logout', (req, res) => {
  req.session.isLoggedIn = false; // Đặt trạng thái đăng nhập thành false
  req.session.destroy(err => {
      if (err) {
          console.log(err);
          return res.status(500).send('Error logging out.');
      }
      res.redirect('/login'); // Chuyển hướng về trang đăng nhập
  });
});
// Route hiển thị trang chính




module.exports = router;
