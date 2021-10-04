import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
declare const FirebaseAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class FirebaseAuthGuard extends FirebaseAuthGuard_base {
    private reflector;
    constructor(reflector: Reflector);
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | import("rxjs").Observable<boolean>;
}
export {};
