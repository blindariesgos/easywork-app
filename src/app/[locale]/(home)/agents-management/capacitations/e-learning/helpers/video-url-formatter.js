export const videoUrlFormatter = url => {
  // Esto se hace más que todo para los videos de YouTube

  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)?|youtu\.be\/)([\w\-]+)/;
  const match = url.match(regex);

  if (match) {
    const videoId = match[1];
    return `https://www.youtube.com/embed/${videoId}`;
  } else {
    return url;
  }
};
