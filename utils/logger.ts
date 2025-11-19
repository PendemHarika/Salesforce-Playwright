import fs from 'fs';
import path from 'path';

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export class Logger {
  static cleanLogs() {
    const logsDir = path.join('logs');
    if (fs.existsSync(logsDir)) {
      const files = fs.readdirSync(logsDir);
      for (const file of files) {
        try {
          fs.unlinkSync(path.join(logsDir, file));
        } catch {}
      }
    }
  }
  private static logFile = path.join('logs', `automation-${Logger.getDateString()}.log`);
  private static ensureLogDir() {
    const dir = path.dirname(Logger.logFile);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }
  private static getDateString() {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
  }
  private static format(level: LogLevel, message: string) {
    return `[${new Date().toISOString()}] [${level}] ${message}`;
  }
  static log(level: LogLevel, message: string) {
    Logger.ensureLogDir();
    const formatted = Logger.format(level, message);
    fs.appendFileSync(Logger.logFile, formatted + '\n');
    if (level === LogLevel.ERROR || level === LogLevel.WARN) {
      console.error(formatted);
    } else if (level === LogLevel.INFO) {
      console.log(formatted);
    }
    // DEBUG logs only go to file, not console
  }
  static info(message: string) { Logger.log(LogLevel.INFO, message); }
  static debug(message: string) { Logger.log(LogLevel.DEBUG, message); }
  static warn(message: string) { Logger.log(LogLevel.WARN, message); }
  static error(message: string) { Logger.log(LogLevel.ERROR, message); }
}
