// Common interfaces

interface Goal {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    end_date: string;
    created_at: string;
}

interface JournalEntry {
    id: number;
    text: string;
    user_id: number;
    goal_id: number;
    created_at: string;
}

interface Journal {
    goal: Goal;
    entries: JournalEntry[];
}

export type { Goal, Journal, JournalEntry }