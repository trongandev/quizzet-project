import Image from "next/image";
import Link from "next/link";
import React, { memo, useMemo, useRef } from "react";
import { MdEdit, MdOutlineInsertEmoticon, MdOutlineReply } from "react-icons/md";
import { Dropdown, Image as Images, Modal, Spin, Tooltip } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { TbSendOff } from "react-icons/tb";
import handleCompareDate from "@/lib/CompareDate";

const ReplyContent = memo(({ msg, isCurrentUser, userId }) => {
    if (!msg?.replyTo) return null;
    return (
        <div className="text-[12px]">
            {isCurrentUser ? (
                <div className="">
                    <p className="flex items-center gap-1">
                        <MdOutlineReply />
                        Bạn đã trả lời {msg?.replyTo?.userId?._id == userId ? "chính bạn" : ":" + msg?.replyTo?.userId?.displayName}
                    </p>

                    {msg?.replyTo?.image && (
                        <Link href={`#${msg?.replyTo._id}`} className={`mb-1 flex justify-end`}>
                            <Image alt="" src={msg?.replyTo.image} width={100} height={100} className="brightness-50 rounded-lg " />
                        </Link>
                    )}
                </div>
            ) : (
                <div className="">
                    <p className="flex items-center gap-1">
                        <MdOutlineReply />
                        {msg?.userId?.displayName} đã trả lời bạn
                    </p>
                    {msg?.replyTo?.image && (
                        <Link href={`#${msg?.replyTo._id}`} className={`mb-1 flex justify-start`}>
                            <Image alt="" src={msg?.replyTo.image} width={100} height={100} className="brightness-50 rounded-lg " />
                        </Link>
                    )}
                </div>
            )}
            {msg?.replyTo?.text !== "" && (
                <Link href={`#${msg?.replyTo._id}`} className={`flex max-w-[350px] justify-end ${isCurrentUser ? "" : ""}`}>
                    <p className={` inline-block bg-gray-400 dark:bg-gray-500/70 rounded-md border border-white/10 px-3 py-2 mb-[-10px] line-clamp-2`}>
                        {msg?.replyTo?.unsend ? "Tin nhắn đã bị gỡ" : msg?.replyTo?.message}
                    </p>
                </Link>
            )}
        </div>
    );
});

const MessageActions = memo(
    ({
        msg,
        token,
        isCurrentUser,
        loading,
        loadingIcon,
        reactIconList,
        isModalOpenEditMess,
        handleOkEditMess,
        handleCancelEditMess,
        editMess,
        handleEditMess,
        setReplyingTo,
        handleReactIcon,
        handleUnsend,
        setEditMess,
    }) => {
        if (!token) return null;
        return (
            <div className={`hidden group-hover:block `}>
                <div className={`flex gap-2 `}>
                    {!msg?.unsend && (
                        <Tooltip placement="top" title="Trả lời">
                            <label htmlFor="text" className=" h-full text-white cursor-pointer bg-gray-400 p-2 rounded-full hover:bg-secondary" onClick={() => setReplyingTo(msg)}>
                                <MdOutlineReply />
                            </label>
                        </Tooltip>
                    )}
                    {isCurrentUser && !msg?.unsend && (
                        <Tooltip placement="top" title="Thu hồi">
                            <div className=" h-full text-white cursor-pointer bg-gray-400 p-2 rounded-full hover:bg-secondary" onClick={() => handleUnsend(msg?._id)}>
                                {loading ? <Spin indicator={<LoadingOutlined spin />} size="default" /> : <TbSendOff />}
                            </div>
                        </Tooltip>
                    )}
                    {!msg?.unsend && (
                        <Dropdown
                            overlay={
                                <div className="flex items-center bg-linear-item-2 rounded-full h-[40px] ">
                                    {reactIconList.map((icon, index) => (
                                        <div className=" hover:bg-gray-400 rounded-full cursor-pointer w-[40px] h-[40px] flex items-center justify-center " key={index}>
                                            {loadingIcon ? (
                                                <Spin indicator={<LoadingOutlined spin />} size="default" />
                                            ) : (
                                                <Image src={icon} width={25} height={25} alt="" onClick={() => handleReactIcon(msg._id, icon)} />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            }
                            trigger={["click"]}
                            placement="top">
                            <div className=" h-full text-white cursor-pointer bg-gray-400 p-2 rounded-full hover:bg-secondary">
                                <MdOutlineInsertEmoticon />
                            </div>
                        </Dropdown>
                    )}
                    {isCurrentUser && !msg?.unsend && (
                        <Tooltip placement="top" title="Chỉnh sửa">
                            <div className=" h-full text-white cursor-pointer bg-gray-400 p-2 rounded-full hover:bg-secondary" onClick={() => handleEditMess(msg)}>
                                <MdEdit />
                            </div>
                        </Tooltip>
                    )}
                    <Modal title="Chỉnh sửa tin nhắn" open={isModalOpenEditMess === msg?._id} onOk={handleOkEditMess} onCancel={handleCancelEditMess} confirmLoading={loading}>
                        <input type="text" placeholder="Nhập thông tin bạn muốn sửa" value={editMess?.message} onChange={(e) => setEditMess({ ...editMess, message: e.target.value })} />
                    </Modal>
                </div>
            </div>
        );
    }
);

const MessageItem = memo(
    ({
        msg,
        lastMessageRef,
        index,
        messages,
        user,
        handleReactIcon,
        setReplyingTo,
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
        handleOkEditMess,
        onOpenChange,
        handleCancelEditMess,
        handleEditMess,
        handleUnsend,
        onReact,
        loading,
        editMess,
        setEditMess,
    }) => {
        const userId = user?._id;
        const isCurrentUser = useMemo(() => msg?.userId?._id === userId, [msg?.userId?._id, userId]);
        const isSameUser = useMemo(() => {
            return index > 0 && messages[index - 1]?.userId?._id === msg?.userId?._id;
        }, [msg]);

        const isLastMessage = useMemo(() => index === messages.length - 1, [index, messages.length]);

        const messageClasses = useMemo(
            () => ({
                container: `flex items-start ${isCurrentUser ? "justify-end" : "justify-start"} mb-[4px] group min-h-[40px] items-center`,
                content: ` ${isCurrentUser ? "" : "ml-[45px]"}`,
                msg: `max-w-[350px]  border border-white/10  ${isCurrentUser ? "bg-primary dark:bg-slate-800/50 text-white " : "bg-gray-200 dark:bg-slate-500/50"} ${
                    msg?.unsend ? "!bg-white dark:!bg-slate-800  border border-primary !text-primary text-[12px]" : ""
                } rounded-lg px-3 py-2 inline-block break-words whitespace-pre-wrap overflow-wrap-anywhere`,
            }),
            [isCurrentUser, msg?.unsend]
        );
        return (
            <>
                <div ref={isLastMessage ? lastMessageRef : null}>
                    {/* Hiển thị tên người dùng trên đầu nhóm */}
                    {!isSameUser && !isCurrentUser && <p className="ml-[45px] text-gray-500 text-sm mb-1 pl-1 mt-5">{msg?.userId?.displayName}</p>}

                    {/* Tin nhắn */}
                    <div className={`flex items-start ${isCurrentUser ? "justify-end" : "justify-start"} mb-[4px] group min-h-[40px] items-center`}>
                        {/* Avatar của người khác */}
                        {!isCurrentUser && !isSameUser && (
                            <Link href={`/profile/${msg?.userId?._id}`} className="w-[40px] h-[40px] relative mr-[-40px]">
                                <Image
                                    src={msg?.userId?.profilePicture || "/meme.jpg"}
                                    alt=""
                                    unoptimized
                                    className="w-full h-full object-cover absolute border-2 border-primary rounded-full"
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            </Link>
                        )}

                        {/* Nội dung tin nhắn */}
                        <div className={`flex items-center w-full gap-3 ${isCurrentUser ? "flex-row-reverse" : ""}`}>
                            <div className={messageClasses.content}>
                                <ReplyContent msg={msg} token={token} isCurrentUser={isCurrentUser} userId={userId} />

                                {msg?.isEdit && <span className={`text-xs text-gray-600 ${isCurrentUser ? "text-end mr-5" : "text-start ml-5"} block`}>Đã chỉnh sửa</span>}

                                {/* <MessageContent msg={msg} isCurrentUser={isCurrentUser} onReactionClick={onReact} /> */}
                                <div className="flex justify-end ">{msg?.message && <p className={messageClasses.msg}>{msg?.unsend ? "Tin nhắn đã bị gỡ" : msg?.message}</p>}</div>
                            </div>

                            <MessageActions
                                msg={msg}
                                setReplyingTo={setReplyingTo}
                                handleReactIcon={handleReactIcon}
                                token={token}
                                loading={loading}
                                isCurrentUser={isCurrentUser}
                                loadingIcon={loadingIcon}
                                onReply={onReply}
                                handleUnsend={handleUnsend}
                                onReact={onReact}
                                onEdit={onEdit}
                                reactIconList={reactIconList}
                                isModalOpenEditMess={isModalOpenEditMess}
                                handleOkEditMess={handleOkEditMess}
                                handleCancelEditMess={handleCancelEditMess}
                                handleEditMess={handleEditMess}
                                editMess={editMess}
                                setEditMess={setEditMess}
                            />

                            {isSameUser && <p className="text-gray-500 text-xs">{msg?.timestamp && handleCompareDate(msg?.timestamp)}</p>}
                        </div>
                    </div>
                </div>
            </>
        );
    }
);

MessageItem.displayName = "MessageItem";
ReplyContent.displayName = "ReplyContent";
MessageActions.displayName = "MessageActions";
export default MessageItem;
