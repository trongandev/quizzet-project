import React from "react";
import Loading from "./ui/loading";

export const LoadingScreen = () => {
    return (
        <div className="flex items-center justify-center h-[80vh]">
            <Loading className="h-14 w-14" />
        </div>
    );
};
