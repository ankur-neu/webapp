
import { Sequelize } from 'sequelize-typescript'
import path from 'path'; 
import { appConfigs } from './config';
const models = path.join(__dirname, "../components/**/*.model.ts");

const config = () => {
  sequelize.authenticate().then(async() => {
    
    console.error("database connected successfully!");
    try {
        await sequelize.sync({force: true})
        console.log("sycn doneß");
    } catch (error) {
        console.log(error)
    }

  }).catch( (e: any) => {
    console.error("database connection error!");
      console.log(e.message)
  })
}


const sequelize = new Sequelize({
  database: appConfigs.db.DB_NAME,
  dialect: 'postgres',
  username: appConfigs.db.DB_USER,
  password: appConfigs.db.DB_PASS,
  // storage: ':memory:',
  models: [models]
});


export default {config};