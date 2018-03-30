var amqp = require('amqplib/callback_api');

const createConnection = () => {
  return new Promise((resolve, reject) => {

    amqp.connect('amqp://localhost', (err, connection) => {
      if (err)
        return reject(err)
      
      resolve(connection);
    })

  })
}

const createChannel = () => {
  return new Promise(async (resolve, reject) => {
    try
    {
      let connection = await createConnection();
      connection.createChannel((err, channel) => {
        if (err)
          return reject(err)

        resolve(channel);
      })
    }
    catch (err)
    {
      reject(err);
    }
  })
}

/**
 * Accepts a queue name string and a javascript object as a message to send
 * @param {string} queue 
 * @param {object} message 
 */
const sendMessage = async (queue, message) => {
  try
  {
    let channel = await createChannel();

    channel.assertQueue(queue, {durable: true});
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
  }
  catch (err)
  {
    let e = new Error(err);
    e.name = 'sendMessage'
    throw e;
  }
}

module.exports = {
  sendMessage
}