import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Construction, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  features?: string[];
}

export function PlaceholderPage({ 
  title, 
  description, 
  icon = <Construction className="h-8 w-8" />,
  features = []
}: PlaceholderPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-gold to-yellow-400 p-4 mb-4">
            {icon}
          </div>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription className="text-lg">{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {features.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Coming Features:</h3>
              <ul className="space-y-2">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-gold rounded-full mr-3" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              This section is being built with AI-powered features and real-time functionality. 
              Continue chatting to help prioritize and build out this page!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild>
                <Link to="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Casino
                </Link>
              </Button>
              <Button variant="outline" className="border-gold text-gold hover:bg-gold/10">
                Request This Feature
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
