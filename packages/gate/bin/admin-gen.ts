import { getContext } from '@keystone-6/core/context'
import { users } from './admin-data'
import config from '../keystone'
import * as PrismaModule from 'myprisma'

type UserProps = {
  name: string
  email: string
  password: string
  isAdmin: boolean
  // name      String    @unique @default("")
  // email     String    @unique @default("")
  // password  String
  // isAdmin   Boolean   @default(false)
  // posts     Post[]    @relation("Post_author")
  // createdAt DateTime? @default(now())
}


export async function main () {
  const context = getContext(config, PrismaModule)

  console.log(`🌱 Inserting seed data`)
  const createUser = async (UserData: UserProps) => {
    let user = await context.query.User.findOne({
      where: { email: UserData.email },
      query: 'id',
    })
    
    if (!user) {
      console.log(`👩 Adding user: ${UserData.name}`)
      user = await context.query.User.createOne({
        data: UserData,
        query: 'id createdAt',
      })
    }
    else console.log(`🔘 User aleady exist: ${UserData.name}`)
  }

  for (const user of users) {
    await createUser(user)
  }

  console.log(`✅ Seed data inserted`)
  console.log(`👋 Please start the process with \`yarn dev1\``)
}

main()
