import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  FileText,
  Car,
  Layers,
  Settings,
  CheckCircle,
} from "lucide-react";

export function StudyMaterials() {
  const studyMaterials = [
    {
      id: "k53-guide",
      title: "Complete K53 Study Guide",
      description:
        "Comprehensive guide covering all test categories with explanations",
      type: "PDF",
      size: "2.1 MB",
      icon: FileText,
      premium: false,
    },
    {
      id: "road-signs",
      title: "Road Signs Quick Reference",
      description: "Visual guide to all South African road signs and markings",
      type: "PDF",
      size: "1.8 MB",
      icon: Layers,
      premium: false,
    },
    {
      id: "vehicle-controls",
      title: "Vehicle Controls Checklist",
      description: "Detailed checklist for vehicle control assessments",
      type: "PDF",
      size: "0.5 MB",
      icon: Settings,
      premium: false,
    },
    {
      id: "practice-scenarios",
      title: "200+ Practice Scenarios",
      description: "Location-aware scenarios for comprehensive practice",
      type: "PDF",
      size: "4.2 MB",
      icon: Car,
      premium: true,
    },
  ];

  const handleDownload = async (materialId: string, isPremium: boolean) => {
    if (isPremium) {
      // Redirect to premium subscription
      window.location.href = "/pricing";
      return;
    }

    // Real download implementation would fetch from secure storage
    try {
      // This would be implemented with actual file serving
      const response = await fetch(`/api/materials/${materialId}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `superk53-${materialId}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      } else {
        alert("Material not available. Please contact support.");
      }
    } catch (error) {
      console.error("Download failed:", error);
      alert("Download failed. Please try again later.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="border border-black p-6">
        <h4 className="text-lg font-bold text-slate-800 mb-4 uppercase tracking-wide">
          Study Materials
        </h4>
        <p className="text-slate-700 mb-6">
          Download official study materials to enhance your K53 preparation.
          Materials are formatted for both digital study and printing.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {studyMaterials.map((material) => {
            const IconComponent = material.icon;
            return (
              <div key={material.id} className="border border-black p-4">
                <div className="flex items-start space-x-4 mb-3">
                  <div className="w-12 h-12 bg-slate-800 border border-black flex items-center justify-center">
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h5 className="font-bold text-slate-800 text-sm">
                        {material.title}
                      </h5>
                      {material.premium && (
                        <Badge className="bg-orange-600 text-white text-xs">
                          PREMIUM
                        </Badge>
                      )}
                    </div>
                    <p className="text-slate-700 text-xs mb-2">
                      {material.description}
                    </p>
                    <div className="text-xs text-slate-500">
                      {material.type} • {material.size}
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => handleDownload(material.id, material.premium)}
                  className={`w-full text-xs font-medium uppercase tracking-wide ${
                    material.premium
                      ? "bg-orange-600 hover:bg-orange-700 text-white"
                      : "bg-slate-800 hover:bg-slate-700 text-white"
                  }`}
                  size="sm"
                >
                  <Download className="h-3 w-3 mr-2" />
                  {material.premium ? "Upgrade to Download" : "Download"}
                </Button>
              </div>
            );
          })}
        </div>

        <div className="bg-slate-100 border border-black p-4 mt-6">
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h5 className="font-bold text-slate-800 text-sm mb-1">
                Study Material Benefits
              </h5>
              <ul className="text-slate-700 text-xs space-y-1">
                <li>• Offline access for study anywhere</li>
                <li>• Print-friendly format for physical notes</li>
                <li>• Updated with latest regulations</li>
                <li>• Organized by test categories</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
