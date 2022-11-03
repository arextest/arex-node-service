// import {Inject} from "@nestjs/common";
// import {Model} from "mongoose";
// import { WorkspaceDocument } from "../schemas/workspace.schema";

// export class ListWorkspaceService {
//     constructor(
//         @Inject("MONGODB_CONNECTION_WorkspaceRepository")
//         private workspaceModel: Model<WorkspaceDocument>,
//     ) {}
//     async invoke(reqBody) {
//         return this.workspaceModel.find({})
//     }
// }