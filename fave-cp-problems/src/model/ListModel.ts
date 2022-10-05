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
            return { error: null, data: response.data };
        } catch (err) {
            console.log(err);
            return { error: err, data: [] }
        }
    }

    async addItem(newItem: EntryItem) {
        try {
            const response: { data: EntryItem } = await axios.post(`${this.api}`, {
                    payload: newItem
                });
            return { error: null, data: response.data };
        } catch (err) {
            console.log(err);
            return { error: err, data: null }
        }
    }

    async deleteItem(entryID: string) {
        try {
            const response: { data: {id: string} } = await axios.delete(`${this.api}/${entryID}`);
            return { error: null, data: response.data };
        } catch (err) {
            console.log(err);
            return { error: err, data: "" }
        }
    }
}

export default new ListModel(API_ENDPOINT)