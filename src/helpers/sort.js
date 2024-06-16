import { parse } from "date-fns";

/**
 * Hàm sắp xếp mảng các đối tượng dựa trên trường thời gian.
 * @param {Array} array - Mảng các đối tượng cần sắp xếp.
 * @param {String} timeField - Tên trường chứa thời gian cần sắp xếp.
 * @returns {Array} - Mảng đã được sắp xếp.
 */
const sortArrayByTime = (array) => {
    const parseDate = (dateString) => {
        return parse(dateString, "HH:mm:ss dd/MM/yyyy", new Date());
    };

    return array.sort((a, b) => {
        const dateA = parseDate(a.date);
        const dateB = parseDate(b.date);
        return dateB - dateA; // Sắp xếp từ mới nhất đến cũ nhất
    });
};

export default sortArrayByTime;
