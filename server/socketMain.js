const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/perfData', { useNewUrlParser: true, useUnifiedTopology: true })

const Machine = require('./Models/Machine')

function socketMain(io, socket) {
    let macAddress

    // console.log(`Socket main running`)
    socket.on('clientAuth', key => {
        if (key === 'YCt1TD0nC3yqT62TqkHh') {
            // valid nodeClient
            socket.join('clients')
        } else if (key === 'wXjkl6mcTEBbd6zkahC2') {
            // valid ui client
            socket.join('ui')
            Machine.find({}, (err, docs) => {
                docs.forEach(machine => {
                    // Assume all machines are offline
                    machine.isActive = false;
                    io.to('ui').emit('data', machine)
                });
            })
        } else {
            // an invalid client has joined
            socket.disconnect(true)
        }
    })

    socket.on('disconnect', () => {
        Machine.find({ macAddress }, (err, docs) => {
            if (docs.length > 0) {
                docs[0].isActive = false
                io.to('ui').emit('data', docs[0])
            }
        })
    })

    // a machine has connect check to see if it's new, if it is, add it
    socket.on('initPerfData', async data => {
        macAddress = data.macAddress
        // now go check mongo
        const mongooseResponse = await checkAndAdd(data)
        console.log(mongooseResponse)
    })

    socket.on('perfData', data => {
        io.to('ui').emit('data', data)
    })
}

async function checkAndAdd(data) {
    try {
        let machine = await Machine.findOne({ macAddress: data.macAddress })
        if (!machine) {
            machine = new Machine(data)
            await machine.save();
            return 'added'
        } else return 'found'
    } catch (err) {
        console.log('error')
        throw err
    }
}

module.exports = socketMain