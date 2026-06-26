import { Model, Optional } from 'sequelize';
export interface ActivityStatusAttributes {
    id: number;
    statusLabel: string;
    appName: string | null;
    icon: string | null;
    startedAt: Date;
    isActive: boolean;
}
type ActivityStatusCreationAttributes = Optional<ActivityStatusAttributes, 'id'>;
declare class ActivityStatus extends Model<ActivityStatusAttributes, ActivityStatusCreationAttributes> implements ActivityStatusAttributes {
    id: number;
    statusLabel: string;
    appName: string | null;
    icon: string | null;
    startedAt: Date;
    isActive: boolean;
}
export default ActivityStatus;
//# sourceMappingURL=activityStatus.model.d.ts.map