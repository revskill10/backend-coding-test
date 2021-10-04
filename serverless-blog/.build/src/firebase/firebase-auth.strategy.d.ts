declare const FirebaseAuthStrategy_base: new (...args: any[]) => any;
export declare class FirebaseAuthStrategy extends FirebaseAuthStrategy_base {
    private defaultApp;
    constructor();
    validate(token: string): Promise<any>;
}
export {};
