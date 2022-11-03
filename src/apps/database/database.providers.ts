// import * as mongoose from 'mongoose';
// const { datasource } = global.conf;
// const { mongodb } = datasource;

// export const mongodbProviders = [
//     {
//         provide: 'MONGODB_CONNECTION',
//         useFactory: (): Promise<typeof mongoose> =>
//             mongoose.connect(
//                 `mongodb://${mongodb.username}:${mongodb.password}@${mongodb.host}:${mongodb.port}/${mongodb.database}`,
//             ),
//     },
// ]