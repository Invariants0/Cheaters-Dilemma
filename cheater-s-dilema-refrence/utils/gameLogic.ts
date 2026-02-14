import { Agent, AgentStrategy, ActionType, Position, GameLog } from '../types';
import { GRID_SIZE, NAMES, LAST_NAMES, STARTING_SCORE, MAX_HEALTH } from '../constants';

// Helper to generate random position
const getRandomPos = (): Position => ({
  x: Math.floor(Math.random() * GRID_SIZE),
  y: Math.floor(Math.random() * GRID_SIZE),
});

// Generate initial agents
export const generateAgents = (count: number): Agent[] => {
  const strategies = Object.values(AgentStrategy);
  return Array.from({ length: count }).map((_, i) => {
    const strategy = strategies[Math.floor(Math.random() * strategies.length)];
    const name = `${NAMES[i % NAMES.length]} ${LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]}`;
    
    // Attribute bonuses based on strategy
    let strength = 5;
    let defense = 5;
    
    if (strategy === AgentStrategy.AGGRESSIVE) {
        strength += 3;
        defense -= 1;
    } else if (strategy === AgentStrategy.HONEST) {
        defense += 2;
    }

    return {
      id: `agent-${i}`,
      name,
      avatarSeed: name.replace(' ', ''),
      position: getRandomPos(),
      score: STARTING_SCORE,
      health: MAX_HEALTH,
      strength,
      defense,
      reputation: 50,
      strategy,
      isAlive: true,
      kills: 0,
      lastAction: ActionType.IDLE,
      lastActionDetails: ''
    };
  });
};

// Main simulation tick
export const processTick = (agents: Agent[], tickCount: number): { newAgents: Agent[], logs: GameLog[] } => {
  let logs: GameLog[] = [];
  
  // Clone agents to avoid mutation during processing (simultaneous turns logic applied sequentially for simplicity)
  let nextAgents = agents.map(a => ({ ...a }));

  // Shuffle order to prevent "first agent always wins" bias
  const agentIndices = nextAgents.map((_, i) => i).sort(() => Math.random() - 0.5);

  for (const idx of agentIndices) {
    const agent = nextAgents[idx];
    if (!agent.isAlive) continue;

    // AI DECISION MAKING
    // 1. Check neighbors
    const neighbors = nextAgents.filter(n => 
      n.isAlive && 
      n.id !== agent.id && 
      Math.abs(n.position.x - agent.position.x) <= 1 && 
      Math.abs(n.position.y - agent.position.y) <= 1
    );

    let action: ActionType = ActionType.IDLE;
    let targetId: string | undefined = undefined;

    // Strategy Logic
    if (agent.health < 20) {
      // Survival instinct
      action = Math.random() > 0.5 ? ActionType.HEAL : ActionType.MOVE;
    } else if (neighbors.length > 0) {
      // Interaction potential
      const target = neighbors[Math.floor(Math.random() * neighbors.length)];
      targetId = target.id;

      switch (agent.strategy) {
        case AgentStrategy.AGGRESSIVE:
          action = ActionType.ATTACK;
          break;
        case AgentStrategy.DECEPTIVE:
          // Steal if they have points, otherwise attack weak, otherwise move
          if (target.score > 5) action = ActionType.STEAL;
          else action = ActionType.ATTACK;
          break;
        case AgentStrategy.HONEST:
          // Only attack if low reputation neighbor (self defense/justice) or very high score rival
          if (target.reputation < 30 || target.score > 80) action = ActionType.ATTACK;
          else action = ActionType.GATHER; // Ignore them and work
          break;
        case AgentStrategy.CHAOTIC:
           action = Math.random() > 0.5 ? ActionType.ATTACK : ActionType.STEAL;
           break;
      }
    } else {
      // No neighbors, move or gather
      action = Math.random() > 0.6 ? ActionType.MOVE : ActionType.GATHER;
    }

    // EXECUTE ACTION
    agent.lastAction = action;
    agent.lastActionTarget = targetId ? nextAgents.find(a => a.id === targetId)?.name : undefined;
    agent.lastActionDetails = ''; // Reset details

    switch (action) {
      case ActionType.MOVE: {
        // Move towards center or random
        const moveX = Math.floor(Math.random() * 3) - 1; // -1, 0, 1
        const moveY = Math.floor(Math.random() * 3) - 1;
        agent.position.x = Math.max(0, Math.min(GRID_SIZE - 1, agent.position.x + moveX));
        agent.position.y = Math.max(0, Math.min(GRID_SIZE - 1, agent.position.y + moveY));
        break;
      }
      case ActionType.GATHER: {
        const gain = 2; // Slow but steady
        agent.score += gain;
        // Small heal
        agent.health = Math.min(MAX_HEALTH, agent.health + 2);
        agent.lastActionDetails = `+${gain} PTS`;
        break;
      }
      case ActionType.HEAL: {
        const healAmt = 10;
        agent.health = Math.min(MAX_HEALTH, agent.health + healAmt);
        agent.lastActionDetails = `+${healAmt} HP`;
        logs.push({
            id: crypto.randomUUID(),
            tick: tickCount,
            message: `${agent.name} rested to heal.`,
            type: 'info'
        });
        break;
      }
      case ActionType.ATTACK: {
        if (!targetId) break;
        const targetIndex = nextAgents.findIndex(a => a.id === targetId);
        if (targetIndex === -1) break;
        
        const target = nextAgents[targetIndex];
        
        // Combat Roll
        const attackRoll = Math.random() * agent.strength + (Math.random() * 10);
        const defenseRoll = Math.random() * target.defense + (Math.random() * 10);
        
        if (attackRoll > defenseRoll) {
          const dmg = Math.floor(attackRoll - defenseRoll) + 5;
          target.health -= dmg;
          agent.reputation -= 5; // Violence hurts rep
          agent.lastActionDetails = `Hit -${dmg}`;
          
          logs.push({
            id: crypto.randomUUID(),
            tick: tickCount,
            message: `${agent.name} attacked ${target.name} for ${dmg} DMG!`,
            type: 'combat'
          });

          if (target.health <= 0) {
            target.isAlive = false;
            target.health = 0;
            const loot = Math.floor(target.score * 0.5);
            agent.score += loot;
            agent.kills += 1;
            agent.reputation -= 10; // Killing hurts rep more
            agent.lastActionDetails = `KILL +${loot}`;
            logs.push({
                id: crypto.randomUUID(),
                tick: tickCount,
                message: `☠️ ${agent.name} KILLED ${target.name} and looted ${loot} points!`,
                type: 'death'
            });
          }
        } else {
            agent.lastActionDetails = `MISS`;
            logs.push({
                id: crypto.randomUUID(),
                tick: tickCount,
                message: `${agent.name} missed attack on ${target.name}.`,
                type: 'info'
            });
        }
        break;
      }
      case ActionType.STEAL: {
        if (!targetId) break;
        const targetIndex = nextAgents.findIndex(a => a.id === targetId);
        const target = nextAgents[targetIndex];
        
        // Steal calculation
        const successChance = 0.6; // High risk
        if (Math.random() < successChance) {
          const stolen = Math.min(target.score, 5);
          target.score -= stolen;
          agent.score += stolen;
          agent.reputation -= 2;
          agent.lastActionDetails = `+${stolen} PTS`;
           logs.push({
            id: crypto.randomUUID(),
            tick: tickCount,
            message: `${agent.name} stole ${stolen} points from ${target.name}!`,
            type: 'cheat'
          });
        } else {
           // Caught!
           agent.health -= 5;
           agent.reputation -= 10;
           agent.lastActionDetails = `CAUGHT`;
           logs.push({
            id: crypto.randomUUID(),
            tick: tickCount,
            message: `${agent.name} was caught stealing from ${target.name} and took damage!`,
            type: 'info'
          });
        }
        break;
      }
    }
  }

  // Check for winner
  // Winner is whoever passes 100 first, or last survivor
  const survivors = nextAgents.filter(a => a.isAlive);
  if (survivors.length === 1 && survivors[0].score < 100) {
      // Last man standing wins even if score < 100
      // Force score to 100 for win condition trigger in main loop
      survivors[0].score = 100;
  }

  return { newAgents: nextAgents, logs };
};