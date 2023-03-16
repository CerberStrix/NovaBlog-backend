import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';

import DBroutes from './routes/DBroutes.js';
import { usersRoutes } from './routes/usersRoutes.js'
import { postsRoutes } from './routes/postsRoutes.js';
import { registerValidation, loginValidation, postCreateValidation } from './validations.js';

import { checkAuth, handleValidationErrors } from './middleware/index.js';
import { UserController, PostController } from './controllers/index.js'

mongoose.set('strictQuery', true);
mongoose
  .connect(DBroutes.devDB)
  .then(() => console.log("DB ok"))
  .catch((err) => console.log('DB Error', err));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  }
})

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.post(usersRoutes.login, loginValidation, handleValidationErrors, UserController.login);
app.post(usersRoutes.register, registerValidation, handleValidationErrors, UserController.register);
app.get(usersRoutes.auth, checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
})

app.get(postsRoutes.route, PostController.getAll);
app.get(postsRoutes.routeById, PostController.getOne);
app.post(postsRoutes.route, checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete(postsRoutes.routeById, checkAuth, PostController.remove);
app.patch(postsRoutes.routeById, checkAuth, postCreateValidation, handleValidationErrors, PostController.update);
app.get(postsRoutes.tags, PostController.getLastTags);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log('Server OK')
})

