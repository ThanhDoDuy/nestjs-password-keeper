export const DEFAULT_SCHEMA = {
  toJSON: {
    versionKey: false,  // Removes __v
    //   virtuals: true,
    //   transform: (doc, ret) => {
    //     ret.id = ret._id;  // Map _id to id
    //     delete ret._id;    // Remove _id
    //     return ret;
    //   },
  },
  toObject: {
    versionKey: false,  // Removes __v
    //   virtuals: true,
    //   transform: (doc, ret) => {
    //     ret.id = ret._id;  // Map _id to id
    //     delete ret._id;    // Remove _id
    //     return ret;
    //   },
  },
  timestamps: true,
}

export const REFRESH_TOKEN = 'refresh_token';