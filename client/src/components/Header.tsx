import { Link, useLocation } from "wouter";
import { Shield, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ConnectButton, useCurrentAccount, useDisconnectWallet } from "@mysten/dapp-kit";

function WalletButton() {
  const currentAccount = useCurrentAccount();
  const [, setLocation] = useLocation();
  const { mutate: disconnect } = useDisconnectWallet();

  if (!currentAccount) {
    return <ConnectButton data-testid="button-connect-wallet" />;
  }

  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="default"
          className="gap-2"
          data-testid="button-profile"
        >
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">Profile</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">My Wallet</p>
            <p className="text-xs leading-none text-muted-foreground font-mono">
              {truncateAddress(currentAccount.address)}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => setLocation("/profile")}
          data-testid="menu-item-profile"
        >
          <User className="mr-2 h-4 w-4" />
          <span>View Profile</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => disconnect()}
          className="text-destructive focus:text-destructive"
          data-testid="menu-item-disconnect"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Disconnect Wallet</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Header() {
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" data-testid="link-home">
          <div className="flex items-center gap-2 font-bold text-xl hover-elevate active-elevate-2 rounded-md px-3 py-2 -ml-3 transition-colors cursor-pointer">
            <Shield className="h-6 w-6 text-primary" />
            <span className="hidden sm:inline">On-Chain CV Proof Vault</span>
            <span className="sm:hidden">CV Vault</span>
          </div>
        </Link>
        
        <nav className="flex items-center gap-2">
          <Link href="/register">
            <Button
              variant={location === "/register" ? "default" : "ghost"}
              size="default"
              data-testid="button-register"
              asChild
            >
              <span>Register CV</span>
            </Button>
          </Link>
          <Link href="/verify">
            <Button
              variant={location === "/verify" ? "default" : "ghost"}
              size="default"
              data-testid="button-verify"
              asChild
            >
              <span>Verify</span>
            </Button>
          </Link>
          <WalletButton />
        </nav>
      </div>
    </header>
  );
}
