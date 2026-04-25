"use client"

import { useRef, useState } from "react"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import { Button } from "@/components/ui/button"
import { FileText, Loader2 } from "lucide-react"
import PDFReportTemplate from "./pdf-report-template"
import { useAstrologyStore } from "@/stores/astrology-store"

export default function PDFExportButton() {
    const { userData } = useAstrologyStore()
    const reportRef = useRef<HTMLDivElement>(null)
    const [isGenerating, setIsGenerating] = useState(false)

    const handleDownload = async () => {
        if (!reportRef.current || !userData) return;

        try {
            setIsGenerating(true)

            // Create PDF (A4 size: 210 x 297 mm)
            const pdf = new jsPDF('p', 'mm', 'a4', true);
            const pdfWidth = 210;
            const pdfHeight = 297;

            // Get all 'pages' from the template which are div children of ref
            // Casting to HTMLElement[]
            const pages = Array.from(reportRef.current.children) as HTMLElement[];

            for (let i = 0; i < pages.length; i++) {
                const page = pages[i];

                // Render Page to Canvas
                // Improved settings for better text quality
                const canvas = await html2canvas(page, {
                    scale: 2, // Higher scale for clarity
                    useCORS: true,
                    logging: false,
                    backgroundColor: "#ffffff"
                });

                const imgData = canvas.toDataURL('image/jpeg', 0.95);

                if (i > 0) pdf.addPage();

                // Add Image to PDF
                // We assume the HTML page div is sized proportionally to A4
                pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
            }

            pdf.save(`${userData.name.replace(/\s+/g, '_')}_Cosmic_Report.pdf`);

        } catch (error) {
            console.error("PDF Gen Error:", error)
        } finally {
            setIsGenerating(false)
        }
    }

    if (!userData) return null;

    return (
        <>
            <Button
                onClick={handleDownload}
                className="bg-amber-600 hover:bg-amber-700 text-white gap-2"
                disabled={isGenerating}
            >
                {isGenerating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <FileText className="w-4 h-4" />
                )}
                {isGenerating ? "Generating..." : "Download Report"}
            </Button>

            {/* Hidden Template Rendered Off-Screen */}
            <div style={{ position: "fixed", top: "-10000px", left: "-10000px", opacity: 0, pointerEvents: "none" }}>
                <PDFReportTemplate ref={reportRef} userData={userData} />
            </div>
        </>
    )
}
