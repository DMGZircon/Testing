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

interface IHero {
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Hero: React.FC<IHero> = ({ setIsLoading }) => {
    const [postID, setPostID] = useState('');
    const [errorPostID, setErrorPostID] = useState(false);
    
    // New state to store analyzed results for all comments
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

    const pageID = '61565173125480';
    const accessToken = 'EAAZASei56b9cBOZBaj2MU69Q6SzS31qCRryzUjZC2k0FUTvvXJZB8OgnxGRbhxfZB3HhTR50BNxDiQZBrCTQq2Bkx9sR9Ia9sDDS1Grvkyztz7sxWqJIAWd1W6hD5RSFEHkEOpjeZBzoIBe8dLdy1fKjp70GUTLAAmU9waS5NwMqRWTN75DM2SuaGaLrpRqE8589pEDfDD4mEIVTNDJSJJtrafieZCMYSYQX'; // Replace with your actual access token

    // Fetch comments and analyze each one
    async function getComments(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (postID.trim() !== '') {
            setIsLoading(true);
            try {
                const fetchedData = await axios.get(`https://graph.facebook.com/v21.0/${pageID}_${postID}/comments?access_token=${accessToken}`);
                console.log(fetchedData.data); // Log the fetched data
                const result = (fetchedData.data as {data: { [key: string]: any }}).data.data || [];

                // Analyze each comment
                const sentiment = new Sentiment();
                const analyzed = result.map((commentObj: { message: string }) => {
                    const analysis = sentiment.analyze(commentObj.message);
                    return {
                        comment: commentObj.message,
                        score: analysis.score,
                        comparative: analysis.comparative,
                        positive: analysis.positive,
                        negative: analysis.negative,
                        sentiment: analysis.score > 0 ? 'Positive' : analysis.score < 0 ? 'Negative' : 'Neutral',
                    };
                });
                
                setAnalyzedComments(analyzed); // Save analyzed comments
                analyzeOverallResults(analyzed); // Analyze overall results
                setIsLoading(false);
            } catch (error) {
                console.error(error); // Log the error for debugging
                setIsLoading(false);
                setErrorPostID(true);
                setTimeout(() => setErrorPostID(false), 3000);
            }
        }
    }
    // Function to analyze overall results from comments
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

                {/* Table for displaying all analyzed comments */}
                {analyzedComments.length > 0 && (
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
                                {analyzedComments.map((row, index) => (
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

                {/* Overall analysis display */}
                {overallAnalysis && (
                    <div className="mt-6">
                        <h2>Overall Analysis</h2>
                        <p>Overall Sentiment: {overallAnalysis.overallSentiment}</p>
                        <p>Total Score: {overallAnalysis.overallScore}</p>
                        <p>Magnitude: {overallAnalysis.scoreMagnitude}</p>
                        
                        <h3>Top 10 Positive Words</h3>
                        <ul>
                            {overallAnalysis.topPositiveWords.map((word, index) => (
                                <li key={index}>{word}</li>
                            ))}
                        </ul>

                        <h3>Top 10 Negative Words</h3>
                        <ul>
                            {overallAnalysis.topNegativeWords.map((word, index) => (
                                <li key={index}>{word}</li>
                            ))}
                        </ul>

                        <h3>Core Sentences</h3>
                        <ul>
                            {overallAnalysis.coreSentences.map((sentence, index) => (
                                <li key={index}>{sentence.comment}</li>
                            ))}
                        </ul>

                        <h3>Score Range</h3>
                        <p>Min: {overallAnalysis.scoreRange.min}, Max: {overallAnalysis.scoreRange.max}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
