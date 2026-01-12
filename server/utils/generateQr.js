import QRCode from "qrcode";

export async function generateQrCode(data) {
  return await QRCode.toBuffer(data, {
    type: "png",
    width: 300,
    margin: 2,
  });
}
