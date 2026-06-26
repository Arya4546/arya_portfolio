import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../db';

export interface ActivityStatusAttributes {
  id: number;
  statusLabel: string;
  appName: string | null;
  icon: string | null;
  startedAt: Date;
  isActive: boolean;
}

type ActivityStatusCreationAttributes = Optional<ActivityStatusAttributes, 'id'>;

class ActivityStatus extends Model<ActivityStatusAttributes, ActivityStatusCreationAttributes>
  implements ActivityStatusAttributes {
  public id!: number;
  public statusLabel!: string;
  public appName!: string | null;
  public icon!: string | null;
  public startedAt!: Date;
  public isActive!: boolean;
}

ActivityStatus.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    statusLabel: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    appName: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    icon: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Lucide icon identifier (e.g. "terminal", "car", "headphones")',
    },
    startedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'activity_status',
    timestamps: false,
    indexes: [
      { fields: ['isActive'] },
      { fields: ['startedAt'] },
    ],
  }
);

export default ActivityStatus;
