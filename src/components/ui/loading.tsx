import React from "react";

interface LoadingProps {
    className?: string;
}

export default function Loading({ className = "" }: LoadingProps) {
    return <div className={`h-5 w-5 rounded-full border-x animate-spin dark:border-white border-gray-500 ${className}`} />;
}
