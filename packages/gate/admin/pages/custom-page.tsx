/** @jsxRuntime classic */
/** @jsx jsx */
// import Link from 'next/link'
import { PageContainer } from '@keystone-6/core/admin-ui/components'
import { Link, jsx, Heading } from '@keystone-ui/core'
import title from '../../public/images/title.png'
// Please note that while this capability is driven by Next.js's pages directory
// We do not currently support any of the auxillary methods that Next.js provides i.e. `getStaticProps`
// Presently the only export from the directory that is supported is the page component itself.
export default function CustomPage () {
  return (
    <PageContainer header={<Heading type="h3">Custom Page</Heading>}>
      <div>
        <h1
          css={{
            width: '100%',
            textAlign: 'center',
          }}
          >
          This is a custom Admin UI Page
        </h1>
        <p
          css={{
            textAlign: 'center',
          }}
          >
          It can be accessed via the route <Link href="/custom-page">/custom-page</Link>
        </p>
        <img src='http://localhost:3000/public/images/title.png'
          css={{
            // height: '5vmin',
            // width: '60%',
            // textAlign: 'center',
            'text-align': 'center',
            // align: 'center',
            display: 'flex',
            'justify-content': 'center'
            // 'margin-left': 'auto',
            // 'margin-right': 'auto',
            // 'max-width': '100%', /* 이미지 크기 조절 */
            // height: 'auto'
          }}
          alt="abab" />
      {/* <img src="https://minotar.net/avatar/398a6080-9fd5-44ed-ad30-0072d5efdf10/100"
      css={{
        height: '5vmin',
        }}
        alt="face_sample" /> */}
      </div>
    </PageContainer>
  )
}
