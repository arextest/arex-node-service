// // import { Connection } from 'mongoose';
// import {WorkspaceSchema} from "./schemas/workspace.schema";

// export const fileProviders = [
//     {
//         provide: 'MONGODB_CONNECTION_WorkspaceRepository',
//         useFactory: (connection: any) =>
//             connection.model(
//                 'workspace_model',
//                 WorkspaceSchema,
//                 'workspace',
//             ),
//         inject: ['MONGODB_CONNECTION'],
//     },
// ];