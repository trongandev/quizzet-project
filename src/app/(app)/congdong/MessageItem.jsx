import Image from "next/image";
import Link from "next/link";
import React, { memo } from "react";
import { MdEdit, MdOutlineInsertEmoticon, MdOutlineReply } from "react-icons/md";
import { Dropdown, Image as Images, Modal, Spin, Tooltip } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { TbSendOff } from "react-icons/tb";

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
                <Link href={`#${msg?.replyTo._id}`} className={`block ${isCurrentUser ? "w-full text-end" : ""}`}>
                    <p className={` inline-block bg-gray-400 rounded-lg px-3 py-2 mb-[-10px] line-clamp-2`}>{msg?.replyTo?.unsend ? "Tin nhắn đã bị gỡ" : msg?.replyTo?.message}</p>
                </Link>
            )}
        </div>
    );
});

const MessageActions = memo(({ msg, isCurrentUser, loading, loadingIcon, onReply, onUnsend, onReact, onEdit, reactIconList }) => {
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
});

const MessageItem = memo(({ message, isLast, onReply, onUnsend, onReact, onEdit }) => {
    const isCurrentUser = useMemo(() => message?.userId?._id === userId, [message?.userId?._id, userId]);
    const isSameUser = useMemo(() => {
        // Logic để check same user
        return false; // Implement your logic here
    }, [message]);

    const messageClasses = useMemo(
        () => ({
            container: `flex items-start ${isCurrentUser ? "justify-end" : "justify-start"} mb-[4px] group min-h-[40px] items-center`,
            content: `max-w-[60%] ${isCurrentUser ? "" : "ml-[45px]"}`,
            message: `max-w-[350px] ${isCurrentUser ? "bg-primary text-white" : "bg-gray-200"} ${
                message?.unsend ? "!bg-white border border-primary !text-primary text-[12px]" : ""
            } rounded-lg px-3 py-2 inline-block`,
        }),
        [isCurrentUser, message?.unsend]
    );
    return (
        <>
            <div key={index} ref={isLastMessage ? lastMessageRef : null}>
                {/* Hiển thị tên người dùng trên đầu nhóm */}
                {!isSameUser && !isCurrentUser && <p className="ml-[45px] text-gray-500 text-sm mb-1 pl-1">{msg?.userId?.displayName}</p>}

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
                            <ReplyContent msg={message} isCurrentUser={isCurrentUser} userId={userId} />

                            {message?.isEdit && <span className={`text-xs text-gray-600 ${isCurrentUser ? "text-end mr-5" : "text-start ml-5"} block`}>Đã chỉnh sửa</span>}

                            <MessageContent message={message} isCurrentUser={isCurrentUser} onReactionClick={onReact} />
                        </div>

                        <MessageActions
                            msg={message}
                            isCurrentUser={isCurrentUser}
                            loading={loading}
                            loadingIcon={loadingIcon}
                            onReply={onReply}
                            onUnsend={onUnsend}
                            onReact={onReact}
                            onEdit={onEdit}
                            reactIconList={reactIconList}
                        />

                        {isSameUser && <p className="text-gray-500 text-xs">{message?.timestamp && handleCompareDate(message?.timestamp)}</p>}
                    </div>
                </div>
            </div>
        </>
    );
});

MessageItem.displayName = "MessageItem";
ReplyContent.displayName = "ReplyContent";
MessageActions.displayName = "MessageActions";
export default MessageItem;
