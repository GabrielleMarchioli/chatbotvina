import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Shield, Clock, Users, Zap, HeartHandshake } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "IA Especializada",
    description: "Algoritmos treinados com conhecimento médico atualizado para respostas precisas."
  },
  {
    icon: Shield,
    title: "Privacidade Garantida",
    description: "Suas informações de saúde são protegidas com criptografia de ponta."
  },
  {
    icon: Clock,
    title: "Disponível 24/7",
    description: "Acesso a orientações médicas a qualquer hora do dia ou da noite."
  },
  {
    icon: Users,
    title: "Para Toda Família",
    description: "Orientações adequadas para diferentes idades e condições de saúde."
  },
  {
    icon: Zap,
    title: "Respostas Rápidas",
    description: "Obtenha orientações instantâneas para suas dúvidas de saúde."
  },
  {
    icon: HeartHandshake,
    title: "Suporte Humanizado",
    description: "Interface amigável que simula uma conversa com um profissional."
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Por que escolher o MediBot?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tecnologia avançada combinada com conhecimento médico para oferecer 
            o melhor suporte em saúde digital.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="shadow-card hover:shadow-medical transition-shadow duration-300">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-gradient-medical rounded-full w-fit">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;