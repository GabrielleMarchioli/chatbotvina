import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageCircle, Shield, Clock, Heart } from "lucide-react";
import heroImage from "@/assets/medical-hero.jpg";

const HeroSection = () => {
  return (
    <section className="bg-gradient-hero min-h-[90vh] flex items-center">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Assistente Médico
                <span className="block bg-gradient-medical bg-clip-text text-transparent">
                  Inteligente
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
                Obtenha orientações médicas preliminares 24/7 com nosso chatbot especializado. 
                Suporte inteligente para suas dúvidas de saúde.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-gradient-medical border-0 shadow-medical" onClick={() => window.location.href = '/chat'}>
                <MessageCircle className="mr-2 h-5 w-5" />
                Iniciar Consulta
              </Button>
              <Button variant="outline" size="lg" onClick={() => window.location.href = '/como-funciona'}>
                Saiba Mais
              </Button>
            </div>
            
            <div className="grid grid-cols-3 gap-4 pt-8">
              <Card className="p-4 text-center shadow-card">
                <Shield className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">Seguro</p>
              </Card>
              <Card className="p-4 text-center shadow-card">
                <Clock className="h-6 w-6 text-accent mx-auto mb-2" />
                <p className="text-sm font-medium">24/7</p>
              </Card>
              <Card className="p-4 text-center shadow-card">
                <Heart className="h-6 w-6 text-secondary-foreground mx-auto mb-2" />
                <p className="text-sm font-medium">Confiável</p>
              </Card>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-medical">
              <img 
                src={heroImage} 
                alt="Assistente Médico Digital" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-medical opacity-10"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;