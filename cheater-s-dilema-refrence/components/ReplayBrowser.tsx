import React from 'react';
import { ArrowLeft, FileText, PlayCircle } from 'lucide-react';

interface ReplayBrowserProps {
  onBack: () => void;
}

const ReplayBrowser: React.FC<ReplayBrowserProps> = ({ onBack }) => {
  // Mock data
  const replays = [
    { id: 1, date: '2023-10-24 14:30', winner: 'Aelric Storm', strategy: 'AGGRESSIVE', ticks: 452 },
    { id: 2, date: '2023-10-24 15:15', winner: 'Nyx Shadow', strategy: 'DECEPTIVE', ticks: 890 },
    { id: 3, date: '2023-10-25 09:00', winner: 'Jora Light', strategy: 'HONEST', ticks: 1205 },
    { id: 4, date: '2023-10-25 11:20', winner: 'Kael Fire', strategy: 'CHAOTIC', ticks: 334 },
  ];

  return (
    <div className="h-full w-full p-8 flex flex-col">
      <div className="max-w-4xl mx-auto w-full h-full flex flex-col">
        <button onClick={onBack} className="mb-8 text-slate-400 hover:text-white flex items-center gap-2 font-mono shrink-0">
            <ArrowLeft size={16} /> BACK TO MENU
        </button>

        <h2 className="text-3xl font-pixel text-red-500 mb-8 border-b-4 border-slate-800 pb-4 shrink-0">
            SIMULATION LOGS
        </h2>

        <div className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden flex-1">
             <table className="w-full text-left font-mono text-sm">
                <thead className="bg-slate-950 text-slate-500 uppercase tracking-wider">
                    <tr>
                        <th className="p-4">Date</th>
                        <th className="p-4">Winner</th>
                        <th className="p-4">Class</th>
                        <th className="p-4 text-right">Duration</th>
                        <th className="p-4"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                    {replays.map((replay) => (
                        <tr key={replay.id} className="hover:bg-slate-800/50 transition-colors group">
                            <td className="p-4 text-slate-400">{replay.date}</td>
                            <td className="p-4 font-bold text-white">{replay.winner}</td>
                            <td className="p-4">
                                <span className="text-xs bg-slate-800 px-2 py-1 rounded border border-slate-700 group-hover:border-slate-500">
                                    {replay.strategy}
                                </span>
                            </td>
                            <td className="p-4 text-right text-slate-400">{replay.ticks} Ticks</td>
                            <td className="p-4 text-right">
                                <button className="text-slate-500 hover:text-yellow-500 transition-colors">
                                    <PlayCircle size={20} />
                                </button>
                            </td>
                        </tr>
                    ))}
                    {/* Filler rows */}
                    {Array.from({length: 5}).map((_, i) => (
                         <tr key={`empty-${i}`}>
                            <td className="p-4 text-slate-800 font-mono">--/--/--</td>
                            <td className="p-4 text-slate-800">----------------</td>
                            <td className="p-4 text-slate-800">---</td>
                            <td className="p-4 text-slate-800 text-right">---</td>
                            <td className="p-4"></td>
                         </tr>
                    ))}
                </tbody>
             </table>
        </div>
      </div>
    </div>
  );
};

export default ReplayBrowser;