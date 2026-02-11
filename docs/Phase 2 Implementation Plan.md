# Phase 2 Implementation Plan: The Cheater's Dilemma

## Overview

Phase 2 builds upon the MVP simulation engine to add advanced features that enhance agent sophistication, user interaction, and analytical capabilities. This phase transforms the CLI-based simulation into a comprehensive multi-agent laboratory with web visualization, intelligent agents, and tournament modes.

## Core Objectives

- **Enhanced Agent Intelligence**: Integrate LLM reasoning for dynamic strategy adaptation
- **Interactive Visualization**: Web-based timeline and metrics dashboard
- **Alliance Mechanics**: Coalition formation and joint actions
- **Advanced Governance**: Complex rule types and power dynamics
- **Tournament Mode**: Multi-game analysis and strategy evolution
- **Replay System**: Interactive timeline scrubbing and analysis

## Feature Breakdown

### 1. Web UI with Timeline Visualization

**Objective**: Replace CLI output with interactive web dashboard for real-time simulation monitoring and analysis.

**Components**:
- **Streamlit Dashboard**: Primary interface with live simulation controls
- **Timeline Visualization**:
  - Turn-by-turn event timeline with filtering
  - Agent resource/strength charts over time
  - Rule change history with impact analysis
- **Metrics Dashboard**:
  - Real-time Gini coefficient tracking
  - Governance capture visualization
  - Strategy frequency charts
  - Winner analysis breakdown

**Technical Implementation**:
- Streamlit app in `web/app.py`
- WebSocket integration for live simulation updates
- Plotly/D3.js for interactive charts
- Export functionality for simulation data

### 2. Alliance System with Coalition Logic

**Objective**: Enable agents to form temporary or long-term coalitions for coordinated actions.

**Features**:
- **Coalition Formation**: Agents can propose/join alliances
- **Joint Actions**: Coordinated theft, attacks, or rule proposals
- **Loyalty Tracking**: Reputation system for alliance betrayal/loyalty
- **Coalition Benefits**: Success bonuses for joint operations
- **Dissolution Mechanics**: Alliances break when incentives misalign

**Implementation Details**:
- New `Alliance` class in `engine/alliance.py`
- Coalition state tracking in `World`
- Joint action resolution in `ConflictResolver`
- Reputation updates for coalition behavior

### 3. LLM-Based Agent Reasoning

**Objective**: Enhance agents with language model capabilities for complex decision-making and adaptation.

**Agent Types**:
- **LLM Agent Base Class**: Extends `Agent` with OpenAI API integration
- **Reasoning Modes**:
  - Strategy analysis and adaptation
  - Alliance negotiation dialogue
  - Rule proposal generation
  - Post-action reflection and learning

**Technical Stack**:
- OpenAI API integration with `openai` package
- Prompt engineering for game-theoretic reasoning
- Fallback to heuristic logic for API failures
- Cost optimization with caching

### 4. Advanced Rule Types

**Objective**: Expand governance system with complex rule mechanics.

**New Rule Categories**:
- **Voting Power Rules**: "Top 3 agents gain veto power"
- **Resource Redistribution**: "Wealth taxes" or "minimum income guarantees"
- **Alliance Rules**: "Coalitions require majority approval"
- **Reputation Gates**: "Agents below trust threshold lose voting rights"
- **Dynamic Penalties**: "Repeated cheaters face escalating punishments"

**Implementation**:
- Extended `RuleSet` with new validation logic
- Rule templates in configuration
- Impact analysis for rule changes

### 5. Replay/Scrubbing Timeline

**Objective**: Enable detailed analysis of simulation runs with interactive controls.

**Features**:
- **Timeline Scrubbing**: Jump to any turn and see state
- **Event Filtering**: Focus on specific agents, action types, or rules
- **What-If Analysis**: Branch from specific turns with modified rules
- **Performance Metrics**: Per-turn analysis of key indicators

**Technical Implementation**:
- Simulation state snapshots per turn
- Efficient state reconstruction
- Web-based timeline controls

### 6. Multi-Game Tournament Mode

**Objective**: Run multiple simulations to analyze strategy evolution and meta-game dynamics.

**Features**:
- **Tournament Runner**: Execute 10-100 games with varying parameters
- **Strategy Evolution**: Track how strategies perform across games
- **Meta-Analysis**: Identify dominant strategies and emergent patterns
- **Parameter Sweeps**: Test different rule configurations
- **Statistical Reporting**: Confidence intervals for key metrics

**Implementation**:
- `Tournament` class in `engine/tournament.py`
- Parallel execution with multiprocessing
- Statistical analysis in `analysis/tournament_metrics.py`

## Technical Architecture

### New Package Structure
```
cheaters-dilemma/
├── web/                    # Web UI components
│   ├── app.py             # Streamlit main app
│   ├── components/        # Reusable UI components
│   └── utils/             # Web utilities
├── engine/
│   ├── alliance.py        # Alliance mechanics
│   ├── llm_agent.py       # LLM agent base class
│   └── tournament.py      # Tournament runner
├── agents/
│   ├── llm_greedy.py      # LLM-enhanced agents
│   ├── llm_cheater.py
│   └── dialogue.py        # Inter-agent communication
└── analysis/
    ├── tournament_metrics.py
    └── visualization.py   # Enhanced plotting utilities
```

### Dependencies
```toml
[project]
dependencies = [
  "pyyaml>=6.0.0",
  "streamlit>=1.28.0",
  "plotly>=5.17.0",
  "openai>=1.0.0",
  "pandas>=2.1.0",
  "numpy>=1.24.0",
]
```

### Configuration Extensions
- `config/alliance.yaml`: Alliance formation parameters
- `config/llm.yaml`: OpenAI API settings and prompts
- `config/tournament.yaml`: Tournament run parameters

## Implementation Roadmap

### Week 1-2: Foundation
1. **Alliance System**: Core coalition mechanics
2. **Web UI Skeleton**: Basic Streamlit dashboard
3. **LLM Integration**: OpenAI API wrapper and basic agent

### Week 3-4: Advanced Features
1. **Timeline Visualization**: Interactive charts and scrubbing
2. **Advanced Rules**: New rule types and validation
3. **Tournament Mode**: Multi-game execution and analysis

### Week 5-6: Polish & Analysis
1. **Enhanced Agents**: Full LLM reasoning capabilities
2. **Dialogue System**: Inter-agent communication
3. **Performance Optimization**: Parallel execution and caching

## Testing Strategy

### Unit Tests
- Alliance formation and dissolution logic
- LLM agent decision making (mocked API)
- Tournament runner functionality

### Integration Tests
- Full simulation with alliances and LLM agents
- Web UI interaction testing
- Tournament mode end-to-end

### Performance Benchmarks
- Simulation speed with different agent counts
- Memory usage for long tournaments
- API call optimization for LLM agents

## Success Metrics

- **Simulation Performance**: Maintain <5 second execution for 500-turn games
- **LLM Integration**: <10% API failure rate with graceful fallbacks
- **Web UI Responsiveness**: <1 second load times for timeline scrubbing
- **Alliance Emergence**: >50% games show coalition formation
- **Tournament Insights**: Clear identification of dominant strategies

## Risk Mitigation

- **API Dependencies**: Implement comprehensive fallbacks for OpenAI API outages
- **Performance**: Profile and optimize LLM calls with caching
- **Complexity**: Maintain clean separation between heuristic and LLM logic
- **UI Complexity**: Start with Streamlit for rapid prototyping, migrate to React if needed

## Future Considerations

- **Distributed Simulation**: Multi-machine tournament execution
- **Agent Evolution**: Genetic algorithms for strategy optimization
- **Real-time Multiplayer**: Human players in simulation
- **Advanced Analytics**: Machine learning on simulation data
- **Cloud Deployment**: Scalable tournament infrastructure