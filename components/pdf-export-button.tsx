"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, FileText, Loader2 } from "lucide-react"
import html2canvas from "html2canvas"
import { jsPDF } from "jspdf"
import { SUDHANSHU_DATA } from "@/data/user-data"

interface PDFExportButtonProps {
    targetId: string
    filename?: string
    title?: string
    variant?: "default" | "outline" | "ghost"
    size?: "default" | "sm" | "lg" | "icon"
    className?: string
}

export default function PDFExportButton({
    targetId,
    filename = "cosmic-path-report",
    title = "Export PDF",
    variant = "outline",
    size = "default",
    className = ""
}: PDFExportButtonProps) {
    const [isExporting, setIsExporting] = useState(false)

    const handleExport = async () => {
        setIsExporting(true)

        try {
            const element = document.getElementById(targetId)
            if (!element) {
                console.error(`Element with id "${targetId}" not found`)
                setIsExporting(false)
                return
            }

            // Capture the element as canvas
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#0f172a', // slate-900
                logging: false,
            })

            // Calculate dimensions
            const imgWidth = 210 // A4 width in mm
            const pageHeight = 297 // A4 height in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width
            let heightLeft = imgHeight
            let position = 0

            // Create PDF
            const pdf = new jsPDF('p', 'mm', 'a4')
            const imgData = canvas.toDataURL('image/png')

            // Add header on first page
            pdf.setFillColor(15, 23, 42) // slate-900
            pdf.rect(0, 0, 210, 20, 'F')
            pdf.setTextColor(34, 211, 238) // cyan-400
            pdf.setFontSize(14)
            pdf.setFont('helvetica', 'bold')
            pdf.text('Cosmic Path Astrology Report', 105, 12, { align: 'center' })
            pdf.setFontSize(8)
            pdf.setTextColor(148, 163, 184) // gray-400
            pdf.text(`Generated for ${SUDHANSHU_DATA.name} on ${new Date().toLocaleDateString()}`, 105, 17, { align: 'center' })

            // Add image
            position = 22
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
            heightLeft -= (pageHeight - position)

            // Handle multi-page content
            while (heightLeft > 0) {
                position = heightLeft - imgHeight
                pdf.addPage()
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
                heightLeft -= pageHeight
            }

            // Add footer on last page
            const pageCount = pdf.getNumberOfPages()
            for (let i = 1; i <= pageCount; i++) {
                pdf.setPage(i)
                pdf.setFontSize(8)
                pdf.setTextColor(148, 163, 184)
                pdf.text(`Page ${i} of ${pageCount}`, 105, 290, { align: 'center' })
                pdf.text('cosmicpathastrology.com', 10, 290)
            }

            // Save PDF
            const timestamp = new Date().toISOString().split('T')[0]
            pdf.save(`${filename}-${timestamp}.pdf`)

        } catch (error) {
            console.error('PDF export failed:', error)
        } finally {
            setIsExporting(false)
        }
    }

    return (
        <Button
            onClick={handleExport}
            disabled={isExporting}
            variant={variant}
            size={size}
            className={`${className} ${variant === 'outline' ? 'border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10' : ''}`}
            aria-label={`Export ${title} as PDF`}
        >
            {isExporting ? (
                <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Exporting...
                </>
            ) : (
                <>
                    <Download className="w-4 h-4 mr-2" />
                    {title}
                </>
            )}
        </Button>
    )
}

// Quick export function for programmatic use
export async function exportElementToPDF(
    elementId: string,
    filename: string = "export"
): Promise<boolean> {
    try {
        const element = document.getElementById(elementId)
        if (!element) return false

        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#0f172a',
        })

        const pdf = new jsPDF('p', 'mm', 'a4')
        const imgWidth = 210
        const imgHeight = (canvas.height * imgWidth) / canvas.width

        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight)
        pdf.save(`${filename}.pdf`)

        return true
    } catch (error) {
        console.error('Export failed:', error)
        return false
    }
}
