const electron = require('electron');
const path = require('path');
const fs = require('fs');


class Phone {
  constructor(opts) {
    this.userSettings = opts.userSettings
  }

  makeCall(numberToDial){
    let call_url = 'http://'+this.userSettings.user+':'+this.userSettings.pw+'@'+this.userSettings.ip+'/cgi-bin/ConfigManApp.com?'
    request.get({
      url: call_url + 'number=' + numberToDial + '&outgoing_uri=URI'
    }, function (e, r) {
      console.log(e, r)
    });
    return true
  }

}

function parseDataFile(filePath, defaults) {
  // We'll try/catch it in case the file doesn't exist yet, which will be the case on the first application run.
  // `fs.readFileSync` will return a JSON string which we then parse into a Javascript object
  try {
    return JSON.parse(fs.readFileSync(filePath));
  } catch(error) {
    // if there was some kind of error, return the passed in defaults instead.
    return defaults;
  }
}

// expose the class
module.exports = Store;