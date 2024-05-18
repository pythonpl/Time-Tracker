import { Project } from "./src/entities/project.entity";
import { TimeReport } from "./src/entities/timereport.entity";
import { User } from "./src/entities/user.entity";
import { MysqlConnectionOptions } from "typeorm/driver/mysql/MysqlConnectionOptions";

export const JWT_SECRET = 'randomstring';

const config: MysqlConnectionOptions = {
    type: 'mysql',
    database: 'timetracker',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'password',
    entities: [Project, TimeReport, User],
    synchronize: true
}

export default config;