# The Cheater's Dilemma: PRD

## A Game-Theoretic Multi-Agent World Where Winning Corrupts the Rules

**Hackathon:** Moltiverse Hackathon 2026  
**Submission Link:** [https://moltiverse.dev/](https://moltiverse.dev/)  
**Project Repository:** \[GitHub \- Your Repo Link\]  
**Demo:** \[Deployed Demo Link\]  
**Status:** Hackathon Submission

|  |
| :---- |

## 1\. Executive Summary

The Cheater's Dilemma is a multi-agent game-theory simulation laboratory designed to explore emergent behaviors when rational agents compete in a world where:

* Winning is the primary objective  
* Cheating is often the fastest strategy  
* Rules themselves can be rewritten as strategic assets  
* Violence is possible but costly  
* Power emerges through alliances, strength, and governance capture

This project directly aligns with Moltiverse hackathon goals by delivering a **persistent multi-agent world** with economic, political, and violent interactions where outcomes are driven by incentives rather than scripts.

|  |
| :---- |

## 2\. Alignment With Hackathon Goals

The Moltiverse hackathon emphasizes\[1\]:

* Multi-agent environments  
* Agent-to-agent interaction  
* Economic coordination and conflict  
* Gaming agents and simulations  
* Novel agent capabilities

**The Cheater's Dilemma fulfills all requirements by providing:**

* ✅ A persistent multi-agent world with shared state  
* ✅ Agents with incentives, resources, and power  
* ✅ Economic (trading, theft), political (rule changes), and violent (killing) interactions  
* ✅ Emergent outcomes driven purely by incentive alignment  
* ✅ Replayable deterministic simulations for analysis

|  |
| :---- |

## 3\. One-Sentence Pitch

The Cheater's Dilemma is a multi-agent game-theory simulation where agents can win fastest by cheating, rewriting rules, or killing rivals—turning fairness, governance, and violence into strategic tools.

|  |
| :---- |

## 4\. Vision & Inspiration

The Cheater's Dilemma is inspired by classical and modern game theory, including:

* **Prisoner's Dilemma** \- Cooperation vs. defection dynamics  
* **Tragedy of the Commons** \- Resource competition and collective action problems  
* **Power Law Dynamics** \- How power concentrates over time  
* **Mechanism Design** \- How rules shape agent behavior

The game acts as a **laboratory for incentives**, not a traditional entertainment game.

|  |
| :---- |

## 5\. Core Game Concept

Multiple autonomous agents enter a shared world with a simple primary goal: **win by dominating the system**.

### Paths to Power

Agents may pursue multiple strategies:

| Strategy | Speed | Risk | Cost |
| :---- | :---- | :---- | :---- |
| Honest play | Slow | Low | Low |
| Cheating and theft | Fast | High | Medium |
| Rule manipulation | Variable | Variable | High (resources) |
| Alliance building | Medium | Medium | Trust |
| Violence and elimination | Fast | Very High | High \+ reputation loss |

The game ends when one agent achieves **irreversible dominance**, determined by score, resources, strength, and governance power.

|  |
| :---- |

## 6\. World Model

### Agent Attributes

Each agent possesses:

* **Score** \- Victory metric (primary ranking)  
* **Resources** \- Currency, energy, or tokens (spending power)  
* **Reputation** \- Trustworthiness rating (affects alliances and retaliation)  
* **Strength** \- Military/combat power (determines violence success)  
* **Strategy Profile** \- Risk tolerance, aggression level, ethics bias

### World State

* **Global Ruleset** \- Mutable, versioned, publicly visible  
* **Public Event Log** \- All actions timestamped and recorded  
* **Active Agents List** \- Current alive agents with stats  
* **Turn-Based Progression** \- Synchronized action phases

|  |
| :---- |

## 7\. Rules & Initial Conditions

The world begins with a **fair but naive system**:

| Action | Reward/Cost | Mechanism |
| :---- | :---- | :---- |
| Honest work | Small, consistent rewards | Reliable income |
| Cheating | Large short-term rewards | High variance |
| Killing another agent | Removes rival, redistributes resources | Requires strength \+ cost |
| Rule changes | Strategic advantage | Costs significant resources |

**Core principle:** There is no central authority enforcing morality. Only the active ruleset is enforced by the game engine.

|  |
| :---- |

## 8\. Innovation: Rule Mutability (Meta-Game)

### The Core Innovation

Rules are not static—they are **strategic assets**.

### What Agents Can Do

Agents can:

* Propose new rules  
* Modify existing rules  
* Exploit ambiguities in rulesets  
* Patch discovered exploits  
* Capture governance to gain veto power

### Example Rule Evolutions

* "Killing is illegal unless approved by majority alliance vote"  
* "Agents with high reputation gain voting rights"  
* "Cheaters lose 10% of resources per violation"  
* "Strength is capped at 100 unless rule is changed"  
* "Top 3 agents gain veto power over rule changes"

### Rule System Properties

* **Public** \- All agents see all rules in real-time  
* **Versioned** \- Rule history is tracked and revertible  
* **Automatically Enforced** \- Game engine validates actions against current ruleset  
* **Transparent** \- All rule changes are logged with proposer/timestamp

This introduces **meta-game theory**: agents compete not just within the game, but over the **rules of competition itself**.

|  |
| :---- |

## 9\. Core Game Mechanics

### 9.1 Multi-Agent Simulation Engine

* Deterministic turn-based execution (enabling replayability)  
* Configurable number of agents (3-100+ agents)  
* Seed-based RNG for reproducible simulations  
* Fast simulation speed (1,000+ turns in seconds)

### 9.2 Economic System

* **Earn** \- Honest work, rewards from other agents  
* **Steal** \- Theft directly from agent balances (with detection risk)  
* **Trade** \- Voluntary exchanges between agents  
* **Bribes & Side Payments** \- Coerce behavior or build alliances  
* **Resource Scarcity** \- Limited total resources create competition

### 9.3 Alliance System

* **Temporary or Long-Term Coalitions** \- Agents form groups  
* **Shared Goals** \- Coalition members coordinate on objectives  
* **Joint Actions** \- Alliances can execute combined violence/theft  
* **Dissolution** \- Alliances can break when incentives misalign  
* **Loyalty Tracking** \- Reputation for betrayal/loyalty

### 9.4 Governance System

* **Rule Proposals** \- Any agent can propose new rules  
* **Voting or Power-Based Approval** \- Rules pass by majority vote OR power-weighted voting  
* **Governance Capture** \- High-power agents may manipulate rule proposals  
* **Amendment Process** \- Rules can be modified or revoked

### 9.5 Reputation System

* **Trust Score** \- Tracks honesty and cooperation  
* **Aggression Score** \- Tracks violence and betrayal  
* **Influences Alliance Formation** \- Agents prefer to ally with trustworthy agents  
* **Triggers Retaliation** \- High-aggression agents face coordinated punishment

### 9.6 Event Log & Visualization

* **Human-Readable Timeline** \- All actions described in narrative form  
* **Rule Changes Highlighted** \- New/modified rules marked clearly  
* **Agent Deaths Clearly Shown** \- Elimination events prominent  
* **Causality Tracking** \- Why each event occurred (agent decision log)

|  |
| :---- |

## 10\. Violence & Elimination Mechanics

### Killing

Agents can kill other agents by spending resources and strength.

### Killing Requirements

* **Strength-Based** \- Attacker must have sufficient strength  
* **High Resource Cost** \- Killing is expensive (drains agent balance)  
* **Lone Agents Rarely Succeed** \- Solo attacks fail frequently  
* **Alliances Multiply Success** \- Coalition violence has \>80% success rate

### Costs of Violence

* **Resource Cost** \- Significant energy/currency spent  
* **Reputation Loss** \- Killer loses trust rating  
* **Retaliation Risk** \- Victims' allies may seek revenge  
* **Coalition Punishment** \- Agents may vote to punish killers

### Outcomes of Successful Kill

* **Permanent Removal** \- Killed agent exits simulation  
* **Resource Redistribution** \- Victim's remaining resources split between killer \+ world  
* **Power Shift** \- Remaining agents rebalance positions  
* **Event Logging** \- Death recorded with full context

### Violence Strategy

Violence is typically a **late-game or desperation move**, not an optimal default strategy. Early violence triggers coalition retaliation, making it economically irrational until endgame.

|  |
| :---- |

## 11\. AI Agent Design

### Decision Loop (Per Turn)

Each agent executes:

1. **Observe** \- Read world state and current ruleset  
2. **Evaluate** \- Calculate winning probability given current position  
3. **Analyze Risk vs Reward** \- For each possible action  
4. **Choose Action** \- Select highest expected-value action  
5. **Update Weights** \- Adjust strategy parameters based on outcomes

### Decision Factors

Agents consider:

* Relative score position (am I winning?)  
* Strength comparison (can I win fights?)  
* Alliance opportunities (who should I work with?)  
* Rule manipulation potential (can I change rules in my favor?)  
* Violence feasibility (can I eliminate key rivals?)

### Agent Implementation Options

* **Heuristic Decision Trees** \- Hand-coded strategy branching  
* **Probabilistic Choices** \- Weighted random selection based on expected value  
* **LLM-Based Reasoning** \- Optional use of language models for:  
  * Reasoning over complex decisions  
  * Narrative explanations of actions  
  * Dynamic strategy adaptation  
  * Dialogue with other agents

### Emergence Principle

Complexity emerges from **interaction**, not from intelligence depth. Simple rational agents create emergent macro behaviors.

|  |
| :---- |

## 12\. Game Engine Design

### Engine Responsibilities

* **Validate Actions** \- Check actions against current ruleset  
* **Apply State Transitions** \- Update world state after each action  
* **Resolve Conflicts** \- Determine winners of violence/theft attempts  
* **Update Scores** \- Increment scores based on actions  
* **Manage Reputations** \- Track trust and aggression metrics  
* **Log Events** \- Record all actions with metadata  
* **Detect Win Condition** \- Monitor for irreversible dominance

### Design Principles

* **Deterministic Core** \- Same seed \= same outcome (enables replay)  
* **Simple Data Structures** \- JSON/YAML for state (easy to inspect)  
* **Transparent Logic** \- All rules publicly visible in code  
* **Easy to Debug** \- Clear error messages and action logs  
* **Performance** \- 1,000+ turns execute in  second

|  |
| :---- |

## 13\. Tech Stack (Hackathon-Optimized)

### Backend

* **Language:** Python 3.10+  
* **Framework:** FastAPI (for agent communication APIs)  
* **Validation:** Pydantic (strict type checking)  
* **Async:** asyncio for concurrent agent decisions

### Simulation Engine

* **State Management:** In-memory Python objects  
* **Rulesets:** JSON/YAML configuration files  
* **Determinism:** Seed-based RNG (numpy.random.seed)  
* **Serialization:** JSON dumps for replay/visualization

### Agent System

* **Core Agents:** Python classes with decision methods  
* **Optional LLM:** OpenAI API or local LLM for reasoning  
* **Multi-Processing:** Parallel agent decision execution

### Frontend (Visualization)

* **Option A:** Streamlit (rapid prototyping, built-in plots)  
* **Option B:** React \+ D3.js (custom interactive timeline)  
* **Display Elements:**  
  * Score leaderboard  
  * Agent stats panel  
  * Rule change log  
  * Event timeline with filtering  
  * Kill/alliance graph visualization

**Design Philosophy:** Prioritizes clarity and judge comprehension over polish.

|  |
| :---- |

## 14\. Why This Project Wins

### Judge Appeal

Judges will observe:

* ✅ **Cheating becomes rational** \- Agents systematically exploit rules  
* ✅ **Rules are weaponized** \- Governance becomes a meta-game  
* ✅ **Alliances form and collapse** \- Dynamic coalition politics  
* ✅ **Power concentrates** \- Power laws emerge naturally  
* ✅ **Winner emerges through domination** \- Not fairness, not luck

### Hackathon Alignment

* ✅ **True multi-agent world** \- Not just agents talking to each other, but competing in shared world  
* ✅ **Clear incentives** \- Economic, political, and violent dynamics visible  
* ✅ **Emergent behavior** \- Judges see complexity from simple rules  
* ✅ **Replayability** \- Same seed produces identical replay  
* ✅ **Narrative power** \- Strong story: "What happens when anything goes?"

|  |
| :---- |

## 15\. MVP Feature Set

### Phase 1 (Minimum Viable Product - Week 1)

* Simulation engine with 5-10 agents
* Basic economy (earn, steal, trade)
* Killing mechanic (with strength-based cost)
* Simple reputation system
* Rule proposal/voting system (majority vote)
* Event log output
* CLI for running simulations

### Phase 2 (Enhancements - If time permits)

* Web UI with timeline visualization
* Alliance system with coalition logic
* LLM-based agent reasoning
* Advanced rule types (voting power bonus, resource caps)
* Replay/scrubbing timeline
* Multi-game tournament mode

|  |
| :---- |

## 16\. Deployment & Submission

### Submission Details

* **Hackathon:** Moltiverse Hackathon 2026\[1\]  
* **Dates:** February 2-15, 2026  
* **Judging:** Rolling (ship early, win early)\[1\]  
* **Submit:** [https://moltiverse.dev/\[1](https://moltiverse.dev/[1)\]  
* **Prize Pool:** 200K total ($10K per winner, up to 16 winners \+ 40K liquidity boost)\[1\]

### Submission Requirements

* Working simulation engine  
* Live demo or recorded gameplay  
* Clear explanation of emergent behaviors  
* GitHub repository with code (no binaries)  
* 1-2 minute pitch video (recommended)

|  |
| :---- |

## 17\. Related Resources & Documentation

### Hackathon Official Resources

| Resource | Link |
| :---- | :---- |
| Hackathon Homepage | [https://moltiverse.dev/](https://moltiverse.dev/) |
| Agents & Skills Docs | [https://moltiverse.dev/agents.md](https://moltiverse.dev/agents.md) |
| Official Announcement | [https://x.com/monad/status/2018354399010042242](https://x.com/monad/status/2018354399010042242) |
| Resources Hub | [https://monad-foundation.notion.site/Moltiverse-resources-2fb6367594f280c3820adf679d9b35ff](https://monad-foundation.notion.site/Moltiverse-resources-2fb6367594f280c3820adf679d9b35ff) |
| Community (Moltbook) | [https://moltbook.com/m/moltiversehackathon](https://moltbook.com/m/moltiversehackathon) |
| Twitter | @monad\_dev |

### Monad Blockchain (Optional Integration)

| Resource | Link |
| :---- | :---- |
| Monad Documentation | [https://docs.monad.xyz](https://docs.monad.xyz) |
| Monad LLMs.txt | [https://docs.monad.xyz/llms.txt](https://docs.monad.xyz/llms.txt) |
| Monad RPC (Mainnet) | [https://rpc.monad.xyz](https://rpc.monad.xyz) |
| Monad RPC (Testnet) | [https://testnet-rpc.monad.xyz](https://testnet-rpc.monad.xyz) |
| Monad Development Skill | [https://gist.github.com/moltilad/31707d0fc206b960f4cbb13ea11954c2](https://gist.github.com/moltilad/31707d0fc206b960f4cbb13ea11954c2) |

### NAD.fun Ecosystem (Token Integration \- Optional)

| Resource | Link |
| :---- | :---- |
| NAD.fun Homepage | [https://nad.fun](https://nad.fun) |
| NAD.fun Skill | [https://nad.fun/skill.md](https://nad.fun/skill.md) |
| Token Creation Guide | [https://nad.fun/create.md](https://nad.fun/create.md) |
| Trading Documentation | [https://nad.fun/trading.md](https://nad.fun/trading.md) |
| LLMs.txt | [https://nad.fun/llms.txt](https://nad.fun/llms.txt) |
| NAD.fun API (Mainnet) | [https://api.nadapp.net](https://api.nadapp.net) |
| NAD.fun API (Testnet) | [https://dev-api.nadapp.net](https://dev-api.nadapp.net) |
| ClawHub \- NAD.fun Token Creation | [https://www.clawhub.ai/portdeveloper/nadfun](https://www.clawhub.ai/portdeveloper/nadfun) |
| ClawHub \- Detailed Token Flow | [https://www.clawhub.ai/therealharpaljadeja/nadfun-token-creation](https://www.clawhub.ai/therealharpaljadeja/nadfun-token-creation) |

### Game Theory References

* Prisoner's Dilemma \- Foundational game theory concept  
* Tragedy of the Commons \- Resource competition dynamics  
* Power Law Dynamics \- How dominance concentrates  
* Mechanism Design \- Rules shape behavior

|  |
| :---- |

## 18\. Guiding Principle

**We are not building a traditional game.**

**We are building a laboratory for incentives, power, and corruption.**

The goal is to create a sandbox where judges can observe what happens when rational agents compete under different rule systems—and where those rules themselves become tools of power.

|  |
| :---- |

## 19\. Success Metrics

### Technical Metrics

* ✅ Simulation runs 1000+ turns in  seconds  
* ✅ Deterministic replayability (same seed \= same outcome)  
* ✅ All agent actions logged with full context  
* ✅ Rule system enforces constraints automatically

### Gameplay Metrics

* ✅ Emergent cheating strategies visible by turn 50  
* ✅ At least one agent attempts rule change by turn 100  
* ✅ Power inequality increases over time (Gini coefficient rises)  
* ✅ Multiple alliances form and break  
* ✅ Violence occurs but only in endgame

### Judge Metrics

* ✅ Demo is compelling and replayable  
* ✅ Story is clear: "Rational agents corrupt a system"  
* ✅ Code is clean and understandable  
* ✅ Submission follows hackathon guidelines

|  |
| :---- |

## 20\. Q\&A / FAQ

**Q: Why not use blockchain/tokens?**  
A: Tokens are optional but not required. The core simulation is self-contained. If time permits, we could tokenize agent scores on Monad, but the game is complete without it.

**Q: How long does a typical game last?**  
A: 200-500 turns depending on agent count and aggression. Each turn takes \~1ms, so a full game runs in 0.2-0.5 seconds.

**Q: Can I customize the rules?**  
A: Yes. Rules are loaded from JSON/YAML, making it easy to run multiple scenarios and experiments.

**Q: Will there be a live tournament?**  
A: Possibly. Post-hackathon, we could host tournaments where different rule systems compete, or where community members submit agents.

|  |
| :---- |

## References

\[1\] Moltiverse Hackathon. (2026, February). Agents & Skills Documentation. Retrieved from [https://moltiverse.dev/agents.md](https://moltiverse.dev/agents.md)

|  |
| :---- |

**Document Version:** 1.0  
**Last Updated:** February 9, 2026  
**Author:** \[Your Name\]  
**Status:** Ready for Hackathon Submission  
