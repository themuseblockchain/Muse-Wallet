export function isLoggedIn() {
    let authorized = window.localStorage.getItem('is_logged_in') == 'true' ? true : false;

    return authorized;
}

export function getUserInformation() {
    let username = window.localStorage.getItem('username');

    return username;
}