import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserCircle, LogOut, Building2, Hotel, Search } from "lucide-react";

export function Navbar() {
  const { user, logoutMutation } = useAuth();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/">
          <a className="flex items-center gap-2 font-semibold text-xl">
            <Hotel className="h-6 w-6" />
            TravelNest
          </a>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Button variant="ghost" asChild>
                <Link href="/search">
                  <Search className="h-5 w-5 mr-2" />
                  Find Hotels
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <UserCircle className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {user.isHotelOwner && (
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">
                        <Building2 className="h-4 w-4 mr-2" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => logoutMutation.mutate()}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button asChild>
              <Link href="/auth">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
