import { Entity, ManyToOne, Opt, PrimaryKey, Property } from "@mikro-orm/core";
import { v4 } from "uuid";
import { Admin } from "./admin.entity";

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

    @ManyToOne(() => Admin, { nullable: true, fieldName: "adminId" })
    updatedBy: Admin
    
    toggle(){
        this.isOn = !this.isOn;
        this.updatedAt = new Date();    
    }
}