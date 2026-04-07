class TysiguDynamicSwitch:
    @classmethod
    def INPUT_TYPES(s):
        return {
            "required": {
                "switch_index": ("INT", {"default": 1, "min": 1, "max": 999}),
            },
            "optional": {
                "text_1": ("STRING", {"forceInput": True}),
                "text_2": ("STRING", {"forceInput": True}),
            }
        }
    RETURN_TYPES = ("STRING",)
    RETURN_NAMES = ("text",)
    FUNCTION = "process"
    CATEGORY = "Tysigu/Text"

    def process(self, switch_index, **kwargs):
        # 指定されたindexのテキストがあれば返す
        key = f"text_{switch_index}"
        if key in kwargs and kwargs[key] is not None:
            return (kwargs[key],)
        
        # 見つからない場合は接続されている最初のテキストを代替として探す
        for i in range(1, 999):
            k = f"text_{i}"
            if k in kwargs and kwargs[k] is not None:
                return (kwargs[k],)
        return ("",)
