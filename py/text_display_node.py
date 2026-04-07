class TysiguTextDisplay:
    @classmethod
    def INPUT_TYPES(s):
        return {"required": {"text": ("STRING", {"forceInput": True})}}
        
    RETURN_TYPES = ("STRING",)
    RETURN_NAMES = ("text",)
    FUNCTION = "process"
    OUTPUT_NODE = True   # UI更新用メッセージを送るために必要
    CATEGORY = "Tysigu/Text"

    def process(self, text):
        # UI（JS）側に描画用の文字列を渡すと同時に、次のノードへテキストを渡す
        return {"ui": {"text": [text]}, "result": (text,)}
