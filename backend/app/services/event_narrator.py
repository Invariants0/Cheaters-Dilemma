"""
Event Narrator - Convert simulation events to human-readable English narratives.
"""

from typing import Dict, Any, List


class EventNarrator:
    """Converts simulation events into human-readable narratives."""
    
    @staticmethod
    def narrate_event(event: Dict[str, Any]) -> str:
        """Convert a single event to human-readable text."""
        turn = event.get("turn", 0)
        actor = event.get("actor", -1)
        action = event.get("action", "UNKNOWN")
        target = event.get("target")
        outcome = event.get("outcome", "unknown")
        details = event.get("details", {})
        
        # Build narrative based on action type
        if action == "WORK":
            gain = details.get("gain", 0)
            return f"Turn {turn}: Agent {actor} worked and earned {gain} tokens"
        
        elif action == "REST":
            heal = details.get("heal", 0)
            new_health = details.get("new_health", 0)
            return f"Turn {turn}: Agent {actor} rested and healed {heal} health (now at {new_health} HP)"
        
        elif action == "STEAL":
            if outcome == "success":
                amount = details.get("amount", 0)
                reason = details.get("reason", "")
                if reason == "caught_after_success":
                    penalty = details.get("penalty", 0)
                    return f"Turn {turn}: Agent {actor} stole {amount} tokens from Agent {target} but was caught and penalized {penalty} tokens"
                else:
                    return f"Turn {turn}: Agent {actor} successfully stole {amount} tokens from Agent {target}"
            else:
                penalty = details.get("penalty", 0)
                return f"Turn {turn}: Agent {actor} failed to steal from Agent {target} and lost {penalty} tokens"
        
        elif action == "ATTACK":
            if outcome == "success":
                reason = details.get("reason", "")
                if reason == "target_eliminated":
                    loot = details.get("loot", 0)
                    damage = details.get("damage", 0)
                    return f"Turn {turn}: Agent {actor} attacked and ELIMINATED Agent {target}, dealing {damage} damage and looting {loot} tokens"
                else:
                    damage = details.get("damage", 0)
                    target_health = details.get("target_health", 0)
                    return f"Turn {turn}: Agent {actor} attacked Agent {target}, dealing {damage} damage (target now at {target_health} HP)"
            else:
                penalty = details.get("penalty", 0)
                return f"Turn {turn}: Agent {actor}'s attack on Agent {target} failed and lost {penalty} tokens"
        
        elif action == "COALITION_ATTACK":
            coalition_size = details.get("coalition_size", 0)
            if outcome == "success":
                reason = details.get("reason", "")
                if reason == "target_eliminated":
                    loot = details.get("loot", 0)
                    damage = details.get("damage", 0)
                    loot_per = details.get("loot_per_actor", 0)
                    return f"Turn {turn}: Agent {actor} and {coalition_size-1} allies launched a coalition attack and ELIMINATED Agent {target}, dealing {damage} damage and looting {loot} tokens ({loot_per} each)"
                else:
                    damage = details.get("damage", 0)
                    target_health = details.get("target_health", 0)
                    return f"Turn {turn}: Agent {actor} and {coalition_size-1} allies attacked Agent {target}, dealing {damage} damage (target now at {target_health} HP)"
            else:
                penalty = details.get("penalty", 0)
                return f"Turn {turn}: Coalition attack by Agent {actor} and {coalition_size-1} allies on Agent {target} failed, each lost {penalty} tokens"
        
        elif action == "FORM_ALLIANCE":
            if outcome == "success":
                partner = details.get("partner", target)
                return f"Turn {turn}: Agent {actor} formed an ALLIANCE with Agent {partner}"
            else:
                return f"Turn {turn}: Agent {actor} failed to form alliance with Agent {target} (already allied)"
        
        elif action == "BREAK_ALLIANCE":
            if outcome == "success":
                partner = details.get("partner", target)
                return f"Turn {turn}: Agent {actor} BROKE alliance with Agent {partner}"
            else:
                return f"Turn {turn}: Agent {actor} tried to break alliance with Agent {target} but no alliance existed"
        
        elif action == "TRADE":
            if outcome == "success":
                actor_gave = details.get("actor_gave", 0)
                actor_received = details.get("actor_received", 0)
                return f"Turn {turn}: Agent {actor} traded {actor_gave} tokens with Agent {target} for {actor_received} tokens"
            else:
                reason = details.get("reason", "")
                return f"Turn {turn}: Trade between Agent {actor} and Agent {target} failed ({reason})"
        
        elif action == "MOVE":
            from_pos = details.get("from", (0, 0))
            to_pos = details.get("to", (0, 0))
            return f"Turn {turn}: Agent {actor} moved from {from_pos} to {to_pos}"
        
        elif action == "PROPOSE_RULE":
            if outcome == "accepted":
                proposal_id = details.get("proposal_id")
                return f"Turn {turn}: Agent {actor} proposed a rule change (Proposal #{proposal_id})"
            else:
                return f"Turn {turn}: Agent {actor}'s rule proposal was rejected"
        
        elif action == "VOTE_RULE":
            if outcome == "accepted":
                return f"Turn {turn}: Agent {actor} voted on a rule proposal"
            else:
                return f"Turn {turn}: Agent {actor}'s vote was rejected"
        
        elif action == "RULE_CHANGE":
            proposal = details.get("proposal", {})
            key = proposal.get("key", "unknown")
            value = proposal.get("value", "unknown")
            proposer = proposal.get("actor", -1)
            return f"Turn {turn}: RULE CHANGED by Agent {proposer}: {key} = {value}"
        
        elif action == "DO_NOTHING":
            return f"Turn {turn}: Agent {actor} did nothing"
        
        else:
            return f"Turn {turn}: Agent {actor} performed {action} (outcome: {outcome})"
    
    @staticmethod
    def narrate_events(events: List[Dict[str, Any]], max_events: int = None) -> List[str]:
        """Convert a list of events to human-readable narratives."""
        narratives = []
        events_to_process = events[:max_events] if max_events else events
        
        for event in events_to_process:
            narrative = EventNarrator.narrate_event(event)
            narratives.append(narrative)
        
        return narratives
    
    @staticmethod
    def print_narrative(events: List[Dict[str, Any]], max_events: int = None):
        """Print human-readable narratives to console."""
        narratives = EventNarrator.narrate_events(events, max_events)
        
        print("="*80)
        print("SIMULATION NARRATIVE - Human-Readable Event Log")
        print("="*80)
        print()
        
        for narrative in narratives:
            print(narrative)
        
        print()
        print("="*80)
        print(f"Total Events: {len(events)}")
        if max_events and len(events) > max_events:
            print(f"(Showing first {max_events} events)")
        print("="*80)
    
    @staticmethod
    def get_summary_stats(events: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Get summary statistics from events."""
        stats = {
            "total_events": len(events),
            "eliminations": 0,
            "alliances_formed": 0,
            "alliances_broken": 0,
            "successful_steals": 0,
            "failed_steals": 0,
            "successful_attacks": 0,
            "failed_attacks": 0,
            "coalition_attacks": 0,
            "trades": 0,
            "rule_changes": 0,
        }
        
        for event in events:
            action = event.get("action", "")
            outcome = event.get("outcome", "")
            details = event.get("details", {})
            
            if action == "ATTACK" and outcome == "success" and details.get("reason") == "target_eliminated":
                stats["eliminations"] += 1
            
            if action == "ATTACK" and outcome == "success":
                stats["successful_attacks"] += 1
            elif action == "ATTACK" and outcome == "failed":
                stats["failed_attacks"] += 1
            
            if action == "STEAL" and outcome == "success":
                stats["successful_steals"] += 1
            elif action == "STEAL" and outcome == "failed":
                stats["failed_steals"] += 1
            
            if action == "FORM_ALLIANCE" and outcome == "success":
                stats["alliances_formed"] += 1
            
            if action == "BREAK_ALLIANCE" and outcome == "success":
                stats["alliances_broken"] += 1
            
            if action == "COALITION_ATTACK":
                stats["coalition_attacks"] += 1
            
            if action == "TRADE" and outcome == "success":
                stats["trades"] += 1
            
            if action == "RULE_CHANGE":
                stats["rule_changes"] += 1
        
        return stats
    
    @staticmethod
    def print_summary(events: List[Dict[str, Any]]):
        """Print summary statistics."""
        stats = EventNarrator.get_summary_stats(events)
        
        print("\n" + "="*80)
        print("SIMULATION SUMMARY STATISTICS")
        print("="*80)
        print(f"Total Events: {stats['total_events']}")
        print(f"Eliminations: {stats['eliminations']}")
        print(f"Alliances Formed: {stats['alliances_formed']}")
        print(f"Alliances Broken: {stats['alliances_broken']}")
        print(f"Successful Steals: {stats['successful_steals']}")
        print(f"Failed Steals: {stats['failed_steals']}")
        print(f"Successful Attacks: {stats['successful_attacks']}")
        print(f"Failed Attacks: {stats['failed_attacks']}")
        print(f"Coalition Attacks: {stats['coalition_attacks']}")
        print(f"Trades: {stats['trades']}")
        print(f"Rule Changes: {stats['rule_changes']}")
        print("="*80)
