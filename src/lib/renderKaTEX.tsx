import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

// Hàm này sẽ phân tích chuỗi văn bản và render LaTeX
export const renderContentWithLaTeX = (content: string) => {
    // Regex để tìm các công thức LaTeX trong dòng ($...$) và khối ($$...$$)
    // Chú ý: Cần xử lý Block Math trước để tránh xung đột với Inline Math nếu có $ bên trong $$
    const regexBlock = /\$\$([^$]+?)\$\$/g; // Non-greedy match for block math
    const regexInline = /\$([^$]+?)\$/g; // Non-greedy match for inline math

    const parts: (string | JSX.Element)[] = [];
    let lastIndex = 0;

    // 1. Xử lý Block Math
    content.replace(regexBlock, (match, latexContent, offset) => {
        if (offset > lastIndex) {
            parts.push(content.substring(lastIndex, offset));
        }
        parts.push(<BlockMath key={`block-${offset}`}>{latexContent}</BlockMath>);
        lastIndex = offset + match.length;
        return match;
    });

    // Thêm phần còn lại sau khi xử lý Block Math
    if (lastIndex < content.length) {
        parts.push(content.substring(lastIndex));
    }

    // 2. Xử lý Inline Math trên các phần đã được xử lý (hoặc không)
    const finalParts = parts.flatMap((part, partIndex) => {
        if (typeof part !== "string") {
            return part; // Giữ nguyên BlockMath component đã được tạo
        }
        const subParts: (string | JSX.Element)[] = [];
        let subLastIndex = 0;
        part.replace(regexInline, (match, latexContent, offset) => {
            if (offset > subLastIndex) {
                subParts.push(part.substring(subLastIndex, offset));
            }
            subParts.push(<InlineMath key={`inline-${partIndex}-${offset}`}>{latexContent}</InlineMath>);
            subLastIndex = offset + match.length;
            return match;
        });
        if (subLastIndex < part.length) {
            subParts.push(part.substring(subLastIndex));
        }
        return subParts;
    });

    return <>{finalParts}</>; // Trả về một React Fragment chứa các phần
};
