import axios from "axios";

import { API_ENDPOINT } from "../config"
import { EntryItem } from "../features/types/list"

interface EntryItemResponse {
    data: {
        [key: string]: EntryItem
    }
}

class ListModel {
    private api: string;

    constructor(api: string) {
        this.api = api + '/list';
    }

    async fetchAllItems() {
        try {
            const response: EntryItemResponse = await axios.get(`${this.api}`);
            return response;
        } catch (err) {
            console.log(err);
            return { data: [] }
            // throw err;
        }
    }

    async addItem(newItem: EntryItem) {
        try {
            const response: { data: EntryItem } = await axios.post(`${this.api}`, {
                    payload: newItem
                });
            return response;
        } catch (err) {
            console.log(err);
            return { data: [] }
            // throw err;
        }
    }

    async deleteItem(entryID: string) {
        try {
            const response: { data: {id: string} } = await axios.delete(`${this.api}/${entryID}`);
            return response;
        } catch (err) {
            console.log(err);
            return { data: [] }
            // throw err;
        }
    }
}

export default new ListModel(API_ENDPOINT)