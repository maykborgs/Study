import * as Yup from 'yup';

import User from '../models/User';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation fails' });
    }
    // yup authentication
    const userExists = await User.findOne({ where: { email: req.body.email } });
    // we search for user email to verify if the user already exist
    if (userExists) {
      return res.status(400).json({ error: 'user already exist' });
    }

    const { id, name, email, provider } = await User.create(req.body);
    // create a user on database
    return res.json({
      id,
      name,
      email,
      provider,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation fails' });
    }
    // yup validation

    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);
    // get the user from user id created in the middleware auth
    if (email !== user.email) {
      const userExists = await User.findOne({ where: { email } });
      // check if the user email is the same as the added be4
      if (userExists) {
        return res.status(400).json({ error: 'user already exists' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: "password doesn't match" });
    }
    // check if the oldpassword is the same of his password

    const { id, name, provider } = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }
}

export default new UserController();
