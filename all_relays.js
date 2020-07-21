module.exports = function(RED) {

    "use strict";

    function all_relaysNode(config) {
        RED.nodes.createNode(this, config);
        this.slot = config.slot;
        var node = this

        node.on('input', function(msg, send, done) {

            // substitua a variavel msg pela a informação desejada a ser passada via serial
            var globalContext = node.context().global;
            var exportMode = globalContext.get("exportMode");
            var currentMode = globalContext.get("currentMode");
            var command = {
                type: "relay_modular_V1_0",
                slot: parseInt(node.slot),
                compare: {},
                method: "open_all_relays",
                get_output: {},
            }
            var file = globalContext.get("exportFile")
            var slot = globalContext.get("slot");
            if(!(slot === "begin" || slot === "end")){
                if(currentMode == "test"){
                    file.slots[slot].jig_test.push(command);
                }
                else{
                    file.slots[slot].jig_error.push(command);
                }
            }
            else{
                if(slot === "begin"){
                    file.slots[0].jig_test.push(command);
                    // file.begin.push(command);
                }
                else{
                    file.slots[3].jig_test.push(command);
                    // file.end.push(command);
                }
            }
            globalContext.set("exportFile", file);
             // node.status({fill:"green", shape:"dot", text:"done"}); // seta o status pra waiting
            console.log(command)
            
            send(msg)

        });

        // var nodeDaVariavel = config.NodeDaVariavel

    }

    // nome do modulo
    RED.nodes.registerType("all_relays", all_relaysNode);
}