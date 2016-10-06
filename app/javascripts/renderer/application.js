$ = require('jquery');

require('electron').ipcRenderer.on('loaded' , function(event, data) {
  document.getElementById('title').innerHTML = data.appName;

  const {desktopCapturer} = require('electron');

  let streaming = false;
  let localStream;

  function handleStream (stream) {
      localStream = stream;
      setAudio(stream);
      stream.onended = function() {
          if (streaming) {
              setAudio();
              toggle();
          }
      };
  }

  function setAudio(stream) {
      console.log(stream);
      if (stream) {
          document.querySelector('audio').src = URL.createObjectURL(stream);
      } else {
          document.querySelector('audio').src = '';
      }
  }

  function handleError (e) {
    console.log('getUserMediaError: ' + JSON.stringify(e, null, '---'));
  }

  function showSources() {
      desktopCapturer.getSources({types: ['window', 'screen']}, (error, sources) => {
        if (error) {
            alert(error);
            throw error;
        }
        for (let source of sources) {
            addSource(source);
        }
      });
  }

  function addSource(source) {
      console.log(source);
      $('select').append($('<option>', {
          value: source.id.replace(':', ''),
          text: source.name
      }));
  }

  function onAccessApproved(desktop_id) {
      if (!desktop_id) {
          alert('Desktop capture rejected');
          return;
      }
      streaming = true;
      document.querySelector('button').innerHTML = 'Stop Streaming';
      console.log('desktop sharing started, id: ', desktop_id);
      navigator.webkitGetUserMedia({
        audio: true,
        video: false
    }, handleStream, handleError);
  }

  function toggle() {
      if (!streaming) {
          let id = ($('select').val()).replace(/window|screen/g, function(match) { return match + ":"; });
          console.log('ID THING', id);
          onAccessApproved(id);
      } else {
          streaming = false;

          if (localStream) {
              localStream.getTracks()[0].stop();
          }
          localStream = null;

          document.querySelector('button').innerHTML = 'stream';
          $('select').empty();
          showSources();
      }
  }

  document.querySelector('button').addEventListener('click', (e) => {
     toggle();
  });

  showSources();

});
