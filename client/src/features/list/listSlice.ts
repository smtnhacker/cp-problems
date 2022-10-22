import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState, AppThunk } from "../../app/store";
import model from "../../model/ListModel";
import { TagScore } from "../../util/tagScoreReducers";
import { EntryHeader, EntryItem, ListState } from "../types/list";

const initialState: ListState = {
  value: [],
  all: [],
  tagScore: {},
  status: 'idle'
};

const processData = (obj: any[]): any[] => {
  return obj
  // return Object.keys(obj).map((key: any): EntryItem => (obj[key] as EntryItem));
}

const getCurDate = (): string => {
  return (new Date()).toISOString()
}

export const addItem = createAsyncThunk(
  'list/addItem',
  async (newItem: EntryItem) => {
    try {
      const withDate: EntryItem = {
        ...newItem,
        createdAt: getCurDate(),
        lastModified: getCurDate(),
      }
      const response = await model.addItem(withDate);
      const { error, data } = response
      if (error) {
        console.log(error)
        throw error
      }
      return data as EntryItem
    } catch (err: any) {
      console.log(err)
      throw err
    }
  }
)

export const updateItem = createAsyncThunk(
  'list/updateItem',
  async (updatedItem: EntryItem) => {
    try {
      const withDate: EntryItem = {
        ...updatedItem,
        lastModified: getCurDate()
      }
      const response = await model.addItem(withDate);
      const { error, data } = response
      if (error) {
        console.log((error as any).message)
        throw error
      }
      return data as EntryItem
    } catch (err: any) {
      console.log(err)
      throw err
    }
  }
)

export const fetchItems = createAsyncThunk(
  'list/fetchItems',
  async (amount: number): Promise<EntryHeader[]> => {
    try {
      const response = await model.fetchAllItems(amount);
      const data = response.data
      // console.table(data);
      return data
    } catch (err: any) {
      console.log(err);
    }
  }
)

export const fetchUserItems = createAsyncThunk(
  'list/fetchUserItems',
  async (authorID: string) => {
    try {
      const response = await model.fetchUserItems(authorID);
      const data = response.data
      // console.log(data);
      return data
    } catch (err: any) {
      console.log(err);
    }
  }
)

export const deleteItem = createAsyncThunk(
  'list/deleteItem',
  async (entry: EntryItem) => {
    try {
      const response = await model.deleteItem(entry);
      const data = (response.data as any).id;
      return data;
    } catch (err: any) {
      console.log(err);
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
    setTagScores: (state: ListState, action: PayloadAction<TagScore>) => {
      state.tagScore = { ...action.payload }
    }
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
          state.all = [action.payload, ...state.all];
        }
      })
      .addCase(addItem.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(updateItem.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        if (action.payload === undefined) {
          throw new Error("Action payload is undefined");
        }
        else {
          state.status = 'idle';
          state.value = state.value.map((entry: EntryItem) => {
            if (entry.id === action.payload.id) {
              return action.payload
            } else {
              return entry
            }
          });
          state.all = state.all.map((entry: EntryHeader) => {
            if (entry.id === action.payload.id) {
              return action.payload
            } else {
              return entry
            }
          })
        }
      })
      .addCase(updateItem.rejected, (state) => {
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
          state.all = [...action.payload];
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
        state.all = state.all.filter(entry => entry.id !== action.payload)
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

export const uploadTagScores = (payload: TagScore): AppThunk =>(dispatch, getState) => {
    console.log("UPLOADING", payload)
    dispatch(listSlice.actions.setTagScores(payload))
  };

export const selectList = (state: RootState) => state.list.value;
export const selectPosts = (state: RootState) => state.list.all;
export const selectStatus = (state: RootState) => state.list.status;
export const selectTagScores = (state: RootState) => state.list.tagScore

export const getPost = async (id: string): Promise<EntryItem> => {
  const { error, errorCode, data} = await model.fetchPost(id);
  if (errorCode && errorCode === 404) {
    throw error
  } else if (error) {
    throw error
  } else {
    return data
  }
}

export default listSlice.reducer