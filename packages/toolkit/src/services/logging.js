let _logger = "console";
let _customLogger = null;

const logToConsole = (...args) => {
  return console.log(args);
};

export const selectLogger = (logger) => {
  _logger = logger;
};

export const setCustomLogger = (logFunction) => {
  _customLogger = logFunction;
  _logger = "custom";
};

export const log = (...args) => {
  switch (_logger) {
    case "console":
      return logToConsole(...args);
    case "custom":
      return _customLogger && _customLogger(...args);
    default:
      return undefined;
  }
};
