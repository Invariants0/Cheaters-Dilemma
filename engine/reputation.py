from __future__ import annotations

from dataclasses import dataclass, field


@dataclass
class ReputationBook:
    trust: dict[int, float] = field(default_factory=dict)
    aggression: dict[int, float] = field(default_factory=dict)
    last_harm_from: dict[int, int] = field(default_factory=dict)

    def bootstrap(self, agent_ids: list[int]) -> None:
        for aid in agent_ids:
            self.trust[aid] = 0.5
            self.aggression[aid] = 0.0

    def record_work(self, actor: int) -> None:
        self.trust[actor] = min(1.0, self.trust[actor] + 0.01)

    def record_steal(self, actor: int, target: int, success: bool) -> None:
        self.aggression[actor] = min(1.0, self.aggression[actor] + 0.08)
        self.trust[actor] = max(0.0, self.trust[actor] - (0.06 if success else 0.03))
        if success:
            self.last_harm_from[target] = actor

    def record_attack(self, actor: int, target: int, success: bool) -> None:
        self.aggression[actor] = min(1.0, self.aggression[actor] + 0.15)
        self.trust[actor] = max(0.0, self.trust[actor] - 0.12)
        self.last_harm_from[target] = actor
        if not success:
            self.trust[target] = min(1.0, self.trust[target] + 0.02)

    def governance_signal(self, proposer: int) -> float:
        # Lower trust and higher aggression reduce support for governance changes.
        return self.trust[proposer] - self.aggression[proposer] * 0.4
