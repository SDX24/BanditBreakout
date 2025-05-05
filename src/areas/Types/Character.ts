export interface ICharacter {
    id: number;
    name: string;
    description: string;
    goal: string;
}

export const Characters: ICharacter[] = [
    {
        id: 1,
        name: "BuckShot",
        description: "BuckShot is a lone guncat whose soul is rumoured to be traded to a desert spirit for vengeance. Hardened by the sun and driven by justice, wherever she goes, trouble follows. She ensures that justice is always served.",
        goal: "Bring Spindle to justice."
    },
    {
        id: 2,
        name: "Serpy",
        description: "Serpy’s the town’s cheerful cowboy, always ready for adventure and fun. Whether it’s helping ranchers or finding snacks, it adds humour and heart wherever it goes. Small in size but big in personality, it’s never boring.",
        goal: "Be friends with Spindle."
    },
    {
        id: 3,
        name: "Grit",
        description: "Grit is the grumpy bartender who keeps the Wild Oasis Saloon running smoothly. Though he doesn’t show it, he cares deeply for the townsfolk, silently handling chaos and keeping things in order in a town full of loud talkers.",
        goal: "Reform Spindle."
    },
    {
        id: 4,
        name: "Scout",
        description: "Scout is the town's cheerful protector, always on patrol with a wagging tail. His keen senses and quick reflexes keep Mirage Creek safe, and he’s always ready for the next adventure with a smile on his face. But something is hiding beneath the surface…",
        goal: "Protect Buckshot and defeat Spindle."
    },
    {
        id: 5,
        name: "Solstice",
        description: "Solstice is a mysterious thief who moves like a shadow, never caught and always elusive. Known for stealing ancient artifacts for the thrill, she’s become a desert legend, with a knack for uncovering lost treasures.",
        goal: "Collect the bounty on Spindle."
    }
];