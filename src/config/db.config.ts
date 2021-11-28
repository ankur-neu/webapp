
import { Sequelize } from 'sequelize-typescript'
import { appConfigs } from './config';
import User from '../components/users/users.model';
import Image from '../components/image/image.model';

// const models = path.join(__dirname, "../components/**/*.model.ts");

const config = async() => {
  await sequelize.authenticate();
  console.error("database connected successfully!");
  await sequelize.sync();
  console.log("sycn doneß");
}


// export const sequelize = new Sequelize(`${appConfigs.db.DB_NAME}`,'','', {
//   // host: `${appConfigs.db.DB_HOST}`,
//   replication: {
//     read: [
//       { host: `${appConfigs.db.DB_HOST_READ}`, username: `${appConfigs.db.DB_USER}`, password: `${appConfigs.db.DB_PASS}`}
//     ],
//     write: { host: `${appConfigs.db.DB_HOST}`, username: `${appConfigs.db.DB_USER}`, password: `${appConfigs.db.DB_PASS}`}
//   },
//   pool: { // If you want to override the options used for the read/write pool you can do so here
//     max: 20,
//     idle: 30000
//   },
//   port: 5432,
//   dialect: 'postgres',
//   models: [User,Image]
// })


export const sequelize = new Sequelize(`${appConfigs.db.DB_NAME}`,``,``, {
  // host: `${appConfigs.db.DB_HOST}`,
  replication: {
    read: [
      { host: `${appConfigs.db.DB_HOST_READ}`, username: `${appConfigs.db.DB_USER}`, password: `${appConfigs.db.DB_PASS}`}
    ],
    write: { host: `${appConfigs.db.DB_HOST}`, username: `${appConfigs.db.DB_USER}`, password: `${appConfigs.db.DB_PASS}`}
  },
  pool: { // If you want to override the options used for the read/write pool you can do so here
    max: 20,
    idle: 30000
  },
  port: 5432,
  dialect: 'postgres',
  models: [User,Image]
})
sequelize.addModels([User,Image])
export default {config};