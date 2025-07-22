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

          {/* System Notice */}
          <div className="bg-slate-100 border-2 border-slate-800 p-6 mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-slate-800 flex items-center justify-center">
                <Info className="h-6 w-6 text-white" />
              </div>
              <div className="text-slate-800">
                <div className="font-bold uppercase tracking-wide mb-1">System Enhancement Notice</div>
                <div className="text-sm leading-relaxed">
                  Advanced features in development: Real-time capacity monitoring, digital appointment scheduling,
                  and integrated GPS navigation system for all registered DLTC facilities nationwide.
                </div>
              </div>
            </div>
          </div>

          {/* DLTC Directory */}
          <div className="grid lg:grid-cols-1 gap-6 mb-8">
            {mockDLTCs.map((dltc) => (
              <Card
                key={dltc.id}
                className="border-2 border-slate-800 bg-white hover:shadow-lg transition-shadow"
              >
                <CardHeader className="bg-slate-800 text-white p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl font-bold uppercase tracking-wide mb-2">
                        {dltc.name}
                      </CardTitle>
                      <p className="text-slate-200">
                        Distance: {dltc.distance} • License Code: DT-{dltc.id.toString().padStart(3, '0')}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="bg-white/20 border border-white/30 px-4 py-2 mb-2">
                        <div className="text-lg font-bold">{dltc.rating}/5.0</div>
                        <div className="text-xs uppercase tracking-wide">Rating</div>
                      </div>
                      <Badge
                        className={`font-semibold uppercase tracking-wide ${
                          dltc.busyLevel === "Quiet"
                            ? "bg-white/20 text-white border-white/30"
                            : dltc.busyLevel === "Moderate"
                              ? "bg-white/20 text-white border-white/30"
                              : "bg-white/20 text-white border-white/30"
                        }`}
                      >
                        {dltc.busyLevel} Activity
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <MapPin className="h-5 w-5 text-slate-600 mt-1 flex-shrink-0" />
                        <div>
                          <div className="font-semibold text-slate-800 text-sm uppercase tracking-wide mb-1">Physical Address</div>
                          <p className="text-slate-600">{dltc.address}</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Phone className="h-5 w-5 text-slate-600 mt-1 flex-shrink-0" />
                        <div>
                          <div className="font-semibold text-slate-800 text-sm uppercase tracking-wide mb-1">Contact Number</div>
                          <p className="text-slate-600">{dltc.phone}</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Clock className="h-5 w-5 text-slate-600 mt-1 flex-shrink-0" />
                        <div>
                          <div className="font-semibold text-slate-800 text-sm uppercase tracking-wide mb-1">Operating Hours</div>
                          <p className="text-slate-600">{dltc.hours}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="bg-slate-100 border-2 border-slate-300 p-4 mb-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-semibold text-slate-800 uppercase tracking-wide text-sm">
                            Current Wait Time
                          </span>
                          <span className="text-lg font-bold text-slate-800">
                            {dltc.waitTime}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="font-semibold text-slate-800 text-sm uppercase tracking-wide mb-2">Available Services</div>
                          <div className="flex flex-wrap gap-2">
                            {dltc.services.map((service, index) => (
                              <Badge
                                key={index}
                                className="bg-slate-800 text-white text-xs uppercase tracking-wide"
                              >
                                {service}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          variant="outline"
                          className="border-2 border-slate-800 text-slate-800 hover:bg-slate-800 hover:text-white font-semibold uppercase tracking-wide"
                        >
                          <Navigation className="h-4 w-4 mr-2" />
                          Navigate
                        </Button>
                        <Button
                          className="bg-slate-800 hover:bg-slate-700 font-semibold uppercase tracking-wide"
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Contact
                        </Button>
                      </div>
                    </div>
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
