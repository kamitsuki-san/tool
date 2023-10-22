
FUNCTION 検索 GLOBAL
    MouseAndKeyboard.SendKeys.FocusAndSendKeys TextToSend: $'''{Control}({F})''' DelayBetweenKeystrokes: 100 SendTextAsHardwareKeys: False
    MouseAndKeyboard.SendKeys.FocusAndSendKeys TextToSend: _SearchWord DelayBetweenKeystrokes: 100 SendTextAsHardwareKeys: False
    ON ERROR REPEAT 3 TIMES WAIT 2
    END
    MouseAndKeyboard.SendKeys.FocusAndSendKeys TextToSend: $'''{Return}''' DelayBetweenKeystrokes: 100 SendTextAsHardwareKeys: False
    MouseAndKeyboard.SendKeys.FocusAndSendKeys TextToSend: $'''{Escape}''' DelayBetweenKeystrokes: 100 SendTextAsHardwareKeys: False
END FUNCTION
