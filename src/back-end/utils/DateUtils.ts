export default class DateUtils {
  static getTimeString(timeSeconds: number): string {
    const hours = Math.trunc(timeSeconds / 3600);
    const minutes = Math.trunc((timeSeconds % 3600) / 60);
    const seconds = Math.trunc((timeSeconds % 3600) % 60);
    return `
      ${hours > 0 ? `0${hours}:` : ''}${minutes}:${
      seconds < 10 ? `0${seconds}` : seconds
    }
    `;
  }

  static getTimeStringWitUnits(timeSeconds: number): string {
    const hours = Math.trunc(timeSeconds / 3600);
    const minutes = Math.trunc((timeSeconds % 3600) / 60);
    const seconds = Math.trunc((timeSeconds % 3600) % 60);
    return `
      ${hours > 0 ? `${hours} hr` : ''} ${
      minutes > 0 ? `${minutes} min` : ''
    } ${seconds > 0 ? `${seconds} sec` : ''}
    `;
  }

  static getDateDiffOrDateString(date: Date): string {
    const currentDate = new Date(Date.now());
    const milliseconds = currentDate.getTime() - date.getTime();
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds > 0 && seconds < 60)
      return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
    if (minutes > 0 && minutes < 60)
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours > 0 && hours < 24)
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days > 0 && days < 14) return `${days} day${days > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  }
}
