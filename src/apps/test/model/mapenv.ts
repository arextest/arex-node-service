import { RunEnv } from "./runenv";

export class MapEnv {
    envContainer: Map<String, RunEnv>;

    constructor() {
        this.envContainer = new Map();
    }

    set(key: string, value: string) {
        if (this.envContainer.has(key)) {
            let env = this.envContainer.get(key);
            env.value = value
        } else {
            let runenv = new RunEnv();
            runenv.key = key;
            runenv.value = value;
            this.envContainer.set(key, runenv);
        }
    }

    get(key: string): string {
        return this.envContainer?.get(key)?.value;
    }

    setBaseValue(key: string, value: string) {
        if (this.envContainer.has(key)) {
            let env = this.envContainer.get(key);
            env.baseValue = value
        } else {
            let runenv = new RunEnv();
            runenv.key = key;
            runenv.baseValue = value;
            this.envContainer.set(key, runenv);
        }
    }

    getBaseValue(key: string): string {
        return this.envContainer?.get(key)?.baseValue;
    }

    setTestValue(key: string, value: string) {
        if (this.envContainer.has(key)) {
            let env = this.envContainer.get(key);
            env.testValue = value
        } else {
            let runenv = new RunEnv();
            runenv.key = key;
            runenv.testValue = value;
            this.envContainer.set(key, runenv);
        }
    }

    getTestValue(key: string) {
        return this.envContainer?.get(key)?.testValue;
    }

    delete(key: string) {
        this.envContainer.delete(key);
    }


}