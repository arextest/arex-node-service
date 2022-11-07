import { ExpectResult } from "./expectresult";

export class CaseResult {
    descriptor: any = undefined;
    expectResults: Array<ExpectResult> = [];
    children: Array<CaseResult> = [];
    constructor(descriptor: any, expectResults: Array<ExpectResult>, children: Array<CaseResult>) {
        this.descriptor = descriptor;
        this.expectResults = expectResults;
        this.children = children;
    }
}
