const defaultLogger = {
  log: (...args) => console.log(new Date().toUTCString(), ...args),
  error: (...args) => console.error(new Date().toUTCString(), ...args)
}

export const getLogger = () => defaultLogger;
