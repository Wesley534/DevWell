import { Button } from '../components/ui/Button';
import { Heart, Brain, Zap, Leaf, Code } from 'lucide-react'; // Added relevant icons

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
      {/* Header for the Landing Page */}
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
            <Button variant="ghost" className="text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-gray-700">
              Features
            </Button>
            <Button variant="ghost" className="text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-gray-700">
              About
            </Button>
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md">
              <a href="/login">Login</a>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-5xl font-extrabold tracking-tight leading-tight text-emerald-800 dark:text-emerald-200">
            Code Smarter, Live Healthier
          </h2>
          <p className="text-xl text-emerald-700 dark:text-emerald-300">
            DevWell is your AI-powered companion for a balanced developer life.
            Track mental health, hydration, nutrition, and coding sessions to
            optimize your well-being and productivity.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white text-lg px-8 py-3 shadow-lg transform transition duration-300 ease-in-out hover:scale-105">
              <a href="/signup">Start Your Free Trial</a>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-emerald-500 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-400 dark:text-emerald-300 dark:hover:bg-gray-700 text-lg px-8 py-3 shadow-lg transform transition duration-300 ease-in-out hover:scale-105">
              <a href="#features">Learn More</a>
            </Button>
          </div>
        </div>
      </main>

      {/* Features Section - Briefly highlighting the core aspects */}
      <section id="features" className="container mx-auto px-4 py-16">
        <h3 className="text-4xl font-bold text-center mb-12 text-emerald-800 dark:text-emerald-200">
          How DevWell Transforms Your Day
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<Brain className="h-8 w-8 text-emerald-500" />}
            title="Mental Clarity"
            description="Track your mood and get AI insights to reduce stress and boost focus."
          />
          <FeatureCard
            icon={<Leaf className="h-8 w-8 text-emerald-500" />}
            title="Balanced Nutrition"
            description="Log meals, stay hydrated with smart reminders, and get healthy snack suggestions."
          />
          <FeatureCard
            icon={<Code className="h-8 w-8 text-emerald-500" />}
            title="Optimized Coding"
            description="Manage coding sessions, take smart breaks, and learn your productivity patterns."
          />
          <FeatureCard
            icon={<Zap className="h-8 w-8 text-emerald-500" />}
            title="Personalized AI"
            description="Receive tailored suggestions for breaks, posture, and wellness, adapting to you."
          />
        </div>
      </section>

      {/* Call to Action at the bottom */}
      <section className="bg-emerald-600 dark:bg-gray-800 py-16 text-white text-center">
        <div className="container mx-auto px-4 space-y-6">
          <h3 className="text-4xl font-bold">Ready to Elevate Your Developer Well-being?</h3>
          <p className="text-xl opacity-90">
            Join DevWell today and start your journey towards a healthier, more productive coding life.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Button asChild size="lg" className="bg-white text-emerald-700 hover:bg-gray-100 text-lg px-8 py-3 shadow-lg transform transition duration-300 ease-in-out hover:scale-105">
              <a href="/signup">Sign Up Now</a>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-emerald-700 text-lg px-8 py-3 shadow-lg transform transition duration-300 ease-in-out hover:scale-105">
              <a href="/login">Login</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-600 dark:text-gray-400 border-t border-green-200 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} DevWell. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-2">
            <a href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Helper component for features
const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center text-center space-y-4 border border-green-100 dark:border-gray-700 transform transition duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
    <div className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-800">
      {icon}
    </div>
    <h4 className="text-xl font-semibold text-emerald-800 dark:text-emerald-200">{title}</h4>
    <p className="text-gray-700 dark:text-gray-300">{description}</p>
  </div>
);

export default LandingPage;