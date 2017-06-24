
export const makeID = (function (global) { //eslint-disable-line
  return function makeID() { //eslint-disable-line
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 5; i++) { //eslint-disable-line
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };
})(window);

export default makeID;
