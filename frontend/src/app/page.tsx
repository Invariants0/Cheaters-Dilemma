import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          The Cheater's Dilemma
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          A multi-agent game-theoretic simulation where winning corrupts the rules
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">About</h2>
          <p className="text-blue-800">
            Explore emergent behaviors when rational agents compete in a world where cheating is often the fastest strategy,
            but rules themselves can be rewritten as strategic assets. Violence is possible but costly, and power emerges
            through alliances, strength, and governance capture.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Start a Simulation</h3>
          <p className="text-gray-600 mb-4">
            Launch a new multi-agent simulation with customizable parameters.
            Watch as agents compete, form alliances, and manipulate governance.
          </p>
          <Link
            href="/simulation"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Start Simulation
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">View Past Runs</h3>
          <p className="text-gray-600 mb-4">
            Browse completed simulations, analyze outcomes, and replay
            historical runs to understand emergent strategies.
          </p>
          <Link
            href="/replays"
            className="inline-block bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            View Replays
          </Link>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Agent Strategies</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-md">
            <h4 className="font-semibold text-gray-900">Greedy</h4>
            <p className="text-sm text-gray-600">Works honestly but steals from the rich</p>
          </div>
          <div className="bg-white p-4 rounded-md">
            <h4 className="font-semibold text-gray-900">Cheater</h4>
            <p className="text-sm text-gray-600">Aggressive theft and rule manipulation</p>
          </div>
          <div className="bg-white p-4 rounded-md">
            <h4 className="font-semibold text-gray-900">Politician</h4>
            <p className="text-sm text-gray-600">Governance-focused with strategic voting</p>
          </div>
          <div className="bg-white p-4 rounded-md">
            <h4 className="font-semibold text-gray-900">Warlord</h4>
            <p className="text-sm text-gray-600">Late-game eliminations and attack buffs</p>
          </div>
        </div>
      </div>
    </div>
  );
}
