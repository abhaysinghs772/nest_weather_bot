import "reflect-metadata";
import { DataSource } from "typeorm"
import { User } from "./entities/user.entity"

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "bot.db.sqlite",
    synchronize: true,
    logging: true,
    entities: [User],
    subscribers: [],
    migrations: [],
});

/* this is used in express apps */
// AppDataSource.initialize()
//     .then(() => {
//         // here you can start to work with your database
//         console.log("DataBase Initialize");
//     })
//     .catch((error) => console.log(error))