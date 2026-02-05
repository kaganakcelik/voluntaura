import { NavLink as RouterNavLink, useLocation } from 'react-router-dom';
import { Map, Heart, List, User, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const navItems = [
  { to: '/discover', icon: Map, label: 'Discover' },
  { to: '/swipe', icon: Heart, label: 'Match' },
  { to: '/list', icon: List, label: 'My List' },
  { to: '/reference', icon: Info, label: 'Reference' },
];

export function Navigation() {
  const location = useLocation();

  return (
    <>
      {/* Desktop Navigation */}
      <header className="hidden md:flex fixed top-0 left-0 right-0 h-16 bg-card/95 backdrop-blur-md border-b z-50">
        <div className="container mx-auto flex items-center justify-between px-6">
          {/* Logo */}
          <RouterNavLink to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl gradient-hero flex items-center justify-center shadow-glow transition-transform group-hover:scale-105">
              <span className="text-lg">🌿</span>
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight">
              Voluntaura
            </span>
          </RouterNavLink>

          {/* Nav Links */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <RouterNavLink
                  key={item.to}
                  to={item.to}
                  className={cn(
                    'nav-item flex-row gap-2 px-4 py-2',
                    isActive && 'nav-item-active'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </RouterNavLink>
              );
            })}
          </nav>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 p-1.5 rounded-full hover:bg-secondary transition-colors">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="https://upload.wikimedia.org/wikipedia/commons/9/91/Bill_Gates_1977.png" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    JD
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-card/95 backdrop-blur-md border-t z-50 pb-safe">
        <div className="flex items-center justify-around h-full px-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <RouterNavLink
                key={item.to}
                to={item.to}
                className={cn(
                  'nav-item',
                  isActive && 'nav-item-active'
                )}
              >
                <item.icon className="w-6 h-6" />
                <span className="text-xs">{item.label}</span>
              </RouterNavLink>
            );
          })}

          {/* Mobile User Avatar */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="nav-item">
                <Avatar className="w-6 h-6">
                  <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    JD
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs">Profile</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      {/* Spacers */}
      <div className="hidden md:block h-16" />
    </>
  );
}
