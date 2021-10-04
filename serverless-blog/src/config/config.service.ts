import * as dotenv from 'dotenv';
import winston from 'winston';
import appRoot from 'app-root-path';
import { Injectable } from '@nestjs/common';
import DailyRotateFile from 'winston-daily-rotate-file';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';

@Injectable()
export class ConfigService {
  private readonly envConfig: { [key: string]: string };

  constructor() {
    dotenv.config();
    this.envConfig = process.env;
  }

  get(key: string): string {
    return this.envConfig[key];
  }

  getWinstonOptions() {
    const options = {
      file: {
        level: 'info',
        filename: `${appRoot}/logs/app.log.%DATE%`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
      },
      error: {
        level: 'error',
        filename: `${appRoot}/logs/error.log.%DATE%`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
      },
      console: {
        format: winston.format.combine(winston.format.timestamp(), winston.format.ms(), nestWinstonModuleUtilities.format.nestLike(this.getAppName())),
      },
    };

    return {
      exitOnError: false, // do not exit on handled exceptions
      transports: [new DailyRotateFile(options.file), new DailyRotateFile(options.error), new winston.transports.Console(options.console)],
      exceptionHandlers: [new winston.transports.Console(options.console)],
    };
  }
}
