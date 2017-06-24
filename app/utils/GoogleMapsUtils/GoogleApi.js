export const GoogleApi = function (opts) {
  opts = opts || {}; // eslint-disable-line

  const apiKey = opts.apiKey;
  const libraries = opts.libraries || [];
  const client = opts.client;
  const URL = 'https://maps.googleapis.com/maps/api/js';

  const googleVersion = '3.27';
  let script = null; //eslint-disable-line
  let google = window.google = null; //eslint-disable-line
  let loading = false; //eslint-disable-line
  let channel = null; //eslint-disable-line
  let language = null; //eslint-disable-line
  let region = null; //eslint-disable-line

  let onLoadEvents = []; //eslint-disable-line

  const url = () => {
    let url = URL; //eslint-disable-line
    let params = { //eslint-disable-line
      key: apiKey,
      callback: 'CALLBACK_NAME',
      libraries: libraries.join(','),
      client: client, //eslint-disable-line
      v: googleVersion,
      channel: channel, //eslint-disable-line
      language: language, //eslint-disable-line
      region: region //eslint-disable-line
    };

    let paramStr = Object.keys(params) //eslint-disable-line
        .filter(k => !!params[k]) //eslint-disable-line
        .map(k => `${k}=${params[k]}`).join('&') //eslint-disable-line

    return `${url}?${paramStr}`;
  };

  return url();
};

export default GoogleApi;
