export const camelize = function(str) { // eslint-disable-line
  return str.split(' ').map(function (word) { // eslint-disable-line
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join('');
};
