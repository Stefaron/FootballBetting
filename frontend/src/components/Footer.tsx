import { Button } from "./Button";

export function Footer() {
  return (
    <footer className="py-20 border-t border-white/10 bg-background-secondary text-center">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-8">Ready to support your club?</h2>
        <Button size="lg" className="mb-12">Launch App</Button>
        
        <div className="flex justify-center gap-8 text-text-secondary text-sm">
          <a href="#" className="hover:text-white transition-colors">Twitter</a>
          <a href="#" className="hover:text-white transition-colors">Discord</a>
          <a href="#" className="hover:text-white transition-colors">Github</a>
        </div>
        <p className="mt-8 text-white/20 text-xs">© 2025 No-Loss Betting Protocol. All rights reserved.</p>
      </div>
    </footer>
  );
}
