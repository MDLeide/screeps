//import { IActivityRepository } from "../../lib/creep/activity/IActivityRepository";
//import { Role } from "../../lib/creep/role/Role";
//import { IRoleState } from "../../lib/creep/role/state/IRoleState";
//import { EmptyRole } from "../../lib/creep/role/EmptyRole";

//import { Transporter } from "./Role/Transporter";

//export class RoleBuilder {
//    static _activityRepository: IActivityRepository;
//    static _registered: boolean = false;

//    public static registerRepository(repo: IActivityRepository) {
//        this._activityRepository = repo;
//        this._registered = true;
//    }

//    static LoadFromState(creep: Creep, id: string, state: IRoleState): Role {
//        if (!this._registered) {
//            throw new Error('You must register an IActivityRepository with the RoleBuiler before using it.');
//        }
//        if (id === 'transporter') {
//            return Transporter.LoadFromState(state, this._activityRepository, undefined, creep);
//        } else if (id === 'empty-role') {
//            return EmptyRole.LoadFromState(state, this._activityRepository, undefined, creep);
//        } else {
//            throw new Error('argument out of range');
//        }
//    }

//    static GetNew(creep: Creep, id: string): Role {
//        if (!this._registered) {
//            throw new Error('You must register an IActivityRepository with the RoleBuiler before using it.');
//        }

//        if (id === 'transporter') {
//            return new Transporter(creep, this._activityRepository);
//        } else if (id === 'empty-role') {
//            return new EmptyRole(creep, this._activityRepository);
//        } else {
//            throw new Error('argument out of range');
//        }
//    }

//    //private static StateIsTransporter(state: creep.state.IRoleState): state is creep.state
//}
