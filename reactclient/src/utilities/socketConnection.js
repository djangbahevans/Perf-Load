import io from 'socket.io-client'

let socket = io.connect('http://localhost:8181')
socket.emit('clientAuth', 'wXjkl6mcTEBbd6zkahC2')


export default socket