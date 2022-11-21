export class ClassContext {
    static classContainer = {}
    static register(name: string) {

    }

    static get(name: string) {

    }
}

export function ClassPlugin(name: string): ClassDecorator {
    return (target: any) => {
        console.log(name)
        console.log(target)

    }
}