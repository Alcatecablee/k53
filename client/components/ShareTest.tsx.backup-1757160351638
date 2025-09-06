import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ShareTest() {
  const [testResult, setTestResult] = useState<string>("");

  const testNativeShare = async () => {
    const shareData = {
      title: "Test Share",
      text: "This is a test share",
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setTestResult("Native share successful!");
      } else {
        setTestResult("Native share not available");
      }
    } catch (error) {
      setTestResult(`Share error: ${error}`);
    }
  };

  const testClipboard = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText("Test clipboard content");
        setTestResult("Clipboard copy successful!");
      } else {
        setTestResult("Clipboard API not available");
      }
    } catch (error) {
      setTestResult(`Clipboard error: ${error}`);
    }
  };

  return (
    <Card className="bg-slate-800 border border-black">
      <CardHeader>
        <CardTitle className="text-white">Share Functionality Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Button onClick={testNativeShare} className="w-full">
            Test Native Share
          </Button>
          <Button onClick={testClipboard} className="w-full">
            Test Clipboard
          </Button>
        </div>
        
        {testResult && (
          <div className="bg-slate-700 border border-black p-3 rounded">
            <p className="text-sm text-slate-300">{testResult}</p>
          </div>
        )}
        
        <div className="bg-slate-700 border border-black p-3 rounded text-xs text-slate-300">
          <p>Browser Info:</p>
          <p>User Agent: {navigator.userAgent}</p>
          <p>Native Share: {navigator.share ? "Available" : "Not Available"}</p>
          <p>Clipboard: {navigator.clipboard ? "Available" : "Not Available"}</p>
        </div>
      </CardContent>
    </Card>
  );
} 