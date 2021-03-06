// @flow
import { WORKSPACES_URL } from "../constants/API"
import {
  WORKSPACES_FETCH_DETAILS_FAILURE,
  WORKSPACES_FETCH_DETAILS_SUCCESS,
  WORKSPACES_FETCH_HISTORIC_DATA_FAILURE,
  WORKSPACES_FETCH_HISTORIC_DATA_SUCCESS,
  WORKSPACES_FETCH_SEATINFOS_FAILURE,
  WORKSPACES_FETCH_SEATINFOS_SUCCESS,
  WORKSPACES_IS_FETCHING_DETAILS,
  WORKSPACES_IS_FETCHING_HISTORIC_DATA,
  WORKSPACES_IS_FETCHING_SEATINFOS,
  WORKSPACES_SET_SEARCH_QUERY,
  WORKSPACES_SET_SORT_TYPE,
  WORKSPACES_TOGGLE_FAVOURITE,
} from "../constants/studyspacesConstants"
import ApiManager from "../lib/ApiManager"

export const setIsFetchingSeatInfos = () => ({
  type: WORKSPACES_IS_FETCHING_SEATINFOS,
})

export const fetchSeatInfosSuccess = (data, lastModified) => ({
  data,
  lastModified,
  type: WORKSPACES_FETCH_SEATINFOS_SUCCESS,
})

export const fetchSeatInfosFailure = (error) => ({
  error,
  type: WORKSPACES_FETCH_SEATINFOS_FAILURE,
})

export const fetchSeatInfos = (token: String) => async (dispatch: Function) => {
  await dispatch(setIsFetchingSeatInfos())
  try {
    const {
      data,
      lastModified,
    } = await ApiManager.workspaces.getSummary(token)
    return dispatch(fetchSeatInfosSuccess(data, lastModified))
  } catch (error) {
    return dispatch(
      fetchSeatInfosFailure(error.message),
    )
  }
}

export const setIsFetchingAverages = (id: Number) => ({
  id,
  type: WORKSPACES_IS_FETCHING_HISTORIC_DATA,
})

export const fetchAveragesSuccess = (id: Number, dailyAverages) => ({
  dailyAverages,
  id,
  type: WORKSPACES_FETCH_HISTORIC_DATA_SUCCESS,
})

export const fetchAveragesFailure = (id: Number, error) => ({
  error,
  id,
  type: WORKSPACES_FETCH_HISTORIC_DATA_FAILURE,
})

export const fetchAverages = (token: String, id: Number) => async (
  dispatch: Function,
) => {
  await dispatch(setIsFetchingAverages(id))
  try {
    const res = await fetch(`${WORKSPACES_URL}/historic?id=${id}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
    const json = await res.json()
    if (!res.ok) {
      throw new Error(json.error || `There was a problem`)
    }
    return dispatch(fetchAveragesSuccess(id, json.content))
  } catch (error) {
    return dispatch(
      fetchAveragesFailure(
        id,
        error.message,
      ),
    )
  }
}

export const toggleFavourite = (id: Number) => ({
  id,
  type: WORKSPACES_TOGGLE_FAVOURITE,
})

export const setSearchQuery = (query: String) => ({
  query,
  type: WORKSPACES_SET_SEARCH_QUERY,
})

export const setSortType = (sortType: String) => ({
  sortType,
  type: WORKSPACES_SET_SORT_TYPE,
})

export const setIsFetchingDetails = () => ({
  type: WORKSPACES_IS_FETCHING_DETAILS,
})

export const fetchDetailsSuccess = (studySpaces) => ({
  studySpaces,
  type: WORKSPACES_FETCH_DETAILS_SUCCESS,
})

export const fetchDetailsFailure = (error) => ({
  error,
  type: WORKSPACES_FETCH_DETAILS_FAILURE,
})

export const fetchDetails = (token: String) => async (
  dispatch: Function,
) => {
  try {
    dispatch(setIsFetchingDetails())

    const {
      data: studySpaces,
    } = await ApiManager.workspaces.getWorkspaces(token)
    return dispatch(fetchDetailsSuccess(studySpaces))
  } catch (error) {
    return dispatch(
      fetchDetailsFailure(
        error.message,
      ),
    )
  }
}
