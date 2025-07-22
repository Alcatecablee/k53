import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Home,
  Search,
  Phone,
  Clock,
  Navigation,
  Star,
  Users,
  Car,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function DLTCPage() {
  const mockDLTCs = [
    {
      id: 1,
      name: "Cape Town DLTC",
      address: "123 Main Road, Cape Town, 8001",
      phone: "021-123-4567",
      hours: "Mon-Fri: 8:00 AM - 4:00 PM, Sat: 8:00 AM - 12:00 PM",
      distance: "2.3 km",
      rating: 4.2,
      busyLevel: "Moderate",
      waitTime: "30-45 min",
      services: ["Learner's Test", "Driver's Test", "Renewals"],
    },
    {
      id: 2,
      name: "Johannesburg DLTC",
      address: "456 CBD Street, Johannesburg, 2000",
      phone: "011-987-6543",
      hours: "Mon-Fri: 7:30 AM - 4:30 PM, Sat: 8:00 AM - 1:00 PM",
      distance: "1.8 km",
      rating: 3.8,
      busyLevel: "Busy",
      waitTime: "60-90 min",
      services: ["Learner's Test", "Driver's Test", "Renewals", "Eye Tests"],
    },
    {
      id: 3,
      name: "Durban DLTC",
      address: "789 Beach Road, Durban, 4001",
      phone: "031-555-7890",
      hours: "Mon-Fri: 8:00 AM - 4:00 PM, Sat: 8:00 AM - 12:00 PM",
      distance: "5.1 km",
      rating: 4.5,
      busyLevel: "Quiet",
      waitTime: "15-30 min",
      services: [
        "Learner's Test",
        "Driver's Test",
        "Renewals",
        "Motorcycle Tests",
      ],
    },
  ];

  const testRequirements = [
    {
      icon: CheckCircle,
      title: "Valid South African ID",
      description: "Original ID document or passport",
    },
    {
      icon: CheckCircle,
      title: "Passport Photos",
      description: "Two recent passport-sized photos",
    },
    {
      icon: CheckCircle,
      title: "Proof of Residence",
      description: "Not older than 3 months",
    },
    {
      icon: CheckCircle,
      title: "Eye Test Certificate",
      description: "If required by examiner",
    },
  ];

  const testTips = [
    "Arrive 30 minutes early to complete paperwork",
    "Bring exact change for test fees",
    "Study road signs the night before your test",
    "Get a good night's sleep before test day",
    "Practice with our K53 simulator beforehand",
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white border-b-2 border-slate-800 shadow-sm mb-8 -mx-4 px-4 py-6">
          <div className="flex items-center justify-between">
            <Button asChild variant="ghost" className="text-slate-700 hover:text-slate-900 font-semibold uppercase tracking-wide">
              <Link to="/">
                <Home className="h-5 w-5 mr-2" />
                Return to Portal
              </Link>
            </Button>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-slate-900 uppercase tracking-wide">DLTC Directory</h1>
              <p className="text-slate-600 uppercase text-sm tracking-wide">Official Testing Center Locator</p>
            </div>
            <div></div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Search Section */}
          <Card className="border-2 border-slate-800 bg-white mb-8">
            <CardHeader className="bg-slate-800 text-white p-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-white/20 border-2 border-white/30 flex items-center justify-center mx-auto mb-6">
                  <MapPin className="h-10 w-10" />
                </div>
                <CardTitle className="text-3xl font-bold mb-4 uppercase tracking-wide">
                  Official DLTC Network
                </CardTitle>
                <p className="text-slate-200 text-lg">
                  Department of Transport Licensed Testing Centers - Republic of South Africa
                </p>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex gap-4 max-w-lg mx-auto">
                <Input
                  placeholder="Enter province, city, or postal code..."
                  className="flex-1 border-2 border-slate-300 focus:border-slate-800 text-slate-800 placeholder:text-slate-500"
                />
                <Button
                  className="bg-slate-800 hover:bg-slate-700 font-semibold uppercase tracking-wide px-8"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Locate
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Coming Soon Notice */}
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4 mb-8">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <strong>Coming Soon:</strong> Real-time wait times, online
                booking, and interactive maps with GPS navigation to all DLTC
                locations across South Africa.
              </div>
            </div>
          </div>

          {/* DLTC Results */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {mockDLTCs.map((dltc) => (
              <Card
                key={dltc.id}
                className="duolingo-card border-2 hover:border-blue-300 transition-colors"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl text-gray-800 mb-1">
                        {dltc.name}
                      </CardTitle>
                      <p className="text-sm text-gray-600">
                        {dltc.distance} away
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 mb-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">
                          {dltc.rating}
                        </span>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          dltc.busyLevel === "Quiet"
                            ? "border-green-300 text-green-700"
                            : dltc.busyLevel === "Moderate"
                              ? "border-yellow-300 text-yellow-700"
                              : "border-red-300 text-red-700"
                        }`}
                      >
                        {dltc.busyLevel}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" />
                    <p className="text-sm text-gray-700">{dltc.address}</p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    <p className="text-sm text-gray-700">{dltc.phone}</p>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Clock className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" />
                    <p className="text-sm text-gray-700">{dltc.hours}</p>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-800">
                        Wait Time
                      </span>
                      <span className="text-sm font-bold text-blue-600">
                        {dltc.waitTime}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {dltc.services.map((service, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-xl font-semibold"
                    >
                      <Navigation className="h-4 w-4 mr-2" />
                      Directions
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 rounded-xl font-semibold"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Information Sections */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Test Requirements */}
            <Card className="duolingo-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>What to Bring</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {testRequirements.map((req, index) => {
                  const IconComponent = req.icon;
                  return (
                    <div key={index} className="flex items-start space-x-3">
                      <IconComponent className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-1">
                          {req.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {req.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Test Day Tips */}
            <Card className="duolingo-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Info className="h-5 w-5 text-blue-500" />
                  <span>Test Day Tips</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {testTips.map((tip, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="bg-blue-100 rounded-full p-1 mt-0.5">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      </div>
                      <span className="text-sm text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Practice Promotion */}
          <Card className="duolingo-card bg-gradient-to-r from-green-500 to-blue-500 text-white">
            <CardContent className="p-8 text-center">
              <div className="bg-white/20 rounded-full p-4 w-fit mx-auto mb-4">
                <Car className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Ready for Your Test?</h3>
              <p className="mb-6 opacity-90 max-w-md mx-auto">
                Make sure you're fully prepared with our comprehensive K53
                practice tests before heading to the DLTC!
              </p>
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="rounded-xl font-semibold"
              >
                <Link to="/practice">
                  Practice K53 Test
                  <CheckCircle className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
