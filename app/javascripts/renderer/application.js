

require('electron').ipcRenderer.on('loaded' , function(event, data) {
  document.getElementById('title').innerHTML = data.appName + ' App';
  document.getElementById('details').innerHTML = 'built with Electron v' + data.electronVersion;
  document.getElementById('versions').innerHTML = 'running on Node v' + data.nodeVersion + ' and Chromium v' + data.chromiumVersion;

  const {desktopCapturer} = require('electron')

  console.log('what is going on here?', desktopCapturer);

  desktopCapturer.getSources({types: ['window', 'screen']}, (error, sources) => {
    if (error) {
        console.log(error);
        throw error
    }
    console.log(error, sources);
    for (let i = 0; i < sources.length; ++i) {
      if (sources[i].name === 'Screen 1') {
        navigator.webkitGetUserMedia({
          audio: true,
          video: false
        }, handleStream, handleError)
        return
      }
    }
  })

  function handleStream (stream) {
      console.log(stream);
    //   document.querySelector('audio').src = URL.createObjectURL(stream)
  }

  function handleError (e) {
    console.log(e)
  }

  var ipc = require("ipc");
  ipc.on("request", function (req, port) {
      //console.log(req);
      var doc = document.implementation.createHTMLDocument(req.url);
      var h1 = doc.createElement("h1");
      h1.textContent = "Hello DOM: " + req.url;
      doc.body.appendChild(h1);

      ipc.send(port, 200, {"content-type": "text/html;charset=UTF-8"},
               doc.documentElement.outerHTML);
  });

});
