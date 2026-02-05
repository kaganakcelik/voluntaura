import { Heart, Users, Target, Mail, MapPin, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ReferencePage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-6 pb-24 md:pb-6">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="w-20 h-20 rounded-2xl gradient-hero flex items-center justify-center mx-auto mb-6 shadow-glow">
          <span className="text-4xl">🌿</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">About Voluntaura</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Connecting passionate volunteers with meaningful opportunities to make a difference in their communities.
        </p>
      </div>

      {/* Resources Section */}
      <Card className="card-elevated mb-8">
        <CardContent className="p-6 md:p-8">
          <h2 className="text-xl font-semibold mb-4">Resources</h2>
          <div className="grid gap-4">
            <a
              href="/documentation"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <ExternalLink className="w-5 h-5 text-primary" />
              </div>
              <span className="font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                TSA Documentation
              </span>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Mission Section */}
      <Card className="card-elevated mb-8">
        <CardContent className="p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Our Mission</h2>
              <p className="text-muted-foreground">
                Voluntaura was created to bridge the gap between willing volunteers and organizations in need.
                We believe everyone has something valuable to contribute, and finding the right opportunity
                should be as easy as swiping right. Our platform uses smart matching to connect you with
                causes that align with your passions, skills, and availability.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Values Grid */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <Card className="card-elevated">
          <CardContent className="p-6">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center mb-4">
              <Heart className="w-5 h-5 text-success" />
            </div>
            <h3 className="font-semibold mb-2">Community First</h3>
            <p className="text-sm text-muted-foreground">
              We prioritize building strong, connected communities through meaningful volunteer experiences.
            </p>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardContent className="p-6">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center mb-4">
              <Users className="w-5 h-5 text-warning" />
            </div>
            <h3 className="font-semibold mb-2">Inclusive Access</h3>
            <p className="text-sm text-muted-foreground">
              Volunteering should be accessible to everyone, regardless of experience or background.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="text-center p-4">
          <p className="text-3xl font-bold text-primary">500+</p>
          <p className="text-sm text-muted-foreground">Opportunities</p>
        </div>
        <div className="text-center p-4">
          <p className="text-3xl font-bold text-primary">10k+</p>
          <p className="text-sm text-muted-foreground">Volunteers</p>
        </div>
        <div className="text-center p-4">
          <p className="text-3xl font-bold text-primary">150+</p>
          <p className="text-sm text-muted-foreground">Organizations</p>
        </div>
      </div>

      {/* Contact Section */}
      <Card className="card-elevated">
        <CardContent className="p-6 md:p-8">
          <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Mail className="w-5 h-5" />
              <span>hello@voluntaura.com</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <MapPin className="w-5 h-5" />
              <span>Spring, Texas</span>
            </div>
          </div>
          <Button className="w-full sm:w-auto">
            <Mail className="w-4 h-4 mr-2" />
            Contact Us
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}