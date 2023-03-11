import express from 'express';
import mongoose from 'mongoose';

import DBroutes from './routes/DBroutes.js';
import { usersRoutes } from './routes/usersRoutes.js'
import { postsRoutes } from './routes/postsRoutes.js';
import { registerValidation, loginValidation, postCreateValidation } from './validations.js';

import checkAuth from './utils/checkAuth.js';
import * as UserController from './controllers/UserControllers.js';
import * as PostsController from './controllers/PostControllers.js';

mongoose.set('strictQuery', true);
mongoose
  .connect(DBroutes.devDB)
  .then(() => console.log("DB ok"))
  .catch((err) => console.log('DB Error', err));

const app = express();
app.use(express.json());

app.post(usersRoutes.loginRoute, loginValidation, UserController.login);
app.post(usersRoutes.registerRoute, registerValidation, UserController.register);
app.get(usersRoutes.authRoute, checkAuth, UserController.getMe);

app.get(postsRoutes.route, PostsController.getAll);
app.get(postsRoutes.routeById, PostsController.getOne);
app.post(postsRoutes.route, checkAuth, postCreateValidation, PostsController.create);
app.delete(postsRoutes.routeById, checkAuth, PostsController.remove);
app.patch(postsRoutes.routeById, checkAuth, PostsController.update);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log('Server OK')
})

