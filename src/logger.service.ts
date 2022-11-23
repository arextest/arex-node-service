//logger.service.ts
import { Injectable } from '@nestjs/common'
import * as winston from 'winston'
import * as DailyRotateFile from 'winston-daily-rotate-file'
import * as path from 'path'

const IS_DEV = process.env.NODE_ENV !== 'production'
const isObject = data => Object.is(Object.prototype.toString.call(data), '[object Object]')

@Injectable()
export class LoggerService {
  private logger: winston.Logger
  constructor(appName) {
    this.logger = winston.createLogger({
			//level : { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 } 
      level: IS_DEV ? 'silly' : 'info',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
        winston.format.colorize(),
				//自定义打印格式
        winston.format.printf(({ level, timestamp, message }) => {
          return `[${timestamp}] [${level}] [${appName}]: ${message}`
        }),
      ),
      transports: [
				//分包，当文件大于20M时会自动拆分
        new DailyRotateFile({
          filename: path.join(process.cwd(), 'logs/error-%DATE%.log'),
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          level: 'error',
        }),
        new DailyRotateFile({
          filename: path.join(process.cwd(), 'logs/info-%DATE%.log'),
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          handleExceptions: true,
          maxSize: '20m',
          maxFiles: '14d',
          level: 'silly',
        }),
        IS_DEV ? new winston.transports.Console({}) : null,
      ].filter(t => !!t),
    })
  }

  private stringify(...args: any[]): string {
    return args.map(arg => (isObject(arg) ? JSON.stringify(arg) : arg)).join('')
  }

  public error(message: any, data?: any): void {
    this.logger.error(this.stringify(message, data))
  }

  public warn(message: any, data?: any): void {
    this.logger.warn(this.stringify(message, data))
  }

  public info(message: any, data?: any): void {
    this.logger.info(this.stringify(message, data))
  }

  public http(message: any, data?: any): void {
    this.logger.http(this.stringify(message, data))
  }

  public verbose(message: any, data?: any): void {
    this.logger.verbose(this.stringify(message, data))
  }

  public debug(message: any, data?: any): void {
    this.logger.debug(this.stringify(message, data))
  }

  public silly(message: any, data?: any): void {
    this.logger.silly(this.stringify(message, data))
  }
}