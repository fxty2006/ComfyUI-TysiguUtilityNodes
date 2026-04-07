import { app } from "../../scripts/app.js";

app.registerExtension({
    name: "Tysigu.UtilityNodes.TextInput",
    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        // ----------------------------------------------------
        // 3. Tysigu Text Input の総行数表示機能
        // ----------------------------------------------------
        if (nodeData.name === "TysiguTextInput") {
            const onDrawForeground = nodeType.prototype.onDrawForeground;
            nodeType.prototype.onDrawForeground = function (ctx) {
                if (onDrawForeground) {
                    onDrawForeground.apply(this, arguments);
                }
                
                if (this.widgets) {
                    const textWidget = this.widgets.find(w => w.name === "text");
                    if (textWidget) {
                        const value = textWidget.value || "";
                        // 空行を無視した実際のテキスト行数をカウント
                        const lines = value.split('\n').filter(l => l.trim() !== "");
                        const countStr = `[ 総行数: ${lines.length} 行 ]`;
                        
                        // テキストボックス外（タイトルバー付近の右上）に目立つように描画
                        ctx.save();
                        ctx.fillStyle = "#A7F432"; // アクセントカラー(ライトグリーン)
                        ctx.font = "bold 13px 'Segoe UI', Arial, sans-serif";
                        ctx.textAlign = "right";
                        ctx.fillText(countStr, this.size[0] - 15, -6);
                        ctx.restore();
                    }
                }
            };
        }
    }
});
