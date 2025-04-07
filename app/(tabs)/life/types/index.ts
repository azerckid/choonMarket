// Define the Post type
export interface Post {
    id: number;
    title: string;
    description: string | null;
    createdAt: Date;
    views: number;
    _count: {
        likes: number;
        comments: number;
    };
} 