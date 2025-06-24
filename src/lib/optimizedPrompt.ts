// optimiz prompt flascardcard single
export function optimizedPromptFCSingle(word: string, language: string) {
    return `
        Bạn là một chuyên gia ngôn ngữ có khả năng tạo flashcard chất lượng cao. Hãy tạo flashcard cho từ "${word}" với ngôn ngữ ${language}.

        Yêu cầu:
        1. Phải cung cấp thông tin chính xác và đầy đủ
        2. Ví dụ phải thực tế và dễ hiểu
        3. Ghi chú phải hữu ích cho việc ghi nhớ
        4. Định dạng JSON phải chính xác

        Trả về kết quả theo cấu trúc JSON sau và KHÔNG kèm theo bất kỳ giải thích nào:

        {
        "title": "", // Từ gốc bằng tiếng ${language} (không ghi phiên âm)
        "define": "", // Định nghĩa bằng tiếng Việt, ngắn gọn và dễ hiểu
        "type_of_word": "", // Loại từ (danh từ, động từ, tính từ, etc.)
        "transcription": "", // Phiên âm chuẩn theo từng ngôn ngữ
        "example": [
            {
            "en": "", // Câu ví dụ bằng ${language}
            "trans": "",// phiên âm theo ví dụ
            "vi": ""  // Dịch nghĩa tiếng Việt
            },
            {
            "en": "",
            "trans": "",
            "vi": ""
            },
            {
            "en": "",
            "trans": "",
            "vi": ""
            },
            {
            "en": "",
            "trans": "",
            "vi": ""
            }
        ],
        "note": "" // Tips ghi nhớ, cách dùng đặc biệt, hoặc các lưu ý quan trọng bằng tiếng Việt. Các dấu nháy đôi "" thay bằng dấu ngoặc () để tránh lỗi JSON
        }
        `;
}
// optimiz prompt flascardcard more
export function optimizedPromptFCMore(prompt: string, language: string) {
    return `
        Bạn là một chuyên gia ngôn ngữ có khả năng tạo flashcard chất lượng cao. Hãy tạo flashcard cho danh sách từ "${prompt}" cách nhau bằng dấu , với ngôn ngữ ${language}.
        
        Yêu cầu:
        1. Phải cung cấp thông tin chính xác và đầy đủ
        2. Ghi chú phải hữu ích cho việc ghi nhớ
        3. Định dạng JSON phải chính xác
        
        Trả về kết quả theo cấu trúc mảng JSON sau và KHÔNG kèm theo bất kỳ giải thích nào:
        
        [{
        "title": "", // Từ gốc bằng tiếng ${language} (không ghi phiên âm)
        "define": "", // Định nghĩa bằng tiếng Việt, ngắn gọn và dễ hiểu
        "type_of_word": "", // Loại từ (danh từ, động từ, tính từ, etc.)
        "transcription": "", // Phiên âm chuẩn theo từng ngôn ngữ
        "example": [
            {
            "en": "", // Câu ví dụ bằng ${language}, thêm phiên âm 
            "trans": "",// phiên âm theo ví dụ
            "vi": "" // Dịch nghĩa tiếng Việt
            },
            {
            "en": "",
            "trans": "",
            "vi": ""
            },
            {
            "en": "",
            "trans": "",
            "vi": ""
            }
        ],
        "note": "" // Tips ghi nhớ, cách dùng đặc biệt, hoặc các lưu ý quan trọng bằng tiếng Việt. Các dấu nháy đôi "" thay bằng dấu ngoặc () để tránh lỗi JSON
        }]
        `;
}

export function optimizedPromptQuiz(topic: string, description: string, questionCount: number, difficulty: string) {
    return `Tôi cần một đối tượng JSON chứa ${questionCount} câu hỏi về chủ đề **${topic}**, tập    trung vào **${description}**.
    
            **Yêu cầu chi tiết:**
            * **Số lượng câu hỏi:** Chính xác ${questionCount} câu.
            * **Độ khó:** ${difficulty}.
            * **Loại câu hỏi:** Tất cả câu hỏi phải là trắc nghiệm (multiple-choice).
                * Mỗi câu hỏi có **4 lựa chọn** ("options").
                * Chỉ **một lựa chọn duy nhất** là đáp án đúng ("correct").

            **Cấu trúc JSON mong muốn cho MỖI câu hỏi:**
            Mỗi câu hỏi phải là một đối tượng JSON riêng biệt và bao gồm tất cả các trường sau:
            * "id": Một số nguyên duy nhất cho từng câu hỏi (bắt đầu từ 1).
            * "question": Nội dung đầy đủ của câu hỏi.
            * "answers": Một mảng chứa 4 chuỗi, mỗi chuỗi là một lựa chọn.
            * "correct": Vị trí phần tử đúng trong mảng "answers" (ví dụ: 0 cho lựa chọn đầu tiên, 1 cho lựa chọn thứ hai, v.v.).

            **Định dạng đặc biệt (nếu có):**
            * Nếu chủ đề hoặc câu hỏi yêu cầu biểu thức toán học, công thức khoa học, hoặc các ký hiệu đặc biệt, vui lòng sử dụng định dạng **LaTeX** chuẩn.
                * Sử dụng dấu $ cho các công thức trong dòng (inline math), ví dụ: $\$f(x) = x^2\$$.
                * Sử dụng dấu \$\$ cho các công thức hiển thị (display math), nếu cần (mặc dù với câu hỏi trắc nghiệm, inline thường đủ).

            **Đầu ra:**
            Toàn bộ đầu ra phải là một **mảng JSON hợp lệ** chứa tất cả các đối tượng câu hỏi. Tuyệt đối không bao gồm bất kỳ văn bản, lời mở đầu, hoặc kết luận nào ngoài cấu trúc JSON.`;
}
