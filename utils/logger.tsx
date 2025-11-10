const COLORS = {
  RESET: "\x1b[0m",
  RED: "\x1b[31m",
  YELLOW: "\x1b[33m",
  BLUE: "\x1b[34m",
};

/**
 * @brief Parses the full file path to get just the filename, ex: /Users/you/project/app/login.tsx -> login.tsx
 * 
 * @param fullPath Full path of the file
 * @returns Filename without directories
 */
function getFilename(fullPath: string): string {
  return fullPath.split(/[\\/]/).pop() || fullPath; //split filepath by / or \ and get last element
}

/**
 * @brief Formats the log message with a tag, filename, and message. Format: [LEVEL] [filename.tsx] message
 * 
 * @param level Log level (ex: INFO, WARN, ERROR)
 * @param color Color code for the level tag
 * @param filename Full path of the file
 * @param message The log message
 * @returns Formatted log string
 */
function formatMessage(
  level: string,
  color: string,
  filename: string,
  message: string
): string {
  const tag = `${color}[${level.toUpperCase()}]${COLORS.RESET}`;
  const file = `[${getFilename(filename)}]`;
  return `${tag} ${file} ${message}`;
}

/**
 * @brief Factory function to create a new logger instance for a specific file
 *
 * @param filename - Pass the "__filename" global variable here
 * @returns object with info, warn, and error logging methods
 */
export function createLogger(filename: string) {
  return {
    info: (message: string, ...args: any[]) => {
      const formatted = formatMessage("INFO", COLORS.BLUE, filename, message);
      console.log(formatted, ...args);
    },

    warn: (message: string, ...args: any[]) => {
      const formatted = formatMessage("WARN", COLORS.YELLOW, filename, message);
      console.warn(formatted, ...args);
    },

    error: (message: string, ...args: any[]) => {
      const formatted = formatMessage("ERROR", COLORS.RED, filename, message);
      console.error(formatted, ...args);
    },
  };
}