import React, { useState } from 'react';
import Sentiment from 'sentiment';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import { TypeAnimation } from 'react-type-animation';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import tagalogWords from '../assets/tagalogWords.json'; // Import Tagalog words
import { AnalysisResult } from '../types/AnalysisResult';
import { useNavigate } from 'react-router-dom';

interface IHero {
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Hero: React.FC<IHero> = ({ setIsLoading }) => {
    const [postID, setPostID] = useState('');
    const [errorPostID, setErrorPostID] = useState(false);
    const [analyzedComments, setAnalyzedComments] = useState<{
        comment: string;
        score: number;
        comparative: number;
        positive: string[];
        negative: string[];
        sentiment: string;
    }[]>([]);
    const [overallAnalysis, setOverallAnalysis] = useState<{
        topPositiveWords: string[];
        topNegativeWords: string[];
        overallSentiment: string;
        overallScore: number;
        scoreMagnitude: number;
        coreSentences: { comment: string; score: number; }[];
        scoreRange: { min: number; max: number; };
    } | null>(null);

    const pageID = '432818713243101';
    const accessToken = 'EAAZASei56b9cBO02glJ1FNT3z5yfRtvgIJ8iF2jne1Xupuo2aKWPT3nrF7vllDt7EdZBPyYowRTZC66Y632z4ZAmGhynKZCsrl29kw1pCZATTRJtVvuOJr7OEZBaGBeKcYKZBH4rvazcY0SA7GlnWYgiGgEjfA0bapXo1CRHdcGdfY9KcCIDzt5SGFZAmb9tXdZBnWO424jw8Y';

    const [currentPage, setCurrentPage] = useState(1);
    const commentsPerPage = 5; // Number of comments per page

    const saveAnalysisResult = (analyzed: any[], postId: string) => {
        const result: AnalysisResult = {
            postId,
            date: new Date().toISOString(),
            overallScore: overallAnalysis?.overallScore || 0,
            overallSentiment: overallAnalysis?.overallSentiment || 'Neutral',
            topPositiveWords: overallAnalysis?.topPositiveWords || [],
            topNegativeWords: overallAnalysis?.topNegativeWords || [],
            scoreMagnitude: overallAnalysis?.scoreMagnitude || 0
        };
        console.log(analyzed);
        console.log('Saving Analysis Result:', result);
        
        // Get existing results from localStorage
        const existingResults = JSON.parse(localStorage.getItem('analysisHistory') || '[]');
        
        // Add new result
        existingResults.push(result);
        
        // Save back to localStorage
        localStorage.setItem('analysisHistory', JSON.stringify(existingResults));
    };

    async function getComments(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (postID.trim() !== '') {
            setIsLoading(true);
            try {
                const fetchedData = await axios.get(`https://graph.facebook.com/v21.0/${pageID}_${postID}/comments?access_token=${accessToken}&limit=75`);
                const result = (fetchedData.data as { data: { [key: string]: any } }).data || [];
                
                const sentiment = new Sentiment();

                // Register custom Tagalog words
                sentiment.registerLanguage('custom', {
                    ...tagalogWords
                });

               // Analyze comments with case-insensitive approach
                    const analyzed = result.map((commentObj: { message: string }) => {
                        const normalizedMessage = commentObj.message.toLowerCase(); // Normalize to lowercase
                        const analysis = sentiment.analyze(normalizedMessage, { language: 'custom' });
                        return {
                            comment: commentObj.message, // Keep original message for display
                            score: analysis.score,
                            comparative: analysis.comparative,
                            positive: analysis.positive,
                            negative: analysis.negative,
                            sentiment: analysis.score > 0 ? 'Positive' : analysis.score < 0 ? 'Negative' : 'Neutral',
                        };
                    });
                
                setAnalyzedComments(analyzed);
                analyzeOverallResults(analyzed);
                saveAnalysisResult(analyzed, postID);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
                setIsLoading(false);
                setErrorPostID(true);
                setTimeout(() => setErrorPostID(false), 3000);
            }
        }
    }

    const analyzeOverallResults = (analyzed: any[]) => {
        const positiveWordFreq: Record<string, number> = {};
        const negativeWordFreq: Record<string, number> = {};
        let overallScore = 0;
        let scoreMagnitude = 0;

        analyzed.forEach((comment) => {
            overallScore += comment.score;
            scoreMagnitude += Math.abs(comment.score);
            comment.positive.forEach((word: string) => {
                positiveWordFreq[word] = (positiveWordFreq[word] || 0) + 1;
            });
            comment.negative.forEach((word: string) => {
                negativeWordFreq[word] = (negativeWordFreq[word] || 0) + 1;
            });
        });

        const topPositiveWords = Object.entries(positiveWordFreq)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([word]) => word);

        const topNegativeWords = Object.entries(negativeWordFreq)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([word]) => word);

        const overallSentiment =
            overallScore > 0 ? 'Positive' : overallScore < 0 ? 'Negative' : 'Neutral';

        const coreSentences = analyzed
            .sort((a, b) => Math.abs(b.score) - Math.abs(a.score))
            .slice(0, 3);

        const scoreRange = {
            min: Math.min(...analyzed.map(c => c.score)),
            max: Math.max(...analyzed.map(c => c.score)),
        };

        setOverallAnalysis({
            topPositiveWords,
            topNegativeWords,
            overallSentiment,
            overallScore,
            scoreMagnitude,
            coreSentences,
            scoreRange,
        });
    };

    // Pagination helpers
    const indexOfLastComment = currentPage * commentsPerPage;
    const indexOfFirstComment = indexOfLastComment - commentsPerPage;
    const currentComments = analyzedComments.slice(indexOfFirstComment, indexOfLastComment);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const navigate = useNavigate();

    return (
        <div className="hero flex sm:pt-0 h-auto py-0 sm:px-20 mt-20 sm:mt-28 " id='home'>
            <div className="section1 sm:w-1/2 w-full flex flex-col gap-2 px-6 py-6 sm:py-10 ">
                <div className='mb-10'>
                    <TypeAnimation
                        sequence={[
                            'Sentimental Analysis',
                            1000,
                            'Enter your feedback',
                            1000,
                            'Analyze your feelings',
                            1000
                        ]}
                        wrapper="span"
                        speed={50}
                        className='text-3xl font-semibold'
                        style={{ display: 'inline-block' }}
                        repeat={Infinity}
                    />
                    <form onSubmit={(e) => { getComments(e) }}>
                        <Box sx={{ minWidth: 120, marginBottom: "0.5em" }}>
                            <FormControl fullWidth>
                                <TextField id="standard-basic" required value={postID} onChange={(e) => { setPostID(e.currentTarget.value) }}
                                    label="Enter your post ID" variant="standard" />
                            </FormControl>
                        </Box>
                        {errorPostID &&
                        <Box sx={{ minWidth: 120, marginBottom: "0.5em" }}>
                            <FormControl fullWidth>
                                <p className='error text-red-500 text-sm'>Your Post ID is invalid!</p>
                            </FormControl>
                        </Box>}
                        <Box sx={{ minWidth: 120 }}>
                            <button className='bg-neutral-600 text-white px-4 py-2 rounded-md text-sm font-normal' type='submit'>Submit</button>
                        </Box>
                    </form>
                </div>

                {currentComments.length > 0 && (
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="sentiment analysis table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Comment</TableCell>
                                    <TableCell align="right">Score</TableCell>
                                    <TableCell align="right">Comparative</TableCell>
                                    <TableCell align="right">Positive Words</TableCell>
                                    <TableCell align="right">Negative Words</TableCell>
                                    <TableCell align="right">Overall Sentiment</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {currentComments.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell component="th" scope="row">{row.comment}</TableCell>
                                        <TableCell align="right">{row.score}</TableCell>
                                        <TableCell align="right">{row.comparative.toFixed(2)}</TableCell>
                                        <TableCell align="right">{row.positive.join(', ') || '-'}</TableCell>
                                        <TableCell align="right">{row.negative.join(', ') || '-'}</TableCell>
                                        <TableCell align="right">{row.sentiment}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
                
                <div className="flex justify-center mt-4">
                    {Array.from({ length: Math.ceil(analyzedComments.length / commentsPerPage) }, (_, index) => (
                        <Button
                            key={index + 1}
                            variant={index + 1 === currentPage ? "contained" : "outlined"}
                            onClick={() => paginate(index + 1)}
                        >
                            {index + 1}
                        </Button>
                    ))}
                </div>

                {overallAnalysis && (
                    <div className="mt-6">
                        {/* Overall Analysis Display */}
                        <h1><b>Overall Analysis</b></h1>
                        <p><b>Overall Sentiment:</b> {overallAnalysis.overallSentiment}</p>
                        <p><b>Total Score:</b> {overallAnalysis.overallScore}</p>
                        <p><b>Magnitude:</b> {overallAnalysis.scoreMagnitude}</p>
                        
                        <h3><b>Top 10 Positive Words</b></h3>
                        <ul>
                            {overallAnalysis.topPositiveWords.map((word, index) => (
                                <li key={index}>{word}</li>
                            ))}
                        </ul>

                        <h3><b>Top 10 Negative Words</b></h3>
                        <ul>
                            {overallAnalysis.topNegativeWords.map((word, index) => (
                                <li key={index}>{word}</li>
                            ))}
                        </ul>

                        <h3><b>Core Sentences</b></h3>
                        <ul>
                            {overallAnalysis.coreSentences.map((sentence, index) => (
                                <li key={index}>{sentence.comment}</li>
                            ))}
                        </ul>

                        <h3><b>Score Range</b></h3>
                        <p>Min: {overallAnalysis.scoreRange.min}, Max: {overallAnalysis.scoreRange.max}</p>
                    </div>
                )}

                <Box sx={{ minWidth: 120, marginTop: "1em" }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/admin-login')}
                    >
                        Admin Login
                    </Button>
                </Box>
            </div>
        </div>
    );
};
