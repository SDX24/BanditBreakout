/**
 * Represents a tile event that can occur during gameplay
 * 
 * Events are triggered by landing on specific tiles 
 */

// IEvent interface, defining the structure of an event
// src/areas/Types/Event.ts

export interface IEvent {
    name: string;
    type: number;
    description: string;
    effect: string;
}

// NOTHING EVENT (TYPE 0)
export class NothingEvent implements IEvent {
    name = "Nothing";
    type = 0;
    description = "Nothing happens here";
    effect = "No effect";
}

// SAFE EVENT (TYPE 1)
export class SafeEvent implements IEvent {
    name = "Safe";
    type = 1;
    description = "This is a safe area";
    effect = "You feel protected here. Gain 3 gold.";
}

// BATTLE EVENT (TYPE 2)
export class BattleEvent implements IEvent {
    name = "Battle";
    type = 2;
    description = "Ambushed by a random thug!";
    effect = "Start a battle!";
}

// BATTLE EFFECT EVENT (TYPE 3)
export class BattleEffectEvent implements IEvent {
    name = "Battle Effect";
    type = 3;
    description = "You get a fancy drink and chug it.";
    effect = "Gain a battle buff for your next battle.";
}

// ITEM EVENT (TYPE 4)
export class ItemEvent implements IEvent {
    name = "Item";
    type = 4;
    description = "You find a chest!";
    effect = "Receive a random item.";
}

// EVENT (TYPE 5) - Story or special events
export class StoryEvent implements IEvent {
    name = "Event";
    type = 5;
    description = "A story or special event occurs.";
    effect = "Something interesting happens!";
}

// SLOTS EVENT (TYPE 6)
export class SlotsEvent implements IEvent {
    name = "Slots";
    type = 6;
    description = "Try your luck at the slots!";
    effect = "Gain or lose a random amount of gold.";
}

// MINING EVENT (TYPE 7)
export class MiningEvent implements IEvent {
    name = "Mining";
    type = 7;
    description = "Enter the mines and dig for gold.";
    effect = "Gain a random amount of gold.";
}

// DECISION EVENT (TYPE 8)
export class DecisionEvent implements IEvent {
    name = "Decision";
    type = 8;
    description = "You come across a fork in the road.";
    effect = "Make a choice that affects your path.";
}

// Factory
export class EventFactory {
    public static createEvent(type: number): IEvent {
        switch (type) {
            case 0: return new NothingEvent();
            case 1: return new SafeEvent();
            case 2: return new BattleEvent();
            case 3: return new BattleEffectEvent();
            case 4: return new ItemEvent();
            case 5: return new StoryEvent();
            case 6: return new SlotsEvent();
            case 7: return new MiningEvent();
            case 8: return new DecisionEvent();
            default: return new NothingEvent();
        }
    }
}
