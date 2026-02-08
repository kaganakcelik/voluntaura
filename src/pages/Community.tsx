import { ExternalLink, MessageSquare, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const additionalSites = [
    {
        name: 'Volunteer Houston',
        url: 'https://volunteerhouston.org',
        description: 'Find volunteer opportunities in the greater Houston area.'
    },
    {
        name: 'The Woodlands Township Volunteer Opportunities',
        url: 'https://www.thewoodlandstownship-tx.gov/Explore-More/Volunteer',
        description: 'Explore various ways to give back within The Woodlands community.'
    }
];

export default function CommunityPage() {
    return (
        <div className="container mx-auto max-w-4xl px-4 py-6 pb-24 md:pb-6 animate-fade-in">
            {/* Hero Section */}
            <div className="text-center mb-12">
                <div className="w-20 h-20 rounded-2xl gradient-hero flex items-center justify-center mx-auto mb-6 shadow-glow">
                    <MessageSquare className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Community Resources</h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Explore more opportunities and share your thoughts to help us improve Voluntaura.
                </p>
            </div>

            {/* External Sites Section */}
            <div className="mb-12">
                <h2 className="text-2xl font-semibold mb-6">Additional Opportunities</h2>
                <div className="grid gap-6">
                    {additionalSites.map((site) => (
                        <Card key={site.url} className="card-elevated group overflow-hidden border-none bg-card/50 backdrop-blur-sm">
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                                            {site.name}
                                        </h3>
                                        <p className="text-muted-foreground">
                                            {site.description}
                                        </p>
                                    </div>
                                    <Button asChild variant="secondary" className="group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                                        <a href={site.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                            Visit Site <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Feedback Section */}
            <Card className="card-elevated border-none bg-gradient-to-br from-card to-secondary/20 shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <MessageSquare className="w-32 h-32" />
                </div>
                <CardHeader className="relative px-8 pt-8">
                    <CardTitle className="text-2xl">Feedback</CardTitle>
                    <CardDescription className="text-base">
                        Tell us about your experience or suggest new features. We'd love to hear from you!
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-8 relative">
                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Name
                                </label>
                                <Input placeholder="Your Name" className="bg-background/50 border-muted" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Email
                                </label>
                                <Input type="email" placeholder="email@example.com" className="bg-background/50 border-muted" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Message
                            </label>
                            <Textarea
                                placeholder="How can we make Voluntaura better for you?"
                                className="min-h-[120px] bg-background/50 border-muted resize-none"
                            />
                        </div>
                        <Button className="w-full md:w-auto h-12 px-8 gradient-hero hover:scale-[1.02] transition-transform duration-300 shadow-glow" type="button">
                            <Send className="w-4 h-4 mr-2" />
                            Send Feedback
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
