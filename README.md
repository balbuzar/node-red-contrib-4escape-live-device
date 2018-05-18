# node-red-contrib-4escape-live-device

## Flow for lpr printer

```
[
    {
        "id": "d759a24.18ef46",
        "type": "tab",
        "label": "Flow 1",
        "disabled": false,
        "info": ""
    },
    {
        "id": "a1842810.fb1c18",
        "type": "4escape-live-device-connector",
        "z": "d759a24.18ef46",
        "server": "5d080610.b9a7a8",
        "device": "65cb5d05.29e004",
        "name": "4escape",
        "x": 165,
        "y": 277,
        "wires": [
            [
                "c44e9fd5.e1e52"
            ]
        ]
    },
    {
        "id": "c44e9fd5.e1e52",
        "type": "4escape-live-listener-clue-text",
        "z": "d759a24.18ef46",
        "name": "",
        "x": 361,
        "y": 311,
        "wires": [
            [
                "ff23e100.f99dd"
            ]
        ]
    },
    {
        "id": "85913256.a6e7f",
        "type": "debug",
        "z": "d759a24.18ef46",
        "name": "",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "false",
        "x": 1122,
        "y": 296,
        "wires": []
    },
    {
        "id": "ff23e100.f99dd",
        "type": "switch",
        "z": "d759a24.18ef46",
        "name": "if shutdown",
        "property": "payload",
        "propertyType": "msg",
        "rules": [
            {
                "t": "eq",
                "v": "shutdown",
                "vt": "str"
            },
            {
                "t": "else"
            }
        ],
        "checkall": "true",
        "repair": false,
        "outputs": 2,
        "x": 581,
        "y": 331,
        "wires": [
            [
                "2e26a589.485b7a"
            ],
            [
                "fb87aa1e.072268"
            ]
        ]
    },
    {
        "id": "2e26a589.485b7a",
        "type": "exec",
        "z": "d759a24.18ef46",
        "command": "sudo halt",
        "addpay": false,
        "append": "",
        "useSpawn": "false",
        "timer": "",
        "oldrc": false,
        "name": "",
        "x": 625,
        "y": 262,
        "wires": [
            [],
            [],
            []
        ]
    },
    {
        "id": "c7fe6274.aa76f",
        "type": "exec",
        "z": "d759a24.18ef46",
        "command": "/bin/hostname",
        "addpay": false,
        "append": "-I",
        "useSpawn": "false",
        "timer": "",
        "oldrc": false,
        "name": "get IP",
        "x": 408,
        "y": 64.5,
        "wires": [
            [
                "6d01b0d0.13d59"
            ],
            [],
            []
        ]
    },
    {
        "id": "ff28cb8d.cec7f8",
        "type": "inject",
        "z": "d759a24.18ef46",
        "name": "",
        "topic": "",
        "payload": "Started!",
        "payloadType": "str",
        "repeat": "",
        "crontab": "",
        "once": true,
        "onceDelay": "10",
        "x": 178,
        "y": 62,
        "wires": [
            [
                "c7fe6274.aa76f"
            ]
        ]
    },
    {
        "id": "6d01b0d0.13d59",
        "type": "template",
        "z": "d759a24.18ef46",
        "name": "",
        "field": "payload",
        "fieldType": "msg",
        "format": "handlebars",
        "syntax": "mustache",
        "template": "\"Welcome =)\"\n{{payload}}",
        "output": "str",
        "x": 645,
        "y": 76,
        "wires": [
            [
                "fb87aa1e.072268"
            ]
        ]
    },
    {
        "id": "fed668e7.7c91d8",
        "type": "exec",
        "z": "d759a24.18ef46",
        "command": "lpr -o cpi=14 ",
        "addpay": true,
        "append": "",
        "useSpawn": "false",
        "timer": "",
        "oldrc": true,
        "name": "",
        "x": 1121,
        "y": 188.5,
        "wires": [
            [],
            [],
            []
        ]
    },
    {
        "id": "fb87aa1e.072268",
        "type": "template",
        "z": "d759a24.18ef46",
        "name": "",
        "field": "payload",
        "fieldType": "msg",
        "format": "handlebars",
        "syntax": "mustache",
        "template": " <<'EOF'\n{{{payload}}}\nEOF",
        "output": "str",
        "x": 900,
        "y": 202,
        "wires": [
            [
                "85913256.a6e7f",
                "fed668e7.7c91d8"
            ]
        ]
    },
    {
        "id": "5d080610.b9a7a8",
        "type": "4escape-live-config",
        "z": "",
        "domain": "",
        "apikey": ""
    },
    {
        "id": "65cb5d05.29e004",
        "type": "4escape-live-device-config",
        "z": "",
        "roomId": "",
        "deviceId": ""
    }
]
```
