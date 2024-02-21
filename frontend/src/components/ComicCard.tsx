import React from 'react';
import { Typography, Card, CardContent, CardMedia, Grid } from '@mui/material';
import { ComicData } from '../utils/types';

interface PropType {
    comicData: ComicData;
}

export default function ComicCard({ comicData }: PropType) {
    return (
        <Card sx={{ margin: 'auto', padding: '10px' }}>
            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} sm={6}>
                    <CardMedia
                        component="img"
                        height="auto"
                        image={comicData.img}
                        alt={comicData.alt}
                        style={{ maxWidth: 1000, maxHeight: 600, width: '100%', margin: 'auto', objectFit: 'contain' }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <CardContent>
                        <Typography variant="h5" component="h2" gutterBottom>
                            {comicData.title}
                        </Typography>
                        <Typography color="text.secondary" gutterBottom>
                            {comicData.day}/{comicData.month}/{comicData.year}
                        </Typography>
                        <Typography variant="body2" component="p" gutterBottom>
                            {comicData.transcript?.split('\n').map((line, index) => (
                                <React.Fragment key={index}>
                                    {line}<br />
                                </React.Fragment>
                            ))}
                        </Typography>
                    </CardContent>
                </Grid>
            </Grid>
        </Card>
    )
} 