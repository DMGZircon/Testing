import React, { useEffect, useState } from 'react'
import Sentiment, { AnalysisResult } from 'sentiment';
import TextField from '@mui/material/TextField';
import ReactSpeedometer from "react-d3-speedometer"
import data from '../assets/tagalogWords.json'
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import { TypeAnimation } from 'react-type-animation';
import axios from 'axios';
interface IHero {
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}
export const Hero:React.FC<IHero> = ({setIsLoading}) => {
    const [selectTagalogText, setSelectTagalogText] = useState("")
    const [selectEnglishText, setSelectEnglishText] = useState("")
    const [postID, setPostID] = useState('')
    const [comments, setComments] = useState([{message:""}])
    const [errorPostID, setErrorPostID] = useState(false)
    const [result, setResult] = useState<AnalysisResult>({
        score: 0,
        comparative: 0,
        calculation: [],
        tokens: [],
        words: [],
        positive: [],
        negative: [],
    });
    useEffect(() => {
        const sentiment = new Sentiment()
        var tlLanguage = data
        sentiment.registerLanguage('tl', tlLanguage)
        const englishResult = sentiment.analyze(selectEnglishText, { language: 'en' })
        setResult(englishResult)
        console.log(englishResult)

    }, [selectEnglishText])

    useEffect(() => {
        const sentiment = new Sentiment()
        var tlLanguage = data
        sentiment.registerLanguage('tl', tlLanguage)
        const tagalogResult = sentiment.analyze(selectTagalogText, { language: 'tl' })
        console.log(tagalogResult)
        setResult(tagalogResult)
    }, [selectTagalogText])

    // const postID = '122106337976505770'
    const pageID = '61565173125480'
    const accessToken = 'EAALpNpGZAkzkBO1XBM0ZCNh7Oyz4vq4CmhKKPFO1HVf8fQd4mghDnA545Aka7quYcMx7etoOg4Ms5xK1fZA2edfNu4Wbmj1KZC2l1YDxxB5F5HG7XWfVZCwEZA0xI1ULbp5psJyTCyMJDetEXxMTSYIZCKNiYNztUigIxsDWUAdmvQmyGidkZBtfFO4JYBKMYMcfSR3iz0aJ'

    async function getComments(e: React.FormEvent<HTMLFormElement>) {
        try {
            e.preventDefault()
            if(postID.trim() !== ''){
                setIsLoading(true)
                const fetchedData = await axios.get(`https://graph.facebook.com/v20.0/${pageID}_${postID}/comments?access_token=${accessToken}`)
                const result = fetchedData.data
                console.log(result.data)
                setComments(result.data)
                setIsLoading(false)
            }
        } catch (error) {
            setIsLoading(false)
            console.log(error)
            setErrorPostID(true)
            setTimeout(()=>setErrorPostID(false), 3000)
        }
    }
    return (
        <div className="hero flex sm:pt-0 h-auto py-0 sm:px-20 mt-20 sm:mt-28 " id='home'>
            <div className="section1 sm:w-1/2 w-full flex flex-col gap-2 px-6 py-6 sm:py-10 ">
                <div className='mb-10'>
                    <TypeAnimation
                        sequence={[
                            // Same substring at the start will only be typed out once, initially
                            'Sentimental Analysis',
                            1000, // wait 1s before replacing "Mice" with "Hamsters"
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
                    {/* {typeError && <p className='font-semibold text-xl'>Pick a Language</p>} */}

                    <form onSubmit={(e) => { getComments(e) }}>
                        <Box sx={{ minWidth: 120, marginBottom: "0.5em" }}>
                            <FormControl fullWidth>
                                <TextField id="standard-basic" required value={postID} onChange={(e) => { setPostID(e.currentTarget.value) }}
                                    label="Enter your post ID" variant="standard" />
                                {/* {typeError && <p className='text-red-500 mt-5'>Please select a language first!</p>} */}
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
                {comments.length > 1 && <>
                    <Box sx={{ minWidth: 120 }}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Select English Comments</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="English Comments"
                                value={selectEnglishText}
                                onChange={(e) => { setSelectEnglishText(e.target.value) }}
                            >
                                {comments.map((e,  i)=>{
                                       return (
                                               <MenuItem key={i} value={e.message}>{e.message}</MenuItem> 
                                       )
                                })}          
                            </Select>
                        </FormControl>
                    </Box>
                    <Box sx={{ minWidth: 120 }}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Select Tagalog Comments</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Tagalog Comments"
                                value={selectTagalogText}
                                onChange={(e) => { setSelectTagalogText(e.target.value) }}
                            >
                                {comments.map((e,  i)=>{
                                       return (
                                               <MenuItem key={i} value={e.message}>{e.message}</MenuItem> 
                                       )
                                })}
                            </Select>
                        </FormControl>
                    </Box>
                </>}

                {result && (
                    <div className='section1 h-auto flex flex-col gap-10 justify-between py-5 sm:py-10 sm:px-10 px-5 border shadow-1xl rounded-lg'>
                        <p className='text-right sm:px-10 font-semibold text-md'>Analysis Result</p>
                        <div className="flex flex-col gap-5 w-full">
                            <p className=' font-medium'>Emotion Status                        
                                 {result.score === 0 ? <label >😐</label> : result.score < 0 && result.score >= -3 ? <label>☹️</label> :
                                result.score < -3 ? <label>😭</label> : result.score > 0 && result.score <= 3 ? <label>😊</label> : <label>🥰</label>}</p>
                                <p className='font-medium'>Result: {result.score==0?(<label>Netural</label>):result.score>0?(<label>Positive</label>):(<label>Negative</label>)}</p>
                            <p className='font-medium'>Words: {result.tokens ?
                                result.tokens.map((e, i) => {
                                    if (i == result.tokens.length - 1) {
                                        return (
                                            <label key={i}>{e} </label>)
                                    } else {
                                        return (
                                            <label key={i}>{e}, </label>)
                                    }

                                }) : null}</p>



                            <p className='font-medium'>Negative Words: {result.negative ?
                                result.negative.map((e, i) => {
                                    if (i == result.negative.length - 1) {
                                        return (
                                            <label key={i}>{e} </label>)
                                    }
                                    return (
                                        <label key={i}>{e}, </label>)
                                }) : null}</p>
                            <p className='font-medium'>Positive Words: {result.positive ?
                                result.positive.map((e, i) => {
                                    if (i == result.positive.length - 1) {
                                        return (
                                            <label key={i}>{e} </label>)
                                    }
                                    return (
                                        <label key={i}>{e}, </label>)
                                }) : null}</p>
                            <p className='font-medium'>Comparative {result.comparative?.toFixed(2)}</p>
                            <p className='font-medium'>Score: {result.score}</p>


                        </div>

                    </div>
                )}
            </div>
            <div className="section2 sm:w-1/2 hidden p-5 sm:flex flex-col gap-2 justify-center items-center shadow-md border rounded-2xl">
                <h1 className='font-semibold text-3xl'>Emotion Meter</h1>
                {result && (
                    <>
                        {result.score === 0 ?
                            <p className='text-[8rem]'>😐</p> : result.score < 0 && result.score >= -3 ?
                                <p className='text-[8rem]'>☹️</p> :
                                result.score < -3 ?
                                    <p className='text-[8rem]'>😭</p> : result.score > 0 && result.score <= 3 ?
                                        <p className='text-[8rem]'>😊</p> :
                                        <p className='text-[8rem]'>🥰</p>}
                    </>
                )}
                <div className=''>
                    <ReactSpeedometer
                        width={500}
                        needleHeightRatio={0.7}
                        value={result.score}
                        minValue={-10}
                        maxValue={10}
                        customSegmentStops={[-10, -5, 0, 5, 10]}
                        currentValueText="Happiness Level"
                        customSegmentLabels={[
                            {
                                text: 'Very Bad',
                                color: '#555',
                            },
                            {
                                text: 'Bad',
                                color: '#555',
                            },
                            {
                                text: 'Good',
                                color: '#555',
                            },
                            {
                                text: 'Very Good',
                                color: '#555',
                            },
                        ]}
                        ringWidth={47}
                        needleTransitionDuration={3333}
                        // needleTransition="easeElastic"
                        needleColor={'#3b3c36 '}
                        textColor={'#3b3c36'}
                    />
                </div>

            </div>
        </div>
    )
}