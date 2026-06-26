"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../db");
class ActivityStatus extends sequelize_1.Model {
}
ActivityStatus.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    statusLabel: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    appName: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true,
    },
    icon: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: true,
        comment: 'Lucide icon identifier (e.g. "terminal", "car", "headphones")',
    },
    startedAt: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    isActive: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
    },
}, {
    sequelize: db_1.sequelize,
    tableName: 'activity_status',
    timestamps: false,
    indexes: [
        { fields: ['isActive'] },
        { fields: ['startedAt'] },
    ],
});
exports.default = ActivityStatus;
//# sourceMappingURL=activityStatus.model.js.map