import { IEvent, NothingEvent, EventFactory } from './Event';

/**
 * Represents a single tile on the game map
 * 
 * Tiles make up the game board
 * May contain events that trigger when a player lands on them.
 */
export default class Tile {
    position: number;
    hasPlayer: boolean;
    hasEvent: boolean;
    event: IEvent;
    
    /**
     * Creates a new Tile instance
     * 
     * @param position - Position on the game map
     * @param hasEvent - Whether this tile triggers an event (defaults to false)
     * @param hasPlayer - Whether a player is currently on this tile (defaults to false)
     * @param event - Event (defaults to Nothing). Can be set
     */
    constructor(position: number) {
        this.position = position;
        this.hasEvent = false;
        this.hasPlayer = false;
        this.event = new NothingEvent();
    }

    //  TILE RELATED METHODS

    public getPosition(): number {
        return this.position;
    }

    public setPosition(position: number): void {
        this.position = position;
    }

    //  EVENT RELATED METHODS

    public eventHas(): boolean {
        return this.hasEvent;
    }

    public eventGet(): IEvent {
        return this.event;
    }

    /**
     * Set an event on this tile by event type
     * @param eventType - The type of event to set
     * - 0: NothingEvent
     * - 1: SafeEvent
     * @returns True if the event was set successfully
     */
    public eventSet(eventType: number): boolean {
        if (eventType === 0) {
            this.event = new NothingEvent();
            this.hasEvent = false;
        } else {
            this.event = EventFactory.createEvent(eventType);
            this.hasEvent = true;
        }
        return true;
    }
    
}