import React, { useState, useEffect } from 'react';
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
import tagalogWords from '../assets/tagalogWords.json';
import { AnalysisResult } from '../types/AnalysisResult';

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
    const accessToken = 'EAAZASei56b9cBO02glJ1FNT3z5yfRtvgIJ8iF2jne1Xupuo2aKWPT3nrF7vllDt7EdZBPyYowRTZC66Y632z4ZAmGhynKZCsrl29kw1pCZATTRJtVvuOJr7OEZBaGBeKcYKZBH4rvazcY0SA7GlnWYgiGgEjfA0bapXo1CRHdcGdfY9KcCIDzt5SGFZAmb9tXdZBnWO424jw8Y'; // Replace with your actual token

    const [currentPage, setCurrentPage] = useState(1);
    const commentsPerPage = 5;

    useEffect(() => {
        if (overallAnalysis) {
            saveAnalysisResult(analyzedComments, postID);
        }
    }, [overallAnalysis]);

    const saveAnalysisResult = async (analyzed: any[], postId: string) => {
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
        try {
            await axios.post('http://localhost:5000/api/saveResult', result);
            console.log('Analysis result saved to the database successfully.');
        } catch (error) {
            console.error('Error saving analysis result:', error);
        }
    };

    const getComments = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (postID.trim() !== '') {
            setIsLoading(true);
            try {
                const fetchedData = await axios.get(`https://graph.facebook.com/v21.0/${pageID}_${postID}/comments?access_token=${accessToken}&limit=75`);
                const result = (fetchedData.data as { data: { [key: string]: any } }).data || [];

                const sentiment = new Sentiment();
                sentiment.registerLanguage('custom', {
                    ...tagalogWords
                });

                const analyzed = result.map((commentObj: { message: string }) => {
                    const normalizedMessage = commentObj.message.toLowerCase();
                    const analysis = sentiment.analyze(normalizedMessage, { language: 'custom' });
                    return {
                        comment: commentObj.message,
                        score: analysis.score,
                        comparative: analysis.comparative,
                        positive: analysis.positive,
                        negative: analysis.negative,
                        sentiment: analysis.score > 0 ? 'Positive' : analysis.score < 0 ? 'Negative' : 'Neutral',
                    };
                });

                setAnalyzedComments(analyzed);
                analyzeOverallResults(analyzed);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
                setIsLoading(false);
                setErrorPostID(true);
                setTimeout(() => setErrorPostID(false), 3000);
            }
        }
    };

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

        const overallSentiment = overallScore > 0 ? 'Positive' : overallScore < 0 ? 'Negative' : 'Neutral';
        const coreSentences = analyzed.sort((a, b) => Math.abs(b.score) - Math.abs(a.score)).slice(0, 3);
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

    const indexOfLastComment = currentPage * commentsPerPage;
    const indexOfFirstComment = indexOfLastComment - commentsPerPage;
    const currentComments = analyzedComments.slice(indexOfFirstComment, indexOfLastComment);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);


    return (
        <div className="hero flex flex-col sm:flex-row justify-center items-center py-12 bg-gray-100 text-gray-800" id='home'>
            <div className="section1 sm:w-1/2 w-full flex flex-col gap-6 px-6">
                <TypeAnimation
                    sequence={['Sentiment Analysis', 1000, 'Enter your feedback', 1000, 'Analyze your feelings', 1000]}
                    wrapper="span"
                    speed={50}
                    className='text-4xl font-bold text-center'
                    style={{ display: 'inline-block' }}
                    repeat={Infinity}
                />
                <form onSubmit={getComments} className="flex flex-col">
                    <Box sx={{ marginBottom: "1em" }}>
                        <FormControl fullWidth>
                            <TextField
                                id="standard-basic"
                                required
                                value={postID}
                                onChange={(e) => setPostID(e.currentTarget.value)}
                                label="Enter your post ID"
                                variant="outlined"
                                color="primary"
                            />
                        </FormControl>
                    </Box>
                    {errorPostID && (
                        <Box sx={{ marginBottom: "1em" }}>
                            <FormControl fullWidth>
                                <p className='error text-red-500 text-sm'>Your Post ID is invalid!</p>
                            </FormControl>
                        </Box>
                    )}
                    <Box sx={{ minWidth: 120 }}>
                        <Button className='bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-normal' type='submit'>Submit</Button>
                    </Box>
                </form>

                {currentComments.length > 0 && (
                    <TableContainer component={Paper} sx={{ marginTop: "2em" }}>
                        <Table sx={{ minWidth: 650 }} aria-label="sentiment analysis table">
                            <TableHead>
                                <TableRow>
                                    <TableCell><b>Comment</b></TableCell>
                                    <TableCell align="right"><b>Score</b></TableCell>
                                    <TableCell align="right"><b>Sentiment</b></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {currentComments.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell component="th" scope="row">{row.comment}</TableCell>
                                        <TableCell align="right">{row.score}</TableCell>
                                        <TableCell
                                            align="right"
                                            style={{
                                                backgroundColor:
                                                    row.sentiment === 'Positive' ? '#99ff99' : 
                                                    row.sentiment === 'Negative' ? '#ff8080' : 
                                                    '#ffff99',
                                                color: '#212529',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {row.sentiment}
                                        </TableCell>
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
                            variant="outlined"
                            color="primary"
                            onClick={() => paginate(index + 1)}
                            className={`mx-1 ${currentPage === index + 1 ? 'bg-gray-700 text-white' : 'text-gray-800'}`}
                        >
                            {index + 1}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="section2 sm:w-1/2 w-full flex flex-col gap-4 px-6">
                {overallAnalysis && (
                    <div className="analysis-results">
                        <h2 className='text-2xl font-bold'>Overall Analysis</h2>
                        <p>Overall Score: {overallAnalysis.overallScore}</p>
                        <p>Overall Sentiment: {overallAnalysis.overallSentiment}</p>
                        <p>Top Positive Words: {overallAnalysis.topPositiveWords.join(', ')}</p>
                        <p>Top Negative Words: {overallAnalysis.topNegativeWords.join(', ')}</p>
                        <p>Score Magnitude: {overallAnalysis.scoreMagnitude}</p>
                        <h3 className='text-xl font-semibold'>Core Sentences:</h3>
                        <ul>
                            {overallAnalysis.coreSentences.map((sentence, index) => (
                                <li key={index}>{sentence.comment} (Score: {sentence.score})</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};
