import QrCode from "qrcode";

export const generateQr = async (data) => {
  try {
    const qrDataUrl = await QrCode.toDataURL(data, {
      width: 200,
      height: 200,
    });
    return qrDataUrl;
  } catch (error) {
    throw new Error("Error generating QR code");
  }
};
