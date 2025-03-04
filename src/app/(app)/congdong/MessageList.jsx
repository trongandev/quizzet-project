import React, { memo } from "react";
import MessageItem from "./MessageItem";

const MessageList = ({
    messages,
    lastMessageRef,
    setReplyingTo,
    handleReactIcon,
    user,
    token,
    isModalOpen,
    reactIconList,
    loadingIcon,
    emoji,
    onReply,
    onEdit,
    onModalCancel,
    onModalOpen,
    onModalOk,
    loading,
    onOpenChange,
    showModalEditMess,
    handleCancelEditMess,
    onModalOpenEditMess,
    handleEditMess,
    editMess,
    handleUnsend,
    isModalOpenEditMess,
    handleOkEditMess,
    setEditMess,
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
                    loading={loading}
                    user={user}
                    token={token}
                    isLast={index === messages.length - 1}
                    isModalOpen={isModalOpen}
                    reactIconList={reactIconList}
                    loadingIcon={loadingIcon}
                    emoji={emoji}
                    onReply={onReply}
                    onEdit={onEdit}
                    onModalCancel={onModalCancel}
                    onModalOpen={onModalOpen}
                    onModalOk={onModalOk}
                    onOpenChange={onOpenChange}
                    isModalOpenEditMess={isModalOpenEditMess}
                    showModalEditMess={showModalEditMess}
                    handleEditMess={handleEditMess}
                    onModalOpenEditMess={onModalOpenEditMess}
                    handleCancelEditMess={handleCancelEditMess}
                    handleUnsend={handleUnsend}
                    editMess={editMess}
                    handleOkEditMess={handleOkEditMess}
                    setEditMess={setEditMess}
                />
            ))}
        </div>
    );
};

MessageList.displayName = "MessageList";
export default MessageList;
