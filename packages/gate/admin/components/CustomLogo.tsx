/** @jsxRuntime classic */
/** @jsx jsx */
// import Link from 'next/link'
import { Link, jsx, H3 } from '@keystone-ui/core'
import title from '../../public/images/title.png';

export function CustomLogo () {
  return (
    // <H3>
    //   <img src='http://localhost:3000/public/images/title.png'
    //     css={{
    //             // width="20%",
    //             align: 'center',
    //             height: '8vmin',
    //           }}
    //     alt="abab" />
    //   <Link
    //     href="/"
    //     css={{
    //       // TODO: we don't have colors in our design-system for this.
    //       backgroundImage: `linear-gradient(to right, #0ea5e9, #6366f1)`,
    //       backgroundClip: 'text',
    //       lineHeight: '1.75rem',
    //       color: 'transparent',
    //       verticalAlign: 'middle',
    //       transition: 'color 0.3s ease',
    //       textDecoration: 'none',
    //     }}
    //   >
    //     Gooma
    //   </Link>
    // </H3>
    <table>
    <tr>
      <td width="0%">
      <img src='http://localhost:3000/public/images/title_logo_v3.png'
        css={{
                // width="20%",
                align: 'center',
                height: '8vmin',
                "border-radius": "1vmin",
              }}
        alt="abab" />
      </td>
      <td width="100%"> 
        <Link
          href="/"
          css={{
            // TODO: we don't have colors in our design-system for this.
            "font-size": "2.5vmin",
            backgroundImage: `linear-gradient(to right, #0ea5e9, #6366f1)`,
            backgroundClip: 'text',
            lineHeight: '1.75rem',
            color: 'transparent',
            verticalAlign: 'middle',
            transition: 'color 0.3s ease',
            textDecoration: 'none',
          }}
        >
          구마백업서버
        </Link>
      </td>
    </tr>
  </table>
  )
}
