import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const Login = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      toast({
        title: t('common.success'),
        description: 'Successfully logged in!',
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
      toast({
        title: t('common.error'),
        description: err.message || 'Login failed',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-primary p-4">
      <div className="w-full max-w-md animate-bounce-in">
        <Card className="shadow-strong glass">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl font-bold text-white">D</span>
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">{t('auth.welcomeBack')}</CardTitle>
              <CardDescription>{t('auth.loginSubtitle')}</CardDescription>
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">{t('auth.email')}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="admin@dnothi.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t('auth.password')}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="password123"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-accent hover:opacity-90 transition-opacity" 
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {t('auth.loginButton')}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <Link 
                to="/forgot-password" 
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                {t('auth.forgotPassword')}
              </Link>
              
              <div className="text-sm text-muted-foreground">
                {t('auth.dontHaveAccount')}{' '}
                <Link 
                  to="/register" 
                  className="text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  {t('auth.register')}
                </Link>
              </div>
            </div>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground text-center mb-2">Demo Credentials:</p>
              <div className="text-xs space-y-1">
                <p><strong>System Admin:</strong> admin@dnothi.com / password123</p>
                <p><strong>Supervisor:</strong> supervisor@dnothi.com / password123</p>
                <p><strong>Agent:</strong> agent@dnothi.com / password123</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};