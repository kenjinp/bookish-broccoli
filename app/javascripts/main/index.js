var electron, path, json;

path = require('path');
json = require('../../package.json');

electron = require('electron');

electron.app.on('ready', function() {
  var window;

  window = new electron.BrowserWindow({
    title: json.name,
    width: json.settings.width,
    height: json.settings.height
  });

  window.webContents.openDevTools()

  window.loadURL('file://' + path.join(__dirname, '..', '..') + '/index.html');

  window.webContents.on('did-finish-load', function(){
    window.webContents.send('loaded', {
      appName: json.name,
      electronVersion: process.versions.electron,
      nodeVersion: process.versions.node,
      chromiumVersion: process.versions.chrome
    });
    var http = require("http");
    var crypto = require("crypto");
    var ipc = require("ipc");
    var server = http.createServer(function (req, res) {
        var port = crypto.randomBytes(16).toString("hex");
        ipc.once(port, function (ev, status, head, body) {
            //console.log(status, head, body);
            res.writeHead(status, head);
            res.end(body);
        });
        window.webContents.send("request", req, port);
    });
    server.listen(8000);
    console.log("http://localhost:8000/");
  });

  window.on('closed', function() {
    window = null;
  });

});
