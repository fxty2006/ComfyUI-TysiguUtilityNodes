class TysiguTextInput:
    @classmethod
    def INPUT_TYPES(s):
        return {"required": {"text": ("STRING", {"multiline": True, "default": ""})}}
    RETURN_TYPES = ("STRING",)
    RETURN_NAMES = ("text",)
    FUNCTION = "process"
    CATEGORY = "Tysigu/Text"

    def process(self, text):
        return (text, )
