import QRCode from "qrcode";

export async function generateQrCode(data) {
  return await QRCode.toDataURL(data);
}

