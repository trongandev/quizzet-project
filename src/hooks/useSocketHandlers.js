import { useCallback, useMemo } from "react";

export const useSocketHandlers = (dispatch) => {
    const messageHandlers = useMemo(
        () => ({
            updateMessages: (newMessage) => {
                dispatch({ type: "ADD_MESSAGE", payload: newMessage });
            },
            handleUnsend: (messageId) => {
                dispatch({
                    type: "UPDATE_MESSAGE",
                    payload: { id: messageId, updates: { unsend: true } },
                });
            },
        }),
        [dispatch]
    );

    return messageHandlers;
};
