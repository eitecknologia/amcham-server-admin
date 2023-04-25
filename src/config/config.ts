/* Environment variables default */

/* SERVER */
process.env.PORT = process.env.PORT || "8002" as string

/* DB */
process.env.DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:N9BaDJO5aYmruvEftKGF@containers-us-west-72.railway.app:5890/amcham" as string

/* JWT */
process.env.TOKEN_SEED = process.env.TOKEN_SEED || "amcham" as string

/* MAIL */
process.env.MAIL_USER = process.env.MAIL_USER || "martin@gmail.com" as string
process.env.PASSWORD = process.env.PASSWORD || "password" as string

/* RESET PASSWORD */
process.env.RESET_PASSWORD_URL = process.env.RESET_PASSWORD_URL || "http://localhost:4200/reset-password" as string

/* DEFAULT PASSWORD */
process.env.DEFAULT_PASSWORD = process.env.DEFAULT_PASSWORD || "123456" as string
