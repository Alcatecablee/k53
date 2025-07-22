import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Card className="border-2 border-slate-800 bg-white">
          <CardHeader className="bg-slate-800 text-white p-8 text-center">
            <div className="w-20 h-20 bg-white/20 border-2 border-white/30 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="h-10 w-10" />
            </div>
            <CardTitle className="text-4xl font-bold mb-4 uppercase tracking-wide">
              Error 404
            </CardTitle>
            <p className="text-slate-200 text-lg uppercase tracking-wide">
              Resource Not Found
            </p>
          </CardHeader>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 uppercase tracking-wide">
              Access Denied
            </h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              The requested resource could not be located within the official K53 Assessment Portal system.
              This may indicate an invalid URL or restricted access area.
            </p>
            <div className="bg-slate-100 border-2 border-slate-300 p-4 mb-6">
              <p className="text-slate-700 text-sm">
                <strong>Attempted Path:</strong> {location.pathname}
              </p>
            </div>
            <Button
              asChild
              size="lg"
              className="bg-slate-800 hover:bg-slate-700 font-semibold uppercase tracking-wide px-8 py-4"
            >
              <a href="/">
                <Home className="h-5 w-5 mr-3" />
                Return to Main Portal
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;
