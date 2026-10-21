export const COMPANY_PROFILE_PDF_URL =
  '/assets/aistudio/Imaginedge_Company_Profile_2026_New_93061266.pdf';
export const COMPANY_PROFILE_FILENAME = 'Imaginedge_Company_Profile_2026.pdf';

let cachedBlob: Blob | null = null;
let cachedBlobUrl: string | null = null;

/**
 * Loads the company profile PDF as a Blob.
 * Caches the blob in memory to prevent repeated 8MB network transfers.
 */
export async function getCompanyProfileBlob(
  onProgress?: (percent: number) => void
): Promise<{ blob: Blob; url: string }> {
  if (cachedBlob && cachedBlobUrl) {
    if (onProgress) onProgress(100);
    return { blob: cachedBlob, url: cachedBlobUrl };
  }

  const response = await fetch(COMPANY_PROFILE_PDF_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
  }

  const contentLength = response.headers.get('content-length');
  const totalBytes = contentLength ? parseInt(contentLength, 10) : 8219095;

  let blob: Blob;

  if (response.body && onProgress && totalBytes > 0) {
    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let receivedBytes = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        chunks.push(value);
        receivedBytes += value.length;
        const percent = Math.min(100, Math.round((receivedBytes / totalBytes) * 100));
        onProgress(percent);
      }
    }
    blob = new Blob(chunks as BlobPart[], { type: 'application/pdf' });
  } else {
    blob = await response.blob();
  }

  cachedBlob = blob;
  cachedBlobUrl = window.URL.createObjectURL(blob);
  return { blob: cachedBlob, url: cachedBlobUrl };
}

/**
 * Downloads the company profile PDF using an in-memory blob.
 * This guarantees reliable downloads without 302 redirect loops or 500 payload errors.
 */
export async function downloadCompanyProfilePdf(
  onProgress?: (percent: number) => void
): Promise<void> {
  try {
    const { blob } = await getCompanyProfileBlob(onProgress);

    const downloadBlobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadBlobUrl;
    link.download = COMPANY_PROFILE_FILENAME;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      window.URL.revokeObjectURL(downloadBlobUrl);
    }, 60000);
  } catch (err) {
    console.error('Error downloading profile PDF:', err);
    // Fallback: direct browser link
    const fallbackLink = document.createElement('a');
    fallbackLink.href = COMPANY_PROFILE_PDF_URL;
    fallbackLink.download = COMPANY_PROFILE_FILENAME;
    fallbackLink.style.display = 'none';
    document.body.appendChild(fallbackLink);
    fallbackLink.click();
    document.body.removeChild(fallbackLink);
  }
}

/**
 * Opens the company profile PDF in a new browser tab using an in-memory Blob URL.
 * Bypasses iframe cookie isolation and Cloud Run proxy redirections.
 */
export async function openCompanyProfileInNewTab(): Promise<void> {
  try {
    const { url } = await getCompanyProfileBlob();
    window.open(url, '_blank');
  } catch (err) {
    console.error('Error opening profile PDF in new tab:', err);
    window.open(COMPANY_PROFILE_PDF_URL, '_blank');
  }
}
