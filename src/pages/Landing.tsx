 import { useNavigate } from 'react-router-dom';
 import { Button } from '@/components/ui/button';
 import { MapPin, Heart, Users, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
 
 export default function LandingPage() {
   const navigate = useNavigate();
 
   const features = [
     {
       icon: MapPin,
       title: 'Discover Locally',
       description: 'Find volunteer opportunities near you with our interactive map.',
     },
     {
       icon: Heart,
       title: 'Smart Matching',
       description: 'Swipe through opportunities tailored to your interests and availability.',
     },
     {
       icon: Users,
       title: 'Track Progress',
       description: 'Manage your volunteer journey and celebrate your impact.',
     },
   ];
 
   const benefits = [
     'Connect with 500+ verified organizations',
     'Find opportunities that match your schedule',
     'Track your volunteer hours and impact',
     'Join a community of 10,000+ volunteers',
   ];
 
   return (
     <div className="min-h-screen bg-background">
       {/* Hero Section */}
       <section className="relative overflow-hidden">
         <div className="absolute inset-0 gradient-hero opacity-5" />
         <div className="container mx-auto px-4 py-16 md:py-24 relative">
           <div className="max-w-3xl mx-auto text-center">
             {/* Logo */}
             <div className="w-20 h-20 rounded-2xl gradient-hero flex items-center justify-center mx-auto mb-8 shadow-glow">
               <span className="text-4xl">🌿</span>
             </div>
 
             {/* Headline */}
             <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
               Make a Difference with{' '}
               <span className="text-primary">Voluntaura</span>
             </h1>
 
             <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
               Discover meaningful volunteer opportunities in your community. 
               Match with causes you care about and start making an impact today.
             </p>
 
             {/* CTA Button */}
             <Button
               size="lg"
               className="text-lg px-8 py-6 rounded-xl shadow-glow"
               onClick={() => navigate('/discover')}
             >
               Find Volunteer Opportunities
               <ArrowRight className="w-5 h-5 ml-2" />
             </Button>
 
             {/* Social Proof */}
             <p className="text-sm text-muted-foreground mt-6">
               <Sparkles className="w-4 h-4 inline mr-1" />
               Join 10,000+ volunteers making a difference
             </p>
           </div>
         </div>
       </section>
 
       {/* Features Section */}
       <section className="py-16 md:py-24 bg-muted/30">
         <div className="container mx-auto px-4">
           <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
             How Voluntaura Works
           </h2>
 
           <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
             {features.map((feature, index) => (
               <div
                 key={feature.title}
                 className="card-elevated p-6 text-center group hover:shadow-lg transition-shadow"
               >
                 <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                   <feature.icon className="w-7 h-7 text-primary" />
                 </div>
                 <div className="text-sm text-primary font-medium mb-2">
                   Step {index + 1}
                 </div>
                 <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                 <p className="text-muted-foreground text-sm">
                   {feature.description}
                 </p>
               </div>
             ))}
           </div>
         </div>
       </section>
 
       {/* Benefits Section */}
       <section className="py-16 md:py-24">
         <div className="container mx-auto px-4">
           <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">
             <div className="flex-1">
               <h2 className="text-2xl md:text-3xl font-bold mb-6">
                 Why Choose Voluntaura?
               </h2>
               <ul className="space-y-4">
                 {benefits.map((benefit) => (
                   <li key={benefit} className="flex items-start gap-3">
                     <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                     <span className="text-muted-foreground">{benefit}</span>
                   </li>
                 ))}
               </ul>
               <Button
                 variant="outline"
                 className="mt-8"
                 onClick={() => navigate('/discover')}
               >
                 Get Started
                 <ArrowRight className="w-4 h-4 ml-2" />
               </Button>
             </div>
 
             {/* Decorative Card Stack */}
             <div className="flex-1 relative h-64 w-full max-w-sm">
               <div className="absolute top-4 left-4 right-4 bottom-0 rounded-2xl bg-primary/5 border border-primary/10" />
               <div className="absolute top-2 left-2 right-2 bottom-2 rounded-2xl bg-primary/10 border border-primary/20" />
               <div className="absolute inset-0 rounded-2xl gradient-hero flex items-center justify-center shadow-glow">
                 <div className="text-center text-primary-foreground">
                   <span className="text-5xl mb-2 block">🌍</span>
                   <p className="font-semibold">Start Your Journey</p>
                 </div>
               </div>
             </div>
           </div>
         </div>
       </section>
 
       {/* Final CTA */}
       <section className="py-16 md:py-24 bg-muted/30">
         <div className="container mx-auto px-4 text-center">
           <h2 className="text-2xl md:text-3xl font-bold mb-4">
             Ready to Make an Impact?
           </h2>
           <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
             Your community needs you. Find the perfect volunteer opportunity 
             and start contributing today.
           </p>
           <Button
             size="lg"
             className="text-lg px-8 py-6 rounded-xl shadow-glow"
             onClick={() => navigate('/discover')}
           >
             Find Volunteer Opportunities
             <ArrowRight className="w-5 h-5 ml-2" />
           </Button>
         </div>
       </section>
 
       {/* Footer */}
       <footer className="py-8 border-t">
         <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
           <p>© 2024 Voluntaura. Making volunteering accessible for everyone.</p>
         </div>
       </footer>
     </div>
   );
 }