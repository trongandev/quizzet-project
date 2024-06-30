import React, { useState, useRef, useEffect } from "react";

export default function SubjectOutline() {
    const [searchTerm, setSearchTerm] = useState("");
    const [highlightedElements, setHighlightedElements] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    // const [highlightedText, setHighlightedText] = useState(template);

    const handleChange = (value) => {
        setSearchTerm(value);
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter" && highlightedElements.length > 0) {
            const nextIndex = (currentIndex + 1) % highlightedElements.length;
            setCurrentIndex(nextIndex);
            highlightedElements[nextIndex].scrollIntoView({ behavior: "smooth", block: "center" });
        }
    };

    const getHighlightedText = (text, highlight) => {
        if (highlight.length < 15) {
            return text;
        }

        const escapedHighlight = highlight.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
        const parts = text.split(new RegExp(`(${escapedHighlight})`, "gi"));

        const elements = [];
        const formattedParts = parts.map((part, index) => {
            if (part.toLowerCase() === highlight.toLowerCase()) {
                const element = (
                    <mark key={index} ref={(el) => elements.push(el)}>
                        {part}
                    </mark>
                );
                return element;
            }
            return part;
        });

        setHighlightedElements(elements);
        return formattedParts;
    };

    // useEffect(() => {
    //     setHighlightedText(getHighlightedText(template, searchTerm));
    // }, [searchTerm]);

    return (
        <div>
            <div className="relative">
                <input className="fixed z-5" type="text" value={searchTerm} onChange={(e) => handleChange(e.target.value)} onKeyDown={handleKeyDown} />
                {/* <div className="result">{highlightedText}</div> */}
            </div>
        </div>
    );
}
