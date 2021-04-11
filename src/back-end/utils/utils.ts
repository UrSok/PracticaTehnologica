export default function getTimeString(timeSeconds: number): string {
  const hours = Math.trunc(timeSeconds / 3600);
  const minutes = Math.trunc((timeSeconds % 3600) / 60);
  const seconds = Math.trunc((timeSeconds % 3600) % 60);
  return `
    ${hours > 1 ? `0${hours}:` : ''}${minutes}:${
    seconds < 10 ? `0${seconds}` : seconds
  }
  `;
}
