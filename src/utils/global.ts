export const getCookieByCookiesKey = (keyOfCookies: string, allCookies: string): string | null => {
    const cookiesArray = allCookies.split(';');
    for (const cookie of cookiesArray) {
        const [cookieName, cookieValue] = cookie.trim().split('=');
        if (cookieName === keyOfCookies) {
            return cookieValue;
        }
    }
    return null;
};