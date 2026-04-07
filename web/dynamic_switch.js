import { app } from "../../scripts/app.js";

app.registerExtension({
    name: "Tysigu.UtilityNodes.DynamicSwitch",
    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        // ----------------------------------------------------
        // 1. Tysigu Dynamic Switch の動的ピン追加機能
        // ----------------------------------------------------
        if (nodeData.name === "TysiguDynamicSwitch") {
            const onConnectionsChange = nodeType.prototype.onConnectionsChange;
            nodeType.prototype.onConnectionsChange = function (type, index, connected, link_info) {
                if (onConnectionsChange) {
                    onConnectionsChange.apply(this, arguments);
                }
                if (type === 1) {
                    this.updateDynamicPins();
                }
            };

            nodeType.prototype.updateDynamicPins = function () {
                if (!this.inputs) return;
                
                let lastTextIndex = 0;
                let maxIndex = 1;
                
                for (let i = 0; i < this.inputs.length; i++) {
                    const input = this.inputs[i];
                    if (input.name.startsWith("text_")) {
                        const idx = parseInt(input.name.split("_")[1]);
                        if (idx > lastTextIndex) lastTextIndex = idx;
                    }
                }

                maxIndex = Math.max(1, lastTextIndex);

                const lastInput = this.inputs.find(inp => inp.name === `text_${lastTextIndex}`);
                if (lastInput && lastInput.link !== undefined && lastInput.link !== null) {
                    const newIdx = lastTextIndex + 1;
                    this.addInput(`text_${newIdx}`, "STRING");
                    maxIndex = newIdx;
                }
                
                for (let i = this.inputs.length - 1; i >= 0; i--) { 
                    const input = this.inputs[i];
                    if (!input || !input.name.startsWith("text_")) continue;
                    
                    const idx = parseInt(input.name.split("_")[1]);
                    if (idx <= 2) continue; 
                    
                    const prevInput = this.inputs.find(inp => inp.name === `text_${idx - 1}`);
                    if (input.link == null && prevInput && prevInput.link == null) {
                        this.removeInput(i);
                        maxIndex = idx - 1;
                    } else {
                        break;
                    }
                }
                
                // スイッチウィジェットの上限を「接続されている線の数」に制限
                let maxConnectedIndex = 1; 
                for (let i = 0; i < this.inputs.length; i++) {
                    const input = this.inputs[i];
                    if (input && input.name.startsWith("text_") && input.link !== null && input.link !== undefined) {
                        const idx = parseInt(input.name.split("_")[1]);
                        if (idx > maxConnectedIndex) {
                            maxConnectedIndex = idx;
                        }
                    }
                }
                
                const switchWidget = this.widgets ? this.widgets.find(w => w.name === "switch_index") : null;
                if (switchWidget && switchWidget.options) {
                    switchWidget.options.max = maxConnectedIndex;
                    if (switchWidget.value > maxConnectedIndex) {
                        switchWidget.value = maxConnectedIndex;
                    }
                }
            };

            const onNodeCreated = nodeType.prototype.onNodeCreated;
            nodeType.prototype.onNodeCreated = function () {
                if (onNodeCreated) {
                    onNodeCreated.apply(this, arguments);
                }
                setTimeout(() => {
                    this.updateDynamicPins();
                }, 100);
            };
        }
    }
});
