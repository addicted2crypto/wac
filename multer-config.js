const multer = require('multer');
const path = require('path');

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(null, false);
    return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = './uploads/';
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const fileName = `${Date.now()}-${path.extname(file.originalname)}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage, limits: { fileSize: 1024 * 1024 * 5 }, fileFilter });

export default upload;