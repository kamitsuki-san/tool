
FUNCTION ルビ設定 GLOBAL
    MouseAndKeyboard.SendKeys.FocusAndSendKeys TextToSend: $'''{Alt}({H}){Alt}({F}{R})''' DelayBetweenKeystrokes: 100 SendTextAsHardwareKeys: False
    WAIT 0.2
    MouseAndKeyboard.SendKeys.FocusAndSendKeys TextToSend: $'''{Alt}({M})''' DelayBetweenKeystrokes: 500 SendTextAsHardwareKeys: False
    WAIT 0.2
    MouseAndKeyboard.SendKeys.FocusAndSendKeys TextToSend: $'''{Alt}({G})''' DelayBetweenKeystrokes: 500 SendTextAsHardwareKeys: False
    MouseAndKeyboard.SendMouseClick.ClickAt ClickType: MouseAndKeyboard.MouseClickType.LeftClick MillisecondsDelay: 0 X: 550 Y: 100 RelativeTo: MouseAndKeyboard.PositionRelativeTo.ActiveWindow MovementStyle: MouseAndKeyboard.MovementStyle.Instant
    Clipboard.SetText Text: RubyString
    MouseAndKeyboard.SendKeys.FocusAndSendKeys TextToSend: $'''{Control}({A}){Control}({V})''' DelayBetweenKeystrokes: 100 SendTextAsHardwareKeys: False
    MouseAndKeyboard.SendKeys.FocusAndSendKeys TextToSend: $'''{Return}''' DelayBetweenKeystrokes: 200 SendTextAsHardwareKeys: False
END FUNCTION
