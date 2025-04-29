import { IEvent, NothingEvent, EventFactory } from './Event';
import Player from './Player';

/**
 * Represents a single tile on the game map
 * 
 * Tiles make up the game board
 * May contain events that trigger when a player lands on them.
 */
export default class Tile {
    position: number;
    hasPlayerOnTile: boolean;
    playersOnTile: number[]
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
        this.hasPlayerOnTile = false;
        this.playersOnTile = []
        this.event = new NothingEvent();
        
    }

    //  TILE POSITION RELATED METHODS

    public getPosition(): number {
        return this.position;
    }


    public setPosition(position: number): void {
        this.position = position;
    }

    // PLAYER RELATED METHODS

    public hasPlayer(): boolean {
        return this.hasPlayerOnTile;
    }

    public getPlayersOnTile(): number[] {
        return this.playersOnTile;
    }

    public addPlayer(player_id: number): void {
        this.playersOnTile.push(player_id);
        this.hasPlayerOnTile = true;
    }

    public removePlayer(player_id: number): void {
        const index = this.playersOnTile.indexOf(player_id);
        if (index > -1) {
            this.playersOnTile.splice(index, 1);
        }
        if (this.playersOnTile.length === 0) {
            this.hasPlayerOnTile = false;
        }
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