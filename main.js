const record = document.querySelector('.record');
const stop = document.querySelector('.stop');
const soundClips = document.querySelector('.sound-clips');

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  console.log('getUserMedia Supported.');
  navigator.mediaDevices.getUserMedia (
    {
      // constraints - only audio needed for this app
      audio: true
    })
    
    // Success callback
    .then(function(stream) {
      const mediaRecorder = new MediaRecorder(stream);

      record.onclick = function() {
        mediaRecorder.start();
        console.log(mediaRecorder.state);
        console.log("recorder started");
        record.style.background = 'red';
        record.style.color = 'black';
      }

      let chunks = [];

      mediaRecorder.ondataavailable = function(e) {
        chunks.push(e.data);
        console.log(chunks);
      }

      stop.onclick = function() {
        mediaRecorder.stop();
        console.log(mediaRecorder.state);
        console.log('recorder stopped');
        record.style.background = "";
        record.style.color = "";
      }
      
      mediaRecorder.onstop = function(e) {
        console.log("mediaRecorder stopped");

        const clipName = prompt('Enter a name for your sound clip');
        const clipFeeling = prompt('What are you feeling when recording this?');

        const clipContainer = document.createElement('article');
        const clipLabel = document.createElement('p');
        const clipFeelingLabel = document.createElement('p');
        const audio = document.createElement('audio');
        const deleteButton = document.createElement('button');

        clipContainer.classList.add('clip')
        audio.setAttribute('controls', '');
        deleteButton.innerHTML = "Delete";
        clipLabel.innerHTML = "Clip Name: " + clipName;
        clipFeelingLabel.innerHTML = "Feeling: " + clipFeeling;

        clipContainer.appendChild(audio);
        clipContainer.appendChild(clipLabel);
        clipContainer.appendChild(clipFeelingLabel);
        clipContainer.appendChild(deleteButton);
        soundClips.appendChild(clipContainer);

        const blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
        chunks = [];
        const audioURL = window.URL.createObjectURL(blob);
        audio.src = audioURL
        // debugger;
        deleteButton.onclick = function(e) {
          let evtTgt = e.target;
          evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
        }
      }



    })

    // Error callback
    .catch(function(err) {
      console.log('The following getUserMedia error ocurred: ' + err);
    });
} else {
  console.log('getUserMedia is not supported on your browser');
}