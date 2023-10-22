
FUNCTION 語句コピー GLOBAL
    # ★★★検索★★★
    SET _SearchWord TO RUBY__TARGET_START
    CALL 検索
    # ★★★ルビ対象文字列を取得★★★
    SET Position TO 0
    LOOP WHILE (Position) <= (0)
        MouseAndKeyboard.SendKeys.FocusAndSendKeys TextToSend: $'''{Shift}({Down})''' DelayBetweenKeystrokes: 100 SendTextAsHardwareKeys: False
        MouseAndKeyboard.SendKeys.FocusAndSendKeys TextToSend: $'''{Control}({C})''' DelayBetweenKeystrokes: 100 SendTextAsHardwareKeys: False
        Clipboard.GetText Text=> ClipboardText
        Text.ParseText.ParseForFirstOccurrence Text: ClipboardText TextToFind: RUBY_END StartingPosition: 0 IgnoreCase: False OccurrencePosition=> Position
        IF ClipboardText.Length > 30 THEN
            EXIT FUNCTION
        END
    END
    MouseAndKeyboard.SendKeys.FocusAndSendKeys TextToSend: $'''{Control}({X})''' DelayBetweenKeystrokes: 100 SendTextAsHardwareKeys: False
    Text.Replace Text: ClipboardText TextToFind: $'''.+%RUBY_START%''' IsRegEx: True IgnoreCase: False ReplaceWith: $'''%''%''' ActivateEscapeSequences: True Result=> RubyString
    Text.Replace Text: RubyString TextToFind: RUBY_END IsRegEx: True IgnoreCase: False ReplaceWith: $'''%''%''' ActivateEscapeSequences: True Result=> RubyString
    IF RubyString.Length = 0 THEN
        EXIT FUNCTION
    END
    Text.Replace Text: ClipboardText TextToFind: $'''%RUBY_START%%RubyString%%RUBY_END%''' IsRegEx: True IgnoreCase: False ReplaceWith: $'''%''%''' ActivateEscapeSequences: True Result=> TargetString
    Text.Replace Text: TargetString TextToFind: RUBY__TARGET_START IsRegEx: True IgnoreCase: False ReplaceWith: $'''%''%''' ActivateEscapeSequences: True Result=> TargetString
    IF TargetString = 0 THEN
        EXIT FUNCTION
    END
    # ★★★ルビをふる文字列を選択★★★
    Clipboard.SetText Text: TargetString
    MouseAndKeyboard.SendKeys.FocusAndSendKeys TextToSend: $'''{Control}({V})''' DelayBetweenKeystrokes: 100 SendTextAsHardwareKeys: False
    LOOP LoopIndex FROM 1 TO TargetString.Length STEP 1
        MouseAndKeyboard.SendKeys.FocusAndSendKeys TextToSend: $'''{Shift}({Up})''' DelayBetweenKeystrokes: 100 SendTextAsHardwareKeys: False
    END
END FUNCTION
