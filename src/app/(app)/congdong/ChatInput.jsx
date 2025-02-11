import React, { memo } from "react";

const ChatInput = memo(({ value, onChange, onKeyPress, onPaste }) => {
    return <input type="text" id="text" className="" value={value} onChange={onChange} placeholder="Nhập tin nhắn bạn muốn gửi... ctrl + v để dán ảnh" onPaste={onPaste} onKeyPress={onKeyPress} />;
});

ChatInput.displayName = "ChatInput";
export default ChatInput;
