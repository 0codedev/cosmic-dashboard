"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    FileText,
    Download,
    Loader2,
    CheckCircle2,
    Star,
    Heart,
    Briefcase,
    Activity,
    Calendar
} from "lucide-react"

interface ReportType {
    id: string
    name: string
    description: string
    pages: string
    icon: React.ReactNode
    sections: string[]
    price: string
    popular?: boolean
}

const REPORT_TYPES: ReportType[] = [
    {
        id: "kundli",
        name: "Complete Kundli Report",
        description: "Comprehensive birth chart analysis with all aspects of life",
        pages: "40-50 pages",
        icon: <Star className="w-5 h-5" />,
        sections: [
            "Birth Chart Details",
            "Planetary Positions",
            "Dasha Timeline (Full Life)",
            "Yoga Analysis",
            "Dosha Analysis with Remedies",
            "Gemstone Recommendations",
            "Nakshatra Analysis",
            "Ashtakvarga Charts",
            "Favorable Periods"
        ],
        price: "Free",
        popular: true
    },
    {
        id: "marriage",
        name: "Marriage & Compatibility Report",
        description: "Detailed analysis for marriage timing and partner compatibility",
        pages: "25-30 pages",
        icon: <Heart className="w-5 h-5" />,
        sections: [
            "7th House Analysis",
            "Venus & Jupiter Strength",
            "Marriage Timing Predictions",
            "Mangal Dosha Analysis",
            "Ideal Partner Characteristics",
            "Compatibility Guidelines",
            "Marriage Muhurta Suggestions",
            "Remedies for Marriage"
        ],
        price: "Free"
    },
    {
        id: "career",
        name: "Career & Finance Report",
        description: "Professional success and wealth accumulation predictions",
        pages: "20-25 pages",
        icon: <Briefcase className="w-5 h-5" />,
        sections: [
            "10th House Analysis",
            "Career Suitable Fields",
            "Income Periods (Dhana Yoga)",
            "Business vs Job Analysis",
            "Foreign Career Potential",
            "Promotion Timing",
            "Investment Guidance",
            "Career Remedies"
        ],
        price: "Free"
    },
    {
        id: "health",
        name: "Health & Longevity Report",
        description: "Physical and mental health analysis with preventive guidance",
        pages: "15-20 pages",
        icon: <Activity className="w-5 h-5" />,
        sections: [
            "6th House Analysis",
            "Longevity Indicators",
            "Health Vulnerabilities",
            "Mental Health Outlook",
            "Favorable Health Periods",
            "Diet Recommendations",
            "Exercise Guidance",
            "Health Remedies"
        ],
        price: "Free"
    },
    {
        id: "varshphal",
        name: "Annual Prediction Report",
        description: "Detailed yearly forecast based on Varshphal",
        pages: "15-20 pages",
        icon: <Calendar className="w-5 h-5" />,
        sections: [
            "Varshphal Chart",
            "Muntha Position",
            "Year Lord Analysis",
            "Monthly Predictions",
            "Career Outlook",
            "Relationship Forecast",
            "Health Predictions",
            "Important Dates"
        ],
        price: "Free"
    }
]

// PDF generation - creates a printable HTML report
async function generatePDFReport(reportType: string): Promise<void> {
    // Get user data for the report
    const SUDHANSHU_DATA = {
        name: "Sudhanshu",
        birthDate: "July 1, 2005",
        birthTime: "10:45 AM",
        birthPlace: "Hyderabad, India",
        sunSign: "Gemini",
        moonSign: "Aquarius",
        ascendant: "Leo",
        nakshatra: "Shatabhisha",
        currentDasha: "Jupiter Mahadasha",
        planets: [
            { name: "Sun", sign: "Gemini", house: 11, degree: "15°23'" },
            { name: "Moon", sign: "Aquarius", house: 7, degree: "8°45'" },
            { name: "Mars", sign: "Aries", house: 9, degree: "22°11'" },
            { name: "Mercury", sign: "Cancer", house: 12, degree: "5°33'" },
            { name: "Jupiter", sign: "Virgo", house: 2, degree: "18°42'" },
            { name: "Venus", sign: "Taurus", house: 10, degree: "12°08'" },
            { name: "Saturn", sign: "Pisces", house: 8, degree: "25°55'" },
            { name: "Rahu", sign: "Pisces", house: 8, degree: "19°23'" },
            { name: "Ketu", sign: "Virgo", house: 2, degree: "19°23'" },
        ],
        yogas: [
            { name: "Gajakesari Yoga", strength: 85, effect: "Wisdom, fame, and leadership" },
            { name: "Budhaditya Yoga", strength: 72, effect: "Intelligence and communication skills" },
            { name: "Hamsa Yoga", strength: 65, effect: "Spiritual wisdom and virtuous nature" },
        ],
        dashas: [
            { planet: "Jupiter", start: "2011", end: "2027", status: "current" },
            { planet: "Saturn", start: "2027", end: "2046", status: "upcoming" },
            { planet: "Mercury", start: "2046", end: "2063", status: "upcoming" },
        ]
    };

    const reportInfo = REPORT_TYPES.find(r => r.id === reportType);
    if (!reportInfo) return;

    // Generate HTML content
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cosmic Path Astrology - ${reportInfo.name}</title>
    <style>
        :root { --primary: #6366f1; --accent: #f59e0b; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', system-ui, sans-serif; background: #0f0f1a; color: #e5e5e5; line-height: 1.6; }
        .container { max-width: 800px; margin: 0 auto; padding: 40px; }
        .header { text-align: center; margin-bottom: 40px; padding-bottom: 30px; border-bottom: 2px solid #333; }
        .header h1 { font-size: 2.5em; background: linear-gradient(135deg, #6366f1, #f59e0b); -webkit-background-clip: text; background-clip: text; color: transparent; margin-bottom: 10px; }
        .header .subtitle { color: #888; margin-bottom: 20px; }
        .header .meta { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; text-align: left; padding: 20px; background: #1a1a2e; border-radius: 10px; }
        .header .meta-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #333; }
        .header .meta-label { color: #888; }
        .header .meta-value { color: #f59e0b; font-weight: 600; }
        .section { margin-bottom: 40px; }
        .section-title { font-size: 1.4em; color: #6366f1; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #333; }
        .table { width: 100%; border-collapse: collapse; background: #1a1a2e; border-radius: 10px; overflow: hidden; }
        .table th, .table td { padding: 12px 15px; text-align: left; border-bottom: 1px solid #333; }
        .table th { background: #252540; color: #6366f1; font-weight: 600; }
        .table tr:last-child td { border-bottom: none; }
        .table tr:hover { background: #252540; }
        .yoga-card { background: #1a1a2e; border-radius: 10px; padding: 15px; margin-bottom: 15px; border-left: 4px solid #f59e0b; }
        .yoga-name { font-weight: 600; color: #f59e0b; margin-bottom: 5px; }
        .yoga-effect { color: #888; font-size: 0.9em; }
        .yoga-strength { display: inline-block; background: #252540; padding: 3px 10px; border-radius: 20px; font-size: 0.8em; color: #6366f1; margin-top: 8px; }
        .dasha-timeline { display: flex; flex-direction: column; gap: 10px; }
        .dasha-item { display: flex; align-items: center; padding: 15px; background: #1a1a2e; border-radius: 10px; }
        .dasha-item.current { border: 2px solid #22c55e; }
        .dasha-planet { font-weight: 600; color: #6366f1; width: 100px; }
        .dasha-period { flex: 1; color: #888; }
        .dasha-status { padding: 4px 12px; border-radius: 20px; font-size: 0.8em; }
        .dasha-status.current { background: #22c55e20; color: #22c55e; }
        .dasha-status.upcoming { background: #6366f120; color: #6366f1; }
        .footer { text-align: center; padding-top: 30px; border-top: 1px solid #333; color: #666; font-size: 0.85em; }
        .print-btn { background: #6366f1; color: white; border: none; padding: 12px 30px; border-radius: 8px; cursor: pointer; font-size: 1em; margin-bottom: 30px; }
        .print-btn:hover { background: #5558dd; }
        @media print { .print-btn { display: none; } body { background: white; color: #333; } .header h1 { color: #6366f1; } }
    </style>
</head>
<body>
    <div class="container">
        <button class="print-btn" onclick="window.print()">📄 Print / Save as PDF</button>
        
        <div class="header">
            <h1>✨ ${reportInfo.name}</h1>
            <p class="subtitle">Cosmic Path Astrology - Personalized Birth Chart Analysis</p>
            <div class="meta">
                <div class="meta-item"><span class="meta-label">Name:</span><span class="meta-value">${SUDHANSHU_DATA.name}</span></div>
                <div class="meta-item"><span class="meta-label">Birth Date:</span><span class="meta-value">${SUDHANSHU_DATA.birthDate}</span></div>
                <div class="meta-item"><span class="meta-label">Birth Time:</span><span class="meta-value">${SUDHANSHU_DATA.birthTime}</span></div>
                <div class="meta-item"><span class="meta-label">Birth Place:</span><span class="meta-value">${SUDHANSHU_DATA.birthPlace}</span></div>
                <div class="meta-item"><span class="meta-label">Sun Sign:</span><span class="meta-value">${SUDHANSHU_DATA.sunSign}</span></div>
                <div class="meta-item"><span class="meta-label">Moon Sign:</span><span class="meta-value">${SUDHANSHU_DATA.moonSign}</span></div>
                <div class="meta-item"><span class="meta-label">Ascendant:</span><span class="meta-value">${SUDHANSHU_DATA.ascendant}</span></div>
                <div class="meta-item"><span class="meta-label">Nakshatra:</span><span class="meta-value">${SUDHANSHU_DATA.nakshatra}</span></div>
            </div>
        </div>
        
        <div class="section">
            <h2 class="section-title">🪐 Planetary Positions</h2>
            <table class="table">
                <thead>
                    <tr><th>Planet</th><th>Sign</th><th>House</th><th>Degree</th></tr>
                </thead>
                <tbody>
                    ${SUDHANSHU_DATA.planets.map(p => `<tr><td>${p.name}</td><td>${p.sign}</td><td>${p.house}</td><td>${p.degree}</td></tr>`).join('')}
                </tbody>
            </table>
        </div>
        
        <div class="section">
            <h2 class="section-title">⭐ Active Yogas</h2>
            ${SUDHANSHU_DATA.yogas.map(y => `
                <div class="yoga-card">
                    <div class="yoga-name">${y.name}</div>
                    <div class="yoga-effect">${y.effect}</div>
                    <span class="yoga-strength">Strength: ${y.strength}%</span>
                </div>
            `).join('')}
        </div>
        
        <div class="section">
            <h2 class="section-title">📅 Vimshottari Dasha Timeline</h2>
            <div class="dasha-timeline">
                ${SUDHANSHU_DATA.dashas.map(d => `
                    <div class="dasha-item ${d.status}">
                        <span class="dasha-planet">${d.planet}</span>
                        <span class="dasha-period">${d.start} - ${d.end}</span>
                        <span class="dasha-status ${d.status}">${d.status === 'current' ? '● Current' : '○ Upcoming'}</span>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="section">
            <h2 class="section-title">📋 Report Sections</h2>
            <table class="table">
                <tbody>
                    ${reportInfo.sections.map((s, i) => `<tr><td>${i + 1}. ${s}</td></tr>`).join('')}
                </tbody>
            </table>
        </div>
        
        <div class="footer">
            <p>Generated by Cosmic Path Astrology on ${new Date().toLocaleDateString()}</p>
            <p>© 2026 Cosmic Path Astrology. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    `.trim();

    // Open in new window
    const newWindow = window.open('', '_blank');
    if (newWindow) {
        newWindow.document.write(htmlContent);
        newWindow.document.close();
    }

    return Promise.resolve();
}

export default function ComprehensiveReports() {
    const [selectedReport, setSelectedReport] = useState<string | null>(null)
    const [generating, setGenerating] = useState<string | null>(null)
    const [generated, setGenerated] = useState<string[]>([])

    const handleGenerateReport = async (reportId: string) => {
        setGenerating(reportId)

        try {
            await generatePDFReport(reportId)
            setGenerated(prev => [...prev, reportId])
        } catch (error) {
            console.error("Error generating report:", error)
        } finally {
            setGenerating(null)
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card className="bg-gradient-to-br from-slate-900/50 to-indigo-900/30 border-indigo-500/30 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-indigo-500/20 rounded-full">
                        <FileText className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Astrological Reports</h2>
                        <p className="text-sm text-gray-400">Download comprehensive PDF reports for detailed analysis</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-green-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>All reports are personalized based on your birth chart</span>
                </div>
            </Card>

            {/* Report Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {REPORT_TYPES.map((report, idx) => (
                    <motion.div
                        layout
                        key={report.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <Card
                            className={`relative overflow-hidden transition-all cursor-pointer ${selectedReport === report.id
                                ? 'bg-indigo-900/30 border-indigo-400 ring-2 ring-indigo-400/50'
                                : 'bg-slate-800/50 border-purple-500/20 hover:border-indigo-500/50'
                                }`}
                            onClick={() => setSelectedReport(selectedReport === report.id ? null : report.id)}
                        >
                            {report.popular && (
                                <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-orange-500 text-white text-xs px-3 py-1 rounded-bl-lg font-medium">
                                    Most Popular
                                </div>
                            )}

                            <div className="p-5">
                                <motion.div layout="position" className="flex items-start gap-3 mb-3">
                                    <div className={`p-2 rounded-lg ${report.id === 'kundli' ? 'bg-amber-500/20 text-amber-400' :
                                        report.id === 'marriage' ? 'bg-pink-500/20 text-pink-400' :
                                            report.id === 'career' ? 'bg-blue-500/20 text-blue-400' :
                                                report.id === 'health' ? 'bg-green-500/20 text-green-400' :
                                                    'bg-purple-500/20 text-purple-400'
                                        }`}>
                                        {report.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-white">{report.name}</h3>
                                        <p className="text-xs text-gray-400 mt-1">{report.description}</p>
                                    </div>
                                </motion.div>

                                <motion.div layout="position" className="flex items-center justify-between mb-4">
                                    <Badge className="bg-slate-700 text-gray-300">{report.pages}</Badge>
                                    <span className="text-green-400 font-semibold">{report.price}</span>
                                </motion.div>

                                {/* Expanded Sections */}
                                {selectedReport === report.id && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        style={{ overflow: "hidden" }}
                                        className="border-t border-slate-700 pt-4 mt-4"
                                    >
                                        <h4 className="text-sm font-medium text-indigo-400 mb-2">Included Sections:</h4>
                                        <ul className="space-y-1">
                                            {report.sections.map((section, i) => (
                                                <li key={i} className="text-xs text-gray-400 flex items-center gap-2">
                                                    <span className="w-1 h-1 bg-indigo-400 rounded-full"></span>
                                                    {section}
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                )}

                                <Button
                                    className={`w-full mt-4 ${generated.includes(report.id)
                                        ? 'bg-green-600 hover:bg-green-700'
                                        : 'bg-indigo-500 hover:bg-indigo-600'
                                        }`}
                                    disabled={generating !== null}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleGenerateReport(report.id)
                                    }}
                                >
                                    {generating === report.id ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Generating...
                                        </>
                                    ) : generated.includes(report.id) ? (
                                        <>
                                            <CheckCircle2 className="w-4 h-4 mr-2" />
                                            Download Again
                                        </>
                                    ) : (
                                        <>
                                            <Download className="w-4 h-4 mr-2" />
                                            Generate Report
                                        </>
                                    )}
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Info Card */}
            <Card className="bg-gradient-to-br from-amber-900/20 to-slate-900/50 border-amber-500/20 p-4">
                <h4 className="text-sm font-medium text-amber-400 mb-2">About Our Reports</h4>
                <p className="text-xs text-gray-400">
                    All reports are generated based on authentic Vedic astrology principles and your personalized birth chart data.
                    Reports include detailed analysis, predictions, and remedies. For best results, ensure your birth time is accurate.
                </p>
            </Card>
        </div>
    )
}
