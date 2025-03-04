import React, { memo } from "react";
import MessageItem from "./MessageItem";

const MessageList = memo(
    ({
        messages,
        lastMessageRef,
        setReplyingTo,
        handleReactIcon,
        user,
        token,
        isModalOpen,
        isModalOpenEditMess,
        reactIconList,
        loadingIcon,
        emoji,
        onReply,
        onEdit,
        onModalCancel,
        onModalOpen,
        onModalOk,
        onOpenChange,
        onModalCancelEditMess,
        onModalOpenEditMess,
        onUnsend,
        onReact,
    }) => {
        return (
            <div className="h-[550px] overflow-y-scroll flex flex-col pr-3 chatcommu">
                {messages.map((msg, index) => (
                    <MessageItem
                        key={msg._id}
                        lastMessageRef={lastMessageRef}
                        index={index}
                        messages={messages}
                        setReplyingTo={setReplyingTo}
                        handleReactIcon={handleReactIcon}
                        msg={msg}
                        user={user}
                        token={token}
                        isLast={index === messages.length - 1}
                        isModalOpen={isModalOpen}
                        isModalOpenEditMess={isModalOpenEditMess}
                        reactIconList={reactIconList}
                        loadingIcon={loadingIcon}
                        emoji={emoji}
                        onReply={onReply}
                        onEdit={onEdit}
                        onModalCancel={onModalCancel}
                        onModalOpen={onModalOpen}
                        onModalOk={onModalOk}
                        onOpenChange={onOpenChange}
                        onModalCancelEditMess={onModalCancelEditMess}
                        onModalOpenEditMess={onModalOpenEditMess}
                        onUnsend={onUnsend}
                        onReact={onReact}
                    />
                ))}
            </div>
        );
    }
);

MessageList.displayName = "MessageList";
export default MessageList;
