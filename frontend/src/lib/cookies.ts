export default function getCookie(name: string): string | null {
    const cookieString = document.cookie;
    const cookies = cookieString.split('; ');
    const cookie = cookies.find(row => row.startsWith(name + '='));
    return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
}


export function setCookie(name: string, value: string, days: number = 2) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}
