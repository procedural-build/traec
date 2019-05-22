const get_query_string = ({
    refId = null, 
    fromDate = null, 
    toDate = null, 
    ignore_cache = false, 
    exclude_summary = false,
    format = null
}) => {
    const refId_ = refId ? `&refId=${refId}` : ''
    const fromDate_ =  fromDate ? `&fromDate=${fromDate}`: '';
    const toDate_ =  toDate ? `&toDate=${toDate}`: '';
    const ignoreCache = ignore_cache ? `&ignore_cache=true`: '';
    const excludeSummary = exclude_summary ? `&exclude_summary=true`: '';
    const format_ = format ? `&output_format=${format}`: '';
    let query_params = `?${refId_}${fromDate_}${toDate_}${ignoreCache}${excludeSummary}${format_}`;
    return query_params
}


export const getProjectReportingPeriods = ({
    projectId, 
    refId = null,
    fromDate = null, 
    toDate = null, 
    ignore_cache = null,
    exclude_summary = null,
    format = null
}) => {
    let query_params = get_query_string({refId, fromDate, toDate, ignore_cache, exclude_summary, format})
    const fetchParams = {
        method: 'GET',
        url: `/api/project/${projectId}/reporting_periods/${query_params}`,
        apiId: 'api_project_reporting_periods_list',
        requiredParams: ['projectId'],
        queryParms: {fromDate: null, toDate: null, ignore_cache: false}
    }
    let stateSetFunc = (state, action) => {
        let data = action.payload 
        let path = refId ? 
            `projectReportingPeriods.ref.${refId}.byId.${projectId}` : 
            `projectReportingPeriods.byId.${projectId}`
        return state.addListToDict(path, data)
    }
    // Adjust the headers based on if the format is excel
    if (format == 'excel') {
        Object.assign(fetchParams, {headers: {"content-type": 'application/xlsx'}})
        stateSetFunc = (state, action) => { return state };
    }
    //
    return {fetchParams, stateParams: {stateSetFunc}}
};


export const deleteProjectReportingPeriod = ({projectId, reportingPeriodId}) => {
    const fetchParams = {
        method: 'DELETE',
        url: `/api/project/${projectId}/reporting_periods/${reportingPeriodId}/`,
        apiId: 'api_project_reporting_periods_delete',
        requiredParams: ['projectId', 'reportingPeriodId'],
    }
    let stateSetFunc = (state, action) => {
        return state.removeInPath(`projectReportingPeriods.byId.${projectId}.${reportingPeriodId}`)
    }
    return {fetchParams, stateParams: {stateSetFunc}}
}


export const getProjectExcelReport = ({
    projectId, 
    refId = null,
    fromDate = null,
    toDate = null,
    ignore_cache = false
}) => {
    let query_params = get_query_string({refId, fromDate, toDate, ignore_cache, excludeSummary: null, format: 'excel'})
    const fetchParams = {
        method: 'GET',
        url: `/api/project/${projectId}/reporting_periods/excel/${query_params}`,
        headers: {"content-type": 'application/xlsx'},
        apiId: 'api_project_reporting_periods_excel_list',
        requiredParams: ['projectId'],
        queryParms: {fromDate: null, toDate: null, ignore_cache: false}
    }
    const stateSetFunc= (state, action) => {
        return state
    }
    return {fetchParams, stateParams: {stateSetFunc}}
};
