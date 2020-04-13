const isEmpty = (string) => {
  if (string.trim() === '') {
    return true;
  } else {
    return false;
  }
};

const reduceUserDetails = (data) => {
  const userDetails = {};
  if (!isEmpty(data.name.trim())) userDetails.name = data.name;
  if (!isEmpty(data.bio.trim())) userDetails.bio = data.bio;
  if (!isEmpty(data.website.trim())) {
    if (data.website.trim().substring(0, 4) !== 'http') {
      userDetails.website = `http://${data.website.trim()}`;
    } else {
      userDetails.website = data.website;
    }
  }
  if (!isEmpty(data.location.trim())) userDetails.location = data.location;
  data.photoURL = 'test';
  return userDetails;
};

module.exports = { isEmpty, reduceUserDetails };
