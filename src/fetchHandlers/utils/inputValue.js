import Im from "../../immutable";

export const isString = i => {
  return typeof i === "string" || i instanceof String;
};

export const addValueToState = (state, commitId, item) => {
  let imItem = Im.fromJS(item);
  /* Save the input as a */
  let newState = state;
  // Strip out the parts
  let metricScoreId = null;
  let baseMetricId = null;
  if (isString(item.metric)) {
    metricScoreId = item.metric;
    metricScore = newState.getInPath(`metricScores.byId.${metricScoreId}`);
    baseMetricId = metricScore.objects.get("metric");
    imItem = imItem.set("baseMetric", baseMetricId);
  } else {
    baseMetricId = item.metric.metric.uid;
    metricScoreId = item.metric.uid;
    // Add the baseMetric and metricScore objects to flat lists
    newState = newState.addToDict(`baseMetrics.byId`, item.metric.metric);
    newState = newState.setInPath(
      `metricScores.byId.${metricScoreId}`,
      Im.fromJS(item.metric).set("metric", baseMetricId)
    );
    // Change the immutable object to have referenced to these objects
    imItem = imItem.set("metric", metricScoreId);
    imItem = imItem.set("baseMetric", baseMetricId);
  }
  // Add indexed against metricScore
  newState = newState.setInPath(`commitEdges.byId.${commitId}.scoreValues.${metricScoreId}.values.${item.uid}`, imItem);
  // Add to an indexed list by baseMetric
  newState = newState.setInPath(
    `commitEdges.byId.${commitId}.bmScoreValues.${baseMetricId}.values.${item.uid}`,
    imItem
  );
  return newState;
};
