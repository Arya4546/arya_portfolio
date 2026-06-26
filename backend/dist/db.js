"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testConnection = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const env_1 = require("./config/env");
exports.sequelize = new sequelize_1.Sequelize(env_1.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: env_1.env.NODE_ENV === 'development' ? console.log : false,
    dialectOptions: {
        ssl: env_1.env.NODE_ENV === 'production'
            ? { require: true, rejectUnauthorized: false }
            : false,
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
});
const testConnection = async () => {
    try {
        await exports.sequelize.authenticate();
        console.log('✅ Database connected successfully');
    }
    catch (error) {
        console.error('❌ Unable to connect to the database:', error);
        process.exit(1);
    }
};
exports.testConnection = testConnection;
//# sourceMappingURL=db.js.map