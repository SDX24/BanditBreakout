import Event from './Event';
/**
 * Represents a single tile on the game map
 * 
 * Tiles make up the game board
 * May contain events that trigger when a player lands on them.
 */
export default class Tile {
    id: number;
    position: number;
    hasEvent: boolean;
    event: number;
    
    /**
     * Creates a new Tile instance
     * 
     * @param id - Unique identifier
     * @param position - Position on the game map
     * @param hasEvent - Whether this tile triggers an event (defaults to false)
     * @param event - Event ID (defaults to 0). Where 0 means no event
     */
    constructor(id: number, position: number, hasEvent: boolean = false, event: number = 0) {
        this.id = id;
        this.position = position;
        this.hasEvent = hasEvent;
        this.event = event;
    }
}