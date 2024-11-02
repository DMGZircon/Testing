export interface AnalysisResult {
    postId: string;
    date: string;
    overallScore: number;
    overallSentiment: string;
    topPositiveWords: string[];
    topNegativeWords: string[];
    scoreMagnitude: number;
} 