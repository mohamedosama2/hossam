import { Injectable, NestInterceptor, ExecutionContext, CallHandler, mixin, Type } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

interface FolderNameInterceptorOptions {
    folderName: string;
}


@Injectable()
export class FolderNameInterceptor implements NestInterceptor {
    constructor(private readonly options: FolderNameInterceptorOptions) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request: Request = context.switchToHttp().getRequest();
        request.query.folderName = this.options.folderName;
        return next.handle();
    }
}



export function FolderNameInterceptorFunction(options: FolderNameInterceptorOptions): Type<NestInterceptor> {
    @Injectable()
    class Interceptor implements NestInterceptor {
        intercept(context: ExecutionContext, next: CallHandler<any>) {
            const request: Request = context.switchToHttp().getRequest();
            request.query.folderName = options.folderName;
            return next.handle()
        }
        fileInterceptor: NestInterceptor;
    }
    return mixin(Interceptor);
}