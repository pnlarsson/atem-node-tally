var camera = null;
var state = null;
var noSleep = new NoSleep();

function setCamera(){
  noSleep.enable(); // keep the screen on!

  camera = $('#selectCamera').val();

  console.log('Set camera to ' + camera);

  if(camera > 0){
    $('#stateDiv').html("CAMERA " + camera);
    $('#stateDiv').css("background-color","white");
  }else{
    $('#stateDiv').html("Select camera below");
    $('#stateDiv').css("background-color","grey");
  }
}

$(document).ready(function(){
  $("#selectCamera").val("0").change();
});

function connect() {
  const url = 'ws://' + $(location).attr('hostname') + ':8080'

  var ws = new WebSocket(url);

  ws.onopen = function() {
    ws.send('hey');
    // heartbeat(ws);
  };

  ws.onmessage = function(e) {
    console.log('Message:', e.data);
  };

  ws.onclose = function(e) {
    console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);

    $('#stateDiv').css("background-color","grey");

    clearTimeout(this.pingTimeout);

    setTimeout(function() {
      connect();
    }, 1000);
  };

  ws.onerror = function(err) {
    console.error('Socket encountered error: ', err.message, 'Closing socket');
    $('#stateDiv').css("background-color","grey");
    ws.close();
  };

  ws.onping = () => {
    console.log('ping');
    // heartbeat(ws);
  }

  ws.onmessage = (e) => {
    console.log(e.data)

    var data = JSON.parse(e.data);

    if(data.source == camera){
      console.log('hey - that is me!');

      state = data.type;

      if(data.type == 'preview'){
        $('#stateDiv').css("background-color","green");
      }else if(data.type == 'program'){
        $('#stateDiv').css("background-color","red");
      }
    }else{
      if(data.type == state){
        $('#stateDiv').css("background-color","white");
      }
    }
  }
}

connect();

function heartbeat(ws) {
  clearTimeout(this.pingTimeout);

  // Use `WebSocket#terminate()`, which immediately destroys the connection,
  // instead of `WebSocket#close()`, which waits for the close timer.
  // Delay should be equal to the interval at which your server
  // sends out pings plus a conservative assumption of the latency.
  this.pingTimeout = setTimeout(() => {
    ws.terminate();
  }, 30000 + 1000);
}
