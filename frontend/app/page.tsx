import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold bg-[linear-gradient(to_right,red,orange,yellow,green)] py-5 bg-clip-text text-transparent drop-shadow-lg mb-6">
            <span className="block">The next generation of</span>
            <span className="block">learning—human-led,</span>
            <span className="block">AI-powered</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-8">
            One platform to analyze content and generate quizzes using AI.
            <br />
            Built for creators, educators, and teams who value speed and quality.
          </p>

          {/* Get Started Button */}
          <Link href="/upload">
            <button className="px-8 py-4 text-lg font-semibold rounded-full
              bg-gradient-to-r from-red-500 via-orange-500 to-yellow-400
              text-black hover:scale-105 transition-transform duration-300
              shadow-lg">
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
