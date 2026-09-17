import { toAssetUrl } from './urlHelper';

/**
 * Copies the raw PNG image blob directly to the user's clipboard.
 * Fallbacks to copying the link URL if image blob copying is not supported or fails.
 */
export async function copyImageAsset(pathOrUrl) {
  const fullUrl = toAssetUrl(pathOrUrl);
  try {
    const response = await fetch(fullUrl);
    const blob = await response.blob();
    let pngBlob = blob;

    if (blob.type !== 'image/png') {
      const img = document.createElement('img');
      img.src = URL.createObjectURL(blob);
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      pngBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    }

    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': pngBlob })
    ]);
    return 'image';
  } catch (err) {
    console.warn('Direct image copy unavailable, falling back to link copy:', err);
    await copyLinkText(pathOrUrl);
    return 'link';
  }
}

/**
 * Copies the full direct asset URL to the clipboard.
 */
export async function copyLinkText(pathOrUrl) {
  const fullUrl = toAssetUrl(pathOrUrl);
  const absoluteUrl = fullUrl.startsWith('http')
    ? fullUrl
    : new URL(fullUrl, window.location.href).href;
  await navigator.clipboard.writeText(absoluteUrl);
  return 'link';
}
