import {mongoose}       from '../config/mongodb';
import {matchingHelper, generateVideoData} from '../helpers/helper';
import {Schema}         from 'mongoose';


const VideoSchema = new mongoose.Schema({
  title:      { type: String, required: true },
  content:    { type: String },
  videoId:    { type: String, requied: true },
  champion:   { type: String, required: true },
  position:   { type: String, required: true },
  tier:       { type: String, required: true },
  attribute:  { type: String, required: true },
  matched:    { type: Boolean, default: false },
  main:       { type: Number, default: 0 },
  owner:      { type: Schema.Types.ObjectId }
});

VideoSchema.statics.getVideos = function () {
  let Video = this;

  return Video.find({}).then((videos) => {
    return videos.map((video) => generateVideoData(video));
  });
}

VideoSchema.statics.getOwner = function (videoId) {
  let Video = this;

  return Video.findOne({ videoId }).then((video) => {
    return video.owner;
  });
}

VideoSchema.statics.match = function (videoId) {
  let Video = this;
  let target, enemy;

  return new Promise((resolve, reject) => {
    Video.find({matched: false}).then((videos) => {
      videos = videos.filter((video) => {
        if (video.videoId !== videoId) {
          return true;
        } else {
          target = video;
          return false;
        }
      });

      enemy = matchingHelper(target, videos);

      if(enemy) {
        Video.update({
          $or: [{videoId: enemy.videoId}, {videoId: target.videoId}]
        }, {
          $set: {matched: true}
        }, {
          multi: true
        }).then(() => resolve(generateVideoData(enemy)))
      } else {
        resolve({});
      }
    }).catch((err) => {
      reject(err);
    })
  });
}

VideoSchema.methods.upload = function() {
  let video = this;

  return new Promise((resolve, reject) => {
    return video.save()
      .then(() => resolve(generateVideoData(video)))
      .catch((e) => rejct(e));
  });
}

VideoSchema.statics.delete = function(videoId) {
  let Video = this;

  return new Promise((resolve, reject) => {
    Video.findOneAndRemove({ videoId }, null, (err, video) => {
      if (video) {
        resolve(generateVideoData(video));
      } else {
        reject();
      }
    });
  });
}

const Video = mongoose.model('video', VideoSchema);

module.exports = {Video};
