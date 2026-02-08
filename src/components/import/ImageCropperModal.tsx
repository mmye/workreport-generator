import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { extractPartsFromImage, type ExtractedPart } from '../../utils/anthropic';
import { convertPdfToImages } from '../../utils/pdfHelpers';

interface ImageCropperModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImport: (parts: ExtractedPart[]) => void;
}

const ImageCropperModal: React.FC<ImageCropperModalProps> = ({ isOpen, onClose, onImport }) => {
    // Stage: 'upload' | 'crop' | 'extracting' | 'review'
    const [stage, setStage] = useState<'upload' | 'crop' | 'extracting' | 'review'>('upload');

    // Upload Data
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [pdfImages, setPdfImages] = useState<string[]>([]);
    const [currentPdfPage, setCurrentPdfPage] = useState(0); // 0-indexed

    // Crop Data
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

    // Extraction Data
    const [extractedParts, setExtractedParts] = useState<ExtractedPart[]>([]);

    if (!isOpen) return null;

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            if (file.type === 'application/pdf') {
                try {
                    const images = await convertPdfToImages(file);
                    setPdfImages(images);
                    setImageSrc(images[0]);
                    setCurrentPdfPage(0);
                    setStage('crop');
                } catch (err) {
                    console.error("PDF Error", err);
                    alert("Failed to process PDF.");
                }
            } else {
                const reader = new FileReader();
                reader.addEventListener('load', () => {
                    setImageSrc(reader.result?.toString() || null);
                    setStage('crop');
                });
                reader.readAsDataURL(file);
            }
        }
    };

    const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const createCroppedImage = async () => {
        if (!imageSrc || !croppedAreaPixels) return null;

        const image = new Image();
        image.src = imageSrc;
        await new Promise((resolve) => { image.onload = resolve; });

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;

        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;

        ctx.drawImage(
            image,
            croppedAreaPixels.x,
            croppedAreaPixels.y,
            croppedAreaPixels.width,
            croppedAreaPixels.height,
            0,
            0,
            croppedAreaPixels.width,
            croppedAreaPixels.height
        );

        return canvas.toDataURL('image/jpeg');
    };

    const handleExtract = async () => {
        setStage('extracting');
        try {
            const croppedImage = await createCroppedImage();
            if (!croppedImage) throw new Error("Failed to crop image");

            const parts = await extractPartsFromImage(croppedImage);
            setExtractedParts(parts);
            setStage('review');
        } catch (err) {
            console.error(err);
            alert("Extraction failed. Check the console or API key.");
            setStage('crop');
        }
    };

    const handleConfirmImport = () => {
        onImport(extractedParts);
        onClose();
        // Reset state
        setStage('upload');
        setImageSrc(null);
        setPdfImages([]);
        setExtractedParts([]);
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center shrink-0">
                    <h2 className="text-lg font-bold text-slate-800">Import Parts from Image/PDF</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-700">✕</button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto relative bg-slate-50">

                    {stage === 'upload' && (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center p-8">
                                <div className="border-2 border-dashed border-slate-300 rounded-lg p-12 hover:bg-slate-50 transition-colors">
                                    <span className="text-4xl block mb-4">📄</span>
                                    <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium shadow-sm">
                                        Select File (JPG, PNG, PDF)
                                        <input type="file" className="hidden" accept="image/*,application/pdf" onChange={handleFileChange} />
                                    </label>
                                    <p className="mt-2 text-sm text-slate-500">Supported formats: JPG, PNG, PDF</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {stage === 'crop' && (
                        <div className="w-full h-full relative flex flex-col">
                            {/* PDF Paging Controls */}
                            {pdfImages.length > 1 && (
                                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-white/90 px-4 py-2 rounded-full shadow-md flex items-center gap-4">
                                    <button
                                        disabled={currentPdfPage === 0}
                                        onClick={() => {
                                            const newPage = currentPdfPage - 1;
                                            setCurrentPdfPage(newPage);
                                            setImageSrc(pdfImages[newPage]);
                                        }}
                                        className="text-slate-600 disabled:opacity-30 hover:text-blue-600 font-bold"
                                    >◀</button>
                                    <span className="text-sm font-medium">Page {currentPdfPage + 1} / {pdfImages.length}</span>
                                    <button
                                        disabled={currentPdfPage === pdfImages.length - 1}
                                        onClick={() => {
                                            const newPage = currentPdfPage + 1;
                                            setCurrentPdfPage(newPage);
                                            setImageSrc(pdfImages[newPage]);
                                        }}
                                        className="text-slate-600 disabled:opacity-30 hover:text-blue-600 font-bold"
                                    >▶</button>
                                </div>
                            )}

                            <div className="flex-1 relative bg-slate-900 overflow-hidden">
                                <Cropper
                                    image={imageSrc || undefined}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={undefined} // Free aspect ratio
                                    onCropChange={setCrop}
                                    onCropComplete={onCropComplete}
                                    onZoomChange={setZoom}
                                />
                            </div>
                            <div className="p-4 bg-white border-t border-slate-200 flex justify-between items-center shrink-0 z-10">
                                <span className="text-sm text-slate-500">Crop the table area you want to extract.</span>
                                <div className="flex gap-2">
                                    <button onClick={() => setStage('upload')} className="text-slate-600 px-4 py-2 text-sm border border-slate-300 rounded hover:bg-slate-50">Back</button>
                                    <button onClick={handleExtract} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium shadow-sm transition-colors">Extract Data</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {stage === 'extracting' && (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <p className="text-slate-600 font-medium">Analyzing image with Claude 3.5 Sonnet...</p>
                                <p className="text-xs text-slate-400 mt-2">This may take a few seconds.</p>
                            </div>
                        </div>
                    )}

                    {stage === 'review' && (
                        <div className="w-full h-full flex flex-col p-6 overflow-hidden">
                            <div className="bg-white rounded border border-slate-200 shadow-sm flex-1 overflow-auto mb-4">
                                <table className="min-w-full divide-y divide-slate-200">
                                    <thead className="bg-slate-50 sticky top-0">
                                        <tr>
                                            {extractedParts.length > 0 ? Object.keys(extractedParts[0]).filter(k => k !== 'id').map(key => (
                                                <th key={key} className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{key}</th>
                                            )) : <th className="px-6 py-3">Data</th>}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-slate-200">
                                        {extractedParts.map((part, idx) => (
                                            <tr key={part.id || idx}>
                                                {Object.keys(part).filter(k => k !== 'id').map(key => (
                                                    <td key={key} className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                                                        {part[key]}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {extractedParts.length === 0 && <div className="p-8 text-center text-slate-400">No data extracted.</div>}
                            </div>
                            <div className="flex justify-end gap-2 shrink-0">
                                <button onClick={() => setStage('crop')} className="text-slate-600 px-4 py-2 border border-slate-300 rounded hover:bg-slate-50">Back to Crop</button>
                                <button onClick={handleConfirmImport} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded font-medium shadow-sm transition-colors">
                                    Confirm Import ({extractedParts.length} items)
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default ImageCropperModal;
