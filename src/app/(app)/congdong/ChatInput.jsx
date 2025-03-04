import React, { memo } from "react";

const ChatInput = memo(({ newMessage, handleMessageChange, handleKeyPress, handlePaste, inputRef, handleInputBlur }) => {
    return (
        <input
            ref={inputRef}
            type="text"
            id="text"
            className=""
            value={newMessage}
            onChange={handleMessageChange}
            onBlur={handleInputBlur}
            placeholder="Nhập tin nhắn bạn muốn gửi... ctrl + v để dán ảnh"
            onPaste={handlePaste}
            onKeyPress={handleKeyPress}
        />
    );
});

ChatInput.displayName = "ChatInput";
export default ChatInput;
