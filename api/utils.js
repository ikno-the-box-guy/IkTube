export const cleanVideoId = (id) => {
    // Full regex: https://regex101.com/r/ciUbdv/1

    const regex = /([\w\-]{11})/;

    const match = id.match(regex);

    if (match) {
        return match[1];
    } else {
        return null;
    }
}