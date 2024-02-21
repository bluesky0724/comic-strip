import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';
import axios from 'axios';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { ComicData } from './utils/types';
import ComicCard from './components/ComicCard';

const ComicPage: React.FC = () => {
    const { comicNumber } = useParams<{ comicNumber?: string }>();
    const [comicData, setComicData] = useState<ComicData | null>(null);
    const [visitCount, setVisitCount] = useState(0);
    const [latestPageNum, setLatestPageNum] = useState<number | null>(null);

    useEffect(() => {
        const fetchLatestPageNum = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/latest-page-num');
                const latestData = response.data;
                setLatestPageNum(latestData);
            } catch (error) {
                console.error('Error fetching latest comic data:', error);
            }
        };

        fetchLatestPageNum();
    }, []);
    useEffect(() => {
        const fetchComicData = async () => {
            try {
                let response;
                if (comicNumber) {
                    response = await axios.get(`http://localhost:5000/api/comic/${comicNumber}`);
                } else {
                    response = await axios.get('http://localhost:5000/api/latest');
                }
                const data: ComicData = response.data.data;
                const count = response.data.count;
                setComicData(data);
                setVisitCount(count);
            } catch (error) {
                console.error(`Error fetching comic data for comic number ${comicNumber || 'latest'}:`, error);
                setComicData(null);
            }
        };

        fetchComicData();
    }, [comicNumber]);
    const prevComicNumber = useMemo(() => {
        return comicData ? comicData.num - 1 : undefined;
    }, [comicData]);

    const nextComicNumber = useMemo(() => {
        return comicData ? comicData.num + 1 : undefined;
    }, [comicData]);


    const getRandomPageNumber = useCallback(() => {
        if (!latestPageNum) return 1;
        return Math.floor(Math.random() * latestPageNum!) + 1;
    }, [latestPageNum]);


    return (
        <Container maxWidth="md">
            <Box display="flex" justifyContent="center" mt={2} mb={2} alignItems="center">
                {prevComicNumber !== undefined && (

                    <Button disabled={comicData?.num === 1 || comicData === null} component={Link} to={`/${prevComicNumber}`} variant="text" color="primary" style={{ marginRight: '10px' }} aria-label="delete" size="large">
                        <NavigateBeforeIcon />
                    </Button>
                )}
                <Typography fontSize={22}>
                    {comicData && `Page ${comicData.num}`}
                </Typography>
                <Box>
                    <Button component={Link} to={`/${getRandomPageNumber()}`} variant="text" color="primary">
                        <QuestionMarkIcon />
                    </Button>
                    {nextComicNumber !== undefined && (
                        <Button disabled={(comicData !== null && latestPageNum !== null && (comicData?.num >= latestPageNum)) || comicData === null} component={Link} to={`/${nextComicNumber}`} variant="text" color="primary" style={{ marginLeft: '10px' }}>
                            <NavigateNextIcon />
                        </Button>
                    )}

                </Box>
            </Box>
            <Typography variant="subtitle1" align="center" mt={2}>
                Visit Count: {visitCount}
            </Typography>
            {comicData ? (
                <ComicCard comicData={comicData} />
            ) : <Typography variant="h5" component="h2" align="center" mt={2}>
                No data for this page
            </Typography>}
        </Container>
    );
};

export default ComicPage;