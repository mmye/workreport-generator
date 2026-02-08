import * as pdfjsLib from 'pdfjs-dist';

// Configure worker. 
// Using a CDN for simplicity in this setup, or we could copy the worker file from node_modules.
// For Vite, explicit import is often better, but pdfjs-dist setup can be tricky.
// We'll try the CDN approach first as it's often more robust for quick prototypes without complex build config.
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

export const convertPdfToImages = async (file: File): Promise<string[]> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const images: string[] = [];

    const numPages = pdf.numPages;

    for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 }); // High quality for OCR
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (!context) continue;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
            canvasContext: context,
            viewport: viewport
        } as any).promise;

        images.push(canvas.toDataURL('image/jpeg'));
    }

    return images;
};
