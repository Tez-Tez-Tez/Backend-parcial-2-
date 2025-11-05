import { registerAs } from "@nestjs/config";

export default registerAs('config',()=>({
    port: process.env.SERVER_PORT,
    jwt: process.env.SECRET_KEY_JWT,
    db:{
        port: process.env.DB_PORT,
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        name: process.env.DB_NAME
    },
    mail:{
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
}))