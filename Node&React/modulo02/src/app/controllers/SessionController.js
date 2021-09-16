import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import User from '../models/User';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation fails' });
    }
    // validate user session email and password with Yup

    const { email, password } = req.body;
    // disruption of the req.body data

    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(401).json({ error: 'user not founf' });
    }
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: "pass doesn't match" });
    }
    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
