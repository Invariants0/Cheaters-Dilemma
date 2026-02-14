from __future__ import annotations

from dataclasses import dataclass
from random import Random

from ..core.rules import RuleSet


@dataclass
class ConflictResolver:
    rules: RuleSet

    def resolve_work(self, actor: int, token_balances: dict[int, int], rng: Random) -> dict[str, object]:
        low, high = self.rules.values.get("work_income", [2, 4])
        gain = rng.randint(int(low), int(high))
        token_balances[actor] += gain
        return {"success": True, "gain": gain}

    def resolve_steal(
        self,
        actor: int,
        target: int,
        token_balances: dict[int, int],
        strength: dict[int, int],
        rng: Random,
    ) -> dict[str, object]:
        if token_balances.get(target, 0) <= 0:
            return {"success": False, "reason": "target_has_no_resources", "amount": 0}

        steal_cap = int(self.rules.values.get("steal_amount", 3))
        take = min(steal_cap, token_balances[target])
        base = float(self.rules.values.get("steal_success_base", 0.45))
        catch_prob = float(self.rules.values.get("steal_catch_prob", 0.25))
        strength_edge = (strength[actor] - strength[target]) * 0.03
        success_p = min(0.9, max(0.05, base + strength_edge))

        if rng.random() < success_p:
            token_balances[target] -= take
            token_balances[actor] += take
            if rng.random() < catch_prob:
                penalty = min(token_balances[actor], int(self.rules.values.get("steal_catch_penalty", 2)))
                token_balances[actor] -= penalty
                return {
                    "success": True,
                    "reason": "caught_after_success",
                    "amount": take,
                    "penalty": penalty,
                }
            return {"success": True, "reason": "clean_success", "amount": take}

        fail_penalty = min(token_balances[actor], int(self.rules.values.get("steal_fail_penalty", 1)))
        token_balances[actor] -= fail_penalty
        return {"success": False, "reason": "failed", "amount": 0, "penalty": fail_penalty}

    def resolve_attack(
        self,
        actor: int,
        target: int,
        token_balances: dict[int, int],
        strength: dict[int, int],
        alive: set[int],
        rng: Random,
    ) -> dict[str, object]:
        cost = int(self.rules.values.get("attack_cost", 5))
        token_balances[actor] -= cost

        base = float(self.rules.values.get("attack_success_base", 0.12))
        edge = (strength[actor] - strength[target]) * 0.04
        success_p = min(0.75, max(0.01, base + edge))

        if rng.random() < success_p:
            if target in alive:
                alive.remove(target)
            loot_ratio = float(self.rules.values.get("attack_loot_ratio", 0.4))
            loot = int(token_balances[target] * loot_ratio)
            token_balances[target] -= loot
            token_balances[actor] += loot
            return {"success": True, "reason": "target_eliminated", "loot": loot}

        recoil = min(token_balances[actor], int(self.rules.values.get("attack_fail_penalty", 2)))
        token_balances[actor] -= recoil
        return {"success": False, "reason": "attack_failed", "penalty": recoil}
