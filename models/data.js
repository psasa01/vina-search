const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const slug = require("slugs");
// require("mongoose-strip-html-tags")(mongoose);
// const mongodbErrorHandler = require("mongoose-mongodb-errors");
// const mongooseAlgolia = require("mongoose-algolia");

const vinoSchema = new mongoose.Schema({
  naziv: {
    type: String,
    required: "Morate unijeti naziv vina!",
    trim: true,
    stripHtmlTags: true,
  },
  slug: {
    type: String,
    stripHtmlTags: true,
  },
  slugZemlja: {
    type: String,
    stripHtmlTags: true,
  },
  godina: {
    type: Number,
    trim: true,
    stripHtmlTags: true,
  },
  proizvodjac: {
    type: String,
    required: "Morate unijeti naziv proizvodjača!",
    trim: true,
    stripHtmlTags: true,
  },
  vrsta: {
    type: String,
    required: "Morate unijeti vrstu vina",
    trim: true,
    stripHtmlTags: true,
  },
  zemlja: {
    type: String,
    required: "Morate unijeti zemlju porijekla",
    trim: true,
    stripHtmlTags: true,
  },
  slika: {
    type: String,
  },
  alkohol: {
    type: String,
  },
  velicina: {
    type: String,
  },
  datum: {
    type: Date,
    default: Date.now,
  },
  korisnik: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
    autopopulate: {
      select: "ime",
    },
  },
  ime: {
    type: String,
  },
});

// presave slug, proper function because we need to bind 'this'!!!
vinoSchema.pre("save", async function (next) {
  // if no changes, exit (return)
  if (!this.isModified("naziv")) {
    return next(); // stop function
  }
  this.slug = slug(this.naziv);
  // this.slugZemlja = slug(this.zemlja);
  // next();
  // make unique slugs
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)`, "i");
  const vinaSlug = await this.constructor.find({
    slug: slugRegEx,
  });
  if (vinaSlug.length) {
    this.slug = `${this.slug}-${vinaSlug.length + 1}`;
  }
});

// vinoSchema.statics.listaZemalja = function () {
//   return this.aggregate([
//     {
//       $unwind: "$zemlja",
//     },
//     {
//       $group: {
//         _id: "$zemlja",
//         count: {
//           $sum: 1,
//         },
//       },
//     },
//     {
//       $sort: {
//         _id: 1,
//       },
//     },
//   ]).collation({ locale: "hr", strength: 2 });
// };

// vinoSchema.statics.popisVrsti = function () {
//   return this.aggregate([
//     {
//       $unwind: {
//         path: "$vrsta",
//       },
//     },
//     {
//       $group: {
//         _id: "$vrsta",
//         count: {
//           $sum: 1,
//         },
//       },
//     },
//     {
//       $sort: {
//         _id: 1,
//       },
//     },
//   ]);
// };

// vinoSchema.statics.popisKorisnika = function () {
//   return this.aggregate([
//     {
//       $unwind: {
//         path: "$ime",
//         preserveNullAndEmptyArrays: true,
//       },
//     },
//     {
//       $group: {
//         _id: "$ime",
//         count: {
//           $sum: 1,
//         },
//       },
//     },
//     {
//       $sort: {
//         _id: 1,
//       },
//     },
//   ]);
// };

// vinoSchema.statics.popisGodina = function () {
//   return this.aggregate([
//     {
//       $unwind: {
//         path: "$godina",
//         preserveNullAndEmptyArrays: true,
//       },
//     },
//     {
//       $group: {
//         _id: "$godina",
//         count: {
//           $sum: 1,
//         },
//       },
//     },
//     {
//       $sort: {
//         _id: 1,
//       },
//     },
//   ]);
// };

// // vinoSchema.plugin(mongooseAlgolia, {
// //   appId: process.env.ALGOLIA_API_ID,
// //   apiKey: process.env.ALGOLIA_ADMIN_API_KEY,
// //   indexName: "vinoSchema", //The name of the index in Algolia, you can also pass in a function
// //   selector:
// //     "naziv _id proizvodjac zemlja godina slika korisnik slug alkohol velicina datum", //You can decide which field that are getting synced to Algolia (same as selector in mongoose)
// //   populate: {
// //     path: "korisnik",
// //     select: "ime",
// //   },
// //   defaults: {
// //     author: "unknown",
// //   },
// //   mappings: {
// //     title: function (value) {
// //       return `Book: ${value}`;
// //     },
// //   },
// //   // virtuals: {
// //   //   whatever: function(doc) {
// //   //     return `Custom data ${doc.title}`
// //   //   }
// //   // },
// //   // filter: function(doc) {
// //   //   return !doc.softdelete
// //   // },
// //   debug: true, // Default: false -> If true operations are logged out in your console
// // });

let Model = mongoose.model("Vino", vinoSchema);

// Model.SyncToAlgolia(); //Clears the Algolia index for this schema and synchronizes all documents to Algolia (based on the settings defined in your plugin settings)
// Model.SetAlgoliaSettings({
//     searchableAttributes: ['naziv', 'proizvodjac', 'zemlja', 'godina', 'korisnik.ime', 'slug'] //Sets the settings for this schema, see [Algolia's Index settings parameters](https://www.algolia.com/doc/api-client/javascript/settings#set-settings) for more info.
// });

// vinoSchema.plugin(mongodbErrorHandler);

module.exports = Model;
