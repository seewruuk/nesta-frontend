export function ImageUrl(imagePath) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    return `${apiUrl}${imagePath}`;
}