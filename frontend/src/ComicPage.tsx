import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Typography, Button, Box, Stack } from '@mui/material';
import axios from 'axios';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { ComicData } from './utils/types';
import ComicCard from './components/ComicCard';
import { getComic, getLatestComic, getLatestComicNum } from './apis';

const ComicPage: React.FC = () => {
    const { comicNumber } = useParams<{ comicNumber?: string }>();
    const [comicData, setComicData] = useState<ComicData | null>(null);
    const [visitCount, setVisitCount] = useState(0);
    const [latestPageNum, setLatestPageNum] = useState<number | null>(null);

    const baseURL = process.env.REACT_APP_PUBLIC_URL;

    useEffect(() => {
        const fetchLatestPageNum = async () => {
            try {
                const response = await getLatestComicNum();
                setLatestPageNum(response);
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
                    response = await getComic(comicNumber);
                } else {
                    response = await getLatestComic();
                }
                const data: ComicData = response.data;
                console.log("comic data is", data);
                const count = response.count;
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
            <Typography variant="subtitle1" fontSize={26} align="center" mt={6}>
                Visit Count: {visitCount}
            </Typography>
            <Stack flexGrow={1} justifyContent="center">
                {comicData ? (
                    <ComicCard comicData={comicData} />
                ) : <Typography variant="h5" component="h2" align="center" mt={2}>
                    No data for this page
                </Typography>}
            </Stack>
            <Box display="flex" justifyContent="center" mt={2} mb={6} alignItems="center" gap="20px">
                {prevComicNumber !== undefined && (

                    <Button style={{ width: '150px' }} disabled={comicData?.num === 1 || comicData === null} component={Link} to={`/${prevComicNumber}`} variant="contained" color="primary" aria-label="delete">
                        Previous
                    </Button>
                )}
                <Typography fontSize={22}>
                    {comicData && `${comicData.num}`}
                </Typography>
                {nextComicNumber !== undefined && (
                    <Button style={{ width: '150px' }} disabled={(comicData !== null && latestPageNum !== null && (comicData?.num >= latestPageNum)) || comicData === null} component={Link} to={`/${nextComicNumber}`} variant="contained" color="primary">
                        Next
                    </Button>
                )}
            </Box>
        </Container>
    );
};

export default ComicPage;