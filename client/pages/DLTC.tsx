import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MapPin, Home, Search, Phone, Clock } from "lucide-react";
import { Link } from "react-router-dom";

export default function DLTCPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-secondary/10">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button asChild variant="outline">
            <Link to="/">
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">DLTC Finder</h1>
            <p className="text-muted-foreground">Find Driving License Testing Centres near you</p>
          </div>
          <div></div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Search Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Find Your Nearest DLTC
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Input 
                  placeholder="Enter your city or province..." 
                  className="flex-1"
                />
                <Button>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground">
                🚧 <strong>Coming Soon:</strong> Interactive map with all DLTC locations across South Africa, 
                including contact details, operating hours, and booking information.
              </p>
            </CardContent>
          </Card>

          {/* Sample DLTC Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-lg">Cape Town DLTC</CardTitle>
                <p className="text-sm text-muted-foreground">Western Cape</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-4 w-4 text-primary mt-1" />
                  <div className="text-sm">
                    <p>123 Main Road, Cape Town, 8001</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Phone className="h-4 w-4 text-primary mt-1" />
                  <div className="text-sm">
                    <p>021-123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Clock className="h-4 w-4 text-primary mt-1" />
                  <div className="text-sm">
                    <p>Mon-Fri: 8:00 AM - 4:00 PM</p>
                    <p>Sat: 8:00 AM - 12:00 PM</p>
                  </div>
                </div>
                
                <Button variant="outline" size="sm" className="w-full mt-4">
                  Get Directions
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-lg">Johannesburg DLTC</CardTitle>
                <p className="text-sm text-muted-foreground">Gauteng</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-4 w-4 text-primary mt-1" />
                  <div className="text-sm">
                    <p>456 CBD Street, Johannesburg, 2000</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Phone className="h-4 w-4 text-primary mt-1" />
                  <div className="text-sm">
                    <p>011-987-6543</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Clock className="h-4 w-4 text-primary mt-1" />
                  <div className="text-sm">
                    <p>Mon-Fri: 7:30 AM - 4:30 PM</p>
                    <p>Sat: 8:00 AM - 1:00 PM</p>
                  </div>
                </div>
                
                <Button variant="outline" size="sm" className="w-full mt-4">
                  Get Directions
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Information Section */}
          <Card className="mt-8 bg-accent/5">
            <CardHeader>
              <CardTitle>What to Bring to Your K53 Test</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Required Documents:</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Valid South African ID document</li>
                    <li>• Two passport-sized photos</li>
                    <li>• Proof of residence (not older than 3 months)</li>
                    <li>• Eye test certificate (if required)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Test Day Tips:</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Arrive 30 minutes early</li>
                    <li>• Bring exact change for fees</li>
                    <li>• Study road signs the night before</li>
                    <li>• Get a good night's sleep</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Practice Prompt */}
          <Card className="mt-8 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">Ready for Your Test?</h3>
              <p className="text-muted-foreground mb-4">
                Make sure you're prepared by taking our practice tests first!
              </p>
              <Button asChild size="lg">
                <Link to="/practice">
                  Start Practice Test
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
