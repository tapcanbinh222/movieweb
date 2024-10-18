// movie.models.js
const mongoose = require('mongoose');

// Định nghĩa schema cho Movie
const movieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, // Bắt buộc phải có
        trim: true, // Loại bỏ khoảng trắng thừa
    },
    category: {
        type: String,
        required: true, // Bắt buộc phải có
        trim: true,
    },
    description: {
        type: String,
        required: true, // Bắt buộc phải có
        trim: true,
    },
    year: {
        type: Number,
        required: true, // Bắt buộc phải có
        min: [1888, 'Năm phim không thể nhỏ hơn 1888'], // Ngày phim đầu tiên được phát hành
        max: [new Date().getFullYear(), 'Năm phim không thể lớn hơn năm hiện tại'], // Năm hiện tại
    },
    rating: {
        type: Number,
        required: true, // Bắt buộc phải có
        min: [0, 'Điểm phải lớn hơn hoặc bằng 0'],
        max: [10, 'Điểm phải nhỏ hơn hoặc bằng 10'], // Giả sử điểm tối đa là 10
    },
    screen: {
        type: String,
        trim: true,
    },
    showtime: {
        type: Date,
        required: true, // Bắt buộc phải có
    },
    availableSeats: {
        type: Number,
        required: true, // Bắt buộc phải có
        min: [0, 'Số ghế có sẵn phải lớn hơn hoặc bằng 0'],
    },
    actors: {
        type: [String],
        required: true, // Bắt buộc phải có
    },
    image: {
        type: String,
        trim: true,
    },
});

// Xuất mô hình Movie
module.exports = mongoose.model('Movie', movieSchema);
