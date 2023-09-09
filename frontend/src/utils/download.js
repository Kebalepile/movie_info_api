/**
 * @description Downloads a file from the given URL with the given title.
 * @param {string} url - The URL of the file to download.
 * @param {string} title - The title to use for the downloaded file.
 */
export default function download(url, title) {
    try {
      let a = document.createElement("a");
      a.style = "display:none";
      a.href = url;
      a.download = title;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
    } catch (err) {
      console.error(err.message);
    }
  }
  