module.exports = ({ env }) => ({
    url: env('HEROKU_URL'),
  });



// module.exports=({env})=>({
//     url: env('STRAPI_URL')
// })



// -----------> for strapi

// http url: /api
//  build ENV_NODE=production yarn build
// STRAPi_URL= ${APP_URL}/api
//  DATABASE_URL= ${db.DATABASE_URL}
 

// -------------> for next
// http url: /
// API_URL=${APP_URL}/api