// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
// import { Document } from 'mongoose'

// export type WorkspaceDocument = Workspace & Document

// class WorkspaceMember {
//     role:string
//     memberId:string
// }

// @Schema()
// export class Workspace {
//     @Prop()
//     name: string
//     @Prop()
//     creator: string
//     @Prop()
//     members: WorkspaceMember[]
//     @Prop({
//         default:()=>new Date()
//     })
//     createdAt: Date
// }

// export const WorkspaceSchema = SchemaFactory.createForClass(Workspace)