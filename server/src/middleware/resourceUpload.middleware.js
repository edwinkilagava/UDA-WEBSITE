
import multer from "multer";
import path from "path";

const MAX_FILE_SIZE = 50 * 1024 * 1024;

const ALLOWED_TYPES = {
  ".pdf": ["application/pdf"],
  ".docx": [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
};

const storage = multer.memoryStorage();

function fileFilter(req, file, callback) {
  const extension = path.extname(file.originalname).toLowerCase();
  const allowedMimeTypes = ALLOWED_TYPES[extension];

  if (
    !allowedMimeTypes ||
    !allowedMimeTypes.includes(file.mimetype)
  ) {
    const error = new Error(
      "Only PDF and DOCX documents are allowed."
    );

    error.statusCode = 400;

    return callback(error);
  }

  callback(null, true);
}

const uploadResourceFile = multer({
  storage,

  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
    fields: 10,
    parts: 11,
  },

  fileFilter,
});

export default uploadResourceFile;
