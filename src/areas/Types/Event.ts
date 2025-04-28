/**
 * Represents a tile event that can occur during gameplay
 * 
 * Events are triggered by landing on specific tiles 
 */
export default class Event {
    id: number;
    type: string;
    description: string;
    
    /**
     * Creates a new Event instance
     * 
     * @param id - Unique identifier
     * @param type - Category of event
     * @param description - Text description
     */
    constructor(id: number, type: string, description: string) {
        this.id = id;
        this.type = type;
        this.description = description;
    }
}