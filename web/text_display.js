import { app } from "../../scripts/app.js";
import { ComfyWidgets } from "../../scripts/widgets.js";

app.registerExtension({
    name: "Tysigu.UtilityNodes.TextDisplay",
    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        // ----------------------------------------------------
        // Tysigu Text Display のUI更新機能 (自動リサイズ等)
        // ----------------------------------------------------
        if (nodeData.name === "TysiguTextDisplay") {
            const onExecuted = nodeType.prototype.onExecuted;
            nodeType.prototype.onExecuted = function (message) {
                if (onExecuted) {
                    onExecuted.apply(this, arguments);
                }
                
                // 既存の古い表示用ウィジェットがあれば削除
                if (this.widgets) {
                    const pos = this.widgets.findIndex((w) => w.name === "display_text");
                    if (pos !== -1) {
                        for (let i = pos; i < this.widgets.length; i++) {
                            this.widgets[i].onRemove?.();
                        }
                        this.widgets.length = pos;
                    }
                }
                
                if (message && message.text) {
                    const displayStr = message.text.join("");
                    
                    // 新しいテキストウィジェットを作成
                    let widget = ComfyWidgets["STRING"](this, "display_text", ["STRING", { multiline: true }], app).widget;
                    widget.inputEl.readOnly = true; 
                    widget.inputEl.style.opacity = 0.9;
                    widget.value = displayStr;
                    
                    // 【初回バグ修正】
                    // 新しくウィジェットを作った1回目だけは、まだ文字が画面（HTML）に反映されておらずサイズが測れないため、
                    // しっかりと時間（150ms + 次の描画フレーム）を待ってからサイズの測定を開始する
                    setTimeout(() => {
                        requestAnimationFrame(() => {
                            if (widget.inputEl) {
                                // 【横スクロール仕様の適用】
                                // 勝手に改行（折り返し）しないように設定し、はみ出た部分は横スクロールバーを出す
                                widget.inputEl.style.whiteSpace = "pre";
                                widget.inputEl.style.overflowX = "auto";
                                widget.inputEl.wrap = "off"; // HTMLのtextarea属性でも完全禁止
                                
                                // 【ステップ1】横幅の測定と決定
                                const scrollWidth = widget.inputEl.scrollWidth;
                                
                                // 最低300px〜ご要望の最大「800px」までの枠に収める
                                let targetWidth = Math.max(300, scrollWidth + 40);
                                let hasHorizontalScroll = false;
                                if (targetWidth > 800) {
                                    targetWidth = 800;
                                    // 計算幅が800を超える＝確実に横スクロールバーが出現する
                                    hasHorizontalScroll = true; 
                                }
                                
                                // 先に横幅だけを適用する
                                this.setSize([targetWidth, this.size[1]]);
                                
                                // 【ステップ2】縦幅の測定と適用
                                requestAnimationFrame(() => {
                                    // textareaの高さを一瞬リセットして、文字量（折り返しなしの純粋な行数）に合わせた高さを計測
                                    widget.inputEl.style.height = "auto";
                                    const scrollHeight = widget.inputEl.scrollHeight;
                                    
                                    // 横スクロールバーが出る場合は、バーによって一番下の行が隠れないようにバーの太さ分（約20px）を縦幅に加算する！
                                    const scrollBarMargin = hasHorizontalScroll ? 20 : 0;
                                    
                                    // ノードのヘッダー・ピン部分の余白
                                    const paddingH = 60; 
                                    const neededHeight = scrollHeight + paddingH + scrollBarMargin;
                                    const finalHeight = Math.max(100, neededHeight);
                                    
                                    // 最終的に決まった横幅と縦幅をノード全体に適用！
                                    this.setSize([targetWidth, finalHeight]);
                                    
                                    // ノードの大きさだけでなく、中のテキストボックスの大きさも明示的に広げる
                                    if (this.onResize) {
                                        this.onResize(this.size);
                                    }
                                    widget.inputEl.style.width = (targetWidth - 32) + "px";
                                    widget.inputEl.style.height = (finalHeight - paddingH) + "px";
                                    
                                    app.graph.setDirtyCanvas(true, true);
                                });
                            }
                        });
                    }, 150);
                }
            };
        }
    }
});
