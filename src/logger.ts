const defaultLogger = {
  log: (...args: any) => console.log(new Date().toUTCString(), ...args),
  error: (...args: any) => console.error(new Date().toUTCString(), ...args)
}

export const getLogger = () => defaultLogger;
