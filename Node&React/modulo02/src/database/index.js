// this file create the connection with the DB
import Sequelize from 'sequelize';

// importing my models
import User from '../app/models/User';
import File from '../app/models/File';
import Appointment from '../app/models/Appointment';
// importing my DB config ans connection
import databaseConfig from '../config/database';

const models = [User, File, Appointment];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    // made the DB connection

    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      );
  }
}

export default new Database();
