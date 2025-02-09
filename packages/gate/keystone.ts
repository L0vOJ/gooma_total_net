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
import { withAuth, session, DBConfig } from './auth'

import path from 'path';
import express, { Request, Response, NextFunction, type Express } from 'express';
import { statusJava } from 'node-mcstatus';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { type TypeInfo, type Context, type Config } from '.keystone/types'

import fs from "fs"
import http from "http"
import https from "https"

function HttpsOpen(host_name: String, frontApp: Express, port: number) {
  const cert_path = "/etc/letsencrypt/live/";
  if(!fs.existsSync(cert_path + host_name +'/fullchain.pem')) return
  const cert_options = {
    ca: fs.readFileSync(cert_path + host_name +'/fullchain.pem'),
    key: fs.readFileSync(cert_path + host_name +'/privkey.pem'),
    cert: fs.readFileSync(cert_path + host_name +'/cert.pem')
  }
  https.createServer(cert_options, frontApp).listen(port);
}


function restrictAccess(context: Context) {
  // const allowedPaths = ['/_next/static/*','/api/*', '/signin', '/main', '/main/*']; ///_next/static/chunks/pages/no-access.js
  const allowedPaths = ['/main', '/main/*', '/map', '/map/*', '/api/*', '/api/graphql']; ///_next/static/chunks/pages/no-access.js
  // const deniedPaths = ['/_next/static/chunks/mains/no-access.js']; 
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 로그인 구현 후 활성화 바람
      // 요청마다 새로운 Keystone Context 생성
      // const keystoneContext = await context.withRequest(req, res);

      // 세션 데이터 가져오기
      // const session = keystoneContext.session?.data ?? false;

      // console.log(session)
      // console.log("req.path: ", req.path)

      // 필요할 때 활성화 하길
      // const isDenied = deniedPaths.some((path) => {
      //   const regex = new RegExp(`^${path.replace('*', '.*')}$`);
      //   return regex.test(req.path);
      // });
      // console.log("isDenied: ", isDenied)
      // if(isDenied) 
      // {
      //   if(!session) return res.redirect('/signin');
      //   else return res.redirect('/main');
      // }

      // 세션이 없거나 isAdmin이 false인 경우 접근 제한 //로그인 구현 후 활성화 바람
      // if (!session || session.isAdmin === false) {
      //   const isAllowed = allowedPaths.some((path) => {
      //     const regex = new RegExp(`^${path.replace('*', '.*')}$`);
      //     return regex.test(req.path);
      //   });

      //   if (!isAllowed) {
      //     if(!session) return res.redirect('/signin');
      //     else return res.redirect('/main');
      //     // return res.status(403).json({ error: 'Access Denied' });
      //   }
      // }
      // 로그인 화면 구현 전 - 퍼블릭만 돌도록 조치
      const isAllowed = allowedPaths.some((path) => {
        const regex = new RegExp(`^${path.replace('*', '.*')}$`);
        return regex.test(req.path);
      });

      if (!isAllowed) {
        return res.redirect('/main');
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
    db: DBConfig,
    // db:{
    //   provider: 'mysql',
    //   url: 'mysql://masic:1q2w3e4R!@' + "127.0.0.1" + '/keystone',
    //   prismaClientPath: 'node_modules/myprisma',
    // },
    ui: {
      // publicPages: [],
      // isAccessAllowed: ({ session }) => {
      //   // console.log("Login==session: ",session)
      //   return session?.data.isAdmin ?? false
      // },
      // adding page middleware ensures that users are redirected to the signin page if they are not signed in.
      // pageMiddleware: async ({ wasAccessAllowed }) => { 
      //   if (wasAccessAllowed) return
      //   return {
      //     kind: 'redirect',
      //     to: '/main',
      //   }
      // },
    },
    lists,
    session,
    server: {
      cors: {
        origin: ['http://localhost:3001', 'https://localhost:3011', 'https://netgooma.ddns.net'], // React 앱 주소
        // port: 3011,
        credentials: true,
      },
      extendExpressApp: (backApp, context) => {
        backApp.use('/public', express.static("public"));
        const frontApp = express();
        const options = { timeout: 1000 * 1, query: true };
        const host_name = process.env.DNS_HOST ?? "netgooma.ddns.net";
        const __dir_package = path.join(__dirname, '../../');
        frontApp.use(express.static(__dirname + '../cert'));
        frontApp.use('/public', express.static("public"));
        frontApp.use('/map', express.static(__dir_package + "web_dynmap"));
        // frontApp.get('/map/*', (req, res) => {
        //   res.sendFile(path.join(__dir_package, 'web_dynmap/index.html'));
        //   // res.send('Operate in Production Mode');
        // });
        frontApp.use('/map', createProxyMiddleware({
          target: 'http://localhost:8123',
          changeOrigin: true,
          // ws: true, // 웹소켓 지원
          // pathRewrite: {
          //   '^/map': '',  // 요청 경로에서 /map 접두사를 제거하고 target으로 전달
          // },
        }));
        frontApp.use('/api/graphql', createProxyMiddleware({
          target: 'http://localhost:3000', // Keystone Admin UI가 실행 중인 서버 주소
          changeOrigin: true,
          secure: false, // HTTPS 클라이언트에서 HTTP 타겟으로 요청 시, 인증서 검증을 건너뛰려면 false로 설정합니다.
          // 필요에 따라 pathRewrite 옵션을 추가할 수 있습니다.
          // pathRewrite: { '^/api/graphql': '/api/graphql' },
        }));
        frontApp.use('/api/mcs', (req, res) => {
          statusJava(host_name, 25565, options)
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
          frontApp.use('/main', express.static(reactBuildPath));
          // 모든 비정적 요청을 React의 index.html로 리디렉션
          frontApp.get('/main/*', (req, res) => {
            res.sendFile(path.join(reactBuildPath, 'index.html'));
            // res.send('Operate in Production Mode');
          });
        } 
        else {
          // 개발 환경에서는 React 앱의 핫 리로딩을 위해 다른 처리를 할 수 있습니다.
          frontApp.get('/main', (req, res) => {
            res.send('Operate in Development Mode');
            // console.log(process.env.NODE_ENV);
          });
        }
        // frontApp.use(restrictAccess(context)); //뒤로 빼놔야 막아진다
        http.createServer(frontApp).listen(3001);
        HttpsOpen(host_name, frontApp, 3011);
      },
    },
  }) satisfies Config
) 
