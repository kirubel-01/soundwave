
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Mic, LogIn, LogOut, User } from 'lucide-react';

const Navigation = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link to="/" className="flex items-center gap-2">
          <Mic className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold">Text to Speech</span>
        </Link>
        
        <nav className="ml-auto flex items-center gap-4">
          {user ? (
            <>
              <div className="text-sm text-muted-foreground">
                {user.email}
              </div>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <Button variant="default" size="sm" onClick={() => navigate('/auth')}>
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navigation;
