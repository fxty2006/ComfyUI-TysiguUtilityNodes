import { app } from "../../scripts/app.js";

app.registerExtension({
    name: "Tysigu.UtilityNodes.ResetButton",
    async beforeRegisterNodeDef(nodeType, nodeData) {
        if (nodeData.name === "SmartTextLineReader") {
            const onNodeCreated = nodeType.prototype.onNodeCreated;
            nodeType.prototype.onNodeCreated = function () {
                if (onNodeCreated) {
                    onNodeCreated.apply(this, arguments);
                }
                
                const node = this;
                
                // 「1に戻す」専用ボタンを追加
                this.addWidget("button", "🔄 Reset line to 1", "button", () => {
                    let resetDone = false;

                    // パターン1: Primitiveノード（外部の入力ピン）が接続されている場合
                    if (node.inputs && node.inputs.length > 0) {
                        // "read_line" または "seed" の名前のピンを柔軟に探す
                        const lineInput = node.inputs.find(inp => inp.name === "read_line" || inp.name === "seed");
                        if (lineInput && lineInput.link !== null && lineInput.link !== undefined) {
                            const link = app.graph.links[lineInput.link];
                            if (link && link.origin_id) {
                                const sourceNode = app.graph.getNodeById(link.origin_id);
                                if (sourceNode && sourceNode.widgets && sourceNode.widgets.length > 0) {
                                    // 繋がっているノードの中で「数字(number)」のウィジェットをすべて1にする
                                    for (let i = 0; i < sourceNode.widgets.length; i++) {
                                        const w = sourceNode.widgets[i];
                                        // control_after_generateなどの文字設定は除外し、数字欄だけを1にする
                                        if (w.name !== "control_after_generate" && (w.type === "number" || typeof w.value === "number")) {
                                            w.value = 1;
                                            resetDone = true;
                                        }
                                    }
                                    sourceNode.setDirtyCanvas(true, true);
                                }
                            }
                        }
                    }
                    
                    // パターン2: 外部ピンに出しておらず、自分のノード内にウィジェットとして残っている場合
                    if (!resetDone && node.widgets && node.widgets.length > 0) {
                        const lineWidget = node.widgets.find(w => w.name === "read_line" || w.name === "seed");
                        if (lineWidget) {
                            lineWidget.value = 1;
                            resetDone = true;
                        }
                    }
                    
                    // リセットが成功したら確実に画面の数字を更新させる
                    if (resetDone) {
                        node.setDirtyCanvas(true, true);
                        app.graph.setDirtyCanvas(true, true);
                        
                        // 無理やり強制的に見た目も更新させるための強い命令
                        if (app.canvas && app.canvas.setDirty) {
                            app.canvas.setDirty(true, true);
                        }
                    }
                });
            };
        }
    }
});
