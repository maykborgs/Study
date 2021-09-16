import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';
// we use multer to storage files
export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err);

        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
// .diskstorage is a method to save images inside our app
// destinations is the path where's about to save the files
// then in file name we create a random token before the original name of the file (format the name to avoid images with the same name)
