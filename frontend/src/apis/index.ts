import axios from "axios";
import { ComicDataDto } from "../utils/types";

const baseURL = process.env.REACT_APP_BASE_URL;

const axiosClient = new axios.Axios({
    baseURL,
});

console.log("base url is", baseURL);

export const getLatestComicNum = async (): Promise<number> => {
    const response = await axiosClient.get(`latest-page-num`);
    return JSON.parse(response.data);
}

export const getLatestComic = async (): Promise<ComicDataDto> => {
    const response = await axiosClient.get(`latest`);
    return JSON.parse(response.data);
}

export const getComic = async (pageNum: string | number): Promise<ComicDataDto> => {
    const response = await axiosClient.get(`comic/${pageNum}`);
    return JSON.parse(response.data);
}