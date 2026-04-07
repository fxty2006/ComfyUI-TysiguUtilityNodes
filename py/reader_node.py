class SmartTextLineReader:
    @classmethod
    def INPUT_TYPES(s):
        return {
            "required": {
                "text": ("STRING", {"forceInput": True}),
                # 内部では ComfyUI標準のシード機能を呼び出すために「seed」という名前を利用する
                "seed": ("INT", {"default": 1, "min": 1, "max": 99999}),
            }
        }
    
    RETURN_TYPES = ("STRING", "STRING") 
    RETURN_NAMES = ("text", "display_info")
    FUNCTION = "process"
    CATEGORY = "Tysigu/Text"

    def process(self, text, seed):
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        total_lines = len(lines)
        
        if total_lines == 0:
            return ("", "総行数: 0行\nエラー: テキストが空です")

        # シード値（1-indexed）をインデックスに変換して行を取得
        # 行数を超えた場合はループするようモジュロ演算
        actual_line = (seed - 1) % total_lines
        selected_text = lines[actual_line]
        
        current_line_disp = actual_line + 1
        
        list_lines = []
        for i, l in enumerate(lines):
            prefix = "▶ " if i == actual_line else "  "
            list_lines.append(f"{prefix}{i+1}: {l}")
        list_str = "\n".join(list_lines)
        
        display_info = f"総行数：{total_lines}行\n[今回出力：{current_line_disp}行目]\n\n---------------------------\n[全テキスト一覧]\n{list_str}"
        
        return (selected_text, display_info)
        
    @classmethod
    def IS_CHANGED(s, text, seed):
        # 連番の seed の値が変われば自然と再実行されるため、ハッシュは値そのものでよい
        return (text, seed)
