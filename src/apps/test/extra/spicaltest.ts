// import { TestField } from "../model/testfield";
// import { ClassPlugin } from "../plugin/classcontext";
// import { Pw } from "../service/exectestscript";

// @ClassPlugin("ddd")
// export class SpicalTest extends Pw {

//     constructor(testField: TestField) {
//         super(testField);
//     }

//     toNotBe(rightValue) {
//         this.caseResult.children[this.firstLvIndex].expectResults[
//             this.secondLvIndex
//         ].rightValue = rightValue;
//         // a
//         if (
//             this.caseResult.children[this.firstLvIndex].expectResults[
//                 this.secondLvIndex
//             ].leftValue ===
//             this.caseResult.children[this.firstLvIndex].expectResults[
//                 this.secondLvIndex
//             ].rightValue
//         ) {
//             this.caseResult.children[this.firstLvIndex].expectResults[
//                 this.secondLvIndex
//             ].status = 'pass';
//         } else {
//             this.caseResult.children[this.firstLvIndex].expectResults[
//                 this.secondLvIndex
//             ].status = 'fail';
//         }
//         // b
//         this.caseResult.children[this.firstLvIndex].expectResults[
//             this.secondLvIndex
//         ].message = `Expected ${this.caseResult.children[this.firstLvIndex].expectResults[
//             this.secondLvIndex
//         ].leftValue
//         } to be ${this.caseResult.children[this.firstLvIndex].expectResults[
//             this.secondLvIndex
//         ].rightValue}'`;
//     }
// }
