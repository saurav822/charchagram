import mongoose from 'mongoose';
import { uuid } from 'zod';

// Define valid party names
const VALID_PARTIES = [
  'BJP', 'Congress', 'AAP', 'Shiv Sena', 'NCP', 'MNS', 
  'Samajwadi Party', 'BSP', 'TMC', 'DMK', 'AIADMK', 'RJD', 'JDU'
];

// Survey score schema
const surveyScoreSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  yes_votes: [{
    type: String,
    required: false,
  }],
  no_votes: [{
    type: String,
    required: false,
  }],
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  }
}, { _id: false });

const deptSurveyScoreSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  ratings: {
    "1": [{ type: String, required: false }], // Array of strings for 1 star ratings
    "2": [{ type: String, required: false }], // Array of strings for 2 star ratings
    "3": [{ type: String, required: false }], // Array of strings for 3 star ratings
    "4": [{ type: String, required: false }], // Array of strings for 4 star ratings
    "5": [{ type: String, required: false }]  // Array of strings for 5 star ratings
  },
  score: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  }
}, { _id: false });
// Department info schema
const deptInfoSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,  
  },
  dept_name: {
    type: String,
    required: true,
    trim: true
  },
  work_info: [{
    type: String,
    trim: true
  }],
  survey_score: [deptSurveyScoreSchema],
  average_score: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  }
}, { _id: false });

// Other candidates schema
const otherCandidatesSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    // validate: {
    //   validator: function(v) {
    //     // UUID validation will be handled at the application level
    //     return true;
    //   },
    //   message: props => `${props.value} is not a valid UUID!`
    // }
  },
  candidate_name: {
    type: String,
    required: false,
    trim: true
  },
  candidate_image_url: {
    type: String,
    required: false,
    trim: true,
    // match: /^https?:\/\/.+/, // Must be a valid URL
    // message: 'Candidate image URL must be a valid HTTP/HTTPS URL'
  },
  candidate_party: {
    type: String,
    required: false,
    // enum: VALID_PARTIES,
    // message: props => `${props.value} is not a valid party name!`
  },
  vote_share: {
    type: String,
    required: false    
  },
  candidate_party_icon_url: {
    type: String,
    required: false,
  }
}, { _id: false });

// Latest news schema
const latestNewsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: false,
    trim: true
  }
}, { _id: false });

// Main constituency schema
const constituencySchema = new mongoose.Schema({
  area_name: {
    type: String,
    required: true,
    // unique: true,
    trim: true
  },  
  english_name: {
    type: String,
    required: false,
    trim: true
  },
  vidhayak_info: {
    name: {
      type: String,
      required: false,
      trim: true
    },
    image_url: {
      type: String,
      required: false,
      trim: true
    },
    age: {
      type: String, // Changed from Number to String to accept "--"
      required: false,
      trim: true
    },
    last_election_vote_percentage: {
      type: String,
      required: false
    },
    experience: {
      type: String, // Changed from Number to String to accept "--"
      required: false
    },
    party_name: {
      type: String,
      required: false
    },
    party_icon_url: {
      type: String,
      required: false,
      trim: true
    },
    manifesto_link: {
      type: String,
      required: false // Changed from true to false
    },
    manifesto_score: {
      type: Number,
      required: false
    },
    metadata: {
      education: {
        type: String,
        required: false,
        trim: true
      },
      net_worth: {
        type: String,
        required: false,
        trim: true
      },
      criminal_cases: {
        type: String, // Changed from Number to String to accept "--"
        required: false
      },
      attendance: {
        type: String,
        required: false
      },
      questions_asked: {
        type: String, // Changed from Number to String to accept "--"
        required: false
      },
      funds_utilisation: {
        type: String,
        required: false
      }
    },
    survey_score: [surveyScoreSchema]
  },
  dept_info: [deptInfoSchema],
  other_candidates: [otherCandidatesSchema],
  latest_news: [latestNewsSchema]
}, {
  timestamps: true,
  collection: 'constituencies'
});

// Create index on area_name for fast querying
constituencySchema.index({ area_name: 1 });
constituencySchema.index({ english_name: 1 });

// Pre-save middleware to ensure unique IDs in dept_info
constituencySchema.pre('save', function(next) {
  if (this.dept_info && this.dept_info.length > 0) {
    const ids = this.dept_info.map(dept => dept.id);
    const uniqueIds = new Set(ids);
    
    if (ids.length !== uniqueIds.size) {
      return next(new Error('Department IDs must be unique within a constituency'));
    }
  }
  next();
});

// Static method to get all constituency names
constituencySchema.statics.getAllAreaNames = function() {
  return this.find({}, 'area_name english_name').sort({ area_name: 1 });
};

constituencySchema.statics.getAllEnglishNames = function() {
  return this.find({}, 'english_name').sort({ english_name: 1 });
};

// Static method to get constituency by area name
constituencySchema.statics.findByAreaName = function(areaName) {
  return this.findOne({ area_name: areaName });
};

export default mongoose.model('Constituency', constituencySchema);
