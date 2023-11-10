declare module 'qr-image' {
    interface QRImageOptions {
      type: 'png' | 'svg' | 'pdf';
    }
  
    interface QRImage {
      imageSync(text: string, options?: QRImageOptions): Buffer;
    }
  
    const qr: QRImage;
  
    export = qr;
  }
  