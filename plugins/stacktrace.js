'use strict';

// Stack trace format :
// https://github.com/v8/v8/wiki/Stack%20Trace%20API
const stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/i;
const stackReg2 = /at\s+()(.*):(\d*):(\d*)/i;

export default ({prependRest = true}={}) => {
  return (id, level, stats, ...rest) => {
    let newStats = JSON.parse(JSON.stringify(stats)); // quick deep cloning
    let newRest = rest.slice();

    let err = rest.find((obj) => obj instanceof Error);

    let stacklist = (err || new Error()).stack.split('\n').slice(1);
    let s = stacklist[0];
    let sp = stackReg.exec(s) || stackReg2.exec(s);

    if (sp && sp.length === 5) {
      newStats.method = sp[1];
      newStats.path = sp[2];
      newStats.line = parseInt(sp[3], 10);
      newStats.pos = sp[4];
      newStats.file = newStats.path.split(/[\\/]/).pop();

      if (prependRest) {
        newRest.splice(0, 0, `(${newStats.path}:${newStats.line})`);
      }
    }

    return [id, level, newStats, ...newRest];
  }
}
