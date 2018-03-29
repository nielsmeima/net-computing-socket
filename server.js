

const net     = require('net');
const request = require('request-promise-native');

const restIp    = '127.0.0.1';
const restPort  = '1337';

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
  
  
  server.listen(8124, '192.168.178.16', () => {
    console.log('server bound');
  });
}
catch (err)
{
  console.log(err);
}

const updateLocation = async (locationUpdate) => {
  try 
  {
    let url = 'http://' + restIp + ':' + restPort + '/api/user';

    let options = {
      method: 'patch',
      body: locationUpdate,
      json: true,
      url
    }

    console.log(options)

    let response = request(options);
  }
  catch (err)
  {
    console.log('updateLocation error');
    console.log(err)
  }
}