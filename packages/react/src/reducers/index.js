import { combineReducers } from 'redux';
import { documents } from './documents.reducer';

const rootReducer = combineReducers({
  documents
});

export default rootReducer;