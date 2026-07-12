/**
 * Resizes and compresses an image File client-side before upload.
 * Draws the source image onto a canvas at a capped dimension and re-encodes
 * as JPEG, producing a much smaller File suitable for API upload.
 *
 * @param {File} file - The original image file (from input or camera capture)
 * @param {number} maxDimension - Maximum width or height in pixels (default 1600)
 * @param {number} quality - JPEG encode quality 0–1 (default 0.8)
 * @returns {Promise<File>} A new compressed JPEG File
 */
export async function compressImage(file, maxDimension = 1600, quality = 0.8) {
  if (!file.type.startsWith("image/")) return file;

  const img = new Image();
  const objectUrl = URL.createObjectURL(file);
  try {
    img.src = objectUrl;
    await img.decode();

    let width = img.naturalWidth;
    let height = img.naturalHeight;

    if (width > maxDimension || height > maxDimension) {
      if (width >= height) {
        height = Math.round((height / width) * maxDimension);
        width = maxDimension;
      } else {
        width = Math.round((width / height) * maxDimension);
        height = maxDimension;
      }
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Image compression failed — canvas produced no blob"));
            return;
          }
          resolve(new File([blob], "scan.jpg", { type: "image/jpeg" }));
        },
        "image/jpeg",
        quality
      );
    });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}