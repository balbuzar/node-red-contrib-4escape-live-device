var io = require('socket.io-client')

module.exports = function(RED) {
    var sockets = {};

    function DomainConfig(n) {
      RED.nodes.createNode(this, n);
      this.domain = n.domain;
      this.apikey = n.apikey;
    }
    RED.nodes.registerType('4escape-live-config', DomainConfig)

    function DeviceConfig(n) {
      RED.nodes.createNode(this, n);
      this.roomId = n.roomId;
      this.deviceId = n.deviceId;
    }
    RED.nodes.registerType('4escape-live-device-config', DeviceConfig);


    function connect(config, force) {
        if (!config.domain) {
            return;
        }
        var self = this;

        var socket = io(`${config.domain}.4escape.io/live`, {
            rejectUnauthorized: false,
            path: '/realtime',
            transports: ['websocket']
        })
        socket.on('reconnect_attempt', function() {
            socket.io.opts.transports = ['websocket'];
        });

        socket.on('error', function(err) {
            console.log(err);
        });

        return socket
    }

    function disconnect(config) {
    }

    function DeviceConnector(n){
        RED.nodes.createNode(this, n)
        this.server = RED.nodes.getNode(n.server)
        this.device = RED.nodes.getNode(n.device)
        var node = this

        if (sockets[node.id]){
            delete sockets[node.id]
        }
        sockets[node.id] = connect(this.server)

        sockets[node.id].on('connect', () => {
            node.send({
                payload:{
                    socketId: node.id,
                    status:'connected',
                }
            })
            node.status({
                fill: "green",
                shape: "dot",
                text: "connected",
            })
            sockets[node.id].emit('hello', {
                room: this.device.roomId || null,
                device: this.device.deviceId || null,
            });
        })

        sockets[node.id].on('disconnect', () => {
            node.send({
                payload:{
                    socketId: node.id,
                    status:'disconnected',
                }
            })
            node.status({
                fill: "red",
                shape: "ring",
                text: "disconnected",
            })
        })

        sockets[node.id].on('connect_error', (err) => {
            if (err) {
                node.send({
                    payload: {
                        socketId: node.id,
                        status: 'errored',
                    }
                })
                node.status({
                    fill: "red",
                    shape: "ring",
                    text: "errored",
                })
                node.error(err)
            }
        })

        sockets[node.id].on('clue', (data) => {
            node.send({
                payload: {
                    socketId: node.id,
                    clue: data
                }
            })
        })

        // sockets[node.id].on('hello', (data) => {
        //     console.log('hello', data);
        // })

        node.on('close', (done) => {
            sockets[node.id].disconnect()
            sockets[node.id].removeAllListeners()
            node.status({})
            done()
        })
    }
    RED.nodes.registerType('4escape-live-device-connector', DeviceConnector);




    function ListenerOnClueText(n) {
        RED.nodes.createNode(this, n);
        this.name = n.name;
        this.socketId = null;

        var node = this;
        node.on('input', function (data) {
            node.socketId = data.payload.socketId;
            if ('undefined' !== typeof data.payload.clue) {
                if ('undefined' !== typeof data.payload.clue.type && data.payload.clue.type === 'text') {
                    node.send({
                        payload: data.payload.clue.uri || null
                    })
                }
            }
        })
    }
    RED.nodes.registerType('4escape-live-listener-clue-text', ListenerOnClueText);
}
