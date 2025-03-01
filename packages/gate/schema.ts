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
    //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
    access: {
      operation: {
        create: allowAll,
        query: allowAll,
        update: hasSession,
        delete: isAdmin,
      },
      filter: {
        update: isAdminOrSameUserFilter,
      },
      item: {
        update: isAdminOrSameUser,
      },
    },
    ui: {
      hideDelete: args => !isAdmin(args),
      listView: {
        initialColumns: ['name', 'isAdmin'],
      },
    },
    fields: {
      name: text({
        access: {
          read: hasSession,
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
          read: isAdminOrSameUser,
          update: isAdminOrSameUser,
        },
        validation: { isRequired: true },
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
          read: isAdminOrSameUser,
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

  TextPost: list({
    //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
    access: allowAll,
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
    },
  }),

  Post: list({
    //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
    access: allowAll,
    fields: {
      title: text({ validation: { isRequired: true } }),

      // the document field can be used for making rich editable content
      //   you can find out more at https://keystonejs.com/docs/guides/document-fields
      content: document({
        formatting: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1],
        ],
        links: true,
        dividers: true,
      }),
      // content: text(),
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

  Announce: list({
    //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
    access: isAdmin,
    fields: {
      title: text({ validation: { isRequired: true } }),

      // the document field can be used for making rich editable content
      //   you can find out more at https://keystonejs.com/docs/guides/document-fields
      content: document({
        formatting: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1],
        ],
        links: true,
        dividers: true,
      }),
    },
  }),

  // this last list is our Tag list, it only has a name field for now
  Tag: list({
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
