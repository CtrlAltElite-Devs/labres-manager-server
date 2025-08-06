import { Entity, Opt, PrimaryKey, Property } from "@mikro-orm/core";
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

    @Property()
    createdAt: Date & Opt = new Date();

    @Property()
    updatedAt: Date & Opt = new Date();
    
    toggle(){
        this.isOn = !this.isOn;
        this.updatedAt = new Date();    
    }
}