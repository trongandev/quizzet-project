import { formatDistance } from "date-fns";
import { vi } from "date-fns/locale";

const handleCompareDate = (date) => {
    return formatDistance(date, new Date(), { locale: vi, addSuffix: true });
};

export default handleCompareDate;
