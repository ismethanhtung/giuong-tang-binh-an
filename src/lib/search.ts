// Utility chuẩn hoá và tìm kiếm tiếng Việt linh hoạt

/**
 * Chuẩn hoá chuỗi:
 * - Chuyển chữ hoa thành chữ thường
 * - Loại bỏ dấu tiếng Việt (NFD decomposition)
 * - Chuyển 'đ' -> 'd'
 * - Chuẩn hoá các loại dấu gạch ngang (en-dash –, em-dash —, minus −) về dấu gạch ngang thông thường '-'
 * - Chuẩn hoá khoảng trắng: gộp nhiều khoảng trắng/tab liên tiếp thành 1 khoảng trắng, trim()
 */
export function normalizeSearchText(str: string): string {
    if (!str) return "";
    return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "d")
        .replace(/[–—−]/g, "-")
        .replace(/\s+/g, " ")
        .trim();
}

/**
 * Tách query thành các từ khoá (tokens)
 * Ví dụ: "giuong  tang   1m-1m" -> ["giuong", "tang", "1m", "1m"]
 */
export function tokenizeSearchQuery(query: string): string[] {
    const normalized = normalizeSearchText(query);
    if (!normalized) return [];

    // Tách theo khoảng trắng hoặc các ký tự phân tách phổ biến nhưng giữ số và chữ
    return normalized
        .split(/[\s,+/|]+/)
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
}

/**
 * Kiểm tra xem một đối tượng có khớp với từ khoá tìm kiếm hay không
 * Sử dụng cơ chế:
 * 1. Nếu chuỗi tìm kiếm khớp trực tiếp (exact substring match) -> Khớp
 * 2. Tìm kiếm theo từng từ (all tokens must match): Mỗi từ trong query đều phải xuất hiện trong targetText
 * 3. Hỗ trợ tìm kiếm kích thước linh hoạt: "1m 1m" khớp với "1m - 1m" hay "1m – 1m"
 */
export function matchSearch(
    targetText: string,
    query: string,
): boolean {
    const normTarget = normalizeSearchText(targetText);
    const normQuery = normalizeSearchText(query);

    if (!normQuery) return true;
    if (!normTarget) return false;

    // 1. Khớp cụm trực tiếp
    if (normTarget.includes(normQuery)) {
        return true;
    }

    // Cung cấp thêm dạng bỏ toàn bộ ký tự đặc biệt để so sánh liền khối (ví dụ "1m1m" khớp "1m - 1m")
    const cleanTarget = normTarget.replace(/[^a-z0-9]/g, "");
    const cleanQuery = normQuery.replace(/[^a-z0-9]/g, "");
    if (cleanQuery && cleanTarget.includes(cleanQuery)) {
        return true;
    }

    // 2. Token match: Tất cả các từ khoá trong query đều phải có mặt trong targetText
    const tokens = tokenizeSearchQuery(query);
    if (tokens.length === 0) return true;

    return tokens.every((token) => {
        // Nếu token là dạng kích thước như "1m", "1m2", "1m4", "2m"...
        if (normTarget.includes(token)) return true;

        // Thử tìm trong target đã làm sạch ký tự đặc biệt
        const cleanToken = token.replace(/[^a-z0-9]/g, "");
        if (cleanToken && cleanTarget.includes(cleanToken)) return true;

        return false;
    });
}
