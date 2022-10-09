import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState, AppThunk } from "../../app/store";
import model from "../../model/ListModel";
import { Tag, EntryItem, ListState } from "../types/list";

const initialState: ListState = {
  value: [],
  status: 'idle'
};

const processData = (obj: any): EntryItem[] => {
  return Object.keys(obj).map((key: any): EntryItem => (obj[key] as EntryItem));
}

export const addItem = createAsyncThunk(
  'list/addItem',
  async (newItem: EntryItem) => {
    try {
      const response = await model.addItem(newItem);
      const { error, data } = response
      if (error) {
        console.log((error as any).message)
        throw error
      }
      return data as EntryItem
    } catch (err: any) {
      console.log(err.message)
      throw err
    }
  }
)

export const fetchItems = createAsyncThunk(
  'list/fetchItems',
  async () => {
    try {
      const response = await model.fetchAllItems();
      const data = processData(response.data)
      console.log(data);
      return data
    } catch (err: any) {
      console.log(err.message);
    }
  }
)

export const fetchUserItems = createAsyncThunk(
  'list/fetchUserItems',
  async (authorID: string) => {
    try {
      const response = await model.fetchUserItems(authorID);
      const data = processData(response.data)
      console.log(data);
      return data
    } catch (err: any) {
      console.log(err.message);
    }
  }
)

export const deleteItem = createAsyncThunk(
  'list/deleteItem',
  async (id: string) => {
    try {
      const response = await model.deleteItem(id);
      const data = (response.data as any).id;
      return data;
    } catch (err: any) {
      console.log(err.message);
    }
  }
)

export const listSlice = createSlice({
  name: "list",
  initialState,
  reducers: {
    // Sample reducer
    // addItemSynch: (state: ListState, action: PayloadAction<EntryItem>) => {
    //   state.value = [action.payload, ...state.value]
    // },
  },
  extraReducers: builder => {
    builder
      .addCase(addItem.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addItem.fulfilled, (state, action) => {
        if (action.payload === undefined) {
          throw new Error("Action payload is undefined");
        }
        else {
          state.status = 'idle';
          state.value = [action.payload, ...state.value];
        }
      })
      .addCase(addItem.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(fetchItems.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        if (action.payload === undefined) {
          throw new Error("Action payload is undefined");
        }
        else {
          state.status = 'idle';
          state.value = [...action.payload];
        }
      })
      .addCase(fetchItems.rejected, (state) => {
        state.status = 'failed'
      })
      .addCase(deleteItem.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.status = 'idle'
        state.value = state.value.filter(entry => entry.id !== action.payload)
      })
      .addCase(deleteItem.rejected, (state) => {
        state.status = 'failed'
      })
      .addCase(fetchUserItems.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchUserItems.fulfilled, (state, action) => {
        if (action.payload === undefined) {
          throw new Error("Action payload is undefined");
        }
        else {
          state.status = 'idle';
          state.value = [...action.payload];
        }
      })
      .addCase(fetchUserItems.rejected, (state) => {
        state.status = 'failed'
      })
  }
});

export const selectList = (state: RootState) => state.list.value;

export default listSlice.reducer