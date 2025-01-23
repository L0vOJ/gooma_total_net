// Welcome to Keystone!
//
// This file is what Keystone uses as the entry-point to your headless backend
//
// Keystone imports the default export of this file, expecting a Keystone configuration object
//   you can find out more at https://keystonejs.com/docs/apis/config

import { config } from '@keystone-6/core'

// to keep this file tidy, we define our schema in a different file
import { type Session, lists } from './schema'

// authentication is configured separately here too, but you might move this elsewhere
// when you write your list-level access control functions, as they typically rely on session data
import { withAuth, session } from './auth'

import path from 'path';
import express, { Request, Response, NextFunction } from 'express';
import { statusJava } from 'node-mcstatus';
import { type TypeInfo, type Context } from '.keystone/types'

import fs from "fs"
import http from "http"
import https from "https"

function restrictAccess(context: Context) {
  // const allowedPaths = ['/_next/static/*','/api/*', '/signin', '/page', '/page/*']; ///_next/static/chunks/pages/no-access.js
  const allowedPaths = ['/page', '/page/*']; ///_next/static/chunks/pages/no-access.js
  // const deniedPaths = ['/_next/static/chunks/pages/no-access.js']; 
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 요청마다 새로운 Keystone Context 생성
      const keystoneContext = await context.withRequest(req, res);

      // 세션 데이터 가져오기
      const session = keystoneContext.session?.data ?? false;

      console.log(session)
      console.log("req.path: ", req.path)

      // 필요할 때 활성화 하길
      // const isDenied = deniedPaths.some((path) => {
      //   const regex = new RegExp(`^${path.replace('*', '.*')}$`);
      //   return regex.test(req.path);
      // });
      // console.log("isDenied: ", isDenied)
      // if(isDenied) 
      // {
      //   if(!session) return res.redirect('/signin');
      //   else return res.redirect('/page');
      // }

      // 세션이 없거나 isAdmin이 false인 경우 접근 제한 //로그인 구현 후 활성화 바람
      // if (!session || session.isAdmin === false) {
      //   const isAllowed = allowedPaths.some((path) => {
      //     const regex = new RegExp(`^${path.replace('*', '.*')}$`);
      //     return regex.test(req.path);
      //   });

      //   if (!isAllowed) {
      //     if(!session) return res.redirect('/signin');
      //     else return res.redirect('/page');
      //     // return res.status(403).json({ error: 'Access Denied' });
      //   }
      // }
      // 로그인 화면 구현 전 - 퍼블릭만 돌도록 조치
      const isAllowed = allowedPaths.some((path) => {
        const regex = new RegExp(`^${path.replace('*', '.*')}$`);
        return regex.test(req.path);
      });

      if (!isAllowed) {
        return res.redirect('/page');
      }

      // 조건에 만족하면 다음 미들웨어로 이동
      next();
    } catch (error) {
      console.error('Error in restrictAccess middleware:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
}

export default withAuth<TypeInfo<Session>>(
  config({
    db: {
      // we're using sqlite for the fastest startup experience
      //   for more information on what database might be appropriate for you
      //   see https://keystonejs.com/docs/guides/choosing-a-database#title
      provider: 'sqlite',
      url: 'file:./keystone.db',
      prismaClientPath: 'node_modules/myprisma',
    },
    ui: {
      // publicPages: [
      //   '/api/*',
      //   // '/signin',
      //   '/_next/static/*',
      //   '/page',
      //   '/page/*',
      // ],
      isAccessAllowed: ({ session }) => {
        // console.log("Login==session: ",session)
        return session?.data.isAdmin ?? false
      },
      // adding page middleware ensures that users are redirected to the signin page if they are not signed in.
      // pageMiddleware: async ({ wasAccessAllowed }) => { 
      //   console.log("wasAccessAllowedddddddddddddddddddddddddddddd: ", wasAccessAllowed)
      //   //wasAccessAllowed can be replace to context 
      //   //그러니 좀 더 다듬어
      //   if (wasAccessAllowed) return
      //   return {
      //     kind: 'redirect',
      //     to: '/page',
      //   }
      // },
    },
    lists,
    session,
    server: {
      cors: {
        origin: ['http://localhost:3001'], // React 앱 주소
        port: 3001,
        credentials: true,
      },
      extendExpressApp: (backApp, context) => {
        backApp.use('/public', express.static("public"));
        const frontApp = express();
        const options = { timeout: 1000 * 1, query: true };
        frontApp.use('/public', express.static("public"));
        frontApp.get('/api/mcs', (req, res) => {
          statusJava("netgooma.ddns.net", 25565, options)
          .then((result) => {
            res.json(result);
          })
          .catch((error) => {
            console.log("reviece fail");
          });
        });
        if (process.env.NODE_ENV === 'production') {
          // console.log(process.env.NODE_ENV);
          const reactBuildPath = path.join(__dirname, 'build');
          frontApp.use('/page', express.static(reactBuildPath));
          // 모든 비정적 요청을 React의 index.html로 리디렉션
          frontApp.get('/page/*', (req, res) => {
            res.sendFile(path.join(reactBuildPath, 'index.html'));
            // res.send('Operate in Production Mode');
          });
        } 
        else {
          // 개발 환경에서는 React 앱의 핫 리로딩을 위해 다른 처리를 할 수 있습니다.
          frontApp.get('/page', (req, res) => {
            res.send('Operate in Development Mode');
            // console.log(process.env.NODE_ENV);
          });
        }
        frontApp.use(restrictAccess(context));
        http.createServer(frontApp).listen(3001);
        const cert_options = {
          ca: fs.readFileSync('/etc/letsencrypt/live/netgooma.ddns.net/fullchain.pem'),
          key: fs.readFileSync('/etc/letsencrypt/live/netgooma.ddns.net/privkey.pem'),
          cert: fs.readFileSync('/etc/letsencrypt/live/netgooma.ddns.net/cert.pem')
        };
        https.createServer(cert_options, frontApp).listen(3011);
      },
    },
  })
)
