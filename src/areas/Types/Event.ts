/**
 * Represents a tile event that can occur during gameplay
 * 
 * Events are triggered by landing on specific tiles 
 */

// IEvent interface, defining the structure of an event
export interface IEvent {
    name: string;
    type: number;
    description: string;
    effect: string;
}

// NOTHING EVENT (TYPE 0)
export class NothingEvent implements IEvent {
    name: string;
    type: number;
    description: string;
    effect: string;
    
    constructor() {
        this.name = "Nothing";
        this.type = 0;
        this.description = "Nothing happens here";
        this.effect = "No effect";
    }
}

// SAFE EVENT (TYPE 1)
export class SafeEvent implements IEvent {
    name: string;
    type: number;
    description: string;
    effect: string;
    
    constructor() {
        this.name = "Safe";
        this.type = 1;
        this.description = "This is a safe area";
        this.effect = "You feel protected here";
    }
}

/**
 * Event factory class to create different event types
 */
export class EventFactory {
    /**
     * Creates a new event based on the given type
     * 
     * @param type - The type of event to create
     * - 0: NothingEvent
     * - 1: SafeEvent
     * @returns An instance of the appropriate event class
     */
    public static createEvent(type: number): IEvent {
        switch (type) {
            case 0:
                return new NothingEvent();
            case 1:
                return new SafeEvent();
            default:
                return new NothingEvent();
        }
    }
}