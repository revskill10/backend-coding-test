// lambda.ts
import { Handler, Context } from 'aws-lambda';
import { Server } from 'http';
import { createServer, proxy } from 'aws-serverless-express';
import { eventContext } from 'aws-serverless-express/middleware';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { createLogger } from './logger';
import { ConfigService } from './config';
import { Logger } from '@nestjs/common';

import express from 'express';

// NOTE: If you get ERR_CONTENT_DECODING_FAILED in your browser, this is likely
// due to a compressed response (e.g. gzip) which has not been handled correctly
// by aws-serverless-express and/or API Gateway. Add the necessary MIME types to
// binaryMimeTypes below
const binaryMimeTypes: string[] = [];

let cachedServer: Server;

async function bootstrapServer(): Promise<Server> {
    const config = new ConfigService();
 if (!cachedServer) {
    const expressApp = express();
    const nestApp = await NestFactory.create(AppModule, new ExpressAdapter(expressApp), {
        logger: createLogger({ config }),
    })
    nestApp.use(eventContext());
    const APP_NAME = config.get('APP_NAME');
    const APP_DESCRIPTION = config.get('APP_DESCRIPTION');
    const API_VERSION = config.get('API_VERSION');
    const options = new DocumentBuilder().setTitle(APP_NAME).setDescription(APP_DESCRIPTION).setVersion(API_VERSION).build();
    const document = SwaggerModule.createDocument(nestApp, options);
    SwaggerModule.setup('api', nestApp, document);

    Logger.log('Mapped {/api, GET} Swagger api route', 'RouterExplorer');
    await nestApp.init();
    cachedServer = createServer(expressApp, undefined, binaryMimeTypes);
 }
 return cachedServer;
}

export const handler: Handler = async (event: any, context: Context) => {
 cachedServer = await bootstrapServer();
 return proxy(cachedServer, event, context, 'PROMISE').promise;
}