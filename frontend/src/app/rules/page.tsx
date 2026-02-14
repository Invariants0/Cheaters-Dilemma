"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api";
import { Ruleset, RuleHistory } from "@/lib/types";
import { GamePanel, GameButton, StatDisplay } from "@/components/GameUI";

export default function RulesPage() {
  const [ruleset, setRuleset] = useState<Ruleset | null>(null);
  const [history, setHistory] = useState<RuleHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [simulationId] = useState("default");

  useEffect(() => {
    const loadRules = async () => {
      try {
        const rulesData = await apiClient.getCurrentRules(simulationId);
        setRuleset(rulesData);
        const historyData = await apiClient.getRulesHistory(simulationId);
        setHistory(historyData);
      } catch (error) {
        console.error("Failed to load rules:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRules();
  }, [simulationId]);

  const ruleCategories = ruleset
    ? {
        economy: Object.entries(ruleset.rules)
          .filter(([k]) => k.includes("steal") || k.includes("resource") || k.includes("work"))
          .reduce((obj, [k, v]) => ({ ...obj, [k]: v }), {}),
        violence: Object.entries(ruleset.rules)
          .filter(([k]) => k.includes("attack") || k.includes("kill") || k.includes("strength"))
          .reduce((obj, [k, v]) => ({ ...obj, [k]: v }), {}),
        governance: Object.entries(ruleset.rules)
          .filter(([k]) => k.includes("vote") || k.includes("proposal") || k.includes("power"))
          .reduce((obj, [k, v]) => ({ ...obj, [k]: v }), {}),
      }
    : { economy: {}, violence: {}, governance: {} };

  return (
    <div className="w-full h-full overflow-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-full">
        {/* Left Panel - Rule Info */}
        <div className="lg:col-span-1 space-y-4">
          <GamePanel title="RULESET VERSION">
            <div className="text-[#eab308] font-mono text-2xl font-bold text-center py-4">
              v{ruleset?.version || "?"}
            </div>
            <StatDisplay label="Total Rules" value={ruleset ? Object.keys(ruleset.rules).length : 0} />
          </GamePanel>

          <GamePanel title="RULE CATEGORIES">
            <div className="space-y-2 text-xs font-mono">
              <div className="text-[#475569] uppercase font-bold">ECONOMY</div>
              <div className="text-[#94a3b8] text-xs">
                {Object.keys(ruleCategories.economy).length} rules
              </div>
              <div className="text-[#475569] uppercase font-bold mt-3">VIOLENCE</div>
              <div className="text-[#94a3b8] text-xs">
                {Object.keys(ruleCategories.violence).length} rules
              </div>
              <div className="text-[#475569] uppercase font-bold mt-3">GOVERNANCE</div>
              <div className="text-[#94a3b8] text-xs">
                {Object.keys(ruleCategories.governance).length} rules
              </div>
            </div>
          </GamePanel>

          <Link href="/" className="block">
            <GameButton className="w-full">BACK TO MENU</GameButton>
          </Link>
        </div>

        {/* Center - Rules Display */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-[#eab308] font-mono text-2xl">&gt; LOADING RULES... &lt;</div>
            </div>
          ) : (
            <div className="space-y-4 h-full overflow-y-auto">
              {/* Current Ruleset */}
              <GamePanel title="CURRENT RULESET">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Economy Rules */}
                  <div className="border border-[#eab308] p-4">
                    <div className="text-[#eab308] font-bold mb-2">ECONOMY</div>
                    <div className="space-y-1 text-xs text-[#94a3b8] font-mono">
                      {Object.entries(ruleCategories.economy).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span>{key}:</span>
                          <span className="text-[#475569]">{JSON.stringify(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Violence Rules */}
                  <div className="border border-[#ff0055] p-4">
                    <div className="text-[#ff0055] font-bold mb-2">VIOLENCE</div>
                    <div className="space-y-1 text-xs text-[#94a3b8] font-mono">
                      {Object.entries(ruleCategories.violence).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span>{key}:</span>
                          <span className="text-[#475569]">{JSON.stringify(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Governance Rules */}
                  <div className="border border-[#94a3b8] p-4">
                    <div className="text-[#94a3b8] font-bold mb-2">GOVERNANCE</div>
                    <div className="space-y-1 text-xs text-[#94a3b8] font-mono">
                      {Object.entries(ruleCategories.governance).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span>{key}:</span>
                          <span className="text-[#475569]">{JSON.stringify(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </GamePanel>

              {/* Rule History Timeline */}
              <GamePanel title="RULE CHANGE HISTORY">
                <div className="text-xs font-mono space-y-2 max-h-96 overflow-y-auto">
                  {history.length > 0 ? (
                    history.map((event, idx) => (
                      <div key={idx} className="border-l-2 border-[#eab308] pl-3 py-2 hover:bg-[#1a1f3a]">
                        <div className="flex justify-between">
                          <span className="text-[#eab308] font-bold">Turn {event.turn}</span>
                          <span className="text-[#475569]">{event.change_type}</span>
                        </div>
                        <div className="text-[#94a3b8] text-xs mt-1">
                          {event.description || `${event.key}: ${JSON.stringify(event.old_value)} → ${JSON.stringify(event.new_value)}`}
                        </div>
                        {event.changed_by && (
                          <div className="text-[#94a3b8] text-xs opacity-70 mt-1">
                            Proposed by Agent {event.changed_by}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-[#94a3b8] opacity-50">No rule changes yet</div>
                  )}
                </div>
              </GamePanel>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

