import { takeEvery, takeLatest } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import request from 'axios'
import {fromJS} from 'immutable'

import * as ac from '../actions/action_creators.js'

const BASE_URL = 'http://experiment-server2016.herokuapp.com/'
const BASE_URL_APP = BASE_URL + "applications"
const BASE_URL_APP_P = BASE_URL_APP + "/"
/**
 * TODO many of sagas simply call to getApplicationData after their job is done
 * maybe it would be faster to recreate state in reducers. 
 */


/**
 * Function to get all Applications from backend, uses Redux-Saga middleware
 * to make calls allmost syncronius. Also very easy to test.
 * Please use export syntax before function* call to pass function* to tests.
 *
 * What it actually does it wraps GET request to promise and after it has resolved
 * calls setState Action Creator.
 */
export function* getApps() {
  try {
    const data = yield call(request.get, (BASE_URL_APP) );
    yield put(ac.setState( data.data ));
  } catch (err) {
    put(ac.setState( [] ));
  }

}

/**
 * Function to Post new Application to DB.
 * Uses data.data since axios return object is full of everything.
 * And we only want actual return payload.
 */
export function* postApp(action){
  try {
    const data = yield call( request.post, (BASE_URL_APP), { name: action.name } );
    yield put( ac.addApplication(data.data) );
  } catch (err) {
    console.log(err);
    yield put(ac.errorScreen(err))
  }
}

/**
 *  Gets id from action and calls backend to delete given
 */

export function* deleteApp(action){
  try{
    yield call( request.delete, (BASE_URL_APP_P + action.id),  );
    yield put( ac.removeApplication(action.id) );
  } catch(err){
    console.log(err);
  }
}

export function* getAppData(action){
  try{
    const data = yield call(request.get, (BASE_URL_APP_P  + action.id + '/data') );
    yield put( ac.setApplicationData(data.data) )
  } catch(err){
    console.log(err)
  }
}
/**
 * configurationkeys
 */
export function* delConfig(action){
  try{
    yield call( request.delete, (BASE_URL_APP_P + action.data.appId + '/configurationkeys/' + action.data.keyId ),  );
    yield put( ac.getApplicationData(action.data.appId) );
  } catch(err){
    console.log(err);
  }
}
export function* addConfig(action){
  try{
    yield call( request.post, (BASE_URL_APP_P + action.data.appId + '/configurationkeys'),
              { name: action.data.payload.name, type: action.data.payload.type, application_id:action.data.appId }  );
    yield put( ac.getApplicationData(action.data.appId) ); //TODO check actual return and maybe use that.
  } catch(err){
    console.log(err);
  }
}
//TODO test
export function* delAllConfig(action){
  try{
    yield call(request.delete, (BASE_URL_APP_P + action.id + '/configurationkeys'));
    yield put(ac.getApplicationData(action.id))
  } catch(e){
    console.log(e);
  }
}
/**
 * Operator
 */
export function* getOperations(){
  try {
    const data = yield call(request.get, (BASE_URL + 'operators'))
    yield put(ac.setOperators(data.data))
  } catch (e) {
    console.log(e);
  }
}
export function* postRangeKey(action){
  try{
    yield call(request.post, (BASE_URL_APP_P + action.payload.appId+
    "/configurationkeys/" + action.payload.constkey + "/rangeconstraints"),
     {
       configurationkey_id: action.payload.constkey,
     operator_id: action.payload.operator,
     value: action.payload.value} );
    yield put(ac.getApplicationData(action.payload.appId))
  } catch(e){
    console.log(e);
  }
}
export function* deleteRangeKey(action){
  try{
    yield call(request.delete, (BASE_URL_APP_P + action.payload.appId+
    "/configurationkeys/" + action.payload.constkey + "/rangeconstraints/" + action.payload.rangeKey))
    yield put(ac.getApplicationData(action.payload.appId))
  } catch(e){
    console.log(e);
  }
}

/**
 * Since you have to tell saga how you want your actions handled
 * there needs to some listerner methods.
 * takeEvery means saga creates buffer and listens every one incoming actions
 * and handles them one by one.
 */
function* deleteAllConfigKeysSaga(){
  yield* takeEvery('DELETE_ALL_CONFIG',delAllConfig)
}

function* deleteConfigKeySaga(){
     yield* takeEvery("DELETE_CONFIGURATION_KEY", delConfig);
 }
function* getApplicationsSaga(){
    yield* takeEvery("GET_APPLICATIONS", getApps);
}

function* postSaga(){
      yield* takeEvery("POST_APPLICATION", postApp)
}
function* deleteApplicationSaga(){
      yield* takeEvery("DELETE_APPLICATION", deleteApp)
}
function* getApplicationDataSaga(){
  yield* takeEvery("GET_APPLICATION_DATA", getAppData)
}
function* postConfigKeySaga(){
  yield* takeEvery("POST_CONFIGURATION_KEY", addConfig)
}
function* getOperationsSaga(){
  yield* takeEvery("GET_OPERATIONS", getOperations)
}
function* postRangeKeySaga(){
  yield* takeEvery("POST_RANGE", postRangeKey)
}
function* deleteRangeKeySaga(){
  yield* takeEvery("DELETE_RANGE", deleteRangeKey)
}

/**
 * And rootSaga to implement all Sagas to store.
 */

export function* rootSaga() {
    yield[
        getApplicationDataSaga(),getApplicationsSaga(),postSaga(),
        deleteApplicationSaga(), deleteConfigKeySaga(),postConfigKeySaga(),
        getOperationsSaga(),postRangeKeySaga(),deleteRangeKeySaga(),
        deleteAllConfigKeysSaga()]

}
