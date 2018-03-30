

const net     = require('net');
const request = require('request-promise-native');

const restIp    = '127.0.0.1';
const restPort  = '3000';

// ===== Listening Socket =====
try
{
  const server = net.createServer((socket) => {
    
    // 'connection' listener
    console.log('client connected');
    
    socket.on('data', (data) => {
      const buffer = Buffer.from(data);

      const locationUpdate = JSON.parse(buffer.toString());

      locationUpdate.longitude = parseFloat(locationUpdate.longitude);
      locationUpdate.latitude  = parseFloat(locationUpdate.latitude);

      console.log('--------------------')
      console.log(server.address());
      console.log('Client address: ' + socket.remoteAddress);
      console.log(locationUpdate)
      updateLocation(locationUpdate);
    })

    socket.on('end', () => {
      console.log('client disconnected');
      // TODO
    });

    socket.pipe(socket);
  });
  
  server.on('error', (err) => {
    throw err;
  });
  
  
  server.listen(8124, '192.168.1.19', () => {
    console.log('server bound');
  });
}
catch (err)
{
  console.log(err);
}

// ===== Update Location To Queue ======
const broker = require('./send');

const updateLocation = async (locationUpdate) => {
  try 
  {
    // let url = 'http://' + restIp + ':' + restPort + '/api/user';

    // let options = {
    //   method: 'patch',
    //   body: locationUpdate,
    //   json: true,
    //   url
    // }

    // let response = request(options);
    broker.sendMessage('user-location', locationUpdate);

  }
  catch (err)
  {
    console.log('updateLocation error');
    console.log(err)
  }
}
