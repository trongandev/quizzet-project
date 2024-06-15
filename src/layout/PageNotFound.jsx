import React from "react";
import { Button, Result } from "antd";
import { Link } from "react-router-dom";
export default function PageNotFound() {
    return (
        <Result
            status="404"
            title="404"
            subTitle="Trang không tồn tại"
            extra={
                <>
                    <Link to="/">
                        <Button type="primary">Back Home</Button>
                    </Link>
                </>
            }
        />
    );
}
