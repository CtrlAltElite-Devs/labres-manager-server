import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { v4 } from "uuid";

@Entity()
export class FeatureFlag {
    @PrimaryKey({columnType: "uuid"})
    id = v4();

    @Property({ unique: true })
    featureName: string;

    @Property({ nullable: true })
    description?: string;


    @Property( {default: true})
    isOn: boolean;

    @Property({ onCreate: () => new Date() })
    createdAt: Date;

    @Property({ onUpdate: () => new Date() })
    updatedAt: Date;

}