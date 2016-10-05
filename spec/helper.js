var path = require('path');

module.exports = {
  appPath: function() {
    switch (process.platform) {
      case 'darwin':
        return path.join(__dirname, '..', '.tmp', 'Streamers-darwin-x64', 'Streamers.app', 'Contents', 'MacOS', 'Streamers');
      case 'linux':
        return path.join(__dirname, '..', '.tmp', 'Streamers-linux-x64', 'Streamers');
      default:
        throw 'Unsupported platform';
    }
  }
};
