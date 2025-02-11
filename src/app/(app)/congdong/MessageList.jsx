import React, { memo } from "react";
import MessageItem from "./MessageItem";

const MessageList = memo(({ messages, onReply, onUnsend, onReact }) => {
    return (
        <div className="h-[550px] overflow-y-scroll flex flex-col pr-3">
            {messages.map((msg, index) => (
                <MessageItem key={msg._id} message={msg} isLast={index === messages.length - 1} onReply={onReply} onUnsend={onUnsend} onReact={onReact} />
            ))}
        </div>
    );
});

MessageList.displayName = "MessageList";
export default MessageList;
