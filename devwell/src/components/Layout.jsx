import * as React from "react";
import { useState } from "react";
import { Heart, Moon, Sun, Settings, User } from "lucide-react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { NavLink } from "react-router-dom";

// Utility function for className concatenation
const cn = (...classes) => classes.filter(Boolean).join(" ");

// Button Component
const Button = React.forwardRef(({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none transform transition duration-300 ease-in-out hover:scale-105";
  const variants = {
    default: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md",
    ghost: "text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-gray-700",
    outline: "border border-emerald-500 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-400 dark:text-emerald-300 dark:hover:bg-gray-700",
  };
  const sizes = {
    default: "h-10 px-4 py-2",
    icon: "h-10 w-10",
    lg: "h-12 px-8 py-3 text-lg",
  };

  const Comp = asChild ? "span" : "button"; // Use span for asChild to wrap NavLink
  return (
    <Comp
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

// Card Components
const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-lg border-green-100 dark:border-gray-700 transform transition duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn("text-lg font-semibold leading-none tracking-tight text-emerald-800 dark:text-emerald-200", className)} {...props} />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-gray-700 dark:text-gray-300", className)} {...props} />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

// Tabs Components
const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-green-100 dark:bg-gray-700 p-1 text-emerald-700 dark:text-emerald-300",
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-emerald-800 dark:data-[state=active]:text-emerald-200 data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

// Layout Component
const Layout = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="py-4 border-b border-green-200 dark:border-gray-700">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 shadow-md">
              <Heart className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
              DevWell
            </h1>
          </div>
          <nav className="flex items-center gap-4">
            <Button asChild variant="ghost">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  cn(
                    "text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-gray-700",
                    isActive && "bg-emerald-100 dark:bg-gray-700"
                  )
                }
              >
                Dashboard
              </NavLink>
            </Button>
            <Button asChild variant="ghost">
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  cn(
                    "text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-gray-700",
                    isActive && "bg-emerald-100 dark:bg-gray-700"
                  )
                }
              >
                Profile
              </NavLink>
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button asChild variant="ghost" size="icon">
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  cn(
                    "text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-gray-700 flex items-center justify-center h-10 w-10",
                    isActive && "bg-emerald-100 dark:bg-gray-700"
                  )
                }
              >
                <Settings className="h-4 w-4" />
              </NavLink>
            </Button>
            <Button asChild variant="ghost" size="icon">
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  cn(
                    "text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-gray-700 flex items-center justify-center h-10 w-10",
                    isActive && "bg-emerald-100 dark:bg-gray-700"
                  )
                }
              >
                <User className="h-4 w-4" />
              </NavLink>
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">{children}</div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-600 dark:text-gray-400 border-t border-green-200 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} DevWell. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-2">
            <NavLink
              to="/privacy"
              className={({ isActive }) =>
                cn(
                  "hover:text-emerald-600 dark:hover:text-emerald-400",
                  isActive && "text-emerald-600 dark:text-emerald-400"
                )
              }
            >
              Privacy Policy
            </NavLink>
            <NavLink
              to="/terms"
              className={({ isActive }) =>
                cn(
                  "hover:text-emerald-600 dark:hover:text-emerald-400",
                  isActive && "text-emerald-600 dark:text-emerald-400"
                )
              }
            >
              Terms of Service
            </NavLink>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
export { Tabs, TabsList, TabsTrigger, TabsContent, Button, Card, CardHeader, CardTitle, CardDescription, CardContent };