import { BlobReader, BlobWriter, TextReader, ZipWriter } from '@zip.js/zip.js';

/**
 * Downloads a file directly or packages it inside a password-protected ZIP archive
 * if a password is provided.
 */
export async function downloadFileWithOptionalPassword(
  content: Blob | string | Uint8Array,
  filename: string,
  mimeType: string,
  password?: string,
) {
  let blobToDownload: Blob;
  let finalFilename = filename;

  const trimmedPassword = password?.trim();

  if (trimmedPassword && trimmedPassword.length > 0) {
    const zipFileWriter = new BlobWriter('application/zip');
    const zipWriter = new ZipWriter(zipFileWriter, {
      password: trimmedPassword,
    });

    let reader;
    if (typeof content === 'string') {
      // Prepend UTF-8 BOM if CSV text for Unicode compatibility
      const utf8Text = content.startsWith('\uFEFF') ? content : '\uFEFF' + content;
      reader = new TextReader(utf8Text);
    } else if (content instanceof Blob) {
      reader = new BlobReader(content);
    } else {
      reader = new BlobReader(new Blob([content as BlobPart], { type: mimeType }));
    }

    await zipWriter.add(filename, reader);
    await zipWriter.close();
    blobToDownload = await zipFileWriter.getData();

    const lastDotIdx = filename.lastIndexOf('.');
    const nameWithoutExt =
      lastDotIdx > 0 ? filename.substring(0, lastDotIdx) : filename;
    finalFilename = `${nameWithoutExt}_protected.zip`;
  } else {
    if (content instanceof Blob) {
      blobToDownload = content;
    } else if (typeof content === 'string') {
      const utf8Text = content.startsWith('\uFEFF') ? content : '\uFEFF' + content;
      blobToDownload = new Blob([utf8Text], { type: mimeType });
    } else {
      blobToDownload = new Blob([content as BlobPart], { type: mimeType });
    }
  }

  const url = URL.createObjectURL(blobToDownload);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', finalFilename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
