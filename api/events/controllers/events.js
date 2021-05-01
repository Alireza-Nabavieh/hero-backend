'use strict';

const { sanitizeEntity } = require('strapi-utils');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */


// در این بخش در هنگام ذخیره نام یوزر نیز ذخیره خواهد شد- همچنین بخش بروزرسانی و حذف فقط برای یوزر مرتبط محدود شده است 
module.exports = {

    // https://strapi.io/documentation/developer-docs/latest/guides/is-owner.html#introduction
    // restrict content editing to content authors only
    
    async create(ctx) {
        let entity;
        if (ctx.is('multipart')) {
          const { data, files } = parseMultipartData(ctx);
          data.user = ctx.state.user.id;
          entity = await strapi.services.events.create(data, { files });
        } else {
          ctx.request.body.user = ctx.state.user.id;
          entity = await strapi.services.events.create(ctx.request.body);
        }
        return sanitizeEntity(entity, { model: strapi.models.events });
      },

    //   update restrication

    async update(ctx) {
        const { id } = ctx.params;
    
        let entity;
    
        const [events] = await strapi.services.events.find({
          id: ctx.params.id,
          'user.id': ctx.state.user.id,
        });
    
        if (!events) {
          return ctx.unauthorized(`You can't update this entry`);
        }
    
        if (ctx.is('multipart')) {
          const { data, files } = parseMultipartData(ctx);
          entity = await strapi.services.events.update({ id }, data, {
            files,
          });
        } else {
          entity = await strapi.services.events.update({ id }, ctx.request.body);
        }
    
        return sanitizeEntity(entity, { model: strapi.models.events });
      },

    
    // Delete restrication

    async delete(ctx) {
        const { id } = ctx.params;
    
        const [events] = await strapi.services.events.find({
          id: ctx.params.id,
          "user.id": ctx.state.user.id,
        });
    
        if (!events) {
          return ctx.unauthorized(`You can't delete this entry`);
        }
    
        const entity = await strapi.services.events.delete({ id });
        return sanitizeEntity(entity, { model: strapi.models.events });
      },


    //  get logged in users
    async me(ctx){
        // console.log(ctx.state.user.role.name)
        // Authenticated

        const user=ctx.state.user

        if(!user){
            return ctx.badRequest(null, [{ messages:[{id:"No Authoization header was found "}]},]);
        }

        const data =await strapi.services.events.find({user: user.id})

        if(!data){
            return ctx.notFound()
        }

        return sanitizeEntity(data,{model:strapi.models.events})
    }
};
