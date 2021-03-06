import { takeEvery, takeLatest } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import request from 'axios'

import { setExperiments } from '../../actions/experimentAC'

const BASE_URL = 'http://experiment-server2016.herokuapp.com/applications/'


export function* getExperiments(action){
  try{
    const data = yield call(request.get,(BASE_URL + action.id + "/experiments"));
    yield put(setExperiments( data.data ))
  } catch(e){
    console.log(e);
  }
}

export function* getExperimentsSaga(){
  yield* takeEvery("GET_EXPERIMENTS", getExperiments)
}
