const os = require('os')
const io = require('socket.io-client')
let socket = io('http://localhost:8181')

socket.on('connect', () => {
    // console.log('I connected to the server')
    // We need to find a way to identify this machine to whomever is concerned
    const nI = os.networkInterfaces()
    let macA
    // loop through all network interfaces and find a non-internal one
    for (const key in nI) {

        /// FOR TESTING PURPOSES
        // macA = Math.floor(Math.random() * 3) + 1
        // break;
        /// FOR TESTING PURPOSES

        if (!nI[key][0].internal) {
            if (!nI[key][0].mac === '00:00:00:00:00:00') {
                macA = Math.random().toString(36).substr(2, 5)
            } else { macA = nI[key][0].mac; }
            break;
        }
    }

    socket.emit('clientAuth', 'YCt1TD0nC3yqT62TqkHh')

    performanceData().then((allPerformanceData) => {
        allPerformanceData.macAddress = macA
        socket.emit('initPerfData', allPerformanceData)
    })

    let perfDataInterval = setInterval(() => {
        performanceData().then((allPerformanceData) => {
            allPerformanceData.macAddress = macA
            socket.emit('perfData', allPerformanceData)
        })
    }, 1000)

    socket.on('disconnect', () => {
        clearInterval(perfDataInterval)
    })
})

// async function performanceData() {
function performanceData() {
    return new Promise(async (resolve) => {
        const cpus = os.cpus()
        // What do we need to know from node about performance
        //  - CPU Load (Current)
        //  - Memory Useage
        //      - Free
        const freeMem = os.freemem()
        //      - Total
        const totalMem = os.totalmem()
        const usedMem = totalMem - freeMem
        const memUseage = Math.floor(usedMem / totalMem * 100) / 100
        //  - OS Type
        const osType = os.type() == 'Darwin' ? 'Mac' : os.type();
        //  - Uptime
        const upTime = os.uptime()
        //  - CPU Info
        //      - Type
        const cpuModel = cpus[0].model
        //      - Number of Cores
        const numCores = cpus.length
        //      - Clock Speed
        const cpuSpeed = cpus[0].speed

        const cpuLoad = await getCPULoad()

        const isActive = true;
        resolve({
            freeMem,
            totalMem,
            usedMem,
            memUseage,
            osType,
            upTime,
            cpuModel,
            numCores,
            cpuSpeed,
            cpuLoad,
            isActive
        })
    })
}

// cpus is all cores. We need the average of all the cores which will give us the cpu average
function cpuAverage() {
    const cpus = os.cpus()
    // get ms in each mode, BUT this number is number since reboot
    // so get it now and get it in 100ms and compare 
    let idleMs = 0;
    let totalMs = 0;
    // loop through each core
    cpus.forEach(aCore => {
        // loop through all property of the current core
        for (type in aCore.times) {
            totalMs += aCore.times[type]
        }
        idleMs += aCore.times.idle;

    })
    return {
        idle: idleMs / cpus.length,
        total: totalMs / cpus.length
    }
}

// because the time property is time since boot, we will get now times and a 100ms from now times.
// compare them, that will give us current load
function getCPULoad() {
    return new Promise((resolve) => {
        const start = cpuAverage()
        setTimeout(() => {
            const end = cpuAverage()
            const idleDifference = end.idle - start.idle
            const totalDifference = end.total - start.total
            // console.log(idleDifference, totalDifference)

            // Calculate % used CPU
            const percentageCpu = 100 - Math.floor(100 * idleDifference / totalDifference)
            resolve(percentageCpu)
        }, 100)
    })
}

