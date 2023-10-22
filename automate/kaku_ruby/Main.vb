
FUNCTION Main_copy GLOBAL
    SET RUBY__TARGET_START TO $'''｜'''
    SET RUBY_START TO $'''《'''
    SET RUBY_END TO $'''》'''
    UIAutomation.FocusWindow.FocusByTitleClass Title: $'''*Word''' Class: $'''OpusApp'''
    # ★★★入力モードチェック★★★
    MouseAndKeyboard.SendKeys.FocusAndSendKeys TextToSend: $'''a''' DelayBetweenKeystrokes: 100 SendTextAsHardwareKeys: True
    MouseAndKeyboard.SendKeys.FocusAndSendKeys TextToSend: $'''{Shift}({Up})''' DelayBetweenKeystrokes: 100 SendTextAsHardwareKeys: False
    MouseAndKeyboard.SendKeys.FocusAndSendKeys TextToSend: $'''{Control}({X})''' DelayBetweenKeystrokes: 100 SendTextAsHardwareKeys: False
    Clipboard.GetText Text=> ClipboardText
    IF ClipboardText <> $'''a''' THEN
        MouseAndKeyboard.SendKeys.FocusAndSendKeys TextToSend: $'''{Control}({Z})''' DelayBetweenKeystrokes: 100 SendTextAsHardwareKeys: False
        EXIT Code: 0 ErrorMessage: $'''入力モードが英数字ではない'''
    END
    LOOP LoopIndex FROM 1 TO 100 STEP 1
        UIAutomation.FocusWindow.FocusByTitleClass Title: $'''*Word''' Class: $'''OpusApp'''
        SET RubyString TO $'''%''%'''
        CALL 語句コピー
        IF RubyString.Length = 0 THEN
            NEXT LOOP
        END
        CALL ルビ設定
    END
END FUNCTION
