// Welcome to your schema
//   Schema driven development is Keystone's modus operandi
//
// This file is where we define the lists, fields and hooks for our data.
// If you want to learn more about how lists are configured, please read
// - https://keystonejs.com/docs/config/lists

import { list } from '@keystone-6/core'
import { allowAll, denyAll } from '@keystone-6/core/access'

// see https://keystonejs.com/docs/fields/overview for the full list of fields
//   this is a few common fields for an example
import {
  text,
  relationship,
  password,
  timestamp,
  checkbox,
  select,
} from '@keystone-6/core/fields'

// the document field is a more complicated field, so it has it's own package
import { document } from '@keystone-6/fields-document'
// if you want to make your own fields, see https://keystonejs.com/docs/guides/custom-fields

// when using Typescript, you can refine your types to a stricter subset by importing
// the generated types from '.keystone/types'
import { type Lists } from '.keystone/types'

export type Session = {
  itemId: string
  data: {
    isAdmin: boolean
  }
}

function hasSession ({ session }: { session?: Session }) {
  return Boolean(session)
}

function isAdminOrSameUser ({ session, item }: { session?: Session, item: Lists.User.Item }) {
  // you need to have a session to do this
  if (!session) return false

  // admins can do anything
  if (session.data.isAdmin) return true

  // the authenticated user needs to be equal to the user we are updating
  return session.itemId === item.id
}

function isAdminOrSameUserFilter ({ session }: { session?: Session }) {
  // you need to have a session to do this
  if (!session) return false

  // admins can see everything
  if (session.data?.isAdmin) return {}

  // the authenticated user can only see themselves
  return {
    id: {
      equals: session.itemId,
    },
  }
}

function isAdmin ({ session }: { session?: Session }) {
  // you need to have a session to do this
  if (!session) return false

  // admins can do anything
  if (session.data.isAdmin) return true

  // otherwise, no
  return false
}

export const lists = {
  User: list({
    // WARNING
    //   for this starter project, anyone can create, query, update and delete anything
    //   if you want to prevent random people on the internet from accessing your data,
    //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
    access: {
      operation: {
        create: allowAll,
        query: allowAll,

        // only allow users to update _anything_, but what they can update is limited by
        //   the access.filter.* and access.item.* access controls
        update: hasSession,

        // only allow admins to delete users
        delete: isAdmin,
      },
      filter: {
        update: isAdminOrSameUserFilter,
      },
      item: {
        // this is redundant as ^filter.update should stop unauthorised updates
        //   we include it anyway as a demonstration
        update: isAdminOrSameUser,
      },
    },
    ui: {
      // only show deletion options for admins
      hideDelete: args => !isAdmin(args),
      listView: {
        // the default columns that will be displayed in the list view
        initialColumns: ['name', 'isAdmin'],
      },
    },

    // this is the fields for our User list
    fields: {
      // by adding isRequired, we enforce that every User should have a name
      //   if no name is provided, an error will be displayed
      name: text({
        access: {
          // only the respective user, or an admin can read this field
          read: hasSession,

          // only admins can update this field
          update: isAdmin,
        },
        isFilterable: false,
        isOrderable: false,
        isIndexed: 'unique',
        validation: { //원래는 이것만 있었음 참고
          isRequired: true,
        },
      }),

      email: text({
        access: {
          // only the respective user, or an admin can read this field
          read: isAdminOrSameUser,

          // only admins can update this field
          update: isAdminOrSameUser,
        },
        validation: { isRequired: true },
        // by adding isIndexed: 'unique', we're saying that no user can have the same
        // email as another user - this may or may not be a good idea for your project
        isIndexed: 'unique',
      }),

      password: password({
        access: {
          read: isAdminOrSameUser, // TODO: is this required?
          update: isAdminOrSameUser,
        },
        validation: {
          isRequired: true,
        },
        ui: {
          itemView: {
            // don't show this field if it isn't relevant
            fieldMode: args => (isAdminOrSameUser(args) ? 'edit' : 'hidden'),
          },
          listView: {
            fieldMode: 'hidden', // TODO: is this required?
          },
        },
      }),

      isAdmin: checkbox({
        access: {
          // only the respective user, or an admin can read this field
          read: isAdminOrSameUser,

          // only admins can create, or update this field
          // create: allowAll,
          create: isAdmin,
          update: isAdmin,
        },
        defaultValue: false,
        ui: {
          // only admins can edit this field
          createView: {
            fieldMode: args => (isAdmin(args) ? 'edit' : 'hidden'),
          },
          itemView: {
            fieldMode: args => (isAdmin(args) ? 'edit' : 'read'),
          },
        },
      }),

      // we can use this field to see what Posts this User has authored
      //   more on that in the Post list below
      posts: relationship({ ref: 'Post.author', many: true }),

      createdAt: timestamp({
        // this sets the timestamp to Date.now() when the user is first created
        defaultValue: { kind: 'now' },
        ui: {
          // only admins can edit this field
          createView: {
            fieldMode: args => (isAdmin(args) ? 'edit' : 'hidden'),
          },
          itemView: {
            fieldMode: args => (isAdmin(args) ? 'edit' : 'read'),
          },
        },
      }),
    },
  }),

  Post: list({
    // WARNING
    //   for this starter project, anyone can create, query, update and delete anything
    //   if you want to prevent random people on the internet from accessing your data,
    //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
    access: allowAll,

    // this is the fields for our Post list
    fields: {
      title: text({ validation: { isRequired: true } }),

      // the document field can be used for making rich editable content
      //   you can find out more at https://keystonejs.com/docs/guides/document-fields
      // content: document({
      //   formatting: true,
      //   layouts: [
      //     [1, 1],
      //     [1, 1, 1],
      //     [2, 1],
      //     [1, 2],
      //     [1, 2, 1],
      //   ],
      //   links: true,
      //   dividers: true,
      // }),
      content: text(),

      // with this field, you can set a User as the author for a Post
      author: relationship({
        // we could have used 'User', but then the relationship would only be 1-way
        ref: 'User.posts',

        // this is some customisations for changing how this will look in the AdminUI
        ui: {
          displayMode: 'cards',
          cardFields: ['name', 'email'],
          inlineEdit: { fields: ['name', 'email'] },
          linkToItem: true,
          inlineConnect: true,
        },

        // a Post can only have one author
        //   this is the default, but we show it here for verbosity
        many: false,
      }),

      // with this field, you can add some Tags to Posts
      tags: relationship({
        // we could have used 'Tag', but then the relationship would only be 1-way
        ref: 'Tag.posts',

        // a Post can have many Tags, not just one
        many: true,

        // this is some customisations for changing how this will look in the AdminUI
        ui: {
          displayMode: 'cards',
          cardFields: ['name'],
          inlineEdit: { fields: ['name'] },
          linkToItem: true,
          inlineConnect: true,
          inlineCreate: { fields: ['name'] },
        },
      }),
    },
  }),

  // this last list is our Tag list, it only has a name field for now
  Tag: list({
    // WARNING
    //   for this starter project, anyone can create, query, update and delete anything
    //   if you want to prevent random people on the internet from accessing your data,
    //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
    access: allowAll,

    // setting this to isHidden for the user interface prevents this list being visible in the Admin UI
    ui: {
      isHidden: true,
    },

    // this is the fields for our Tag list
    fields: {
      name: text(),
      // this can be helpful to find out all the Posts associated with a Tag
      posts: relationship({ ref: 'Post.tags', many: true }),
    },
  }),
} satisfies Lists
