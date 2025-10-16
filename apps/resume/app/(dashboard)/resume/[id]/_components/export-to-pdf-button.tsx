"use client";

import { useState } from 'react';
import { Button } from "@repo/design-system/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { pdf } from '@react-pdf/renderer';
import { ResumePDF } from './resume-pdf';
import { useResumeBasicInfo } from '../../../../../stores/resume-editor-store';

export function ExportToPdfButton() {
  const basicInfo = useResumeBasicInfo();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExportPDF = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // Generate the PDF blob
      const blob = await pdf(<ResumePDF />).toBlob();
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Use name from basic info for filename, fallback to generic name
      const fileName = basicInfo?.firstName && basicInfo?.lastName 
        ? `${basicInfo.firstName}_${basicInfo.lastName}_Resume.pdf`
        : 'Resume.pdf';
      
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button 
        size="sm" 
        variant="outline" 
        onClick={handleExportPDF}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Download className="mr-2 h-4 w-4" />
        )}
        {isGenerating ? 'Generating...' : 'Export to PDF'}
      </Button>
      {error && (
        <p className="text-red-600 text-xs">
          {error}
        </p>
      )}
    </div>
  );
}
