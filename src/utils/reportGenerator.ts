import createReport from 'docx-templates';
import { saveAs } from 'file-saver';
import { useReportStore } from '../store/useReportStore';
import { useSettingsStore } from '../store/useSettingsStore';

// Mock function to simulate PDF generation from Word
// In a real app, this would send the docx buffer to a backend server for conversion
const convertDocxToPdf = async (docxBuffer: Uint8Array): Promise<Blob> => {
    console.log("Mocking PDF conversion server call...");
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate latency
    return new Blob([docxBuffer], { type: 'application/pdf' }); // Returning docx as PDF for prototype
};

export const generateWordReport = async () => {
    const { data } = useReportStore.getState();
    const { wordTemplate } = useSettingsStore.getState();

    if (!wordTemplate) {
        alert("No template uploaded! Please upload a template in Settings.");
        return;
    }

    try {
        const templateBuffer = await wordTemplate.arrayBuffer();

        const report = await createReport({
            template: templateBuffer,
            data: {
                report_id: 'R-2025-001', // Mock ID
                date: new Date().toLocaleDateString(),
                client: 'Acme Corp', // Mock Client
                ...data, // Access to chapters: inspectionTasks, abnormalityTasks, etc.
            },
            cmdDelimiter: ['{{', '}}'], // Standard mustache style
        });

        saveAs(new Blob([report]), `WorkReport_${new Date().toISOString().split('T')[0]}.docx`);
    } catch (error) {
        console.error("Word Generation Error:", error);
        alert("Failed to generate Word report. Check console for details.");
    }
};

export const generatePdfReport = async () => {
    const { data } = useReportStore.getState();
    const { wordTemplate } = useSettingsStore.getState();

    if (!wordTemplate) {
        alert("No template uploaded! Please upload a template in Settings.");
        return;
    }

    try {
        const templateBuffer = await wordTemplate.arrayBuffer();

        // 1. Generate Word first (server needs the filled docx)
        const wordBuffer = await createReport({
            template: templateBuffer,
            data: {
                report_id: 'R-2025-001',
                date: new Date().toLocaleDateString(),
                client: 'Acme Corp',
                ...data,
            },
        });

        // 2. Convert to PDF (Mock)
        const pdfBlob = await convertDocxToPdf(wordBuffer);

        saveAs(pdfBlob, `WorkReport_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
        console.error("PDF Generation Error:", error);
        alert("Failed to generate PDF report. Check console for details.");
    }
};
