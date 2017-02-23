import Code from '../config/responseCode';
import {responseByCode} from '../helpers/helper';
import {Match} from '../models/match';
import {getPercentage} from '../helpers/helper';

/*
  {
    isLike: 1 / -1,
    videos: {
      id, // videosId
      which // -1 / 1
    }
  }
*/
const LIKE = 1;
const DISLIKE = -1;

async function updateLikes (req, res) {
  let {isLike, videos: { id, which } } = req.body;
  let likes, percentage;
  try {
    if (isLike === LIKE) {
      likes = await Match.upLikes(id, which)
    } else if (isLike === DISLIKE) {
      likes = await Match.downLikes(id, which);
    }

    if (likes) {
      percentage = getPercentage(likes);
    } else {
      percentage = {};
    }

    res.json({code: Code.PUT_MATCH_SUCCESS, data: {likes, percentage}});
  } catch (e) {
    if (e === -1) {
      responseByCode(res, Code.DOCS_NOT_FOUND, 400);
    } else {
      responseByCode(res, Code.PUT_MATCH_FAIL, 400);
    }
  }
}

/*
  {
    videos: {
      id
    }
  }
*/
async function updateViews (req, res) {
  let {videos: {id}} = req.body;

  try {
    let views = await Match.viewed(id);

    res.json({code: Code.PUT_MATCH_SUCCESS, data: views});
  } catch (e) {
    console.log(e);
    responseByCode(res, Code.PUT_MATCH_FAIL, 400);
  }
}

module.exports = {
  updateLikes,
  updateViews
};