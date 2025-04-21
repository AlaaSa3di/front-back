// utils/apiFeatures.js
function applyApiFeatures(query, queryString) {
  let resultQuery = query;
  
  // 1. Filtering
  const queryObj = { ...queryString };
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach(el => delete queryObj[el]);
  
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
  resultQuery = resultQuery.find(JSON.parse(queryStr));
  
  // 2. Sorting
  if (queryString.sort) {
    const sortBy = queryString.sort.split(',').join(' ');
    resultQuery = resultQuery.sort(sortBy);
  } else {
    resultQuery = resultQuery.sort('-createdAt');
  }
  
  // 3. Field limiting
  if (queryString.fields) {
    const fields = queryString.fields.split(',').join(' ');
    resultQuery = resultQuery.select(fields);
  } else {
    resultQuery = resultQuery.select('-__v');
  }
  
  // 4. Pagination
  const page = queryString.page * 1 || 1;
  const limit = queryString.limit * 1 || 100;
  const skip = (page - 1) * limit;
  resultQuery = resultQuery.skip(skip).limit(limit);
  
  return resultQuery;
}

module.exports = applyApiFeatures;