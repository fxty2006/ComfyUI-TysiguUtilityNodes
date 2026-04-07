from .py.text_input_node import TysiguTextInput
from .py.reader_node import SmartTextLineReader
from .py.text_display_node import TysiguTextDisplay
from .py.dynamic_switch_node import TysiguDynamicSwitch

NODE_CLASS_MAPPINGS = {
    "TysiguTextInput": TysiguTextInput,
    "SmartTextLineReader": SmartTextLineReader,
    "TysiguTextDisplay": TysiguTextDisplay,
    "TysiguDynamicSwitch": TysiguDynamicSwitch
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "TysiguTextInput": "TysiguTextInput",
    "SmartTextLineReader": "TysiguReadLines",
    "TysiguTextDisplay": "TysiguTextDisplay",
    "TysiguDynamicSwitch": "TysiguDynamicSwitch"
}

WEB_DIRECTORY = "./web"

__all__ = ['NODE_CLASS_MAPPINGS', 'NODE_DISPLAY_NAME_MAPPINGS', 'WEB_DIRECTORY']
