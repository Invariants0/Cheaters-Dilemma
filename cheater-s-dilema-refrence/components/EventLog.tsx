import React, { useEffect, useRef } from 'react';
import { GameLog } from '../types';

interface EventLogProps {
  logs: GameLog[];
}

const EventLog: React.FC<EventLogProps> = ({ logs }) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 h-full flex flex-col">
      <h3 className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest border-b border-slate-800 pb-2">
        World Events
      </h3>
      <div className="flex-1 overflow-y-auto scrollbar-hide space-y-2 pr-1">
        {logs.length === 0 && (
          <div className="text-slate-600 text-xs italic text-center mt-10">Simulation ready. Waiting for start...</div>
        )}
        {logs.map((log) => (
          <div key={log.id} className="text-xs animate-fade-in">
            <span className="text-slate-500 font-mono mr-2">[{log.tick}]</span>
            <span className={`
              ${log.type === 'combat' ? 'text-orange-400' : ''}
              ${log.type === 'death' ? 'text-red-500 font-bold' : ''}
              ${log.type === 'cheat' ? 'text-purple-400' : ''}
              ${log.type === 'win' ? 'text-yellow-400 font-bold text-sm' : ''}
              ${log.type === 'info' ? 'text-slate-300' : ''}
            `}>
              {log.message}
            </span>
          </div>
        ))}
        <div ref={endRef} />
      </div>
    </div>
  );
};

export default EventLog;